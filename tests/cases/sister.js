// Серьёзное дело №3 «Сестра Гульфии»: след у вокзала, поиски в пионерлагере, вернуть в буфет.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.trip=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.surv.dlg=null;g.minute=14*60;g.money=300;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');st();
a=prep(g=>{g.surv.cityMode=false;g.surv.atWild=null;g.region=1;g.loc='m_cafe';g.surv.xp=2000;g.surv.npc=Object.assign(g.surv.npc||{},{m_cafe:{rel:30,chat:0,job:null,trade:0,deal:0,help:0,debt:0,debtDay:0}});g.world=g.world||{};g.world.met=Object.assign(g.world.met||{},{m_cafe:true})});
a.do('surv:talk:m_cafe');const hasBq=/dl:bq/.test(a.html());a.do('dl:bq');g=a.do('dl:bqyes');let q=g.surv.bq&&g.surv.bq.sister;console.log('1 взял:',hasBq,q&&q.st);
// след: кассирша (с деньгами — всегда)
a=prep(g=>{g.surv.cityMode=false;g.region=2;g.loc='s_ticket'});a.pin('s_ticket');a.do('pl:enter');const tb=/bq:sister:ticket/.test(a.html());g=a.do('bq:sister:ticket');console.log('2 касса:',tb,g.surv.bq.sister.st);
// лагерь: поиск и «откуп»
a=prep(g=>{g.surv.cityMode=true;g.surv.atWild='camp';g.region=0});g=a.do('bq:sister:search');console.log('3 поиск:',g.surv.bq.sister.st);g=a.do('bq:sister:pay');console.log('4 откуп:',g.surv.bq.sister.st);
// вернуть
a=prep(g=>{g.surv.cityMode=false;g.surv.atWild=null;g.region=1;g.loc='m_cafe'});a.pin('m_cafe');a.do('pl:enter');const hb=/bq:sister:home/.test(a.html());g=a.do('bq:sister:home');console.log('5 вернул:',hb,g.surv.bq.sister.done,'|',g.log[0].slice(0,80));
// бесплатные пирожки
const m0=st().money;a=prep(g=>{});g=a.do('surv:meal:m_cafe');console.log('6 пирожки:',m0,'→',g.money,'|',g.log[0]);
const ok=hasBq&&tb&&g.surv.bq.sister.done&&hb&&g.money===300;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('sister failed');console.log('errors',errs);process.exit(0);
