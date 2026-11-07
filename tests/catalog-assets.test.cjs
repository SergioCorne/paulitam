'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {catalog}=require('../server/catalog-model.cjs');
const Media=require('../site/product-media.js');
const root=path.resolve(__dirname,'../site');
test('every independent charm and plain color resolves to its own photographic reference asset',()=>{
 const {products}=catalog();Media.apply(products);const charms=products.filter(p=>p.kind==='charm'),plain=products.find(p=>p.kind==='plain');assert.equal(charms.length,153);assert.equal(plain.colors.length,10);
 const sources=[...charms.map(p=>p.photos[0]),...plain.colors.flatMap(c=>c.photos)];assert.equal(new Set(sources).size,sources.length);
 const hashes=new Set();for(const source of sources){const bytes=fs.readFileSync(path.join(root,source));assert.equal(bytes.subarray(0,4).toString(),'RIFF',source);assert.equal(bytes.subarray(8,12).toString(),'WEBP',source);assert(bytes.length>2000,source);hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));}assert.equal(hashes.size,sources.length,'Separate products must not reuse one image');
 for(const p of charms){assert.equal(p.stock,null);assert.equal(p.costCents,null);assert.equal(p.mediaStatus,'generated-reference');}
 for(const c of plain.colors)assert.equal(c.mediaStatus,'generated-reference');
});
test('personalization contains the full Spanish alphabet and digits and remains individually purchasable',()=>{
 const {products}=catalog();const Core=require('../site/atelier-core.js');for(const char of 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789'){const id=/\d/.test(char)?'ch-numero-'+char:'ch-inicial-'+(char==='Ñ'?'enie':char.toLowerCase());const p=products.find(p=>p.id===id);assert(p,char);const line=Core.normalizeLine({id,quantity:1,customization:[],gift:false},products);assert(line,char);assert.equal(Core.breakdown(line,products).total,95);}
});
test('all 197 collection models have distinct two-view photographic assets',()=>{
 const {products,collections}=catalog();Media.apply(products);const models=products.filter(p=>!p.kind);assert.equal(models.length,197);const hashes=new Set();
 for(const p of models){assert.equal(p.photoViews,2,p.name);assert.equal(p.mediaStatus,'generated-reference');assert.match(p.collectionPhoto,/\.webp$/);const bytes=fs.readFileSync(path.join(root,p.collectionPhoto));assert.equal(bytes.subarray(0,4).toString(),'RIFF',p.name);assert.equal(bytes.subarray(8,12).toString(),'WEBP',p.name);assert(bytes.length>4000,p.name);hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));}
 assert.equal(hashes.size,197,'Each model must keep its own photograph');for(const c of collections)assert(models.some(p=>p.collection===c.id),c.label);
});
