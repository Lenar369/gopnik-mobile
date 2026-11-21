// Правки после теста 21.11: крафт по разделам, летом нет «погреться», места с картинкой из карты района.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
let a=boot(),g=a.do('start');a.do('city');a.do('close');g=st();g.surv.cityMode=false;g.surv.defaultSeen=true;g.region=0;g.loc='home';g.minute=10*60;store[KEY]=JSON.stringify(g);a=boot();
a.do('surv:view:craft');let h=a.html();const cats=(h.match(/surv:craftcat:[^"]+/g)||[]).length,noTiles=!/crafttile/.test(h);
a.do('surv:craftcat:Тепло');h=a.html();const inCat=/crafttile/.test(h)&&/Назад к разделам/.test(h)&&!/Варежки/.test(h);
a.do('surv:craftcat:');const back=!/crafttile/.test(a.html());console.log('1 крафт: разделов',cats,'| плиток в списке разделов нет',noTiles,'| внутри',inCat,'| назад',back);
// летом события «погреться» не бывает
const code=require('fs').readFileSync(process.argv[2],'utf8');const okWarm=/if\(cold\)pool\.push\('warm'\)/.test(code);
// место без своей картинки — кусок карты района
a=boot();a.pin('play');a.do('pl:enter');h=a.html();const crop=/class="pimg" style="background-image:url\('[^']*(yard|maps)[^']*'\);background-size:260%/.test(h);console.log('2 спортплощадка — кусок карты:',crop);
const ok=cats>=5&&noTiles&&inCat&&back&&okWarm&&crop;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('fixes21 failed');console.log('errors',errs);process.exit(0);
