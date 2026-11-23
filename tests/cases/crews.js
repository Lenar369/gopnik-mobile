// Компании районов: старшие на картах, «Ты с какого района?» в чужом районе, отношение в «Людях».
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;w.__CREW_TEST=1;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.cityMode=false;g.surv.trip=null;g.surv.atWild=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.surv.dlg=null;g.minute=22*60;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');st();
// старший на карте Рынка
a=prep(g=>{g.region=1;g.loc='m_rows';g.surv.resp={}});let h=a.html();const pin=/data-pin="crew_1"/.test(h);
// встреча: много попыток входа в место ночью
let met=null;for(let i=0;i<40&&!met;i++){a=prep(g=>{g.region=1;g.loc='m_rows';g.surv.resp={};g.surv.crewDay={};g.day=10+i});a.pin('m_rows');g=a.do('pl:enter');if(g.fight&&g.fight.crew)met=g.fight}
console.log('1 метка старшего',pin,'| встреча',met&&met.type,met&&met.crew);
// «свой» — не трогают
let none=true;for(let i=0;i<30;i++){a=prep(g=>{g.region=1;g.loc='m_rows';g.surv.resp={1:30};g.surv.crewDay={};g.day=50+i});a.pin('m_rows');g=a.do('pl:enter');if(g.fight&&g.fight.crew)none=false}
console.log('2 своему не докапываются:',none);
// Люди
a=prep(g=>{g.region=1;g.loc='m_rows';g.surv.resp={1:12};g.surv.pplAll=false});a.do('surv:view:people');h=a.html();const ppl=/Район держат «Рыночные»/.test(h)&&/знают/.test(h)&&/Шакир/.test(h);console.log('3 люди:',ppl);
const ok=pin&&met&&met.type==='crew1'&&none&&ppl;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('crews failed');console.log('errors',errs);process.exit(0);
