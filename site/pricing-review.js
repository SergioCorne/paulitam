'use strict';
const StorePricing={giftCents:190,reviewOnly:true};
const PricingReview={
 propose(cents,cost=null){const target=cents<500?Math.round(cents/2):Math.round(cents/200)*100-10;const floor=Number.isInteger(cost)?Math.ceil(cost/.8):0;return Math.max(target,floor);},
 apply(products){for(const p of products){p.currentPrice=p.isNew?null:p.price;const cents=p.isNew?Math.round(p.price*100):this.propose(Math.round(p.price*100),p.costCents);p.proposedPrice=cents/100;p.price=p.proposedPrice;p.proposedMargin=Number.isInteger(p.costCents)?(cents-p.costCents)/cents:null;}},
 rows(products){return products.map(p=>({id:p.id,name:p.name,previous:p.currentPrice,proposed:p.proposedPrice,cost:p.costCents??null,margin:p.proposedMargin??null}));}
};
if(typeof module!=='undefined')module.exports={PricingReview,StorePricing};else PricingReview.apply(products);
