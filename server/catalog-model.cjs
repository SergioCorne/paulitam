'use strict';
function catalog(){const base=require('../site/catalog.js'),atelier=require('../site/atelier-catalog.js'),universe=require('../site/universe-catalog.js'),{PricingReview}=require('../site/pricing-review.js');const products=structuredClone([...base.products,...atelier.atelierProducts]),collections=structuredClone(base.collections),extra=[];universe.extend(collections,products,extra);products.push(...extra);PricingReview.apply(products);return {products,collections,rows:PricingReview.rows(products)};}
module.exports={catalog};
