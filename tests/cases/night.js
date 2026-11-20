// Ночёвка вне дома и серьёзное дело «Король свалки».
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function prep(f){const g=JSON.parse(store[KEY]);g.fight=null;g.surv.cityMode=true;g.surv.trip=null;g.surv.defaultSeen=true;g.surv.place=null;g.surv.scene=null;g.surv.cop=null;g.surv.dlg=null;g.surv.venue=null;g.hp=100;g.money=300;f(g);store[KEY]=JSON.stringify(g);return boot()}
let a=boot(),g=a.do('start');a.do('city');st();
// 1) днём ночевать нельзя, вечером — можно; спим до 7:00
a=prep(g=>{g.surv.atWild='heat';g.minute=14*60});const hD=a.html();g=a.do('surv:sleepout:heat');const noDay=/с 18:00/.test(g.log[0]);console.log('1 днём:',g.log[0]);
let ok2=true,events=[];
for(const k of ['heat','bank']){for(let i=0;i<4;i++){a=prep(g=>{g.surv.atWild=k;g.minute=22*60;g.surv.warmth=60;g.surv.energy=20;g.day=140});const d0=st().day;g=a.do('surv:sleepout:'+k);
 const t=st();if(t.fight)a.do('fx:run');events.push(k+':'+Math.round(t.surv.warmth)+'/'+Math.round(t.surv.energy)+(t.fight?' драка':'')+(/обчистили/.test(t.log.join(' '))?' ограбили':''));
 if(!(t.minute===7*60&&t.day===d0+1&&t.surv.energy>20))ok2=false;
 if(k==='heat'&&t.surv.warmth<60)ok2=false;if(k==='bank'&&t.surv.warmth>=60)ok2=false}}
console.log('2 ночёвки (тепло/бодрость):',events.join(' | '));
// 2) Король свалки — дать дело, путь «работа»
a=prep(g=>{g.surv.atWild='dump';g.minute=12*60;g.surv.bq={dump:{st:'go',t0:0}};g.surv.mats={battery:2,wire:3}});let h=a.html();
a.do('surv:wpin:dump');const btn=/bq:dump:work/.test(a.html())||(()=>{a.do('pl:enter');return /bq:dump:work/.test(a.html())})();
g=a.do('bq:dump:work');const st1=g.surv.bq.dump.st;g=a.do('bq:dump:give');console.log('3 Король:',btn,st1,'→',g.surv.bq.dump.st,'|',g.surv.dumpKing,'|',g.log[0]);
const okK=st1==='bring'&&g.surv.bq.dump.done&&g.surv.dumpKing==='friend'&&!g.surv.mats.battery;
// 3) путь «драка» — после победы dumpKing=beaten
a=prep(g=>{g.surv.atWild='dump';g.minute=12*60;g.surv.bq={dump:{st:'go',t0:0}};g.surv.dumpKing=null});g=a.do('bq:dump:fight');console.log('4 драка началась:',!!g.fight,g.fight&&g.fight.quest);
const okF=!!g.fight&&g.fight.quest==='dump';
// 4) в «Заданиях» видно дело
a=prep(g=>{g.surv.bq={dump:{st:'bring',t0:0}}});a.do('surv:view:quests');const inQ=/Король свалки/.test(a.html());console.log('5 в заданиях:',inQ);
const ok=noDay&&ok2&&okK&&okF&&inQ;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('night/dump failed');console.log('errors',errs);process.exit(0);
