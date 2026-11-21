// Главное меню, новая игра (имя обязательно, 4 героя), настройки, «Холод» в шапке.
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');const KEY='gopnik-kazan-1998-survival-v6';
let store={},errs=[],W;
function boot(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(String(e).slice(0,300)));const d=new JSDOM(html,{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc,beforeParse(w){for(const k in store)w.localStorage.setItem(k,store[k]);w.matchMedia=()=>({matches:false,addListener(){}})}});W=d.window;
 return {do(id){const b=W.document.createElement('button');b.dataset.do=id;W.document.getElementById('root').appendChild(b);b.click();b.remove()},html:()=>W.document.getElementById('root').innerHTML,doc:()=>W.document}}
let a=boot();let h=a.html();const t1=/ГОПНИК/.test(h)&&/ttl:new/.test(h)&&!/ttl:continue/.test(h)&&!/ТЕСТ/.test(h);
a.do('ttl:settings');h=a.html();const t2=/ttl:music/.test(h)&&/ttl:sound/.test(h);a.do('ttl:music');const mus=W.localStorage.getItem('gopnik-music')==='0';a.do('ttl:home');
a.do('ttl:new');h=a.html();const cards=(h.match(/data-origin=/g)||[]).length;a.do('start');h=a.html();const needName=/Впиши имя/.test(h);
a.doc().getElementById('nickname').value='Ленар';a.doc().querySelector('[data-origin="thief"]').click();a.doc().getElementById('nickname').value='Ленар';a.do('start');
const g=JSON.parse(W.localStorage.getItem(KEY)||'null');h=a.html();
console.log('меню',t1,'| настройки',t2,mus,'| героев',cards,'| имя обязательно',needName,'| игра',g&&g.name,g&&g.origin,'| холод в шапке',/data-t="Холод"/.test(h));
store[KEY]=W.localStorage.getItem(KEY);a=boot();h=a.html();const cont=/ttl:continue/.test(h);a.do('ttl:continue');const inGame=/lb-stats|landbar|maphost/.test(a.html());console.log('продолжить',cont,inGame);
const ok=t1&&t2&&mus&&cards===4&&needName&&g&&g.name==='Ленар'&&g.origin==='thief'&&cont&&inGame;
console.log(ok?'OK':'FAIL');if(!ok)errs.push('title failed');console.log('errors',errs);process.exit(0);
