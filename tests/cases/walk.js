const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const title=h=>(h.match(/drawer-head"><strong>([^<]*)/)?.[1]||'-')+' | bar:'+((h.match(/class="citybar[^"]*"><[a-z]+[^>]*>([^<]*)/)||[])[1]||'-');
const desc=h=>h.match(/class="description">([^<]*)/)?.[1];
(async()=>{
 let a=boot(),g=a.do('start');
 g=a.do('city');console.log('1 open city:',g.surv.cityMode,title(a.html()),'| pins',(a.html().match(/citypin/g)||[]).length,'| art',a.html().match(/cityart" src="([^"]*)/)?.[1]);
 g=a.do('surv:cpin:6');console.log('2 pin center:',title(a.html()),'|',desc(a.html()),'|',(a.html().match(/data-do="(surv:walk|travel|surv:cityback)[^"]*"/g)||[]).join(' / '));
 const t0=g.day*1440+g.minute;
 g=a.do('surv:walk:6');console.log('3 walking:',title(a.html()),g.surv.trip&&g.surv.trip.to);
 // гоняем, отвечая на события
 for(let i=0;i<200;i++){await wait(10);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev){const k=g.surv.trip.ev.k;console.log('   event',k,'|',title(a.html()));a.do('surv:road:skip')}}
 console.log('4 arrived:',g.region,g.loc,'mins',g.day*1440+g.minute-t0,'food',Math.round(g.surv.food),'warmth',Math.round(g.surv.warmth),'| log',g.log[0]);
 // назад на автобусе
 g=a.do('city');g=a.do('surv:cpin:0');g=a.do('travel:0:bus');console.log('5 bus home:',g.region,g.surv.cityMode,'money',g.money);
 // пауза и разворот
 g=a.do('city');g=a.do('surv:walk:3');await wait(30);g=a.do('surv:trippause');const x1=g.surv.trip.x;await wait(40);g=st();console.log('6 paused stays:',g.surv.trip.x===x1,title(a.html()));
 g=a.do('surv:tripback');for(let i=0;i<200;i++){await wait(10);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip')}
 console.log('7 back home:',g.region,g.surv.cityMode);
 // зимой ночью далеко — смерть в пути
 g.surv.shift=130;g.minute=22*60;g.surv.food=5;g.surv.warmth=10;g.hp=10;store[KEY]=JSON.stringify(g);a=boot();
 g=a.do('city');g=a.do('surv:walk:4');
 for(let i=0;i<300;i++){await wait(10);g=st();if(!g.surv.trip)break;if(g.surv.trip.ev)a.do('surv:road:skip');if(g.surv.trip&&g.surv.trip.paused)a.do('surv:tripgo')}
 console.log('8 winter walk:',g.region,g.loc,'deaths',g.surv.deaths,'hp',g.hp,'| scene',g.surv.scene,'| title',title(a.html()));
 // все события
 g.surv.scene=null;g.surv.deaths=0;g.hp=100;g.surv.food=90;g.surv.warmth=90;g.money=100;g.inventory.push('cigs');g.surv.cityMode=true;
 for(const [k,ans] of [['find','take'],['dogs','dogs-fight'],['gop','gop-cig'],['gop','gop-bold'],['warm','warm-in'],['shelter','shelter-wait'],['ride','ride-yes']]){
  g.surv.trip={to:6,x:700,y:400,paused:true,ev:{k,item:'food_bread'},lastEv:0,from:0};g.region=0;store[KEY]=JSON.stringify(g);a=boot();
  const h=a.html();g=a.do('surv:road:'+ans);console.log('9',k,'|',title(h),'|',desc(h).slice(0,60),'→',g.log[0].slice(0,60),'| trip',!!g.surv.trip,'region',g.region);
 }
 console.log('errors',errs);process.exit(0);
})();
