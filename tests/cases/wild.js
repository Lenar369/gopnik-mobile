const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=3;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};const wait=ms=>new Promise(r=>setTimeout(r,ms));
const title=h=>h.match(/drawer-head"><strong>([^<]*)/)?.[1];const acts=h=>(h.match(/data-do="(surv:[a-z]+:?[^"]*)"[^>]*><b>/g)||[]).map(x=>x.slice(9,-5)).join(' | ');
(async()=>{
 let a=boot(),g=a.do('start');g=a.do('city');
 console.log('1 wild pins',(a.html().match(/wildpin/g)||[]).length);
 g=a.do('surv:wpin:heat');let h=a.html();console.log('2',title(h),'|',h.match(/class="description">([^<]*)/)?.[1],'| banner',/drawbanner/.test(h),'|',(h.match(/data-do="surv:walk[^"]*"/g)||[]).join(','),'| bus?',/travel:/.test(h));
 g=a.do('surv:walk:w:heat');for(let i=0;i<300;i++){await wait(5);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip')}
 h=a.html();console.log('3 arrived atWild',g.surv.atWild,'region',g.region,'|',title(h),'| bar',h.match(/class="citybar"><span>([^<]*)/)?.[1],'|',g.log[0]);
 console.log('   actions:',(h.match(/data-do="surv:(loot|use|wrest|view)[^"]*"/g)||[]).join(' '));
 g=a.do('surv:loot:wild_heat');h=a.html();console.log('4 search',g.log[0],'| scene',g.surv.scene,/scenecard/.test(h));
 g=a.do('surv:scene-ok');g=a.do('surv:cityclose');console.log('5 cityclose blocked',g.surv.cityMode,g.surv.atWild);
 // в бункер и в район
 g=a.do('surv:walk:w:cellar');for(let i=0;i<400;i++){await wait(5);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip');if(g.surv.trip&&g.surv.trip.paused)a.do('surv:tripgo')}
 console.log('6 cellar',g.surv.atWild,'warmth',Math.round(g.surv.warmth));
 g=a.do('surv:cpin:4');h=a.html();console.log('7 from wild to garage:',title(h),'| bus?',/travel:4:bus/.test(h));
 g=a.do('surv:walk:4');for(let i=0;i<400;i++){await wait(5);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip');if(g.surv.trip&&g.surv.trip.paused)a.do('surv:tripgo')}
 console.log('8 arrived',g.region,g.loc,'atWild',g.surv.atWild,'cityMode',g.surv.cityMode,'|',g.log[0]);
 // разворот из дикого места
 g=a.do('city');g=a.do('surv:walk:w:dump');await wait(20);g=a.do('surv:tripback');for(let i=0;i<400;i++){await wait(5);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip');if(g.surv.trip&&g.surv.trip.paused)a.do('surv:tripgo')}
 console.log('9 back',g.region,g.surv.atWild,g.surv.cityMode);
 console.log('errors',errs);process.exit(0);
})();
