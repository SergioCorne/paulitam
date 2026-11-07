const {test}=require('node:test');
const assert=require('node:assert/strict');
const {catalog}=require('../server/catalog-model.cjs');
const {PricingReview}=require('../site/pricing-review.js');
const {PaulitaProfiles,PaulitaCore,PaulitaEmotions}=require('../site/experiences-data.js');
const atelier=require('../site/atelier-core.js');
global.AtelierCore=atelier;
const privateCards=require('../site/private-cards.js');
test('new universes have distinct recipes, 6 models each, and preserved original SKU IDs',()=>{
 const c=catalog();assert.equal(c.collections.length,43);assert.equal(c.products.filter(p=>!p.kind).length,197);
 assert.equal(new Set(c.products.map(p=>p.id)).size,c.products.length);
 const newModels=c.products.filter(p=>p.isNew&&!p.kind);assert.equal(new Set(newModels.map(p=>[...p.motifs].sort().join('|'))).size,newModels.length);
 for(const p of newModels){assert(p.motifs.length>=3);assert.equal(p.stock,null);assert.equal(p.licenseStatus,'original');assert.deepEqual(p.photos,[]);}
 for(const collection of c.collections.filter(c=>c.original&&!['primavera','verano','otono','invierno'].includes(c.id)))assert.equal(c.products.filter(p=>!p.kind&&p.collection===collection.id).length,6,collection.id);
 for(const id of ['bloom','sunny','cozy','snow','belle','simba','pirate','snoopy','bff-sun','bff-moon'])assert(c.products.some(p=>p.id===id));
 for(const season of ['primavera','verano','otono','invierno'])assert.equal(c.products.filter(p=>!p.kind&&p.collection===season).length,4);
 assert(c.products.filter(p=>p.collection==='invierno').every(p=>p.lining));
 assert(!c.products.some(p=>p.authenticity==='crocs-verified'));
});
test('half-price proposals never invent margins and respect a configured 20% gross-margin floor',()=>{
 const {products,rows}=catalog();assert.equal(products.find(p=>p.id==='liso-clasico').price,11.9);assert.equal(products.find(p=>p.id==='ch-corazon').price,.75);
 for(const r of rows){assert.equal(r.cost,null);assert.equal(r.margin,null);if(r.previous!==null){const ratio=r.proposed/r.previous;assert(ratio>.44&&ratio<.56,r.id);}}
 assert.equal(PricingReview.propose(1000,700),875);
});
test('all six entertainment outcomes and all emotion designs resolve to real catalog items',()=>{
 const {products}=catalog();for(let i=0;i<6;i++)assert.equal(PaulitaCore.personality([i,i,i,i,i]).id,PaulitaProfiles[i].id);
 for(const e of PaulitaEmotions){const line=PaulitaCore.design(e.color,e.motifs,products,38);assert(atelier.normalizeLine(line,products));assert.equal(line.customization.length,e.motifs.length);assert(atelier.breakdown(line,products).total>0);}
 const line=PaulitaCore.surprise('lila','dreamy',products,()=>.2);assert.equal(line.color,'lila');assert.equal(new Set(line.customization.map(s=>s.id)).size,3);
});
test('two complementary pairs are added atomically and keep requested initials',()=>{
 const {products}=catalog();const a={...PaulitaCore.design('pastel',['moon'],products,38),requestedInitial:'P'},b=PaulitaCore.design('lila',['star'],products,null);const cart=[];assert.throws(()=>PaulitaCore.pair(cart,[a,b],products));assert.deepEqual(cart,[]);b.size=39;const result=PaulitaCore.pair(cart,[a,b],products);assert.equal(result.length,2);assert.equal(result[0].requestedInitial,'P');
});
test('private cards encrypt and authenticate in the browser without sending their decryption key',async()=>{
 const content={title:'Fixture privada',message:'Un mensaje de prueba local',photo:null};const encrypted=await privateCards.encrypt(content);assert(!JSON.stringify(encrypted.ciphertext).includes(content.message));assert.deepEqual(await privateCards.decrypt(encrypted,encrypted.key),content);const wrong=await privateCards.encrypt({});await assert.rejects(privateCards.decrypt(encrypted,wrong.key));assert.equal(encrypted.readerHash,await privateCards.digest(encrypted.reader));assert.notEqual(encrypted.reader,encrypted.key);
});
test('QR library produces a real QR matrix for private capability links',()=>{
 const qr=require('../site/qrcode.js')(0,'M');qr.addData('https://paulitam.woas-team.team/#carta=fixture&k=opaque-key&r=opaque-reader');qr.make();assert(qr.getModuleCount()>=21);assert(qr.isDark(0,0));assert(qr.createSvgTag({scalable:true}).includes('<svg'));
});
