'use strict';
const AtelierVisuals={
 esc:v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 icon(name){
  const shapes={
   heart:'<path d="M32 53C22 44 8 35 8 23 8 9 26 7 32 19 38 7 56 9 56 23 56 35 42 44 32 53Z" fill="#ed82ac"/>',
   letter:'<rect x="5" y="14" width="54" height="37" rx="6" fill="#fff1df"/><path d="m7 17 25 19 25-19" fill="none"/><path d="M32 43 22 33q-3-11 10-5 13-6 10 5Z" fill="#ed82ac"/>',
   flower:'<g fill="#ffd7e4"><ellipse cx="32" cy="17" rx="9" ry="14"/><ellipse cx="32" cy="47" rx="9" ry="14"/><ellipse cx="17" cy="32" rx="14" ry="9"/><ellipse cx="47" cy="32" rx="14" ry="9"/></g><circle cx="32" cy="32" r="10" fill="#e9bd69"/>',
   butterfly:'<path d="M31 28C8-5 0 30 24 35 3 51 25 67 32 42 39 67 61 51 40 35 64 30 56-5 33 28Z" fill="#c8b3e5"/><path d="M32 18v29m0-28-7-8m7 8 7-8" fill="none"/>',
   cat:'<path d="M10 29 9 8 25 19h14L55 8l-1 22c14 35-58 35-44-1Z" fill="#e0c9b1"/><path d="M21 34h2m18 0h2m-14 7 3 3 3-3m-20 3-10-3m44 3 10-3" fill="none"/>',
   paw:'<ellipse cx="32" cy="44" rx="18" ry="14" fill="#e995b6"/><g fill="#e995b6"><ellipse cx="10" cy="25" rx="7" ry="9"/><ellipse cx="24" cy="15" rx="7" ry="10"/><ellipse cx="41" cy="15" rx="7" ry="10"/><ellipse cx="54" cy="27" rx="7" ry="9"/></g>',
   croissant:'<path d="M5 43C4 11 59 7 59 43L46 48 39 43H25l-7 5Z" fill="#dfb478"/><path d="m15 24 9 20m7-25 1 24m15-20-8 20" fill="none"/>',
   coffee:'<path d="M13 24h33v23q-16 14-33 0Z" fill="#f9e3cb"/><path d="M46 27q23-2 10 17H46M10 56h43M24 17q-8-5 0-11m12 11q-8-5 0-11" fill="none"/>',
   star:'<path d="m32 4 8 18 20 2-15 14 4 21-17-10-18 10 4-21L3 24l21-2Z" fill="#efcf83"/>',
   moon:'<path d="M45 6C-10 0-4 67 48 57 19 46 21 20 45 6Z" fill="#dccbee"/><circle cx="47" cy="24" r="3" fill="#ecc881"/>',
   bow:'<path d="M29 29C-7-6-1 63 29 37l-8 22 12-7 11 7-8-22C66 63 72-6 36 29Z" fill="#ed9ebd"/><circle cx="32" cy="33" r="7" fill="#d67d9f"/>',
   pearl:'<circle cx="32" cy="32" r="23" fill="#fff7e8"/><path d="M17 28q2-13 16-13" fill="none" stroke="#fff" stroke-width="5"/>',
   cloud:'<path d="M15 50C-4 45 2 23 18 26 19 6 45 5 47 26 65 24 68 48 51 50Z" fill="#e7dff5"/><path d="M24 37h2m14 0h2m-15 6q5 6 11 0" fill="none"/>',
   smile:'<circle cx="32" cy="32" r="25" fill="#f1d58e"/><path d="M22 24h1m18 0h1M18 36q14 19 28 0" fill="none"/>',
   book:'<path d="M4 11q15-3 28 6 13-9 28-6v43q-15-3-28 5-13-8-28-5Z" fill="#ead5ed"/><path d="M32 17v42M10 23l14 3m-14 6 14 3m15-9 14-3m-14 12 14-3" fill="none"/>',
   halves:'<path d="M30 53C15 41 4 30 8 19 12 8 23 11 30 20l-6 9 8 7-7 8Z" fill="#ec9db9"/><path d="m34 53 5-9-7-8 8-7-6-9C42 7 54 11 57 20 61 33 46 44 34 53Z" fill="#bba7d8"/>',
   pumpkin:'<path d="M9 20q13-9 23-4 15-6 25 6c13 36-56 46-48-2Z" fill="#e7ac73"/><path d="M32 17q-4-13 8-14M32 20v36M21 21q-10 19 0 32m22-32q10 19 0 32" fill="none"/>',
   snowflake:'<path d="M32 3v58M7 18l50 28M7 46l50-28M22 9l10 9L42 9M22 55l10-9 10 9M7 30l12-5V13m38 21-12 5v12M7 34l12 5v12m38-21-12-5V13" fill="none" stroke="#b59aca" stroke-width="4"/>'
  };
  return `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#9a6f83" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shapes[name]||shapes.heart}</svg>`;
 },
 clog(hex){return `<svg class="clog-drawing" viewBox="0 0 360 420" aria-hidden="true"><ellipse cx="180" cy="383" rx="104" ry="15" fill="#704553" opacity=".09"/><path d="M70 109C70-5 289-5 289 109l-10 230c-4 64-199 64-205 0Z" fill="${hex}" stroke="#876578" stroke-width="2"/><path d="M78 110C80 18 280 18 282 110" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="11"/><ellipse cx="180" cy="289" rx="79" ry="65" fill="#fff7ef" stroke="#876578" stroke-width="2"/><path d="M97 277c0 96 166 96 166 0" fill="none" stroke="#876578" stroke-width="15"/><path d="M97 277c0 96 166 96 166 0" fill="none" stroke="${hex}" stroke-width="11"/><g fill="#98788a" opacity=".55">${[88,126,164,202].flatMap((y,r)=>[120,160,200,240].map((x,c)=>`<ellipse cx="${x+(r%2?3:0)}" cy="${y}" rx="7" ry="5"/>`)).join('')}</g><circle cx="96" cy="277" r="10" fill="${hex}" stroke="#876578"/><circle cx="264" cy="277" r="10" fill="${hex}" stroke="#876578"/></svg>`;},
 color(p,id){return p.colors?.find(c=>c.id===id)||p.colors?.[0];},
 photoPath(path){return typeof path==='string'&&/^[a-zA-Z0-9_./-]+\.(webp|png|jpg|jpeg)$/.test(path)?path:null;},
 product(p,colorId){const color=this.color(p,colorId);const source=this.photoPath((color?.photos?.length?color.photos:p.photos)?.[0]);return `<span class="mock-product ${p.kind==='charm'?'charm-mock':''}">${source?`<img src="${this.esc(source)}" alt="${this.esc(p.name+(color?' · '+color.name:''))}" loading="lazy">`:p.kind==='charm'?this.icon(p.icon):this.clog(color.hex)}${!source?'<span class="photo-pending">Ilustración · foto pendiente</span>':''}</span>`;},
 layout(selections){const placed=[];for(const s of selections||[])for(let i=0;i<s.quantity&&placed.length<24;i++){const n=placed.length;const position=s.placements?.[i]||{x:32+(n%4)*12,y:23+Math.floor(n/4)*5};placed.push({id:s.id,index:i,x:position.x,y:position.y});}return placed;},
 line(line,all){const p=all.find(p=>p.id===line.id);if(p.kind!=='plain'||!line.customization?.length)return this.product(p,line.color);const color=this.color(p,line.color);return `<span class="mock-product miniature-design">${this.clog(color.hex)}${this.layout(line.customization).map(s=>`<span class="mini-charm" style="left:${s.x}%;top:${s.y}%">${this.icon(all.find(p=>p.id===s.id).icon)}</span>`).join('')}</span>`;}
};
