const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,200)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});const w=d.window;
 return {do(id){const b=w.document.createElement('button');b.dataset.do=id;w.document.getElementById('root').appendChild(b);b.click();b.remove();store[KEY]=w.localStorage.getItem(KEY);return JSON.parse(store[KEY])},html:()=>w.document.getElementById('root').innerHTML}}
const sc=h=>(h.match(/class="scenecard"[\s\S]*?<strong>([^<]*)/)||[])[1]||'нет';
let a=boot();let g=a.do('start-winter');console.log('winter:',sc(a.html()),g.surv.scene);
g=a.do('surv:scene-ok');console.log('after ok:',sc(a.html()),g.surv.scene);
// default
a=boot();g=a.do('start');g.surv.shift=15;g.minute=23*60;store[KEY]=JSON.stringify(g);a=boot();g=a.do('sleep');console.log('default:',sc(a.html()),g.surv.defaultSeen);
g=a.do('surv:scene-ok');
// death
g.surv.food=0;g.surv.warmth=0;g.hp=3;store[KEY]=JSON.stringify(g);a=boot();g=a.do('travel:6:foot');console.log('death:',sc(a.html()),'drawer',a.html().match(/drawer-head"><strong>[^<]*/)?.[0]);
g=a.do('surv:scene-ok');console.log('after:',sc(a.html()),a.html().match(/drawer-head"><strong>[^<]*/)?.[0]);
// gear icons
g.inventory.push('ushanka');g.money=999;store[KEY]=JSON.stringify(g);a=boot();
setTimeout(()=>{a.do('noop');const w=a.html();console.log('nav bag');},10);
console.log('errors',errs);
