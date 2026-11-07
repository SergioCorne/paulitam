const {test}=require('node:test');
const assert=require('node:assert/strict');
const {randomBytes,createHash}=require('node:crypto');
const {mkdtemp,rm}=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {createApp}=require('../server/app.cjs');
const cards=require('../site/private-cards.js');
const hash=s=>createHash('sha256').update(s).digest('hex');
async function run(t,options={}){const app=createApp(options);await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.server.address().port;t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.close();});return {...app,request:async(route,method='GET',data=null,secret=null,origin=null)=>{const r=await fetch(base+route,{method,headers:{...(data?{'Content-Type':'application/json'}:{}),...(secret?{Authorization:'Bearer '+secret}:{}),...(origin?{Origin:origin}:{})},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json()};}};}
test('private cards require read capabilities, protect management, and can be deleted by their owner',async t=>{
 const a=await run(t,{env:{}}),encrypted=await cards.encrypt({message:'Local synthetic fixture'}),created=await a.request('/api/private','POST',{type:'letter',ciphertext:encrypted.ciphertext,iv:encrypted.iv,readerHash:encrypted.readerHash});assert.equal(created.status,201);const {id,owner}=created.data;
 assert.equal((await a.request('/api/private/'+id)).status,404);assert.equal((await a.request('/api/private/'+id,'GET',null,'wrong')).status,404);
 const read=await a.request('/api/private/'+id,'GET',null,encrypted.reader);assert.equal(read.status,200);assert.equal((await cards.decrypt(read.data,encrypted.key)).message,'Local synthetic fixture');
 assert(!a.db.prepare('SELECT payload FROM records WHERE id=?').get(id).payload.includes('Local synthetic fixture'));
 assert.equal((await a.request('/api/owned/'+id,'DELETE',null,'wrong')).status,404);assert.equal((await a.request('/api/owned/'+id,'DELETE',null,owner)).status,200);assert.equal((await a.request('/api/private/'+id,'GET',null,encrypted.reader)).status,404);
});
test('public wishes, planets and garden messages stay private until consent and moderation',async t=>{
 const admin=randomBytes(32).toString('hex'),a=await run(t,{env:{MODERATION_TOKEN:admin}});
 assert.equal((await a.request('/api/community','POST',{type:'wish',payload:{text:'Un deseo de prueba'}})).status,400);
 assert.equal((await a.request('/api/community','POST',{type:'wish',consent:true,payload:{text:'contacto@example.test'}})).status,400);
 const created=await a.request('/api/community','POST',{type:'wish',consent:true,payload:{text:'Un deseo sintético para verificar la cola.'}});assert.equal(created.status,201);
 assert.deepEqual((await a.request('/api/community?type=wish')).data.items,[]);
 assert.equal((await a.request('/api/moderation')).status,403);
 assert.equal((await a.request('/api/moderation/'+created.data.id,'PUT',{decision:'approve',checkedPrivacy:false},admin)).status,400);
 assert.equal((await a.request('/api/moderation/'+created.data.id,'PUT',{decision:'approve',checkedPrivacy:true},admin)).status,200);
 const published=await a.request('/api/community?type=wish');assert.equal(published.data.items.length,1);assert(!JSON.stringify(published.data).includes(created.data.owner));
 assert.equal((await a.request('/api/owned/'+created.data.id,'DELETE',null,created.data.owner)).status,200);assert.equal((await a.request('/api/community?type=wish')).data.items.length,0);
});
test('capsules stay locked until their server date and expire without requiring email',async t=>{
 let clock=Date.now();const a=await run(t,{env:{},now:()=>clock}),encrypted=await cards.encrypt({message:'Mensaje del futuro'});const created=await a.request('/api/private','POST',{type:'capsule',ciphertext:encrypted.ciphertext,iv:encrypted.iv,readerHash:encrypted.readerHash,unlockAt:clock+120000});
 assert.equal(created.status,201);assert.equal((await a.request('/api/private/'+created.data.id,'GET',null,encrypted.reader)).status,423);clock+=180000;assert.equal((await a.request('/api/private/'+created.data.id,'GET',null,encrypted.reader)).status,200);clock+=367*86400000;await a.tick();assert.equal(a.db.prepare('SELECT count(*) AS n FROM records').get().n,0);
});
test('email is opt-in, double-confirmed, scheduled and idempotent; fixtures never contact a provider',async t=>{
 let clock=Date.now(),mails=[];const env={DATA_ENCRYPTION_KEY:randomBytes(32).toString('hex'),RESEND_API_KEY:'fixture-not-a-real-api-key',CAPSULE_FROM:'Test <noreply@example.test>',PUBLIC_ORIGIN:'https://example.test'};const a=await run(t,{env,now:()=>clock,sendMail:async(payload,id)=>mails.push({payload,id})}),encrypted=await cards.encrypt({message:'Synthetic email fixture'}),body={type:'capsule',ciphertext:encrypted.ciphertext,iv:encrypted.iv,readerHash:encrypted.readerHash,unlockAt:clock+120000,email:'recipient@example.test',emailConsent:true};
 const created=await a.request('/api/private','POST',body);assert.equal(created.status,201);await a.tick();assert.equal(mails.length,1);assert(mails[0].payload.text.includes('Confirma'));clock+=180000;await a.tick();assert.equal(mails.length,1);
 const link=mails[0].payload.text.match(/https:\/\/\S+/)[0],params=new URLSearchParams(new URL(link).hash.slice(1));assert.equal((await a.request('/api/confirm/'+created.data.id,'POST',{token:params.get('token')})).status,200);await a.tick();assert.equal(mails.length,2);await a.tick();assert.equal(mails.length,2);assert(!mails[1].payload.text.includes(encrypted.key));
 const stored=a.db.prepare('SELECT email FROM records WHERE id=?').get(created.data.id).email;assert(!stored.includes('recipient@example.test'));
});
test('cross-origin writes, unsafe community content and oversized JSON are rejected',async t=>{
 const a=await run(t,{env:{PUBLIC_ORIGIN:'https://example.test'}});assert.equal((await a.request('/api/community','POST',{type:'wish',consent:true,payload:{text:'fixture'}},null,'https://elsewhere.test')).status,403);assert.equal((await a.request('/api/community','POST',{type:'flower',consent:true,payload:{text:'Llama al +34 600 123 456'}})).status,400);
 const tooLarge=await a.request('/api/community','POST',{type:'wish',consent:true,payload:{text:'x'.repeat(2_000_001)}});assert.equal(tooLarge.status,413);
});
test('moderation records persist on disk across service restarts',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'paulitam-fixture-'));const database=path.join(dir,'state.sqlite');
 try{const first=createApp({database,env:{}});first.db.prepare('INSERT INTO records(id,type,owner_hash,payload,status,created,expires) VALUES(?,?,?,?,?,?,?)').run('fixture','wish',hash('owner-fixture'),JSON.stringify({text:'Synthetic durable fixture'}),'pending',Date.now(),Date.now()+86400000);first.close();const second=createApp({database,env:{}});assert.equal(second.db.prepare('SELECT status FROM records WHERE id=?').get('fixture').status,'pending');second.close();}finally{await rm(dir,{recursive:true,force:true});}
});
