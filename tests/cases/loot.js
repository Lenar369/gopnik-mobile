const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const acts=h=>(h.match(/data-do="surv:(loot|view)[^"]*"/g)||[]).join(' ');
let a=boot(),g=a.do('start');
g=a.pin('house12');console.log('1 house12 actions:',acts(a.html()));
for(let i=0;i<4;i++){g=a.do('surv:loot:q5_basement');console.log('  search',i,'|',g.log[0])}
console.log('2 mats',JSON.stringify(g.surv.mats),'loot',JSON.stringify(g.surv.loot));
// дать материалов и проверить крафт
g.surv.mats={planks:9,nails:9,paper:5,matches:3,rags:6,wool:3,cloth:2,rope:6,scrap:5,tape:4,pipe:3,plastic:6,battery:4,can:3,wire:4,glass:2,spiral:1,brick:3,leather:1,spirit:2,herbs:2,coal:3};
g.inventory.push('drink_water','food_potato','food_stew','food_bread','drink_water');store[KEY]=JSON.stringify(g);a=boot();
g=a.do('surv:view:craft');const ch=a.html();console.log('3 craft panel tiles',(ch.match(/crafttile/g)||[]).length,'can',(ch.match(/crafttile can/g)||[]).length,'| away:',ch.match(/<strong>(🧭|🏠)[^<]*/)?.[0]);
g=a.do('surv:craft:campfire');console.log('4',g.log[0]);
g=a.do('surv:craft:wool_hat');console.log('5 home-only away:',g.log[0]);
g=a.pin('home');
for(const id of ['wool_hat','mittens','shiv','blanket_vest','wrapped_boots','bandage','compress','herbal_tea','baked_potato','stew_soup','rusks','pipe_club','sack','flashlight','workbench','nail_bat','sled','heater','windows','radio','woodpile','home_backpack','torch','paper_lining','hot_bottle']){const t0=g.day*1440+g.minute;g=a.do('surv:craft:'+id);console.log('  craft',id.padEnd(14),(g.day*1440+g.minute-t0+'м').padEnd(5),'|',g.log[0].slice(0,80))}
console.log('6 base',JSON.stringify(g.surv.base),'inv',g.inventory.length,g.inventory.join(','));
g=a.do('surv:view:bag');const bh=a.html();console.log('7 bag weight:',bh.match(/⚖️ Вес:[^<]*/)?.[0]);
// надеть заточку, начать драку
const i=g.inventory.indexOf('nail_bat');g=a.do('item:'+i);console.log('8 equip',JSON.stringify(g.equip));
g=a.do('fight');console.log('9 fight hp',g.fight&&g.fight.hp,'|',g.log[0]);
g=a.do('close');
// ящик
g=a.pin('home');g=a.do('surv:stashall');console.log('10 stash',Object.keys(g.surv.stash.mats).length,'mats left',JSON.stringify(g.surv.mats));
g=a.do('surv:stashtake:planks');console.log('11 took planks',g.surv.mats.planks,g.surv.stash.mats.planks);
// скупщик
g.region=1;g.loc='m_pawn';g.surv.mats={scrap:3,bottle:2};store[KEY]=JSON.stringify(g);a=boot();
g=a.pin('m_pawn');console.log('12 pawn actions:',acts(a.html()));
g=a.do('surv:sell:scrap:all');console.log('13',g.log[0],'money',g.money);
// использовать костёр
const t0=g.day*1440+g.minute;g=a.do('surv:use:campfire');console.log('14 campfire',g.log[0],'mins',g.day*1440+g.minute-t0);
console.log('errors',errs);
