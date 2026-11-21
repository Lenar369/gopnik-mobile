// Правки 21.11 (вторая партия): автобус на окраины, чай 2 раза, «Люди» здесь, кафе за один вход, клуб в Центре.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.trip=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.surv.dlg=null;g.money=200;g.minute=13*60;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');st();
// автобус до посёлка (восток) и обратно
a=prep(g=>{g.surv.cityMode=true;g.surv.atWild=null;g.region=0});a.do('surv:wpin:village');let h=a.html();const bb=/surv:sbus:w:village/.test(h);
const t0=st().day*1440+st().minute;g=a.do('surv:sbus:w:village');const t1=g.day*1440+g.minute;console.log('1 автобус:',bb,'| на месте',g.surv.atWild,'| ₽',g.money,'| мин',t1-t0);
const okBus=bb&&g.surv.atWild==='village'&&g.money===175;
a=boot();a.do('surv:cpin:2');h=a.html();const back=/surv:sbus:2/.test(h);g=a.do('surv:sbus:2');console.log('2 обратно:',back,g.region,g.surv.cityMode,g.money);const okBack=back&&g.region===2&&g.money===150;
// чай два раза
a=prep(g=>{g.surv.cityMode=false;g.surv.atWild=null;g.region=0;g.loc='home'});a.do('surv:hometea');a.do('surv:hometea');g=a.do('surv:hometea');const okTea=/дважды/.test(g.log[0]);console.log('3 чай:',g.log[0]);
// люди: в Пятом — Зоя и др., без людей Центра
a.do('surv:view:people');h=a.html();const okP=/Тётя Зоя/.test(h)&&!/Сберкасса/.test(h)&&/Все знакомые/.test(h);console.log('4 люди здесь:',okP);
// кафе — сразу внутрь
a=prep(g=>{g.surv.cityMode=false;g.region=0;g.loc='q5_cafe';g.minute=12*60});a.pin('q5_cafe');g=a.do('pl:enter');const okCafe=!!(g.surv.venue&&g.surv.venue.id==='q5_cafe');console.log('5 кафе сразу:',okCafe);
// клуб — в Центре, в Речном нет
a=prep(g=>{g.surv.cityMode=false;g.region=5;g.loc='w_quay'});const noClub=!/data-pin="w_club"/.test(a.html());
a=prep(g=>{g.surv.cityMode=false;g.region=6;g.loc='c_square'});const club=/Клуб «Полночь»/.test(a.html());console.log('6 клуб:',noClub,club);
const ok=okBus&&okBack&&okTea&&okP&&okCafe&&noClub&&club;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('fixes21b failed');console.log('errors',errs);process.exit(0);
