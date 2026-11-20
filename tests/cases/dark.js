// Тёмные углы: без китайского/армейского фонаря закрыты; с ним — свой хабар (медь, радиодетали, монеты, сухпаёк).
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
function look(g){g.minute=12*60;g.fight=null;g.region=0;if(g.surv){g.surv.place=null;g.surv.scene=null;g.surv.sceneData=null;g.surv.dlg=null;g.surv.cop=null;g.surv.venue=null}store[KEY]=JSON.stringify(g);const a=boot();a.pin('house12');a.do('pl:enter');return a}
const darkBtn=h=>(h.match(/data-do="surv:loot:dark_q5_basement"><b>|data-do="surv:loot:dark_q5_basement">[^<]*<small>([^<]*)/)||[])[1]||'';
let a=boot(),g=a.do('start');
let A=look(st()),h=A.html();
const b0=/surv:loot:dark_q5_basement/.test(h),lock0=/pfdark[^>]*>[^<]*🔒/.test(h)&&/<i>🔒<\/i>/.test(h);
console.log('1 без света: кнопка',b0,'| замок',lock0,'|',darkBtn(h));
let t0=st().minute;g=A.do('surv:loot:dark_q5_basement');const no0=/^🌑/.test(g.log[0])&&g.minute===t0;console.log('2',g.log[0]);
g=st();g.inventory.push('flashlight');A=look(g);g=A.do('surv:loot:dark_q5_basement');const no1=/Самодельный фонарик не добивает/.test(g.log[0]);console.log('3',g.log[0]);
let got=new Set(),n=0;
for(let i=0;i<10;i++){g=st();if(!g.inventory.includes('flash_cn'))g.inventory.push('flash_cn');g.surv.fcharge={flash_cn:10};g.surv.energy=90;g.hp=100;g.surv.loot={};g.surv.mats={};A=look(g);
 if(i===0){h=A.html();console.log('4 с китайским:',darkBtn(h),'| замок',/<i>🔒<\/i>/.test(h))}
 g=A.do('surv:loot:dark_q5_basement');if(g.fight){A.do('fx:run');continue}n++;Object.keys(g.surv.mats||{}).forEach(x=>got.add(x));g.inventory.forEach(x=>x==='army_ration'&&got.add(x))}
console.log('5 обысков',n,'| нашёл',[...got].join(','));
const uniq=['copper','radio_parts','coins','army_ration'].some(x=>got.has(x));
g=st();g.region=1;g.loc='m_pawn';g.surv.mats={coins:2};g.fight=null;g.surv.cop=null;const m0=g.money;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:sell:coins:all');console.log('6',g.log[0]);
const ok=b0&&lock0&&no0&&no1&&n>0&&uniq&&g.money>m0;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('dark checks failed');
console.log('errors',errs);process.exit(0);
