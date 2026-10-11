'use strict';
const assert=require('node:assert/strict');
const oldKey=process.env.GROQ_API_KEY;
process.env.GROQ_API_KEY='test-only-not-a-real-key';
const originalFetch=global.fetch;
let promptSeen='';
global.fetch=async(url,opts)=>{assert.match(url,/groq\.com\/openai/);const body=JSON.parse(opts.body);promptSeen=body.messages.map(m=>m.content).join('\n');return {ok:true,json:async()=>({choices:[{message:{content:"I designed Horal's escrow flow to make the payment states clearer."}}]})};};
const handler=require('../api/agent.js');
function invoke(method,body={},headers={}){return new Promise((resolve,reject)=>{const res={headers:{},status(code){this.statusCode=code;return this;},setHeader(k,v){this.headers[k]=v;},json(value){resolve({code:this.statusCode,data:value,headers:this.headers});return this;}};Promise.resolve(handler({method,body,headers:{host:'localhost',...headers}},res)).catch(reject);});}
(async()=>{
 const health=await invoke('GET');assert.equal(health.code,200);assert.equal(health.data.ok,true);assert(health.data.records>=20);
 const denied=await invoke('POST',{question:'Horal escrow'},{origin:'https://random.example'});assert.equal(denied.code,403);
 const answer=await invoke('POST',{question:'How did you handle escrow and trust at Horal?',page_context:{pathname:'/work/horal'},history:[]});
 assert.equal(answer.code,200);assert.match(answer.data.answer,/escrow/i);assert(answer.data.source_ids.includes('horal'));
 assert(promptSeen.includes('Horal')&&promptSeen.includes('FIRST PERSON'));
 const job=await invoke('POST',{question:'Compare my experience with this Product Designer role in fintech requiring UX research, design systems and collaboration with developers.',history:[]});
 assert.equal(job.code,200);assert(promptSeen.includes('strengths and gaps'));
 global.fetch=originalFetch;
 if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey;
 console.log('Agent smoke tests: health, origin guard, retrieval, first-person evidence, role comparison passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
