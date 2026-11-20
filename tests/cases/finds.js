// Обыск с шансами: в окне места видно, что можно найти и с каким шансом; фонари поднимают шансы; фонари продаются.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
const sum=c=>c.reduce((a,x)=>a+(parseInt(x.split(' ').pop())||0),0);
const light=h=>h.match(/class="pfhead"><b>[^<]*<\/b><small>([^<]*)/)?.[1];
function look(g){g.minute=12*60;if(g.surv)g.surv.place=null;store[KEY]=JSON.stringify(g);const a=boot();a.pin('house12');a.do('pl:enter');return a}
let a=boot(),g=a.do('start');
let A=look(g),h=A.html(),c0=chips(h);const l0=light(h)||'';console.log('1 без света:',light(h),'|',c0.join(' · '));
g=st();g.inventory.push('flashlight');A=look(g);h=A.html();const c1=chips(h);console.log('2 самодельный:',light(h),'|',c1.join(' · '));
g=st();g.inventory.push('flash_army');A=look(g);h=A.html();const c2=chips(h);console.log('3 армейский:',light(h),'|',c2.join(' · '));
const ok1=c0.length>=4&&sum(c0)<sum(c1)&&sum(c1)<sum(c2)&&/без фонарика/.test(l0);
// обыск без света ночью — подсказка, со светом — находки
let hint=false;for(let i=0;i<8&&!hint;i++){g=st();g.inventory=g.inventory.filter(x=>!/flash/.test(x));g.minute=23*60;g.surv.energy=90;g.hp=100;g.fight=null;g.surv.loot={};store[KEY]=JSON.stringify(g);a=boot();
 g=a.do('surv:loot:q5_basement');hint=/нужен фонарик/.test(g.log[0]);if(hint)console.log('4 ночью без света:',g.log[0]);if(g.fight)a.do('fx:run');g=a.do('surv:scene-ok')}
let found=0,n=0;for(let i=0;i<12;i++){g=st();g.inventory=g.inventory.filter(x=>x!=='flash_army').concat(['flash_army']);g.minute=12*60;g.surv.energy=90;g.hp=100;g.fight=null;g.surv.loot={};store[KEY]=JSON.stringify(g);a=boot();
 const m0=JSON.stringify(st().surv.mats);g=a.do('surv:loot:q5_attic');if(g.fight){a.do('fx:run');continue}n++;if(JSON.stringify(g.surv.mats)!==m0||/×|,/.test(g.log[0]))found++}
console.log('5 с армейским: находки в',found,'из',n,'обысков');
// покупка
g=st();g.region=1;g.loc='m_pawn';g.money=500;g.inventory=g.inventory.filter(x=>!/flash/.test(x));g.fight=null;store[KEY]=JSON.stringify(g);a=boot();
g=a.pin('m_pawn');a.do('pl:enter');const hasBuy=/surv:gbuy:flash_army/.test(a.html());g=a.do('surv:gbuy:flash_army');console.log('6 комиссионка:',hasBuy,'|',g.log[0],'| деньги',g.money);
const ok=ok1&&hasBuy&&hint&&n>0&&found>=n/2&&g.inventory.includes('flash_army')&&g.money<500;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('finds checks failed');
console.log('errors',errs);process.exit(0);
