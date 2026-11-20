// Ночлег за деньги: настоящий сон (бодрость растёт) и три новые гостиницы — Дом колхозника, комната над шиномонтажом, «Заря».
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.cityMode=false;g.surv.trip=null;g.surv.atWild=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.hp=100;g.money=200;g.surv.energy=20;g.surv.nerves=40;g.surv.warmth=40;g.surv.food=50;f(g);store[KEY]=JSON.stringify(g);return boot()}
function enter(a,id){a.pin(id);a.do('pl:enter');return a.html()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');st();
// старый ночлег — бодрость растёт
a=prep(g=>{g.region=3;g.loc='f_dorm';g.minute=14*60});g=a.do('world:sleep:f_dorm:eight');const okOld=g.surv.energy>90&&g.money===185;console.log('1 общага:',Math.round(g.surv.energy),g.money);
// гостиница у вокзала (заведение)
a=prep(g=>{g.region=2;g.loc='hotel';g.minute=22*60});g=a.do('world:sleep:hotel:morning');const okH=g.surv.energy>90&&g.minute===7*60&&g.money===170;console.log('2 вокзал:',Math.round(g.surv.energy),g.minute,g.money);
// Дом колхозника: кнопки, дешёвый, с камерой хранения — ничего не крадут
a=prep(g=>{g.region=1;g.loc='m_kolhoz';g.minute=22*60;g.surv.mats={scrap:4,wire:4,coins:2}});let h=enter(a,'m_kolhoz');const bK=/world:sleep:m_kolhoz:morning:safe/.test(h);
g=a.do('world:sleep:m_kolhoz:morning:safe');const okK=bK&&g.money===185&&g.surv.mats.coins===2&&g.surv.energy>90;console.log('3 колхозник:',bK,g.money,JSON.stringify(g.surv.mats));
let thefts=0;for(let i=0;i<12;i++){a=prep(g=>{g.region=1;g.loc='m_kolhoz';g.minute=22*60;g.surv.mats={scrap:4,wire:4,coins:2}});g=a.do('world:sleep:m_kolhoz:morning');if(/недосчитался/.test(g.log[0]))thefts++}console.log('4 краж без камеры из 12:',thefts);
// Комната над шиномонтажом: бесплатно после дела Ильдара, тепло
a=prep(g=>{g.region=4;g.loc='g_room';g.minute=14*60;g.surv.ildarFree=true});h=enter(a,'g_room');const bG=/бесплатно/.test(h);g=a.do('world:sleep:g_room:eight');const okG=bG&&g.money===200&&g.surv.warmth===100;console.log('5 у Ильдара:',bG,g.money,g.surv.warmth);
// «Заря»: душ лечит простуду, завтрак
a=prep(g=>{g.region=6;g.loc='c_zarya';g.minute=23*60;g.surv.cold=true});h=enter(a,'c_zarya');g=a.do('world:sleep:c_zarya:morning');const okZ=!g.surv.cold&&g.money===140&&/завтрак/.test(g.log[0])&&g.surv.food>50;console.log('6 Заря:',g.surv.cold,g.money,Math.round(g.surv.food),'|',g.log[0].slice(0,120));
const ok=okOld&&okH&&okK&&thefts>0&&thefts<12&&okG&&okZ;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('lodging failed');console.log('errors',errs);process.exit(0);
