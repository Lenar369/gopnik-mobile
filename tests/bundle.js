// Собирает index.html в один файл для тестов: файлы data/*.js (их подключают теги <script src="data/...">)
// вставляются в начало основного скрипта. jsdom в тестах внешние скрипты не грузит.
// CLI: node bundle.js <index.html> [out.html] [папка с data/ — по умолчанию рядом с index.html]
const fs=require('fs'),path=require('path');
function bundle(file,dataDir){
 let html=fs.readFileSync(file,'utf8');const dir=dataDir||path.dirname(file);let code='';
 html=html.replace(/<script src="(data\/[^"]+\.js)"><\/script>/g,(m,src)=>{code+=fs.readFileSync(path.join(dir,src),'utf8')+'\n';return ''});
 return code?html.replace(/<script>\r?\n/,()=>'<script>\n'+code):html;
}
module.exports=bundle;
if(require.main===module){const out=bundle(path.resolve(process.argv[2]),process.argv[4]&&path.resolve(process.argv[4]));if(process.argv[3])fs.writeFileSync(process.argv[3],out);else process.stdout.write(out)}
