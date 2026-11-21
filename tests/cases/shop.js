// Магазин вещей: свой товар по местам, цены ×2 после дефолта, самоделки не продаются.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.cityMode=false;g.surv.trip=null;g.surv.atWild=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.money=500;g.minute=12*60;f(g);store[KEY]=JSON.stringify(g);return boot()}
const buys=h=>(h.match(/data-do="buy:[a-z_]+"/g)||[]).map(x=>x.slice(13,-1)).sort().join(',');
let a=boot(),g=a.do('start');a.do('city');a.do('close');st();
// Торговые ряды до дефолта
a=prep(g=>{g.region=1;g.loc='m_rows';g.day=1});a.pin('m_rows');a.do('pl:enter');a.do('shop');let h=a.html();a.do('pagenext');h+=a.html();const b1=buys(h);console.log('1 ряды:',b1);
const noCraft=!/buy:(wool_hat|shiv|nail_bat|crowbar|sack|home_backpack|sled|pipe_club|flashlight)/.test(h)&&/buy:downjacket/.test(h);
g=a.do('buy:downjacket');const okBuy=g.inventory.includes('downjacket')&&g.money===320;console.log('2 пуховик до дефолта:',g.money);
// после дефолта — ×2
a=prep(g=>{g.region=1;g.loc='m_rows';g.day=40;g.inventory=g.inventory.filter(x=>x!=='downjacket')});a.pin('m_rows');a.do('pl:enter');a.do('shop');g=a.do('buy:downjacket');const okDef=g.money===140;console.log('3 после дефолта:',g.money);
// книжный — только очки; купить чужое — нельзя
a=prep(g=>{g.region=6;g.loc='c_book';g.day=1});a.pin('c_book');a.do('pl:enter');a.do('shop');const b2=buys(a.html());g=a.do('buy:downjacket');const okBook=b2==='glasses'&&g.money===500;console.log('4 книжный:',b2,'| чужое:',g.log[0]);
const ok=noCraft&&okBuy&&okDef&&okBook;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('shop failed');console.log('errors',errs);process.exit(0);
