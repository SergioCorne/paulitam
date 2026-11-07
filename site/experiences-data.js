'use strict';
const PaulitaProfiles=[
 {id:'romantic',name:'Paulita Romantic',icon:'heart',color:'pastel',palette:['#edc1d2','#fff5e8','#d893b1'],description:'Te quedas con los detalles que tienen algo que contar. Una flor, una nota, un gesto pequeño que no era tan pequeño.',collection:'san-valentin',motifs:['heart','rose','letter']},
 {id:'dreamy',name:'Paulita Dreamy',icon:'star',color:'lila',palette:['#cbb6df','#f3e9fa','#e2c68f'],description:'Tienes un pie aquí y otro en esa idea que te hace ilusión. Te gustan los cielos bonitos y dejar espacio para imaginar.',collection:'dreamy',motifs:['moon','star','planet']},
 {id:'chaos',name:'Paulita Chaos',icon:'smile',color:'chicle',palette:['#e68db8','#d2b7df','#f3d58e'],description:'Un caos precioso, pero con criterio propio. Mezclas planes, colores y pequeños antojos, y casi siempre acabas inventando algo.',collection:'y2k',motifs:['lightning','camera','smile']},
 {id:'cozy',name:'Paulita Cozy',icon:'coffee',color:'crema',palette:['#e7d5b5','#c5a5af','#f8f0e5'],description:'Sabes disfrutar una pausa. Una taza, un capítulo y un plan tranquilo pueden ser justo lo que necesitabas.',collection:'otono',motifs:['coffee','book','bear']},
 {id:'sunshine',name:'Paulita Sunshine',icon:'sun',color:'verde',palette:['#f1d49d','#c6d9bd','#edb8c2'],description:'Te ilusionan los planes sencillos y las cosas que pasan fuera. Donde hay un rayito de sol, tú ya has encontrado un plan.',collection:'verano',motifs:['sun','flower','strawberry']},
 {id:'coquette',name:'Paulita Coquette',icon:'bow',color:'pastel',palette:['#e8c5d5','#fff8ec','#c7b6d3'],description:'Lo tuyo son los detalles elegidos con calma. Un lazo, una perla y ese rosa que se parece mucho a ti.',collection:'coquette',motifs:['bow','pearl','rose']}
];
const PaulitaQuestions=[
 ['Tu plan de hoy sería…',['Una cita con flores','Mirar el cielo y soñar','Improvisar tres planes','Café, libro y manta','Escapada al sol','Un paseo y un lazo bonito']],
 ['El color que te llama primero…',['Rosa suave','Lila de atardecer','Rosa chicle con chispa','Crema calentito','Verde con un toque de sol','Rosa empolvado y perlas']],
 ['Un pequeño detalle que guardarías…',['Una nota escrita a mano','Una estrella dibujada','Una foto inesperada','Un marcapáginas','Una flor de un paseo','Una cinta que envolvía un regalo']],
 ['Tu forma de disfrutar lo bonito…',['Compartirlo con alguien','Imaginar lo que podría ser','Mezclarlo a mi manera','Quedarme un ratito más','Salir a encontrarlo','Elegir cada detalle']],
 ['El charm que va contigo hoy…',['Un corazón','Una luna','Un rayito','Una taza','Un sol','Un lazo']]
];
const PaulitaEmotions=[
 ['love','Enamoradísima','romantic','pastel',['heart','letter','rose']],['happy','Feliz y brillante','sunshine','chicle',['sun','star','smile']],['calm','Tranquila','cozy','crema',['coffee','book','leaf']],['dream','Soñadora','dreamy','lila',['moon','star','planet']],['nostalgia','Nostálgica','cozy','crema',['camera','cassette','book']],['adventure','Aventurera','sunshine','azul',['compass','wave','sun']],['chaos','Un caos precioso','chaos','chicle',['lightning','smile','camera']]
].map(([id,name,profile,color,motifs])=>({id,name,profile,color,motifs}));
const PaulitaCore={
 personality(answers){const scores=PaulitaProfiles.map(()=>0);answers.forEach((a,i)=>{if(Number.isInteger(a)&&a>=0&&a<6)scores[a]+=i===4?2:1;});let winner=0;for(let i=1;i<6;i++)if(scores[i]>scores[winner]||(scores[i]===scores[winner]&&answers.at(-1)===i))winner=i;return PaulitaProfiles[winner];},
 charmsFor(motifs,all){return motifs.map(icon=>all.find(p=>p.kind==='charm'&&p.icon===icon)).filter(Boolean);},
 design(color,motifs,all,size=null){return {id:'liso-clasico',color,size,quantity:1,customization:this.charmsFor(motifs,all).map(p=>({id:p.id,quantity:1,placements:[]})),gift:false,message:''};},
 surprise(color,profile,all,random=Math.random){const p=PaulitaProfiles.find(p=>p.id===profile)||PaulitaProfiles.find(p=>p.color===color)||PaulitaProfiles[0];const pool=[...new Set([...p.motifs,...(color==='azul'?['wave','shell']:color==='verde'?['leaf','flower']:color==='lila'?['moon','star']:['heart','bow'])])];const picks=[],target=Math.min(3,pool.length);while(picks.length<target){const i=Math.min(pool.length-1,Math.floor(random()*pool.length));picks.push(pool.splice(i,1)[0]);}return this.design(color,picks,all);},
 pair(cart,lines,all){const draft=structuredClone(cart);for(const raw of lines){const normalized=AtelierCore.normalizeLine(raw,all);if(!normalized)throw Error('Selecciona las dos tallas antes de añadir los pares.');AtelierCore.breakdown(normalized,all);AtelierCore.addLine(draft,normalized);}return draft;}
};
if(typeof module!=='undefined')module.exports={PaulitaProfiles,PaulitaQuestions,PaulitaEmotions,PaulitaCore};
