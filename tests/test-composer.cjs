const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../portfolio-agent.js'),'utf8');
const start=source.indexOf('function resizeComposer(){'),end=source.indexOf("input.addEventListener('input'",start);
for(const [measured,height,overflow] of [[44,'44px','hidden'],[120,'120px','hidden'],[300,'192px','auto']]){
 const input={style:{removeProperty(key){delete this[key]}},scrollHeight:measured,offsetHeight:44,getBoundingClientRect:()=>({height:44})};const c={input,innerHeight:900};vm.createContext(c);vm.runInContext(source.slice(start,end)+'resizeComposer()',c);
 assert.equal(input.style.height,height);assert.equal(input.style.overflowY,overflow);
}
assert(source.includes('<textarea id="portfolio-question"'));
assert(!source.includes('search-browse-row'));
assert(!source.includes('browseSelect'));
assert(source.includes("event.key==='Enter'&&!event.shiftKey"));
console.log('Composer grows with content, caps its height with scrolling, and retains multiline entry.');
