const {test}=require('node:test');
const assert=require('node:assert/strict');
const {products}=require('../site/catalog.js');
const {atelierProducts,atelierColors,charmCategories}=require('../site/atelier-catalog.js');
const core=require('../site/atelier-core.js');
const shop=require('../site/shop-core.js');
const all=[...products,...atelierProducts];
const base={id:'liso-clasico',color:'lila',size:38,quantity:1,customization:[],gift:false,message:''};
test('three independent purchase modes have no minimum charm requirement',()=>{
 const plain=core.normalizeLine(base,all);
 const charm=core.normalizeLine({id:'ch-corazon',quantity:3},all);
 const custom=core.normalizeLine({...base,customization:[{id:'ch-corazon',quantity:2,placements:[{x:35,y:25},{x:52,y:30}]},{id:'ch-lazo',quantity:1,placements:[]}]},all);
 assert.equal(shop.unitCents(plain,all),2490);assert.equal(shop.unitCents(charm,all),150);assert.equal(shop.unitCents(custom,all),2980);
 assert.equal(shop.totalCents([plain,charm,custom],all),5920);
 assert.equal(plain.customization.length,0);assert.equal(charm.size,null);
});
test('custom colors, quantities, gift cards and positions survive a cart round trip',()=>{
 const line=core.normalizeLine({...base,quantity:2,gift:true,message:'Para mi persona favorita',customization:[{id:'ch-flor',quantity:2,placements:[{x:34,y:26},{x:56,y:32}]}]},all);
 const restored=shop.normalizeCart(JSON.parse(JSON.stringify([line])),all,[36,37,38,39,40,41]);
 assert.deepEqual(restored,[line]);assert.equal(shop.totalCents(restored,all),6360);
 assert.deepEqual(core.snapshot(restored[0],all).charms[0].placements,line.customization[0].placements);
 assert.equal(core.snapshot(line,all).color,'Lila');
});
test('invalid or duplicate charm selections cannot produce a cheaper checkout',()=>{
 for(const customization of [[{id:'unknown',quantity:1}],[{id:'ch-corazon',quantity:-1}],[{id:'ch-corazon',quantity:1},{id:'ch-corazon',quantity:1}],[{id:'liso-clasico',quantity:1}]])assert.equal(core.normalizeLine({...base,customization},all),null);
 assert.equal(core.normalizeLine({...base,color:'unknown'},all),null);assert.equal(core.normalizeLine({...base,size:99},all),null);
 assert.equal(core.normalizeLine({id:'ch-corazon',quantity:0},all),null);
});
test('cost floors block pricing below real configured costs',()=>{
 const costly=all.map(p=>p.id==='ch-corazon'?{...p,costCents:200}:p);
 assert.throws(()=>core.breakdown({...base,customization:[{id:'ch-corazon',quantity:1}]},costly),/below configured cost/);
 assert.doesNotThrow(()=>core.breakdown(base,all));
});
test('existing collections are preserved and revised sample prices stay within the requested reduction',()=>{
 assert.equal(products.length,19);
 for(const p of products){const reduction=1-p.price/p.originalPrice;assert(reduction>=.099&&reduction<=.151,p.name);}
 assert.equal(shop.unitCents({id:'bff-sun',gift:false},all),6980);
 assert.equal(new Set(all.map(p=>p.id)).size,all.length);
 assert.equal(atelierColors.length,9);assert.equal(charmCategories.length,9);
 for(const p of atelierProducts){assert.equal(p.stock,null);assert.equal(p.costCents,null);assert.deepEqual(p.photos,[]);}
});
test('distinct arrangements stay separate, identical designs combine quantities',()=>{
 const a=core.normalizeLine({...base,customization:[{id:'ch-corazon',quantity:1,placements:[{x:32,y:23}]}]},all);
 const b=core.normalizeLine({...base,customization:[{id:'ch-corazon',quantity:1,placements:[{x:52,y:33}]}]},all);
 const cart=[];core.addLine(cart,a);core.addLine(cart,structuredClone(a));core.addLine(cart,b);assert.equal(cart.length,2);assert.equal(cart[0].quantity,2);assert.equal(cart[1].quantity,1);
});
