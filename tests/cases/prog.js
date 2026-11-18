const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;w.__WALK_MS=3;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},nav(v){const b=W.document.createElement('button');b.dataset.nav=v;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
// кривая
const xpAt=W.eval?null:null;
a.nav('hero');let h=a.html();console.log('1 hero:',(h.match(/<b>Уровень[^<]*<\/b>[^<]*/)||[])[0],'| stats',(h.match(/class="statrow"/g)||[]).length,'| plus?',/pg:stat/.test(h));
// дать опыт до уровня 10

g=st();g.surv.xp=6000;store[KEY]=JSON.stringify(g);a=boot();g=a.nav('hero');h=a.html();
console.log('2 lvl@6000:',(h.match(/<b>Уровень[^<]*<\/b>[^<]*/)||[])[0],'|',(h.match(/свободных очков: \d+/)||[])[0],'| offer',(h.match(/pg:pick:[a-z0-9]+/g)||[]).join(','),'| badge',/hasnew/.test(h));
g=a.do('pg:stat:0');g=a.do('pg:stat:0');g=a.do('pg:stat:1');console.log('3 stats',JSON.stringify(g.surv.prog.st),'|',g.log[0]);
const pick=(a.html().match(/pg:pick:([a-z0-9]+)/)||[])[1];g=a.do('pg:pick:'+pick);console.log('4 picked',pick,JSON.stringify(g.surv.prog.sk),'|',g.log[0]);
// уровни по опыту
const lv=[1000,10000,50000,150000,400000,1000000];for(const x of lv){g.surv.xp=x;store[KEY]=JSON.stringify(g);a=boot();a.nav('hero');console.log('  xp',x,'→',(a.html().match(/<b>Уровень[^<]*<\/b>[^<]*/)||[])[0])}
// навыки в деле: Двоечник и Камнемёт
g.surv.xp=6000;g.surv.prog.sk={jab:2,thrower:2,steady:3,porter:1,walrus:1};store[KEY]=JSON.stringify(g);a=boot();
g=a.do('fight');g=a.do('fx:first');h=a.html();console.log('5 grid buttons:',(h.match(/<small>[^<]*очк[^<]*<\/small>/g)||[]).join(' ; '),'| AP',g.fight&&g.fight.ap);
// перегруз и вес
g=st();g.fight=null;store[KEY]=JSON.stringify(g);a=boot();a.nav('bag');console.log('6 bag:',(a.html().match(/⚖️ Вес:[^<]*/)||[])[0]);
// тренировка
g=st();g.region=0;g.loc='play';store[KEY]=JSON.stringify(g);a=boot();for(let i=0;i<20;i++)g=a.do('train');console.log('7 train',JSON.stringify(g.surv.prog.train),'|',g.log.find(x=>/Тренировки/.test(x)));
// умения
g=st();g.surv.loot={};g.surv.energy=90;g.region=0;g.loc='house12';store[KEY]=JSON.stringify(g);a=boot();for(let i=0;i<3;i++){g=a.do('surv:loot:q5_basement');if(g.fight){g=st();g.fight=null;store[KEY]=JSON.stringify(g);a=boot()}}console.log('8 um',JSON.stringify(st().surv.prog.um),'|',st().log[0]);
a.nav('hero');h=a.html();console.log('9 hero sections:',(h.match(/<strong>[^<]*<\/strong>/g)||[]).slice(0,6).join(' '));
console.log('errors',errs);process.exit(0);
