const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=2;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};const wait=ms=>new Promise(r=>setTimeout(r,ms));
const pins=h=>(h.match(/data-do="surv:(wpin|sheet|cpin):[^"]*"/g)||[]).map(x=>x.slice(14,-1)).join(' ');
const art=h=>h.match(/class="mapart cityart" src="([^"]*)"/)?.[1];
async function go(a,to){a.do('surv:walk:'+to);const seen=new Set();let g;for(let i=0;i<2000;i++){await wait(3);g=st();const t=art(a.html());if(t)seen.add(t.split("/").pop());if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip');if(g.surv.trip&&g.surv.trip.paused)a.do('surv:tripgo');g=st();if(g.hp<40)g=st()}return [g,[...seen]]}
(async()=>{
 let a=boot(),g=a.do('start');g=a.do('city');let h=a.html();
 console.log('1 city pins:',pins(h));
 const ok1=/sheet:north/.test(h)&&/sheet:south/.test(h)&&/sheet:east/.test(h)&&!/wpin:dachas/.test(h)&&!/wpin:camp/.test(h);
 g=a.do('surv:sheet:north');h=a.html();console.log('2 north view:',art(h),'|',pins(h),'| title',h.match(/maptitle">([^<]*)/)?.[1]);
 const ok2=/north_/.test(art(h))&&/wpin:dachas/.test(h)&&/wpin:camp/.test(h)&&/sheet:city/.test(h)&&!/cityhero/.test(h);
 g=a.do('surv:wpin:camp');h=a.html();console.log('3 camp drawer walk:',(h.match(/surv:walk:w:camp/)||[]).length,'|',h.match(/class="description">([^<]*)/)?.[1]);
 let seen;[g,seen]=await go(a,'w:camp');h=a.html();
 console.log('4 arrived',g.surv.atWild,'| maps seen',seen.join(','),'| hero shown',/cityhero/.test(h),'| title',h.match(/maptitle">([^<]*)/)?.[1]);
 const ok4=g.surv.atWild==='camp'&&seen.some(x=>/city_/.test(x))&&seen.some(x=>/north_/.test(x));
 g=a.do('surv:loot:wild_camp');console.log('5 search',g.log[0]);g=a.do('surv:scene-ok');
 // восток: посёлок
 [g,seen]=await go(a,'w:village');h=a.html();console.log('6 village',g.surv.atWild,'| maps',seen.join(','),'| place art',/village_/.test(h));
 // обратно в город, в район
 [g,seen]=await go(a,2);console.log('7 back to district',g.region,g.surv.cityMode,'| maps',seen.join(','));
 const ok=ok1&&ok2&&ok4&&g.surv.atWild==null&&g.region===2;
 console.log(ok?'OK':'FAIL');if(!ok)errs.push('outskirts checks failed');
 console.log('errors',errs);process.exit(0);
})();
