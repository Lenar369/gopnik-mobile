const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__FIGHT_MS=0;w.__WALK_MS=3;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const bub=h=>(h.match(/class="bubble">([^<]*)/)||[])[1];const opts=h=>(h.match(/data-do="dl:[^"]*"[^>]*>[^<]*<b>[^<]*/g)||[]).map(x=>x.replace(/data-do="dl:([^"]*)".*<b>/,'$1=')).join(' | ');
let a=boot(),g=a.do('start');g=a.do('city');a.do('surv:cityclose');g=st();
g.region=1;g.loc='m_rows';store[KEY]=JSON.stringify(g);a=boot();
g=a.pin('m_rows');let h=a.html();console.log('1 before meet talk?',/surv:talk:/.test(h),'| meet?',/world:meet:m_rows/.test(h));
g=a.do('world:meet:m_rows');h=a.html();const opt=(h.match(/data-do="(story:[^"]*)"/)||[])[1];if(opt)g=a.do(opt);
g=st();console.log('2 met',JSON.stringify(g.city?Object.keys(g.city.met||{}):Object.keys((g.world||{}).met||{})),'npc',JSON.stringify(g.surv.npc));
g=a.pin('m_rows');h=a.html();console.log('3 talk action:',(h.match(/surv:talk:[a-z_]+/)||[])[0]);
g=a.do('surv:talk:m_rows');h=a.html();console.log('4 dialog:',bub(h),'\n  opts:',opts(h));
g=a.do('dl:news');h=a.html();console.log('5 news:',bub(h),'| tips',JSON.stringify(g.surv.tips),'| log',g.log[0]);
g=a.do('dl:news');console.log('  again:',bub(a.html()));
g=a.do('dl:job');h=a.html();console.log('6 job:',bub(a.html()),'\n  opts:',opts(h));
g=a.do('dl:take');console.log('  taken:',JSON.stringify(g.surv.npc.m_rows.job),'| parcels',JSON.stringify(g.surv.parcels));
const J=g.surv.npc.m_rows.job;
if(J.type==='fetch'){g.surv.mats[J.item]=J.n;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:talk:m_rows');g=a.do('dl:turnin');console.log('7 turnin:',bub(a.html()),'| money',g.money,'| rel',g.surv.npc.m_rows.rel)}
else{const to=J.to;g.region=0;store[KEY]=JSON.stringify(g);a=boot();g=st();g.city=g.city||{};const w=g.city;
 // знакомство с получателем не обязательно? — посылку отдаём только знакомому: отметим знакомство
 (g.city&&g.city.met?g.city.met:(g.world.met))[to]=true;g.region=[1,2,3,4,5,6].find(r=>true);store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:talk:'+to);h=a.html();console.log('7 deliver opts:',opts(h));g=a.do('dl:deliver');console.log('  delivered:',bub(a.html()),'| money',g.money,'| parcels',g.surv.parcels.length)}
// обмен
g=st();g.surv.mats={plastic:5,rope:5,herbs:5,can:5,bottle:5};store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:talk:m_rows');g=a.do('dl:trade');h=a.html();console.log('8 trade opts:',opts(h));
g=a.do('dl:haggle');console.log('  haggle:',bub(a.html()));g=a.do('dl:swap:0');console.log('  swap:',bub(a.html()),'|',g.log[0]);
// помощь
g=st();g.surv.npc.m_rows.rel=50;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:talk:m_rows');g=a.do('dl:help');h=a.html();console.log('9 help opts:',opts(h));g=a.do('dl:loan');console.log('  loan:',g.log[0],'debt',g.surv.npc.m_rows.debt);
g=a.do('dl:repay');console.log('  repay:',g.log[0]);g=a.do('dl:bye');console.log('10 closed',!g.surv.dlg);
// люди
const b=W.document.createElement('button');b.dataset.nav='people';W.document.getElementById('root').appendChild(b);b.click();console.log('11 people:',(a.html().match(/Лиля<\/b><small>[^<]*<\/small><span>[^<]*/)||[])[0]);
// разборка: знакомый
console.log('errors',errs);process.exit(0);
