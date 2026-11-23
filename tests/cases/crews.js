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
// шаг 2: дело у старшего — «залётные» / любое по дню; выполнить и доложить
a=prep(g=>{g.region=1;g.loc='crew_1';g.surv.resp={1:12};g.surv.cjob=null;g.surv.cjobDay={};g.day=60;g.minute=22*60;g.money=100});a.pin('crew_1');a.do('pl:enter');h=a.html();const giveBtn=/cj:give:1/.test(h);
g=a.do('cj:give:1');let J=g.surv.cjob;console.log('4 дело:',giveBtn,J&&J.k,J&&J.at);
// выполнить: перейти в нужное место
if(J){const reg=J.k==='parcel'?+J.at.slice(5):1;a=prep(g=>{g.region=reg;g.loc=J.at;g.minute=23*60});g=a.do('cj:act');if(g.fight){a=prep(g=>{g.surv.cjob.step='back'})}J=st().surv.cjob}
const stepBack=J&&J.step==='back';a=prep(g=>{g.region=1;g.loc='crew_1'});const r0=st().surv.resp[1];g=a.do('cj:done');console.log('5 доложил:',stepBack,'| отношение',r0,'→',g.surv.resp[1],'|',g.log[0]);
const okJob=giveBtn&&stepBack&&g.surv.resp[1]>r0&&!g.surv.cjob;
// скидка своим 20%
a=prep(g=>{g.region=1;g.loc='m_rows';g.surv.resp={1:30};g.money=100;g.day=5;g.minute=12*60});g=a.do('surv:buy:food_bread:m_rows');console.log('6 скидка:',100-g.money,'|',g.log[0]);const okDisc=/Скидка своим/.test(g.log[0]);
// шаг 3: вражда — помог «Рыночным» → «Привокзальные» холоднее
a=prep(g=>{g.region=1;g.loc='crew_1';g.surv.resp={1:12,2:2};g.surv.cjob={r:1,k:'parcel',at:'crew_2',until:99,step:'back'}});g=a.do('cj:done');const okRiv=g.surv.resp[2]<2;console.log('7 вражда: Привокзальные',g.surv.resp[2],JSON.stringify(g.surv.resp),g.log[0]);
// разборка за двор: после 24 августа
a=prep(g=>{g.region=0;g.loc='court';g.day=30;g.minute=12*60;g.surv.turf=null;g.surv.resp={1:-5,3:30,4:30}});a.do('surv:hometea');g=st();const T=g.surv.turf;console.log('8 разборка:',T&&T.st,T&&T.by,'|',g.log.find(x=>/залётные/i.test(x)));
a=prep(g=>{g.region=0;g.loc='court'});a.pin('court');a.do('pl:enter');let hh=a.html();const btns=/turf:fight/.test(hh)&&/turf:talk/.test(hh)&&/turf:pay/.test(hh);
g=a.do('turf:fight');const F=g.fight;console.log('9 драка:',btns,F&&F.type,F&&F.m.length);
const okTurf=T&&T.st==='go'&&T.by===1&&btns&&F&&F.type==='turf'&&F.m.length===2;
a=prep(g=>{g.region=0;g.loc='court';g.money=300;g.surv.turf={st:'go',by:1,day:30}});g=a.do('turf:pay');console.log('10 откуп:',g.surv.turf.st,g.money);const okPay=g.surv.turf.st==='paid';
const ok=okRiv&&okTurf&&okPay&&okJob&&okDisc&&pin&&met&&met.type==='crew1'&&none&&ppl;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('crews failed');console.log('errors',errs);process.exit(0);
