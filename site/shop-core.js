'use strict';
const atelierEngine=typeof module!=='undefined'?require('./atelier-core.js'):AtelierCore;
const ShopCore={
 normalizeCart(saved,products,sizes){
  if(!Array.isArray(saved))return [];
  return saved.filter(x=>x&&products.some(p=>p.id===x.id)&&(products.find(p=>p.id===x.id).kind||sizes.includes(x.size))&&Number.isInteger(x.quantity)&&x.quantity>0).flatMap(x=>{
   const p=products.find(p=>p.id===x.id);
   if(p.kind){const valid=atelierEngine.normalizeLine(x,products);return valid?[valid]:[];}
   if(p.bff&&!sizes.includes(x.friendSize))return [];
   return [{id:p.id,size:x.size,friendSize:p.bff?x.friendSize:null,option:p.options?(p.options.includes(x.option)?x.option:p.options[0]):'',quantity:Math.min(x.quantity,10),gift:x.gift===true,message:typeof x.message==='string'?x.message.slice(0,160):''}];
  });
 },
 unitCents(line,products){const p=products.find(p=>p.id===line.id);if(p.kind)return atelierEngine.breakdown(line,products).total;return atelierEngine.safePriceCents(p)*(p.bff?2:1)+(line.gift?390:0);},
 totalCents(cart,products){return cart.reduce((total,line)=>total+this.unitCents(line,products)*line.quantity,0);},
 recommend(answers,questions,products){
  const scores=new Map(products.map(p=>[p.id,0]));
  answers.forEach((answer,index)=>{const option=questions[index]?.options[answer];if(option)option.slice(1).forEach(id=>scores.set(id,(scores.get(id)||0)+(index===4?3:2)));});
  return [...products].sort((a,b)=>scores.get(b.id)-scores.get(a.id));
 }
};
if(typeof module!=='undefined')module.exports=ShopCore;
