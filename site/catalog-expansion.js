'use strict';
// Original concepts only. No supplier, physical stock, material certification or licenses are implied.
const CatalogExpansion={
 apply(products,categories){
  const newCategories=[['kawaii','Cute y kawaii'],['coquette','Coquette y románticos'],['aesthetic','Estética y aesthetic'],['personalizacion','Letras y personalización']];
  for(const [id,name]of newCategories)if(!categories.some(c=>c.id===id))categories.push({id,name});
  const designs=[
   ['frog','Ranita de estanque','animales','Una ranita verde sentada sobre una pequeña hoja de nenúfar.'],
   ['duck','Patito de paseo','animales','Un patito amarillo con pico naranja y pequeñas alas abiertas.'],
   ['dachshund','Teckel de paseo','animales','Un perrito teckel de cuerpo alargado, orejas caídas y collar rosa.'],
   ['poodle','Caniche esponjoso','animales','Un caniche crema con pelo rizado y un lazo pequeño.'],
   ['corgi','Corgi sonriente','animales','Un corgi de orejas grandes, pecho blanco y patitas cortas.'],
   ['dalmatian','Dálmata de lunares','animales','Un perrito blanco con manchas negras y collar rojo.'],
   ['dolphin','Delfín de verano','animales','Un delfín azul saltando sobre una pequeña ola.'],
   ['turtle','Tortuguita viajera','animales','Una tortuga marina verde con caparazón de hexágonos.'],
   ['octopus','Pulpito curioso','animales','Un pulpito lavanda de ocho tentáculos y ojos amables.'],
   ['whale','Ballena de sueños','animales','Una ballena azul pastel con una pequeña gota de agua.'],
   ['fox','Zorrito de otoño','animales','Un zorrito naranja sentado, cola grande con punta blanca.'],
   ['hedgehog','Erizo de jardín','animales','Un erizo pequeño marrón con una flor junto a la oreja.'],
   ['cupcake','Cupcake de fresa','comida','Un cupcake con envoltorio rosa, crema blanca y una fresa.'],
   ['fries','Patatitas para compartir','comida','Patatas fritas doradas en una cajita de rayas rosa y crema.'],
   ['sushi','Sushi de domingo','comida','Una pieza de sushi de salmón con arroz blanco y detalle de alga.'],
   ['watermelon','Sandía al sol','comida','Una rodaja triangular de sandía rosa, semillas negras y corteza verde.'],
   ['peach','Melocotón suave','comida','Un melocotón redondeado con dos hojas y un surco central.'],
   ['avocado','Aguacate feliz','comida','Medio aguacate verde con un hueso marrón redondo.'],
   ['boba','Té de burbujas','comida','Un vaso transparente de té rosa con perlas oscuras y pajita.'],
   ['vinyl','Vinilo de domingo','aesthetic','Un disco de vinilo negro con etiqueta central rosa y surcos circulares.'],
   ['dice','Dados de la suerte','aesthetic','Dos dados pequeños crema con puntos rosa, uno mostrando tres y otro seis.'],
   ['headphones','Mi banda sonora','aesthetic','Unos auriculares rosa con almohadillas crema y diadema curva.'],
   ['mascot','Bichito de ilusión','kawaii','Personaje original: una gotita lavanda con dos antenas redondas, ojos pequeños y botas rosas. Sin parecido con personajes existentes.'],
   ['ribbonrose','Rosa de cinta','coquette','Una rosa plegada en cinta rosa empolvado con dos hojas de satén verde.'],
   ['gingerbread','Galletita de Navidad','temporada','Una galleta de jengibre con glaseado blanco y botones rosa.'],
   ['ghost','Fantasmita amable','temporada','Un fantasmita blanco de borde ondulado que sostiene una calabacita naranja.']
  ];
  for(const [icon,name,category,design]of designs)this.add(products,'ch-new-'+icon,name,category,icon,design);
  for(const letter of 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ')this.add(products,'ch-inicial-'+(letter==='Ñ'?'enie':letter.toLowerCase()),'Letra '+letter,'personalizacion','initial-'+letter,'Una letra mayúscula '+letter+' de trazo grueso y redondeado, rosa pastel con un fino borde crema.');
  for(let n=0;n<10;n++)this.add(products,'ch-numero-'+n,'Número '+n,'personalizacion','number-'+n,'Un número '+n+' de trazo redondeado, lavanda con un fino borde crema.');
  const crossCategories={kawaii:['cat','dog','bear','bunny','capybara','smile','cloud','rainbow','heart','star','flower','bow','duck','frog','mascot','octopus'],coquette:['bow','pearl','heart','flower','rose','butterfly','ribbon','lace','dress','mirror','ribbonrose'],aesthetic:['camera','vinyl','planet','star','moon','dice','music','microphone','headphones','cassette','phone','circuit','quill','key','leaf','flower'],temporada:['gingerbread','snowflake','candy','bell','lights','ghost','pumpkin','sun','shell','strawberry','leaf','lemon'],animales:['butterfly','bee','paw','cat','dog','bunny','bear','capybara','frog','duck','dolphin','turtle','octopus','whale']};for(const p of products.filter(p=>p.kind==='charm'))p.categories=[...new Set([p.category,...Object.entries(crossCategories).filter(([,icons])=>icons.includes(p.icon)).map(([id])=>id)])];
  const flame=products.find(p=>p.id==='ch-u-flame');if(flame){flame.name='Llama de fuego';flame.description='Una pequeña llama de fuego coral y dorada para una combinación llena de ilusión. Referencia original pendiente de fabricación.';}
  const featured=['ch-corazon','ch-new-frog','ch-u-capybara','ch-new-sushi','ch-lazo','ch-new-dachshund','ch-new-cupcake','ch-u-planet','ch-inicial-a','ch-new-vinyl','ch-new-duck','ch-new-boba'];for(const [i,id]of featured.entries()){const p=products.find(p=>p.id===id);if(p)p.displayOrder=100-i;}
  const plain=products.find(p=>p.kind==='plain');if(!plain.colors.some(c=>c.id==='amarillo'))plain.colors.push({id:'amarillo',name:'Amarillo mantequilla',hex:'#efdb91',photos:[],stock:null});
  for(const p of products.filter(p=>p.kind==='charm'))p.designBrief??=p.name+': un charm con forma de '+(typeof UniverseCatalog!=='undefined'?UniverseCatalog.motifNames[p.icon]||p.name:p.name)+'.';
 },
 add(products,id,name,category,icon,design){if(products.some(p=>p.id===id))return;products.push({id,kind:'charm',name,category,icon,designBrief:design,description:design+' Diseño de referencia; fabricación y disponibilidad por confirmar.',price:.95,isNew:true,priceStatus:'proposal',licenseStatus:'original',costCents:null,stock:null,photos:[],charms:[],wrap:'motivos originales'});}
};
if(typeof module!=='undefined')module.exports=CatalogExpansion;else CatalogExpansion.apply(products,charmCategories);
