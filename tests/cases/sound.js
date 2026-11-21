// Звуки мира: кнопка в меню, переключение, звуки на события (поддельный AudioContext считает созданные звуки).
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={},errs=[],W,made=0,loops=0,noises=0;
function fakeAC(){const node=()=>({connect(){},disconnect(){},start(){},stop(){},gain:{value:1,setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}},frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},Q:{value:1},type:''});
 return class{constructor(){this.currentTime=0;this.sampleRate=8000;this.state='running';this.destination={}}resume(){}createGain(){return node()}createOscillator(){made++;return node()}createBiquadFilter(){return node()}createBuffer(c,n){return {getChannelData:()=>new Float32Array(n)}}createBufferSource(){made++;noises++;const n=node();Object.defineProperty(n,'loop',{set(v){if(v)loops++}});return n}}}
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){w.__WALK_MS=5;w.AudioContext=fakeAC();for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove();return st()},html:()=>W.document.getElementById('root').innerHTML}}
const st=()=>{store[KEY]=W.localStorage.getItem(KEY);store['gopnik-sound']=W.localStorage.getItem('gopnik-sound');if(store['gopnik-sound']==null)delete store['gopnik-sound'];return JSON.parse(store[KEY])};
(async()=>{let a=boot(),g=a.do('start');a.do('surv:menu');const btn=/data-do="fx:sound"[^>]*>🔊 Звук: включён/.test(a.html());console.log('1 кнопка в меню:',btn);
made=0;g=a.do('surv:loot:q5_basement');const m1=made;console.log('2 обыск — звуков:',m1);
a.do('fx:sound');st();const off=W.localStorage.getItem('gopnik-sound')==='0';a.do('surv:menu');const lbl=/🔇 Звук: выключен/.test(a.html());
made=0;g=st();g.surv.loot={};g.fight=null;store[KEY]=JSON.stringify(g);a=boot();a.do('surv:loot:q5_basement');const m2=made;console.log('3 выключен:',off,lbl,'звуков при обыске:',m2);
// зимой на улице — ветер (зацикленный фон)
g=st();delete store['gopnik-sound'];g.day=140;g.surv.cityMode=true;g.surv.atWild='bank';g.loc=null;g.fight=null;g.surv.scene=null;store[KEY]=JSON.stringify(g);loops=0;made=0;a=boot();a.do('city');await new Promise(r=>setTimeout(r,150));console.log('4 зимой на улице фон:',loops,'звуков',made,'html city?',/cityart/.test(a.html()),st().surv.cityMode,st().loc,st().day);
// музыка: после клика в меню идёт перебор; выключили — новые ноты не планируются
g=st();g.fight=null;g.surv.scene=null;g.minute=14*60;g.day=5;store[KEY]=JSON.stringify(g);a=boot();a.do('surv:menu');const mb=/🎵 Музыка: включена/.test(a.html());made=0;await new Promise(r=>setTimeout(r,700));const mOn=made;
a.do('surv:music');made=0;await new Promise(r=>setTimeout(r,1500));const mOff=made;a.do('surv:menu');const ml=/🎵 Музыка: выключена/.test(a.html());console.log('5 музыка: кнопка',mb,'| нот за 0,7 с',mOn,'| после выкл',mOff,ml);
// ночью — «Ночной район» (больше голосов: бас, ударные, подложка)
g=st();delete store['gopnik-music'];g.fight=null;g.surv.scene=null;g.minute=23*60;store[KEY]=JSON.stringify(g);a=boot();a.do('surv:menu');made=0;noises=0;await new Promise(r=>setTimeout(r,700));const mN=noises;console.log('6 ночью ударных за 0,7 с:',mN);

const ok=mN<=1&&mOn<=1&&mb&&mOff<=1&&ml&&btn&&m1>0&&off&&lbl&&m2===0&&loops>0;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('sound failed');console.log('errors',errs);process.exit(0);})();
