const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const set=f=>{let g=st();f(g);store[KEY]=JSON.stringify(g);return boot()};
const dd=h=>(h.match(/data-do="(dl|cp|uc):[a-z]+"/g)||[]).join(' ');const bub=h=>(h.match(/class="bubble">([^<]*)/)||[])[1];
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
console.log('1 pin',/data-pin="q5_police"/.test(a.html()));
g=a.pin('q5_police');console.log('2 acts',dd(a.html()),'| trouble?',/surv:trouble/.test(a.html()));
g=a.do('uc:meet');console.log('  ',g.log[0]);g=a.pin('q5_police');console.log('3 talk btn',/surv:talk:q5_police/.test(a.html()));
g=a.do('surv:talk:q5_police');let h=a.html();console.log('4 dlg',bub(h),'|',dd(h));
g=a.do('dl:uj');console.log('5',bub(a.html()));g=a.do('dl:ujyes');console.log('  job',JSON.stringify(g.surv.uch),g.log[0]);g=a.do('dl:bye');
const J=g.surv.uch.job.k;const at={cellar:'house12',market:'m_side',witness:'s_station',garage:'garage'}[J];const reg={house12:0,m_side:1,s_station:2,garage:0}[at];
a=set(g=>{g.region=reg;g.loc=at;g.minute=22*60});g=a.pin(at);console.log('6 at',at,'acts',(a.html().match(/data-do="uc:[a-z]+"/g)||[]).join(' '));g=a.do('uc:do');
let n=0;while(st().fight&&n<60){const F=st().fight;a.do(F.phase==='talk'?'fx:pay':'fx:flee');a.do('fx:guard');n++}a.do('fx:done');g=st();console.log('  step',g.surv.uch.job&&g.surv.uch.job.step,'|',g.log[0].slice(0,80));
a=set(g=>{g.region=0;g.loc='q5_police';g.fight=null;g.surv.fightOver=null;g.surv.heat=40;g.surv.npc.q5_police.rel=40});g=a.do('surv:talk:q5_police');h=a.html();console.log('7 dlg',dd(h));g=a.do('dl:ujrep');console.log('  report',g.log[0],'heat',Math.round(g.surv.heat));
console.log('  lfd',st().surv.lastFightDay,'day',st().day,JSON.stringify(st().surv.uch));g=a.do('dl:wit');console.log('  wit:',bub(a.html()));g=a.do('dl:bye');
// патруль: сослаться
a=set(g=>{g.region=2;g.loc='s_station';g.surv.heat=20;g.surv.cop={name:'X',line:'«Док»',tries:0}});h=a.html();console.log('8 cop uch btn',/cp:uch/.test(h));g=a.do('cp:uch');console.log('  ',g.surv.cop?bub(a.html()):g.log[0]);
// облава
a=set(g=>{g.region=1;g.loc='m_rows';g.minute=12*60;g.surv.cop=null;g.surv.ev={};g.surv.heat=10;g.surv.mats={rope:3}});let raid=false;for(let i=0;i<40&&!raid;i++){g=st();g.surv.ev={};store[KEY]=JSON.stringify(g);a=boot();g=a.pin(['m_rows','m_pawn','m_cafe','m_side'][i%4]);raid=!!(g.surv.cop&&g.surv.cop.kind==='raid')}
h=a.html();console.log('9 raid',raid,(h.match(/class="btop"><b>[^<]*/)||[])[0],dd(h));g=a.do('cp:dump');console.log('  dump',g.log[0],'mats',JSON.stringify(g.surv.mats));
// вокзал 18-20
a=set(g=>{g.region=2;g.loc='s_station';g.minute=18*60+30;g.surv.cop=null;g.surv.ev={}});let st0=false;for(let i=0;i<10&&!st0;i++){g=st();g.surv.ev={};g.surv.cop=null;store[KEY]=JSON.stringify(g);a=boot();g=a.pin(['s_platform','s_ticket','s_cafe'][i%3]);st0=!!g.surv.cop}console.log('10 station check',st0);
// рейд в клубе
a=set(g=>{g.region=6;g.loc='c_cafe';g.minute=23*60;g.surv.cop=null;g.surv.ev={};g.money=200});let cr=false;for(let i=0;i<40&&!cr;i++){g=st();g.surv.ev={};g.surv.cop=null;g.surv.venue=null;store[KEY]=JSON.stringify(g);a=boot();a.do('vn:enter:c_cafe');g=a.do('vn:do:dance');cr=!!(g.surv.cop&&g.surv.cop.kind==='clubraid')}h=a.html();console.log('11 club raid',cr,(h.match(/class="btop"><b>[^<]*/)||[])[0],dd(h));g=a.do('cp:wall');console.log('  wall',g.log[0]);
console.log('errors',errs);process.exit(0);
