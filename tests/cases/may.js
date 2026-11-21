// Новая игра начинается 1 мая 1998; 17 августа — сцена дефолта; накануне слухи. (__WALK_MS не задаём — как у игрока.)
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={},errs=[],W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
let a=boot(),g=a.do('start');let h=a.html();const d0=(h.match(/lb-date[^>]*><small>([^<]*)/)||h.match(/phase-name">([^<·]*)/)||[])[1]||'';
console.log('1 старт:',d0,'| shift',g.surv.shift,'|',g.log[0].slice(0,40));
const okStart=/1 мая 1998/.test(d0)&&/1 мая 1998/.test(g.log[0]);
// 10 августа — слух, 17 — дефолт
g=st();g.day=101;g.minute=23*60+50;g.surv.defaultSeen=false;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:hometea');a=boot();
g=st();g.minute=23*60+50;store[KEY]=JSON.stringify(g);a=boot();
let rum=false,def=false;for(let i=0;i<9;i++){g=st();g.minute=23*60+50;g.fight=null;g.surv.scene=null;store[KEY]=JSON.stringify(g);a=boot();a.do('surv:hometea');g=st();if(g.log.some(x=>/шепчутся про доллар/.test(x)))rum=true;if(g.surv.defaultSeen)def=true}
console.log('2 слух:',rum,'| дефолт:',def,'| сцена',st().surv.scene);
const ok=okStart&&rum&&def;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('may failed');console.log('errors',errs);process.exit(0);
