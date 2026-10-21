const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../portfolio-agent.js','utf8');
const api=source.slice(source.indexOf('async function askAgent('),source.indexOf('\nfunction renderEvidenceLinks'));
const encoder=new TextEncoder();
function context(fetch){const c={fetch,AbortController,TextDecoder,DOMException,setTimeout,clearTimeout,history:[],roleDescription:'',currentPageContext:()=>({}),activeRequest:{controller:new AbortController(),partial:''}};vm.createContext(c);vm.runInContext(api,c);return c;}
function response(events,fragment=true){const bytes=encoder.encode(events.map(e=>JSON.stringify(e)).join('\n')+'\n');return new Response(new ReadableStream({start(c){if(fragment){for(let i=0;i<bytes.length;i+=3)c.enqueue(bytes.slice(i,i+3));}else c.enqueue(bytes);c.close();}}),{headers:{'Content-Type':'application/x-ndjson'}});}
(async()=>{
 let payload;const c=context(async(url,opts)=>{payload=JSON.parse(opts.body);return response([{type:'status'},{type:'delta',text:'₦500,'},{type:'delta',text:'000'},{type:'done',answer:'₦500,000',source_ids:[],evidence_links:[{label:'Press coverage',url:'https://example.com'}]}]);});
 const parts=[];const result=await c.askAgent('HOFAL',p=>parts.push(p));assert.equal(result.answer,'₦500,000');assert.deepEqual(parts,['₦500,','₦500,000']);assert.equal(payload.stream,true);assert.equal(result.evidenceLinks[0].label,'Press coverage');
 const truncated=context(async()=>response([{type:'delta',text:'partial'}]));await assert.rejects(truncated.askAgent('q'),/interrupted/);assert.equal(truncated.activeRequest.partial,'partial');
 const failed=context(async()=>response([{type:'error',error:'Please retry',code:'stream_unavailable'}]));await assert.rejects(failed.askAgent('q'),/retry/);
 const fallback=context(async()=>new Response(JSON.stringify({answer:'Which leadership?',intent:'clarification'}),{headers:{'Content-Type':'application/json'}}));assert.equal((await fallback.askAgent('leadership')).intent,'clarification');
 const stopped=context(async(url,opts)=>{await new Promise((resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(new DOMException('Stopped','AbortError'))));});const pending=stopped.askAgent('q');stopped.activeRequest.controller.abort();await assert.rejects(pending,{name:'AbortError'});
 // Preview only one explicitly named project, on an expanded desktop.
 const preview=source.slice(source.indexOf('function contextualPreview('),source.indexOf('\nfunction localAnswer'));
 const vista={id:'vista-itss',url:'/work/vista/',title:'Vista'};let opened=0;
 const v={projectsInAnswer:t=>t.includes('Vista')?[vista]:[],dockViewport:{matches:true},chatView:'focused',showProof:()=>opened++};vm.createContext(v);vm.runInContext(preview,v);
 v.contextualPreview('Tell me about Vista','Vista banking');assert.equal(opened,1);v.contextualPreview('more','Vista banking');assert.equal(opened,1);v.chatView='docked';v.contextualPreview('Vista','Vista');assert.equal(opened,1);v.chatView='focused';v.dockViewport.matches=false;v.contextualPreview('Vista','Vista');assert.equal(opened,1);
 console.log('Client checks passed: UTF-8 fragmented streaming, evidence metadata, truncated/error streams, JSON clarification, abort and desktop-only contextual preview.');
})().catch(e=>{console.error(e);process.exitCode=1;});
