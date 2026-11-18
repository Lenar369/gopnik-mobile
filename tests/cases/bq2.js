const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;w.__WALK_MS=2;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const set=f=>{let g=st();f(g);store[KEY]=JSON.stringify(g);return boot()};const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
a=set(g=>{g.surv.xp=20000;g.region=2;g.loc='s_platform';g.minute=22*60;g.surv.bq={wagon:{st:'go',left:6,home:0,raid:99999}}});
g=a.pin('s_platform');let h=a.html();console.log('A drawer:',(h.match(/drawer-head"><strong>[^<]*/)||[])[0],'| acts',(h.match(/data-do="[^"]*"/g)||[]).slice(0,12).join(' '));
a=set(g=>{g.surv.bq.wagon.st='crates'});g=a.pin('s_platform');h=a.html();console.log('B',(h.match(/data-do="bq:[^"]*"/g)||[]).join(' '));
g=a.do('bq:wagon:take');g=a.do('bq:wagon:take');console.log('  took',g.surv.mats.crate,g.log[0]);
// метель: пешком из дач в район
a=set(g=>{g.surv.shift=130;g.surv.bq={storm:{st:'escort',until:999999}};g.surv.cityMode=true;g.surv.atWild='dachas';g.surv.trip=null;g.surv.food=95;g.surv.warmth=95;g.hp=100});
g=a.do('surv:walk:2');for(let i=0;i<800;i++){await wait(4);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip');if(g.fight){a.do('fx:flee');a.do('fx:done')}if(g.surv.trip&&g.surv.trip.paused)a.do('surv:tripgo')}
console.log('C storm',JSON.stringify(g.surv.bq.storm),'region',g.region,'|',g.log.find(x=>/Метель|тулуп/.test(x)),'| sheepskin',g.inventory.includes('sheepskin'));
console.log('errors',errs);process.exit(0)})();
