// Календарь: год в дате и переход через Новый год (31.12.1998 → 1.01.1999).
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
let a=boot(),g=a.do('start');let h=a.html();const d0=(h.match(/phase-name">([^<·]*)/)||h.match(/lb-date[^>]*><small>([^<]*)/)||[])[1];console.log('1 старт:',d0);
g=a.do('city');a.do('close');g=st();g.surv=g.surv||{};g.surv.cityMode=false;g.surv.defaultSeen=true;g.day=153;g.minute=23*60+40;g.surv.energy=90;g.hp=100;g.fight=null;store[KEY]=JSON.stringify(g);a=boot();h=a.html();
const d1=(h.match(/lb-date[^>]*><small>([^<]*)/)||h.match(/phase-name">([^<]*)/)||[])[1];console.log('2 канун:',d1);
for(let i=0;i<5;i++){g=st();if(g.day>153)break;g.fight=null;g.surv.loot={};g.surv.energy=90;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:loot:q5_basement');if(g.fight)a.do('fx:run')}
g=st();h=a.html();const d2=(h.match(/lb-date[^>]*><small>([^<]*)/)||h.match(/phase-name">([^<]*)/)||[])[1];
const ny=g.log.find(x=>/Наступил 1999/.test(x));console.log('3 после:',d2,'| лог:',ny,'| сцена',g.surv.scene,'| нервы',g.surv.nerves);
let sc=st().surv.scene;for(let i=0;i<3&&sc&&sc!=='newyear';i++){a.do('surv:scene-ok');sc=st().surv.scene}console.log('4 сцена:',sc,'|',/С Новым годом/.test(a.html()));g=a.do('surv:scene-ok');const okS=sc==='newyear'&&!g.surv.nyPending&&!g.surv.scene;
const ok=okS&&/1998/.test(d0||'')&&/31 дек 1998/.test(d1||'')&&/1999/.test(d2||'')&&!!ny;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('calendar failed');console.log('errors',errs);process.exit(0);
