const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e.detail&&e.detail.stack||e).slice(0,400)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=3;w.__FIGHT_MS=0;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const cheb=(a,b)=>Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]));
// автопилот боя на клетках: идём к ближайшему, бьём
function auto(a,maxT=80){let g=st(),n=0;while(g.fight&&n<maxT){n++;const F=g.fight;if(F.phase==='talk'){g=a.do('fx:first');continue}
 const alive=F.ep.map((p,i)=>F.m[i]>0?i:-1).filter(i=>i>=0);const t=alive.sort((x,y)=>cheb(F.ep[x],[F.hx,F.hy])-cheb(F.ep[y],[F.hx,F.hy]))[0];const p=F.ep[t];
 if(cheb(p,[F.hx,F.hy])<=1){g=a.do(F.ap>=2?'fx:cell:'+p[0]+':'+p[1]:'fx:end')}
 else{const h=a.html();const mv=[...h.matchAll(/class="cell mv"[^>]*data-do="fx:cell:(\d+):(\d+)"/g)].map(m=>[+m[1],+m[2]]);if(!mv.length){g=a.do('fx:end');continue}mv.sort((x,y)=>cheb(x,p)-cheb(y,p));g=a.do('fx:cell:'+mv[0][0]+':'+mv[0][1])}}
 return [g,n]}
let a=boot(),g=a.do('start');g=a.do('city');a.do('surv:cityclose');g=st();
// 1 сюжетная: разборка
g=a.pin('play');g=a.do('dispute');g=a.do('fight');let h=a.html();
console.log('1 phase',g.fight.phase,'| spirit',g.fight.spirit,'| line',g.fight.line,'\n  talk opts:',(h.match(/data-do="fx:(calm|press|trick|name|pay|first|leave)"/g)||[]).join(' '),'| items?',/fx:item/.test(h));
for(let i=0;i<4&&g.fight&&g.fight.phase==='talk';i++){g=a.do('fx:calm');console.log('  talk:',g.log[0],'| spirit',g.fight&&g.fight.spirit,g.fight&&g.fight.phase)}
if(g.fight){h=a.html();console.log('2 grid: cells',(h.match(/class="cell/g)||[]).length,'obs',g.fight.obs.length,'ap',g.fight.ap,'hero',g.fight.hx,g.fight.hy,'foes',JSON.stringify(g.fight.ep),'| mv cells',(h.match(/cell mv/g)||[]).length);let n;[g,n]=auto(a);console.log('  ended after',n,'| result',g.surv.fightOver&&g.surv.fightOver.title,'|',g.surv.fightOver&&g.surv.fightOver.text)}
else console.log('2 talked out:',g.surv.fightOver&&g.surv.fightOver.title);
g=a.do('fx:done');
// 3 бросок кирпичом в собак
g.surv.mats={brick:3,bottle:1};g.hp=100;store[KEY]=JSON.stringify(g);a=boot();
g=a.do('city');g=st();g.surv.trip={to:6,x:700,y:400,paused:true,ev:{k:'dogs'},lastEv:0,from:0};store[KEY]=JSON.stringify(g);a=boot();
g=a.do('surv:road:dogs-fight2');console.log('3 dogs phase',g.fight.phase);
g=a.do('fx:mode:throw');h=a.html();const tgt=g.fight.ep.findIndex((p,i)=>cheb(p,[g.fight.hx,g.fight.hy])<=4);console.log('  throw mode, in range',tgt,'| atk cells',(h.match(/cell atk/g)||[]).length);
if(tgt<0){g=a.do('fx:cell:2:2');g=a.do('fx:mode:throw');}
const T=st().fight;const ti=T.ep.findIndex(p=>cheb(p,[T.hx,T.hy])<=4);if(ti>=0){g=a.do('fx:cell:'+T.ep[ti][0]+':'+T.ep[ti][1]);console.log('  threw:',g.log.find(x=>/бросок/.test(x)),'| bricks',g.surv.mats.brick)}
let n;[g,n]=auto(a);console.log('  dogs end',n,'|',g.surv.fightOver&&g.surv.fightOver.title,'hp',g.hp);g=a.do('fx:done');
// 4 оборона и побег
g.surv.trip={to:6,x:700,y:400,paused:true,ev:{k:'gop'},lastEv:0,from:0};g.hp=100;store[KEY]=JSON.stringify(g);a=boot();
for(let k=0;k<10;k++){g=a.do('surv:road:gop-bold');if(g.fight)break;g.surv.trip.ev={k:'gop'};store[KEY]=JSON.stringify(g);a=boot()}
console.log('4 gop phase',g.fight&&g.fight.phase);
g=a.do('fx:leave');console.log('  leave →',g.fight?g.fight.phase:'ended',g.log[0]);
if(g.fight){g=a.do('fx:guard');console.log('  guard turn:',g.log.slice(0,2).join(' / '));g=a.do('fx:flee');console.log('  flee:',g.fight?'still':'ended',g.log[0])}
if(st().fight){[g,n]=auto(a);}g=a.do('fx:done');
// 5 искать приключений
g=st();g.surv.trip=null;g.surv.cityMode=false;g.region=1;g.loc='m_rows';g.hp=100;g.surv.energy=90;store[KEY]=JSON.stringify(g);a=boot();
g=a.pin('m_rows');h=a.html();console.log('5 trouble btn',/surv:trouble/.test(h));
let fights=0,quiet=0;for(let i=0;i<15;i++){g=st();g.hp=100;g.surv.energy=90;store[KEY]=JSON.stringify(g);a=boot();g=a.do('surv:trouble');if(g.fight){fights++;[g,n]=auto(a);a.do('fx:done')}else quiet++}
console.log('  15 tries: fights',fights,'quiet',quiet);
g=st();g.region=0;g.loc='home';store[KEY]=JSON.stringify(g);a=boot();g=a.pin('home');console.log('6 home has trouble?',/surv:trouble/.test(a.html()));
console.log('errors',errs);process.exit(0);
