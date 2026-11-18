const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
let a=boot(),g=a.do('start');g=a.do('city');a.do('surv:cityclose');g=st();
g.surv.mats={brick:2};g.fight=null;store[KEY]=JSON.stringify(g);a=boot();
g=st();g.surv.trip={to:6,x:700,y:400,paused:true,ev:{k:'dogs'},lastEv:0,from:0};g.surv.cityMode=true;store[KEY]=JSON.stringify(g);a=boot();
g=a.do('surv:road:dogs-fight2');
// поставить собаку на расстояние 3
g.fight.ep[0]=[3,2];g.fight.obs=[];store[KEY]=JSON.stringify(g);a=boot();
g=a.do('fx:mode:throw');let h=a.html();console.log('mode',g.fight.mode,'atk',(h.match(/cell atk/g)||[]).length,'rng',(h.match(/ rng/g)||[]).length);
g=a.do('fx:cell:3:2');console.log(g.log.slice(0,3).join(' / '),'| bricks',g.surv.mats.brick,'| dog hp',g.fight&&g.fight.m);
g=a.do('fx:flee');console.log('flee from edge:',g.fight?'still':'ended',g.log[0]);
g=st();g.region=1;g.loc='m_rows';store[KEY]=JSON.stringify(g);a=boot();const b=W.document.createElement('button');b.dataset.pin='m_rows';W.document.getElementById('root').appendChild(b);b.click();console.log('m_rows trouble',/surv:trouble/.test(a.html()));
console.log('errors',errs);process.exit(0);
