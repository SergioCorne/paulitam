'use strict';
// Generated photographic references are explicitly distinguished from supplier photographs.
const ProductMedia={
 apply(products){for(const p of products){if(p.kind==='plain'){for(const color of p.colors){color.photos=['ref-liso-'+color.id+'.webp'];if(color.id==='pastel')color.photos.push('ref-liso-pastel-lateral.webp','ref-liso-pastel-superior.webp');color.mediaStatus='generated-reference';}}else if(p.kind==='charm'){p.photos=['ref-'+p.id+'.webp'];p.mediaStatus='generated-reference';}else{p.collectionPhoto=p.concept?'ref-model-'+p.id+'.webp':p.id+'.webp';p.photoViews=2;p.mediaStatus='generated-reference';}}},
 caption:'Referencia visual generada · producto por confirmar'
};
if(typeof module!=='undefined')module.exports=ProductMedia;else ProductMedia.apply(products);
