const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const acts=h=>(h.match(/data-do="(vn:[^"]*|world:sleep[^"]*)"[^>]*>[^<]*<b>[^<]*/g)||[]).map(x=>x.replace(/data-do="([^"]*)".*<b>/,'$1=')).join(' | ');
let a=boot(),g=a.do('start');a.do('city');g=a.do('surv:cityclose');
console.log('1 q5 pin',/data-pin="q5_cafe"/.test(a.html()));
g=a.pin('q5_cafe');let h=a.html();console.log('2 drawer:',(h.match(/drawer-head"><strong>[^<]*/)||[])[0],'| enter',/vn:enter:q5_cafe/.test(h),'| facade',/venues\/cafe_/.test(h)?'yes':'(не загружена в jsdom)');
g=a.do('vn:enter:q5_cafe');h=a.html();console.log('3 inside:',(h.match(/class="bubble">([^<]*)/)||[])[1],'\n  menu:',acts(h));
g=a.do('vn:do:meal');console.log('4 meal:',g.log[0],'money',g.money,'food',Math.round(g.surv.food));
g=a.do('vn:do:leave');console.log('5 left',!g.surv.venue);
for(const [r,id,hour] of [[2,'s_bar',20],[4,'g_bar',3],[6,'c_rest',14],[5,'w_club',23],[2,'hotel',22],[2,'s_bar',10]]){g=st();g.region=r;g.loc=id;g.minute=hour*60;g.money=300;g.surv.venue=null;g.fight=null;store[KEY]=JSON.stringify(g);a=boot();g=a.pin(id);h=a.html();const open=/vn:enter:/.test(h);g=a.do('vn:enter:'+id);h=a.html();console.log('6',id,hour+':00','open',open,'|',(h.match(/class="bubble">([^<]*)/)||[,g.log[0]])[1].slice(0,60),'\n   menu:',acts(h))}
// ресторан в кожанке
g=st();g.region=6;g.loc='c_rest';g.minute=14*60;g.equip['Верх']='coat';g.money=300;g.surv.venue=null;store[KEY]=JSON.stringify(g);a=boot();g=a.do('vn:enter:c_rest');h=a.html();console.log('7 rest w/ coat:',acts(h));g=a.do('vn:do:errand');console.log('  ',g.log[0]);
// клуб: братва
g=st();g.region=5;g.loc='w_club';g.minute=23*60;g.surv.venue=null;store[KEY]=JSON.stringify(g);a=boot();g=a.do('vn:enter:w_club');console.log('8 club money',g.money);g=a.do('vn:do:bratva');console.log('  bratva:',g.fight?'fight '+g.fight.type:g.log[0]);
// бар: слух
g=st();g.region=2;g.loc='s_bar';g.minute=20*60;g.fight=null;g.surv.venue=null;store[KEY]=JSON.stringify(g);a=boot();g=a.do('vn:enter:s_bar');g=a.do('vn:do:listen');console.log('9 listen:',g.log[0]);g=a.do('vn:do:cards');console.log('  cards:',g.log[0]);
// гостиница ночлег
g=st();g.region=2;g.loc='hotel';g.minute=22*60;g.money=100;g.surv.venue=null;store[KEY]=JSON.stringify(g);a=boot();g=a.do('vn:enter:hotel');g=a.do('world:sleep:hotel:morning');console.log('10 hotel sleep:',g.log[0],'| venue closed',!g.surv.venue,'| time',g.minute/60);
console.log('errors',errs);process.exit(0);
