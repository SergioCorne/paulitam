'use strict';
// Editable concept catalog. null means unconfirmed; no supplier, costs or stock are assumed.
const atelierColors=[
 ['pastel','Rosa pastel','#efbcd0'],['chicle','Rosa chicle','#e869a1'],['blanco','Blanco','#f7f5f0'],['negro','Negro','#45414a'],['crema','Crema','#e4d4b7'],['lila','Lila','#b9a2d5'],['azul','Azul','#85b4d8'],['verde','Verde','#9cbea4'],['rojo','Rojo','#d87179']
].map(([id,name,hex])=>({id,name,hex,photos:[],stock:null}));
const charmCategories=[['amor','Corazones y amor'],['naturaleza','Flores y naturaleza'],['animales','Animales'],['comida','Comida y dulces'],['magia','Estrellas y magia'],['accesorios','Lazos y accesorios'],['divertidos','Personajes y diseños divertidos'],['especiales','Colecciones especiales'],['temporada','Colecciones de temporada']].map(([id,name])=>({id,name}));
const giftDedications=['Para alguien que ilumina mis días','Para mi persona favorita','Para una amiga que merece el mundo','Porque te mereces un caprichito','Un pequeño detalle para alguien muy especial'];
const atelierProducts=[
 {id:'liso-clasico',kind:'plain',name:'Tu lienzo · zueco liso',price:24.90,description:'Un punto de partida para tu propio universo. Puedes elegirlo completamente liso, sin añadir ningún charm. Modelo, tallas y colores de muestra pendientes de confirmar.',colors:atelierColors,sizes:[36,37,38,39,40,41],photos:[],stock:null,costCents:null,charms:[],wrap:'corazones y flores',priceStatus:'sample'},
 ...[
  ['ch-corazon','Corazoncito','amor','heart',150,'El cariño y el amor por los pequeños detalles.',true],
  ['ch-carta','Carta de amor','amor','letter',190,'Un mensajito que merece guardarse.'],
  ['ch-flor','Flor sensible','naturaleza','flower',150,'El lado sensible, romántico y capaz de florecer.',true],
  ['ch-mariposa','Mariposa soñadora','naturaleza','butterfly',190,'Un guiño a las ganas de descubrir cosas bonitas.'],
  ['ch-gato','Gatito curioso','animales','cat',190,'Para quienes encuentran compañía en unas patitas.'],
  ['ch-huella','Huella de amor','animales','paw',150,'Un pequeño símbolo de cariño por los animales.'],
  ['ch-croissant','Croissant de domingo','comida','croissant',190,'Ese momento de pausa que apetece repetir.'],
  ['ch-cafe','Mi ritual de café','comida','coffee',190,'Los pequeños rituales que hacen especial lo cotidiano.',true],
  ['ch-estrella','Estrellita ilusionada','magia','star',150,'Los sueños y las ilusiones que nos acompañan.',true],
  ['ch-luna','Luna tranquila','magia','moon',190,'Un poquito de calma para tus días llenos de planes.'],
  ['ch-lazo','Lazo rosa','accesorios','bow',190,'La feminidad y ese gusto por el rosa que no pide permiso.',true],
  ['ch-perla','Pequeña perla','accesorios','pearl',150,'Un detalle sencillo para una combinación muy tuya.'],
  ['ch-nube','Nube contenta','divertidos','cloud',190,'Para llevar un día bonito incluso cuando está nublado.'],
  ['ch-sonrisa','Sonrisita','divertidos','smile',150,'Un recordatorio para mirar el día con un poquito de humor.'],
  ['ch-libro','Un capítulo más','especiales','book',190,'La curiosidad y las ganas de seguir aprendiendo.',true],
  ['ch-mitades','Personas que encajan','especiales','halves',250,'Dos mitades en el diseño: las personas especiales de nuestra vida.',true],
  ['ch-calabaza','Calabacita','temporada','pumpkin',190,'Un pequeño guiño al lado divertido del otoño.'],
  ['ch-copo','Copo de invierno','temporada','snowflake',150,'La calma y los pequeños detalles de los días de invierno.']
 ].map(([id,name,category,icon,cents,description,personal])=>({id,kind:'charm',name,category,icon,price:cents/100,description,personal:!!personal,photos:[],stock:null,costCents:null,charms:[],wrap:'pequeños detalles de la categoría',priceStatus:'sample'}))
];
const priceChanges=[{before:3990,after:3490},{before:4290,after:3790},{before:4490,after:3990},{before:4590,after:4090},{before:4690,after:4190},{before:4790,after:4290},{before:4990,after:4490}];
const scrapbookEntries=[
 {id:'primeros-pasos',title:'Los primeros pasos',note:'Aquí guardaremos una foto real de los comienzos en Granada.',image:null,date:null},
 {id:'mesa-creativa',title:'Nuestra mesa de ideas',note:'Un huequito para los colores, bocetos y momentos del proyecto.',image:null,date:null},
 {id:'pequeno-recuerdo',title:'Un recuerdo para guardar',note:'Este espacio espera su próxima foto y una nota de Paulita.',image:null,date:null}
];
const surpriseMessages=['Por si hoy necesitabas recordar lo especial que eres.','No hace falta tener un día perfecto para encontrar algo bonito.','Que nunca te falten motivos para ilusionarte.','Las cosas hechas con cariño siempre tienen algo diferente.','Hoy también mereces regalarte algo bonito.','Los pequeños detalles hacen que los días sean especiales.','Ojalá hoy te pase algo que te saque una sonrisa sin darte cuenta.'];
const seasonPersonalities={primavera:{quote:'Florecer también es ir a tu ritmo.',description:'Romántica, floral y soñadora.',charms:['ch-flor','ch-mariposa','ch-corazon']},verano:{quote:'Un plan improvisado puede ser el mejor plan.',description:'Alegre, espontánea y divertida.',charms:['ch-sonrisa','ch-nube','ch-estrella']},otono:{quote:'Una pausa, un capítulo y algo calentito.',description:'Cálida, tranquila y un poquito nostálgica.',charms:['ch-libro','ch-cafe','ch-calabaza']},invierno:{quote:'Los pies calentitos. Las ilusiones, también.',description:'Acogedora, dulce y delicada.',charms:['ch-copo','ch-luna','ch-corazon']}};
if(typeof module!=='undefined')module.exports={atelierColors,charmCategories,atelierProducts,giftDedications,priceChanges,scrapbookEntries,surpriseMessages,seasonPersonalities};
else products.push(...atelierProducts);
