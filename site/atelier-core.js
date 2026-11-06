'use strict';
const AtelierCore={
 validQuantity:n=>Number.isSafeInteger(n)&&n>0&&n<=999,
 normalizeLine(line,all){
  const p=all.find(p=>p.id===line.id);if(!p?.kind||!this.validQuantity(line.quantity))return null;
  const common={id:p.id,quantity:line.quantity,gift:line.gift===true,message:typeof line.message==='string'?line.message.slice(0,160):'',option:'',friendSize:null};
  if(p.kind==='charm')return {...common,size:null,color:null,customization:[]};
  if(!p.sizes.includes(line.size)||!p.colors.some(c=>c.id===line.color))return null;
  const customization=[];
  if(Array.isArray(line.customization))for(const selection of line.customization){
   if(!selection||!all.some(c=>c.id===selection.id&&c.kind==='charm')||!this.validQuantity(selection.quantity)||customization.some(c=>c.id===selection.id))return null;
   const placements=Array.isArray(selection.placements)?selection.placements.slice(0,selection.quantity).map(pos=>({x:Number.isFinite(pos?.x)?Math.max(24,Math.min(76,pos.x)):50,y:Number.isFinite(pos?.y)?Math.max(15,Math.min(58,pos.y)):35})):[];
   customization.push({id:selection.id,quantity:selection.quantity,placements});
  }
  return {...common,size:line.size,color:line.color,customization};
 },
 safePriceCents(p){const price=Math.round(p.price*100);if(!Number.isSafeInteger(price)||price<0)throw Error('Invalid product price');if(Number.isInteger(p.costCents)&&price<p.costCents)throw Error('Price is below configured cost');return price;},
 breakdown(line,all){const p=all.find(p=>p.id===line.id);const base=this.safePriceCents(p);const extras=(line.customization||[]).map(s=>({id:s.id,quantity:s.quantity,unit:this.safePriceCents(all.find(c=>c.id===s.id))}));const charms=extras.reduce((n,s)=>n+s.unit*s.quantity,0);return {base,charms,extras,count:extras.reduce((n,s)=>n+s.quantity,0),gift:line.gift?390:0,total:base+charms+(line.gift?390:0)};},
 lineKey(line){const {quantity,...rest}=line;return JSON.stringify(rest);},
 addLine(cart,line){const existing=cart.find(x=>this.lineKey(x)===this.lineKey(line));if(existing){if(existing.quantity+line.quantity>999)throw Error('Máximo 999 unidades por selección.');existing.quantity+=line.quantity;}else cart.push(line);},
 snapshot(line,all){const p=all.find(p=>p.id===line.id);return {product:p.name,color:p.kind==='plain'?p.colors.find(c=>c.id===line.color)?.name:null,size:line.size,quantity:line.quantity,charms:(line.customization||[]).map(s=>({name:all.find(p=>p.id===s.id).name,quantity:s.quantity,placements:s.placements})),gift:line.gift,message:line.message,totalCents:this.breakdown(line,all).total*line.quantity};}
};
if(typeof module!=='undefined')module.exports=AtelierCore;
