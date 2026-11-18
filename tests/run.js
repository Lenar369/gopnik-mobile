// Автотесты «Гопник: Казань 1998».  Запуск:  cd tests && npm install && node run.js [путь к index.html]
// По умолчанию проверяется ../preview-v6/index.html. Тест считается пройденным, если
// скрипт отработал и напечатал «errors []» (ни одной ошибки JavaScript в игре).
const {spawnSync}=require('child_process');const fs=require('fs');const path=require('path');
const file=path.resolve(process.argv[2]||path.join(__dirname,'..','preview-v6','index.html'));
const html=fs.readFileSync(file,'utf8');
let fail=0;
// 1) синтаксис всего скрипта игры
try{const m=html.match(/<script>([\s\S]*)<\/script><\/body>/);new Function(m[1]);console.log('✔ синтаксис')}catch(e){console.log('✘ синтаксис:',e.message);process.exit(1)}
// 2) сценарии
const cases=fs.readdirSync(path.join(__dirname,'cases')).filter(f=>f.endsWith('.js')).sort();
for(const c of cases){
 const t0=Date.now();const r=spawnSync(process.execPath,[path.join(__dirname,'cases',c),file],{encoding:'utf8',timeout:180000,cwd:__dirname});
 const out=(r.stdout||'')+(r.stderr||'');const ok=r.status===0&&/errors \[\]/.test(out);
 console.log((ok?'✔ ':'✘ ')+c.replace('.js','').padEnd(8)+' '+((Date.now()-t0)/1000).toFixed(1)+' с');
 if(!ok){fail++;console.log(out.split('\n').slice(-15).map(l=>'   │ '+l).join('\n'))}
}
console.log(fail?'\n✘ Провалено: '+fail+' из '+cases.length:'\n✔ Все '+cases.length+' сценариев прошли');
process.exit(fail?1:0);
