const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;w.__WALK_MS=2;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const set=f=>{let g=st();f(g);store[KEY]=JSON.stringify(g);return boot()};
const ops=h=>(h.match(/data-do="cp:[a-z]+"/g)||[]).join(' ');const bub=h=>(h.match(/class="bubble">([^<]*)/)||[])[1];
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
// растёт: обыск охраняемого
a=set(g=>{g.region=2;g.loc='s_platform';g.surv.energy=90;g.surv.loot={}});for(let i=0;i<3;i++){g=a.do('surv:loot:station_wagons');if(g.fight){g=st();g.fight=null;g.surv.fightOver=null;store[KEY]=JSON.stringify(g);a=boot()}}console.log('1 heat after guarded search',st().surv.heat);
// патруль на улице
const run=(h,act)=>{a=set(g=>{g.region=2;g.loc='s_station';g.surv.heat=h;g.surv.cop={name:'Сержант Котов',line:'«Документики»',tries:0};g.money=200;g.inventory=['nail_bat','drink_vodka','food_bread'];g.surv.mats={crate:2};g.fight=null;g.surv.fightOver=null;g.surv.jail=null});
 let h0=a.html();g=a.do('cp:'+act);let h1=a.html();return [h0,h1,st()]};
let [h0,h1,s]=run(10,'docs');console.log('2 opts',ops(h0),'| chip',/copchip/.test(h0),'| docs@10:',s.surv.cop?'still: '+bub(h1):s.log[0]);
[h0,h1,s]=run(95,'docs');console.log('3 docs@95:',s.surv.cop?bub(h1)+' | must opts '+ops(h1):s.log[0]);
[h0,h1,s]=run(40,'bribe');console.log('4 bribe@40:',s.surv.cop?bub(h1):s.log[0],'money',s.money,'heat',Math.round(s.surv.heat));
[h0,h1,s]=run(40,'run');console.log('5 run:',s.surv.cop?'?':s.log[0].slice(0,80),'heat',Math.round(s.surv.heat),'region',s.region,s.loc);
[h0,h1,s]=run(70,'docs');g=a.do('cp:go');g=st();console.log('6 jail:',g.log[0].slice(0,160),'\n   loc',g.region,g.loc,'time',g.minute/60,'heat',Math.round(g.surv.heat),'jail',JSON.stringify(g.surv.jail),'inv',g.inventory.join(','));
g=a.pin('c_police');console.log('7 police acts',(a.html().match(/data-do="cp:[a-z]+"/g)||[]).join(' '));g=a.do('cp:claim');console.log('  claim:',g.log[0],'inv',g.inventory.join(','),'crates',g.surv.mats.crate);
g=a.do('cp:help');console.log('  help:',g.log[0],'heat',Math.round(g.surv.heat));
// драка с нарядом
[h0,h1,s]=run(20,'fight');console.log('8 fight:',s.fight&&s.fight.type,s.fight&&s.fight.lvl,'heat',Math.round(s.surv.heat));
// проигрыш → тюрьма
a=set(g=>{g.hp=3});g=a.do('fx:first');let n=0;while(st().fight&&n<40){const F=st().fight;g=a.do(F.phase==='talk'?'fx:first':'fx:guard');n++}g=st();console.log('9 after lose:',g.loc,'|',g.log.find(x=>/обезьян/.test(x))?.slice(0,90));
// убывание
a=set(g=>{g.surv.heat=50;g.region=0;g.loc='home';g.fight=null;g.surv.fightOver=null});g=a.do('sleep');console.log('10 decay after sleep',Math.round(st().surv.heat));
console.log('errors',errs);process.exit(0);
