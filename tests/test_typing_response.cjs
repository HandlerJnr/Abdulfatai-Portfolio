const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('typing-response.js','utf8').replace('export function typeText','function typeText');
function setup(reduced=false){let next=0,queue=new Map(),updates=[];const ctx={DOMException,Array,Promise,matchMedia:()=>({matches:reduced}),requestAnimationFrame(fn){queue.set(++next,fn);return next},cancelAnimationFrame(id){queue.delete(id)}};vm.createContext(ctx);vm.runInContext(source,ctx);return {typeText:ctx.typeText,updates,frame(now){const callbacks=[...queue.values()];queue.clear();callbacks.forEach(fn=>fn(now))},pending:()=>queue.size};}
(async()=>{
 let t=setup(),text='A helpful reply 🙂 with Unicode.';const p=t.typeText(text,{duration:100,onUpdate:x=>t.updates.push(x)});t.frame(0);assert.equal(t.updates[0],'A');assert.notEqual(t.updates[0],text);t.frame(40);assert(t.updates.at(-1).length>1);t.frame(100);await p;assert.equal(t.updates.at(-1),text);assert.equal(t.pending(),0);
 t=setup();const controller=new AbortController(),p2=t.typeText('A long answer',{signal:controller.signal,onUpdate:x=>t.updates.push(x)});t.frame(0);controller.abort();await assert.rejects(p2,{name:'AbortError'});assert.equal(t.pending(),0);assert.equal(t.updates.length,1);
 t=setup(true);await t.typeText(text,{onUpdate:x=>t.updates.push(x)});assert.deepEqual(t.updates,[text]);assert.equal(t.pending(),0);
 t=setup();let current=true;const p3=t.typeText('Outdated answer',{isCurrent:()=>current,onUpdate:x=>t.updates.push(x)});t.frame(0);current=false;t.frame(40);await assert.rejects(p3,{name:'AbortError'});assert.equal(t.pending(),0);
 t=setup();await t.typeText('',{onUpdate:x=>t.updates.push(x)});assert.deepEqual(t.updates,['']);
 for(const file of ['portfolio-agent.js','search/search-portfolio.js']){const s=fs.readFileSync(file,'utf8');assert(s.includes("await import('/typing-response.js')"),file);assert(s.includes('await typeText('),file);assert(s.includes("setAttribute('aria-hidden','true')"),file);}
 console.log('Typing reveal: progressive frames, complete text, Unicode, Stop, stale requests, reduced motion and both clients passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
