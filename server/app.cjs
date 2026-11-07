'use strict';
const http=require('node:http');
const {DatabaseSync}=require('node:sqlite');
const {randomBytes,createHash,createCipheriv,createDecipheriv,timingSafeEqual}=require('node:crypto');
const {readFile}=require('node:fs/promises');
const path=require('node:path');
const token=()=>randomBytes(32).toString('base64url');
const hash=v=>createHash('sha256').update(String(v)).digest('hex');
const eq=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const privateText=v=>/[\w.+-]+@[\w.-]+\.[a-z]{2,}|https?:|www\.|(?:\+?\d[\s().-]*){7,}/i.test(v);
const error=(status,message)=>Object.assign(new Error(message),{status});
function createApp(options={}){
 const env=options.env||process.env,db=new DatabaseSync(options.database||env.DATABASE_PATH||':memory:');
 db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY,type TEXT NOT NULL,owner_hash TEXT NOT NULL,reader_hash TEXT,payload TEXT NOT NULL,status TEXT NOT NULL,created INTEGER NOT NULL,unlock_at INTEGER,expires INTEGER NOT NULL,email TEXT,confirmed INTEGER DEFAULT 0,confirm_hash TEXT); CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,record_id TEXT NOT NULL,kind TEXT NOT NULL,payload TEXT NOT NULL,due INTEGER NOT NULL,status TEXT DEFAULT \'pending\',attempts INTEGER DEFAULT 0);');
 const admin=env.MODERATION_TOKEN||'',encryption=env.DATA_ENCRYPTION_KEY?Buffer.from(env.DATA_ENCRYPTION_KEY,'hex'):null;
 const emailEnabled=!!(encryption?.length===32&&env.RESEND_API_KEY&&env.CAPSULE_FROM&&env.PUBLIC_ORIGIN);
 const now=()=>options.now?options.now():Date.now();const limits=new Map();

 function encrypt(v){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',encryption,iv),out=Buffer.concat([c.update(JSON.stringify(v)),c.final()]);return Buffer.concat([iv,c.getAuthTag(),out]).toString('base64');}
 function decrypt(v){const b=Buffer.from(v,'base64'),c=createDecipheriv('aes-256-gcm',encryption,b.subarray(0,12));c.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([c.update(b.subarray(28)),c.final()]).toString());}
 const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(data));};
 const auth=req=>String(req.headers.authorization||'').replace(/^Bearer /,'');
 function owned(req,id){const r=db.prepare('SELECT * FROM records WHERE id=?').get(id);if(!r||!eq(r.owner_hash,hash(auth(req))))throw error(404,'No se encuentra ese contenido con esta clave.');return r;}
 function moderate(req){if(admin.length<24||!eq(auth(req),admin))throw error(403,'Se necesita acceso de moderación.');}
 function publicPayload(type,data){
  const clean={};const text=(name,max,required=false)=>{const value=String(data[name]||'').trim();if(value.length>max||(required&&!value))throw error(400,'Revisa la longitud y los campos.');if(privateText(value))throw error(400,'No incluyas nombres de contacto, enlaces, teléfonos ni correos en contenido público.');clean[name]=value;};
  if(type==='planet'){text('alias',35,true);text('persona',35,true);if(!/^#[a-f0-9]{6}$/i.test(data.color||''))throw error(400,'Color no válido.');clean.color=data.color;clean.charms=Array.isArray(data.charms)?data.charms.filter(x=>typeof x==='string'&&/^[a-z0-9-]{1,60}$/.test(x)).slice(0,12):[];clean.collection=/^[a-z0-9-]{1,60}$/.test(data.collection||'')?data.collection:'';if(data.design){const d=data.design;if(!/^[a-z0-9-]{1,60}$/.test(d.id||'')||!['pastel','chicle','blanco','negro','crema','lila','azul','verde','rojo','amarillo'].includes(d.color)||![36,37,38,39,40,41].includes(d.size))throw error(400,'Diseño no válido.');clean.design={id:d.id,color:d.color,size:d.size,customization:(Array.isArray(d.customization)?d.customization:[]).slice(0,30).map(s=>({id:/^[a-z0-9-]{1,60}$/.test(s.id||'')?s.id:'',quantity:Number.isInteger(s.quantity)&&s.quantity>0&&s.quantity<=99?s.quantity:1,placements:(Array.isArray(s.placements)?s.placements:[]).slice(0,24).map(pos=>({x:Number.isFinite(pos?.x)?Math.max(24,Math.min(76,pos.x)):50,y:Number.isFinite(pos?.y)?Math.max(15,Math.min(58,pos.y)):35}))})).filter(s=>s.id)};}}
  else{text('text',240,true);}
  return clean;
 }
 async function body(req){let parts=[],size=0;for await(const part of req){size+=part.length;if(size>2_000_000)throw error(413,'El contenido es demasiado grande.');parts.push(part);}try{return JSON.parse(Buffer.concat(parts).toString()||'{}');}catch{throw error(400,'JSON no válido.');}}
 async function handler(req,res){
  try{
   const url=new URL(req.url,'http://localhost'),route=url.pathname,method=req.method;
   if(route.startsWith('/api/')){
    const origin=req.headers.origin;
    if(origin&&origin!==(env.PUBLIC_ORIGIN||`http://${req.headers.host}`))throw error(403,'Origen no permitido.');
    if(['POST','PUT','DELETE'].includes(method)){const address=req.socket.remoteAddress||'unknown',current=limits.get(address)||{count:0,until:now()+3600000};if(current.until<now()){current.count=0;current.until=now()+3600000;}if(++current.count>60)throw error(429,'Espera un poco antes de volver a enviar.');limits.set(address,current);if(limits.size>10000)for(const [key,value]of limits)if(value.until<now())limits.delete(key);}
   }
   if(route==='/healthz')return json(res,200,{ok:true});
   if(route==='/api/status'&&method==='GET')return json(res,200,{storage:true,moderation:'manual',email:emailEnabled,reviewOnly:env.REVIEW_ONLY!=='false'});
   if(route==='/api/private'&&method==='POST'){
    const data=await body(req);if(!['letter','capsule'].includes(data.type)||!Array.isArray(data.ciphertext)||data.ciphertext.length<16||data.ciphertext.length>1_500_000||!data.ciphertext.every(x=>Number.isInteger(x)&&x>=0&&x<=255)||!Array.isArray(data.iv)||data.iv.length!==12||!data.iv.every(x=>Number.isInteger(x)&&x>=0&&x<=255)||!/^[a-f0-9]{64}$/i.test(data.readerHash||''))throw error(400,'Contenido privado no válido.');
    const unlock=data.type==='capsule'?Number(data.unlockAt):null;if(data.type==='capsule'&&(!Number.isFinite(unlock)||unlock<now()+60000||unlock>now()+5*366*86400000))throw error(400,'Elige una fecha futura dentro de cinco años.');
    const id=randomBytes(18).toString('base64url'),owner=token(),payload=JSON.stringify({ciphertext:data.ciphertext,iv:data.iv}),expires=(unlock||now())+366*86400000;
    let email=null,confirmation=null;if(data.email){if(!emailEnabled)throw error(503,'El envío por correo aún no está configurado.');if(!data.emailConsent||!/^\S+@\S+\.\S+$/.test(data.email)||data.email.length>254)throw error(400,'Revisa el correo y su consentimiento.');email=encrypt(data.email);confirmation=token();}
    db.prepare('INSERT INTO records(id,type,owner_hash,reader_hash,payload,status,created,unlock_at,expires,email,confirm_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(id,data.type,hash(owner),data.readerHash,payload,'private',now(),unlock,expires,email,confirmation?hash(confirmation):null);
    if(email){const link=env.PUBLIC_ORIGIN+'/#confirmar='+id+'&token='+confirmation;db.prepare('INSERT INTO outbox(id,record_id,kind,payload,due) VALUES(?,?,?,?,?)').run(token(),id,'confirm',encrypt({to:data.email,link}),now());}
    return json(res,201,{id,owner,unlockAt:unlock,expires,emailConfirmationPending:!!email});
   }
   const privateMatch=route.match(/^\/api\/private\/([\w-]+)$/);
   if(privateMatch&&method==='GET'){const r=db.prepare('SELECT * FROM records WHERE id=? AND status=\'private\'').get(privateMatch[1]);if(!r||r.expires<now()||!eq(r.reader_hash,hash(auth(req))))throw error(404,'Carta no disponible o enlace incompleto.');if(r.unlock_at&&r.unlock_at>now())return json(res,423,{message:'Tu cápsula aún está guardada.',unlockAt:r.unlock_at});return json(res,200,{...JSON.parse(r.payload),type:r.type,unlockAt:r.unlock_at});}
   const confirmMatch=route.match(/^\/api\/confirm\/([\w-]+)$/);if(confirmMatch&&method==='POST'){const data=await body(req),r=db.prepare('SELECT * FROM records WHERE id=?').get(confirmMatch[1]);if(!r||!r.confirm_hash||!eq(r.confirm_hash,hash(data.token)))throw error(404,'Confirmación no válida.');db.prepare('UPDATE records SET confirmed=1,confirm_hash=NULL WHERE id=?').run(r.id);db.prepare('INSERT INTO outbox(id,record_id,kind,payload,due) VALUES(?,?,?,?,?)').run(token(),r.id,'ready',encrypt({to:decrypt(r.email),link:env.PUBLIC_ORIGIN+'/#capsula='+r.id}),r.unlock_at||now());return json(res,200,{confirmed:true});}
   if(route==='/api/community'&&method==='POST'){const data=await body(req);if(!['wish','planet','flower'].includes(data.type)||data.consent!==true)throw error(400,'Confirma que quieres compartir ese contenido.');const payload=publicPayload(data.type,data.payload||{}),id=randomBytes(18).toString('base64url'),owner=token();db.prepare('INSERT INTO records(id,type,owner_hash,payload,status,created,expires) VALUES(?,?,?,?,?,?,?)').run(id,data.type,hash(owner),JSON.stringify(payload),'pending',now(),now()+366*86400000);return json(res,201,{id,owner,status:'pending'});}
   if(route==='/api/community'&&method==='GET'){const type=url.searchParams.get('type');if(!['wish','planet','flower'].includes(type))throw error(400,'Tipo no válido.');const rows=db.prepare('SELECT id,payload,created FROM records WHERE type=? AND status=\'approved\' AND expires>? ORDER BY created DESC LIMIT 100').all(type,now());return json(res,200,{items:rows.map(r=>({id:r.id,...JSON.parse(r.payload),created:r.created}))});}
   const ownerMatch=route.match(/^\/api\/owned\/([\w-]+)$/);if(ownerMatch&&method==='GET'){const r=owned(req,ownerMatch[1]);return json(res,200,{id:r.id,type:r.type,status:r.status,unlockAt:r.unlock_at,emailConfirmed:!!r.confirmed,delivery:db.prepare('SELECT kind,status,attempts FROM outbox WHERE record_id=?').all(r.id)});}if(ownerMatch&&method==='DELETE'){const r=owned(req,ownerMatch[1]);db.exec('BEGIN IMMEDIATE');try{db.prepare('DELETE FROM outbox WHERE record_id=?').run(r.id);db.prepare('DELETE FROM records WHERE id=?').run(r.id);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}return json(res,200,{deleted:true});}
   if(route==='/api/moderation'&&method==='GET'){moderate(req);return json(res,200,{items:db.prepare('SELECT id,type,payload,created FROM records WHERE status=\'pending\' ORDER BY created LIMIT 100').all().map(r=>({...r,payload:JSON.parse(r.payload)}))});}
   const modMatch=route.match(/^\/api\/moderation\/([\w-]+)$/);if(modMatch&&method==='PUT'){moderate(req);const data=await body(req),r=db.prepare('SELECT * FROM records WHERE id=? AND status=\'pending\'').get(modMatch[1]);if(!r||!['approve','reject'].includes(data.decision))throw error(400,'Revisión no válida.');if(data.decision==='approve'){if(data.checkedPrivacy!==true)throw error(400,'Confirma la revisión de privacidad.');publicPayload(r.type,JSON.parse(r.payload));}db.prepare('UPDATE records SET status=? WHERE id=?').run(data.decision==='approve'?'approved':'rejected',r.id);return json(res,200,{status:data.decision==='approve'?'approved':'rejected'});}
   if(route.startsWith('/api/'))throw error(404,'Ruta no disponible.');
   if(options.staticDir&&route==='/__qa/viewport'){const width=[390,768].includes(Number(url.searchParams.get('width')))?Number(url.searchParams.get('width')):390;res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end('<!doctype html><html lang=es><head><title>PaulitaM · revisión '+width+' px</title><style>body{margin:0;background:#eadde5;display:grid;justify-content:center;font:12px sans-serif}p{text-align:center;color:#704d61}iframe{width:'+width+'px;height:844px;border:0;background:white}</style></head><body><p>PaulitaM 2.0 · viewport '+width+' px</p><iframe title="PaulitaM en revisión responsive" src="/#experiencias"></iframe></body></html>');}
   if(!options.staticDir)throw error(404,'No encontrado.');
   const requested=decodeURIComponent(route==='/'?'/index.html':route);if(requested.includes('..')||requested.split('/').some(s=>s.startsWith('.')))throw error(404,'No encontrado.');const file=path.join(options.staticDir,requested);const bytes=await readFile(file).catch(()=>{throw error(404,'No encontrado.');});const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.txt':'text/plain'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(bytes);
  }catch(e){if(!res.headersSent)json(res,e.status||500,{message:e.status?e.message:'No se ha podido completar la operación.'});else res.end();}
 }
 async function tick(){
  db.prepare('DELETE FROM outbox WHERE record_id IN(SELECT id FROM records WHERE expires<?)').run(now());db.prepare('DELETE FROM records WHERE expires<?').run(now());
  if(!emailEnabled)return;
  const rows=db.prepare('SELECT * FROM outbox WHERE status=\'pending\' AND due<=? AND attempts<5 LIMIT 10').all(now());
  for(const row of rows){const record=db.prepare('SELECT * FROM records WHERE id=?').get(row.record_id);if(!record)continue;const mail=decrypt(row.payload),subject=row.kind==='confirm'?'Confirma tu cápsula de PaulitaM':'Tu cápsula de PaulitaM te está esperando';const text=row.kind==='confirm'?`Has solicitado recibir un aviso de tu cápsula. Confirma aquí: ${mail.link}\nSi no lo solicitaste, ignora este mensaje. No recibirás avisos posteriores sin confirmar.`:`La fecha de tu cápsula ha llegado. Ábrela en el navegador donde la creaste o utiliza tu enlace privado guardado: ${mail.link}\nPuedes borrar tu cápsula desde Mis recuerdos.`;
   try{const send=options.sendMail||(async(payload,key)=>{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify(payload),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('Delivery failed');});await send({from:env.CAPSULE_FROM,to:[mail.to],subject,text},row.id);db.prepare('UPDATE outbox SET status=\'sent\',attempts=attempts+1 WHERE id=?').run(row.id);}catch{db.prepare('UPDATE outbox SET attempts=attempts+1,due=?,status=CASE WHEN attempts>=4 THEN \'failed\' ELSE \'pending\' END WHERE id=?').run(now()+15*60000,row.id);}
  }
  db.prepare('DELETE FROM outbox WHERE record_id IN(SELECT id FROM records WHERE expires<?)').run(now());db.prepare('DELETE FROM records WHERE expires<?').run(now());
 }
 return {server:http.createServer(handler),db,tick,close:()=>db.close()};
}
if(require.main===module){const app=createApp({database:process.env.DATABASE_PATH,staticDir:process.env.STATIC_DIR?path.resolve(process.env.STATIC_DIR):undefined});app.server.listen(Number(process.env.PORT||4173),process.env.HOST||'127.0.0.1',()=>console.log('PaulitaM review server ready on port '+(process.env.PORT||4173)));const interval=setInterval(()=>app.tick().catch(()=>{}),60000);process.on('SIGTERM',()=>{clearInterval(interval);app.server.close(()=>{app.close();process.exit(0);});});}
module.exports={createApp};
