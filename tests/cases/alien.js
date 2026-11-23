// Серьёзное дело №5 «Чужая территория»: Маслёнок даёт, ящик у «Заводских» — тихо, по-хорошему или силой.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.cityMode=false;g.surv.trip=null;g.surv.atWild=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.venue=null;g.surv.dlg=null;g.minute=14*60;g.money=300;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');a.do('close');st();
// условие: «Гаражные» знают, 5-й уровень
a=prep(g=>{g.region=4;g.loc='crew_4';g.surv.resp={4:12};g.surv.xp=2000;g.world=g.world||{};g.world.met=Object.assign(g.world.met||{},{crew_4:true})});
a.do('surv:talk:crew_4');let h=a.html();const hasBq=/dl:bq/.test(h);
a.do('dl:bq');a.do('dl:bqyes');g=st();const q=g.surv.bq&&g.surv.bq.alien;console.log('1 дело взято:',hasBq,q&&q.st,q&&q.until);
if(!q){const g2=st();g2.surv.bq=Object.assign(g2.surv.bq||{},{alien:{st:'go',t0:0,until:g2.day+4}});store[KEY]=JSON.stringify(g2)}
// путь «по-хорошему»
a=prep(g=>{g.region=3;g.loc='crew_3';g.surv.resp={3:12,4:12}});a.pin('crew_3');a.do('pl:enter');h=a.html();const askBtn=/bq:alien:ask/.test(h);g=a.do('bq:alien:ask');console.log('2 Бугор:',askBtn,g.surv.bq.alien.st,'|',g.log[0]);
// отдать
a=prep(g=>{g.region=4;g.loc='crew_4'});a.pin('crew_4');a.do('pl:enter');h=a.html();const giveBtn=/bq:alien:give/.test(h);g=a.do('bq:alien:give');const done=g.surv.bq.alien.done;console.log('3 отдал:',giveBtn,done,'| Гаражные',g.surv.resp[4],'|',g.log[0]);
// путь «силой» — начинается драка
a=prep(g=>{g.region=3;g.loc='f_warehouse';g.surv.bq.alien={st:'go',t0:0,until:g.day+4}});a.pin('f_warehouse');a.do('pl:enter');h=a.html();const forceBtn=/bq:alien:force/.test(h);g=a.do('bq:alien:force');console.log('4 силой:',forceBtn,g.fight&&g.fight.type,g.fight&&g.fight.quest);
const ok=hasBq&&askBtn&&giveBtn&&done&&g.fight&&g.fight.quest==='alien'&&forceBtn;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('alien failed');console.log('errors',errs);process.exit(0);
