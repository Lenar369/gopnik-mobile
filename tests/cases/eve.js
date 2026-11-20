// Канун праздников: ёлка (28–31 дек, нервы дома быстрее до конца января), подработка у Гены 22.02 и 7.03.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
const dayOf=(y,m,d)=>Math.round((Date.UTC(y,m,d)-Date.UTC(1998,7,1))/864e5)+1;
function prep(f){const g=st();g.fight=null;g.surv=g.surv||{};g.surv.cityMode=false;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.energy=90;g.hp=100;g.money=200;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');
// ёлка на рынке 30 декабря
a=prep(g=>{g.region=1;g.loc='m_rows';g.day=dayOf(1998,11,30);g.minute=12*60});a.pin('m_rows');a.do('pl:enter');const bt=/surv:eve:tree/.test(a.html());
g=a.do('surv:eve:tree');console.log('1 ёлка:',bt,'|',g.log[0],'| деньги',g.money,'| tree',g.surv.tree);
const okT=bt&&g.surv.tree===1999&&g.money===140;
// дома 15 января: нервы растут быстрее, чем без ёлки
function restGain(tree){const b=prep(g=>{g.region=0;g.loc='home';g.day=dayOf(1999,0,15);g.minute=10*60;g.surv.nerves=40;g.surv.tree=tree?1999:null});const n0=st().surv.nerves;b.do('surv:hometea');return st().surv.nerves-n0}
const gT=restGain(true),gN=restGain(false);console.log('2 нервы за чай дома: с ёлкой',gT.toFixed(2),'без',gN.toFixed(2));
a=prep(g=>{g.region=0;g.loc='home';g.day=dayOf(1999,1,5);g.minute=10*60;g.surv.tree=1999});a.pin('home');a.do('pl:enter');const noTree=!/surv:tree/.test(a.html());console.log('3 в феврале ёлки нет:',noTree);
// Гена 22 февраля
a=prep(g=>{g.region=0;g.day=dayOf(1999,1,22);g.minute=12*60});a.pin('court');a.do('pl:enter');const bg=/surv:eve:gena_feb/.test(a.html());const r0=st().relations.gena,m0=st().money;
g=a.do('surv:eve:gena_feb');console.log('4 Гена:',bg,'|',g.log[0],'| +',g.money-m0,'| gena',r0,'→',g.relations.gena);
const okG=bg&&g.money-m0===60&&g.relations.gena===r0+1&&g.surv.energy<90;g=a.do('surv:eve:gena_feb');const once=/Уже/.test(g.log[0]);
const ok=okT&&gT>gN&&noTree&&okG&&once;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('eve failed');console.log('errors',errs);process.exit(0);
