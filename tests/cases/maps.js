// Новые карты районов (заказ 10): метки переставлены под новые летние/зимние кадры.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={};const errs=[];let W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},pin(id){const b=W.document.createElement('button');b.dataset.pin=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);return JSON.parse(store[KEY])};
const chips=h=>(h.match(/class="fchip[^"]*">[^<]*<i>[^<]*<\/i>/g)||[]).map(x=>x.replace(/<[^>]*>|class="fchip[^"]*">/g,'').trim());
const pinAt=(h,id)=>{const m=h.match(new RegExp('data-pin="'+id+'"[^>]*style="left:(\\d+)px;top:(\\d+)px|style="left:(\\d+)px;top:(\\d+)px"[^>]*data-pin="'+id+'"'));return m?[+(m[1]||m[3]),+(m[2]||m[4])].join(','):null};
let a=boot(),g=a.do('start');const want={0:['home','140,380'],1:['m_rows','420,270'],2:['s_station','510,135'],3:['f_gate','330,320'],4:['g_mech','300,240'],5:['w_quay','880,215'],6:['c_square','330,270']};let ok=true;
for(const r in want){g=st();g.region=+r;g.loc=null;if(g.surv){g.surv.cityMode=false;g.surv.place=null}store[KEY]=JSON.stringify(g);a=boot();const got=pinAt(a.html(),want[r][0]);console.log(r,want[r][0],got);if(got!==want[r][1])ok=false}
console.log(ok?'OK':'FAIL');if(!ok)errs.push('maps pins failed');
console.log('errors',errs);process.exit(0);
