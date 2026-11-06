const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {products,collections,quizQuestions}=require('../site/catalog.js');
const core=require('../site/shop-core.js');
const sizes=[36,37,38,39,40,41];
test('all requested collections have distinct designs and two-view image assets',()=>{
 assert.equal(collections.length,17);assert.equal(products.length,19);
 assert.equal(new Set(products.map(p=>p.id)).size,19);
 for(const c of collections)assert(products.some(p=>p.collection===c.id),c.id);
 for(const p of products){assert(fs.statSync(path.join(__dirname,'../site',p.id+'.webp')).size>1000);assert(p.charms.length>=3);}
 assert.equal(new Set(products.map(p=>p.charms.join('|'))).size,19);
 assert(products.find(p=>p.id==='snow').lining);
 assert.deepEqual(products.filter(p=>p.collection==='disney').map(p=>p.name),['La Bella y la Bestia','El Rey León']);
});
test('gift totals use integer cents, scale with quantity and include both BFF pairs',()=>{
 const pack={id:'bff-sun',size:36,friendSize:41,quantity:2,gift:true};
 assert.equal(core.unitCents(pack,products),8370);
 assert.equal(core.totalCents([pack,{id:'music',size:38,quantity:1,gift:true}],products),21720);
 assert.equal(core.unitCents({...pack,gift:false},products),7980);
});
test('restored carts reject invalid IDs, sizes and incomplete packs; clamp quantities and messages',()=>{
 const input=[{id:'bff-sun',size:36,friendSize:41,quantity:12,gift:true,message:'x'.repeat(200)}, {id:'bff-moon',size:36,quantity:1},{id:'fake',size:36,quantity:1},{id:'snow',size:99,quantity:1},{id:'music',size:38,option:'injected',quantity:1}];
 const cart=core.normalizeCart(input,products,sizes);assert.equal(cart.length,2);assert.equal(cart[0].quantity,10);assert.equal(cart[0].message.length,160);assert.equal(cart[0].friendSize,41);assert.equal(cart[1].option,'Quevedo');
 assert.deepEqual(core.normalizeCart({},products,sizes),[]);
});
test('quiz recommendations depend on choices and always resolve to an existing product',()=>{
 const music=core.recommend([2,0,0,2,0],quizQuestions,products)[0];
 const sports=core.recommend([3,0,0,2,0],quizQuestions,products)[0];
 assert.equal(music.id,'music');assert.equal(sports.id,'sports');
 const walk=(answers=[])=>{if(answers.length===quizQuestions.length){assert(products.some(p=>p.id===core.recommend(answers,quizQuestions,products)[0].id));return;}quizQuestions[answers.length].options.forEach((_,i)=>walk([...answers,i]));};walk();
});
