// Праздники: объявление утром, праздничное дело в месте раз в год, День города — надбавка скупщика.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
const dayOf=(y,m,d)=>Math.round((Date.UTC(y,m,d)-Date.UTC(1998,7,1))/864e5)+1;
function prep(f){const g=st();g.fight=null;g.surv=g.surv||{};g.surv.cityMode=false;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.energy=90;g.hp=100;g.money=200;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');
// 1) переход в 23 февраля 1999 — объявление
let ann=null;for(let i=0;i<5&&!ann;i++){a=prep(g=>{g.region=0;g.day=dayOf(1999,1,22);g.minute=23*60+40;g.surv.loot={}});g=a.do('surv:loot:q5_basement');if(g.fight)a.do('fx:run');ann=st().log.find(x=>/Сегодня 23 февраля/.test(x))}
console.log('1',ann);
// 2) Главный двор: поздравить мужиков
a=prep(g=>{g.region=0;g.day=dayOf(1999,1,23);g.minute=14*60});a.pin('court');a.do('pl:enter');const b1=/surv:hol:feb23/.test(a.html());const r0=st().relations.valera;
g=a.do('surv:hol:feb23');console.log('2 кнопка',b1,'|',g.log[0],'| valera',r0,'→',g.relations.valera,'| деньги',g.money);
const okF=b1&&g.relations.valera===r0+1&&g.money===170;g=a.do('surv:hol:feb23');const once=/уже/i.test(g.log[0])&&g.money===170;console.log('3 повтор:',g.log[0]);
// 3) День города: надбавка у скупщика
a=prep(g=>{g.region=1;g.loc='m_pawn';g.day=dayOf(1998,7,30);g.minute=12*60;g.surv.mats={coins:2}});const m0=st().money;g=a.do('surv:sell:coins:all');console.log('4',g.log[0],'| +',g.money-m0);
const okC=g.money-m0===117;
// 4) 9 мая — кнопка на площади, в обычный день — нет
a=prep(g=>{g.region=6;g.loc='c_square';g.day=dayOf(1999,4,9);g.minute=12*60});a.pin('c_square');a.do('pl:enter');const b9=/surv:hol:may9/.test(a.html());
a=prep(g=>{g.region=6;g.loc='c_square';g.day=dayOf(1999,4,10);g.minute=12*60});a.pin('c_square');a.do('pl:enter');const bNo=!/surv:hol:/.test(a.html());console.log('5 9 мая кнопка',b9,'| 10 мая нет',bNo);
const ok=!!ann&&okF&&once&&okC&&b9&&bNo;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('holidays failed');console.log('errors',errs);process.exit(0);
