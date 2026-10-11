import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');const dist=path.join(root,'dist');let errors=[];let pages=0;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
for(const file of walk(dist).filter(x=>x.endsWith('.html'))){pages++;const source=fs.readFileSync(file,'utf8');if(/(?:href|src)="https?:\/\/(?:jamiudesigns\.vercel\.app|abdulfataijamiu\.surge\.sh)/.test(source))errors.push(path.relative(dist,file)+': old portfolio dependency');for(const match of source.matchAll(/(?:href|src)="(\/[^"]*)"/g)){const url=match[1].split(/[?#]/)[0];const target=path.join(dist,decodeURIComponent(url));if(!fs.existsSync(target)&&!fs.existsSync(path.join(target,'index.html')))errors.push(path.relative(dist,file)+': '+url)}if(/Michael T\.|Brooklyn Simmons|LuxeGlow|Average ROI|Successful Pre-Orders/.test(source))errors.push(path.relative(dist,file)+': template claim remains')}
for(const route of ['','about','work','services','contact','credentials','process','privacy-policy','terms-and-conditions','404','academic-proofreader'])if(!fs.existsSync(path.join(dist,route,'index.html')))errors.push('Missing route '+route);
for(const forbidden of ['notes','resources','work-with-me','team','pricing','blog','product','styleguide','changelog'])if(fs.existsSync(path.join(dist,forbidden,'index.html')))errors.push('Inactive route is still served: '+forbidden);
for(const slug of ['horal','pay4me','bizinc','kremor-ai','vista-itss','chalant-ai','arete','shortlet-lagos','settle','synqit','archi-tek','loan-investment-app','project-management-dashboard'])if(!fs.existsSync(path.join(dist,'work',slug,'index.html')))errors.push('Case study missing '+slug);
for(const css of walk(path.join(dist,'assets')).filter(x=>x.endsWith('.css'))){for(const match of fs.readFileSync(css,'utf8').matchAll(/url\(["']?(\/[^)"']+)/g)){if(!fs.existsSync(path.join(dist,match[1])))errors.push(path.relative(dist,css)+': '+match[1])}}
execFileSync(process.execPath,['--check',path.join(dist,'assets/portfolio.js')]);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`Verified ${pages} pages: links, local assets, required routes and JavaScript syntax pass.`);
