// Экран места: компактное окно → «Войти» → полный экран с действиями; «Карта» открывает город; задания — только взятые
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},nav(v){const b=W.document.createElement('button');b.dataset.nav=v;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const set=f=>{let g=st();f(g);store[KEY]=JSON.stringify(g);return boot()};
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
g=a.pin('house12');let h=a.html();console.log('1 compact',/pdrawer/.test(h),'enter',/pl:enter/.test(h),'title',(h.match(/class="maptitle">([^<]*)/)||[])[1]);
g=a.do('pl:enter');h=a.html();console.log('2 screen',/placeov/.test(h),'acts',(h.match(/class="pacts">[\s\S]*?<\/section>/)||[''])[0].match(/data-do="[^"]*"/g).length);
g=a.do('surv:loot:q5_basement');h=a.html();console.log('3 after search: scene',/scenecard/.test(h),'fight',!!g.fight);if(g.fight){g=st();g.fight=null;store[KEY]=JSON.stringify(g);a=boot()}else{g=a.do('surv:scene-ok')}h=a.html();console.log('  back in place screen',/placeov/.test(h));
g=a.do('pl:exit');h=a.html();console.log('4 exit',!/placeov/.test(h),'focus',/pdrawer/.test(h));
g=a.nav('map');console.log('5 nav map → city',g.surv.cityMode);g=a.nav('map');console.log('  again stays',g.surv.cityMode);
h=a.html();console.log('6 hero avatar on city',/cityhero[^>]*><span class="ava hc/.test(h));
a=set(g=>{g.surv.cityMode=false;g.region=0});g=a.nav('quests');h=a.html();console.log('7 quests no untaken',!/можно взять/.test(h),(h.match(/Взятые задания<\/strong>[^]*?<\/div><\/div>/)||[''])[0].slice(0,120).replace(/<[^>]+>/g,' '));
a=set(g=>{g.region=5;g.loc='w_quay';g.surv.shift=130});g=a.pin('w_fish');h=a.html();console.log('8 river winter tint',/wintint/.test(h),'title',(h.match(/class="maptitle">([^<]*)/)||[])[1]);
console.log('errors',errs);process.exit(0);
