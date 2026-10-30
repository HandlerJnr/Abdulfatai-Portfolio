const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const file of ['portfolio-agent.js','search/search-portfolio.js']){
 const source=fs.readFileSync(file,'utf8'),line=source.split('\n').find(s=>s.includes('function contactHandoff(')),ctx={};vm.createContext(ctx);vm.runInContext(line,ctx);
 for(const answer of ['You can contact Jamiu directly for that example.','Jamiu can walk you through the details directly.','Connect with Jamiu to discuss the research.'])assert(ctx.contactHandoff(answer),file+': '+answer);
 for(const answer of ['He designed seller contact and escrow states.','The project connects buyers with sellers.'])assert(!ctx.contactHandoff(answer),file+': '+answer);
 assert(source.includes('contactHandoff(turn.text)'));assert(source.includes(file.startsWith('search/')?'contactHandoff(cached?.text)':'contactHandoff(answer)'));
}
console.log('Recruiter handoffs show existing contact cards in both views without matching product contact features.');
