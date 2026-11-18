const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};const bub=h=>(h.match(/class="bubble">([^<]*)/)||[])[1];
let a=boot(),g=a.do('start');g=a.do('city');a.do('surv:cityclose');g=st();
const met=k=>{const c=g.city||g.world;c.met=c.met||{};c.met[k]=true};
// найдём ключ города
console.log('keys',Object.keys(g).filter(k=>typeof g[k]==='object').join(','));
g.world.met=g.world.met||{};g.world.met.m_rows=true;g.world.met.w_fish=true;g.region=1;g.loc='m_rows';
g.surv.npc={m_rows:{rel:20,chat:0,job:{type:'deliver',to:'w_fish',pay:40,until:g.day+3},trade:0,deal:0,help:0,debt:0,debtDay:0}};
g.surv.parcels=[{from:'m_rows',to:'w_fish',until:g.day+3,pay:40}];store[KEY]=JSON.stringify(g);a=boot();
g=a.do('surv:talk:w_fish');let h=a.html();console.log('deliver opt:',/dl:deliver/.test(h));g=a.do('dl:deliver');console.log(' ',bub(a.html()),'|',g.log[0],'| money',g.money,'| rel from',g.surv.npc.m_rows.rel,'| job cleared',!g.surv.npc.m_rows.job);
// наводка
g=a.do('dl:bye');g=st();g.surv.npc.m_rows.chat=0;store[KEY]=JSON.stringify(g);
let tip=null;for(let d=0;d<10&&!tip;d++){g=st();g.day=1+d;g.surv.npc.m_rows.chat=0;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:talk:m_rows');g=a.do('dl:news');if(g.surv.tips&&Object.keys(g.surv.tips).length)tip=Object.keys(g.surv.tips)[0]}
console.log('tip:',tip,'|',g.log[0]);
if(tip){g=a.do('dl:bye');g=st();const P=tip;g.surv.energy=90;g.surv.loot={};store[KEY]=JSON.stringify(g);a=boot();
 for(let i=0;i<6;i++){g=a.do('surv:loot:'+tip);if(g.fight){g=st();g.fight=null;store[KEY]=JSON.stringify(g);a=boot();continue}if(/по наводке/.test(g.log[0]))break}console.log('search with tip:',g.log[0])}
console.log('errors',errs);process.exit(0);
