const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},nav(v){const b=W.document.createElement('button');b.dataset.nav=v;W.document.getElementById('root').appendChild(b);b.click();b.remove()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
a.nav('hero');let h=a.html();console.log('1 lvl1 stats:',(h.match(/<em>\d+<\/em>/g)||[]).join(' '),'| free',(h.match(/свободных очков: \d+/)||['0'])[0]);
g.surv.xp=6000;store[KEY]=JSON.stringify(g);a=boot();a.nav('hero');h=a.html();console.log('2 lvl10 free:',(h.match(/свободных очков: \d+/)||[])[0],'| btns',(h.match(/pg:stat:0:\d/g)||[]).join(','));
g=a.do('pg:stat:0:5');g=a.do('pg:stat:1:1');console.log('3',JSON.stringify(g.surv.prog.st),g.log[0]);
for(const xp of [0,6000,50000,400000]){const lv=[];for(let i=0;i<6;i++){g=st();g.surv.xp=xp;g.fight=null;g.surv.fightOver=null;g.region=4;store[KEY]=JSON.stringify(g);a=boot();g=a.do('fight');lv.push(g.fight.lvl+'/'+g.fight.max+'hp')}console.log('4 xp',xp,'shpana',lv.join(' '))}
h=a.html();console.log('5 btop:',(h.match(/class="btop"><b>[^<]*/)||[])[0]);g=a.do('fx:first');h=a.html();console.log('  lvtag',(h.match(/class="ulv[^"]*">\d+/g)||[]).join(','));
console.log('errors',errs);process.exit(0);
