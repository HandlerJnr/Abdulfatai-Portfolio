import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const hex=/#(?:[a-fA-F\d]{8}|[a-fA-F\d]{6}|[a-fA-F\d]{4}|[a-fA-F\d]{3})\b/;
const files=['dist/assets/portfolio.css','dist/assets/ask-jamiu.css','dist/assets/companion.css','dist/assets/portfolio.js'];
const powerMarkers=[
  '/* Small, non-interactive signature powers stay inside the companion\'s orbit. */',
  '/* A companion crossing a button never captures that button\'s click or tap. */',
  '/* Short screen-wide signature powers; never intercept navigation or touch. */',
  '/* Mobile companion: keep drag and tap powers, but make the launcher quieter. */'
];
let errors=[];
for(const file of files){
 let source=fs.readFileSync(path.join(root,file),'utf8');
 if(file.endsWith('/companion.css')){
  const positions=powerMarkers.map(m=>source.indexOf(m));
  if(positions.some(p=>p<0)){errors.push('Missing character-power exception boundary');continue;}
  // Only leave character identity and power-effect colours intact.
  source=source.slice(0,positions[0])+source.slice(positions[1],positions[2])+source.slice(positions[3]);
 }
 if(hex.test(source))errors.push(file+': hardcoded UI hex colour found');
}
for(const page of ['dist/index.html','dist/services/index.html','dist/process/index.html']){
 const content=fs.readFileSync(path.join(root,page),'utf8');
 for(const match of content.matchAll(/style="([^"]*)"/g))if(hex.test(match[1]))errors.push(page+': hardcoded inline UI colour');
}
// Deliberately exempt the reference.css Webflow export, original brand-project
// colour swatches and Pokémon character/power colours. Those are assets/identity,
// not reusable site interface tokens.
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Portfolio UI theme audit passed: shared colours use existing theme variables.');
