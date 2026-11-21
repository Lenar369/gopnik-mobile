// Баланс подработки: смена 2–4 ч, 15–30 ₽, не каждый день, после дефолта ×1,3.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.cityMode=false;g.surv.trip=null;g.surv.atWild=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.money=0;g.minute=9*60;g.stamina=100;g.surv.energy=100;g.surv.food=100;g.jobDay=0;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');st();
// найти день, когда на Бирже есть работа, и день, когда нет
let res={},hours=null;
for(let d=2;d<14;d++){a=prep(g=>{g.region=1;g.loc='m_workers';g.day=d;if(g.world)g.world.work={}});const m0=st().minute;g=a.do('world:work:m_workers');const got=g.money;if(got>0&&!res.yes){res.yes=got;hours=(g.minute-m0)/60}if(got===0&&/работы нет/.test(g.log[0]))res.no=true}
console.log('1 Биржа: платят',res.yes,'₽ за',hours,'ч | бывают дни без работы:',!!res.no);
// после дефолта
let def=0;for(let d=40;d<50&&!def;d++){a=prep(g=>{g.region=1;g.loc='m_workers';g.day=d;if(g.world)g.world.work={}});g=a.do('world:work:m_workers');def=g.money}
console.log('2 после дефолта:',def);
// Валера
let val=0;for(let d=2;d<10&&!val;d++){a=prep(g=>{g.region=0;g.loc='garage';g.day=d});g=a.do('work');val=g.money}
console.log('3 Валера:',val,'| силы',g.stamina);
// второй раз в тот же день — нельзя
g=a.do('work');const once=/уже отработал/.test(g.log[0])||/работы нет/.test(g.log[0]);
const ok=res.yes===25&&hours===4&&res.no&&def===33&&val===15&&once;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('work failed');console.log('errors',errs);process.exit(0);
