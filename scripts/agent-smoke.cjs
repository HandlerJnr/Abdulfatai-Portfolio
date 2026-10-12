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
 assert(promptSeen.includes('Previous assistant messages are conversation context, never factual evidence'));
 const history=[{role:'user',text:'Tell me about Vista banking'},{role:'assistant',text:'I integrated a fraud-detection model.',source_ids:['vista-itss']}];
 let calls=0;
 global.fetch=async()=>{calls++;throw new Error('provider offline');};
 const answers=[];
 for(let i=0;i<4;i++){
  const more=await invoke('POST',{question:i===0?'Could you go a little deeper into your last answer with a specific example?':'Tell me more',follow_up:i>0,history,page_context:{pathname:'/simple/work/vista-itss'}});
  assert.equal(more.code,200);assert.equal(more.data.engine,'portfolio-grounded');assert(more.data.evidence_ids.length);
  assert(!/fraud|trouble answering/i.test(more.data.answer));
  if(i<3)assert.deepEqual(more.data.source_ids,['vista-itss']);
  answers.push(more.data.answer);history.push({role:'user',text:'Tell me more'},{role:'assistant',text:more.data.answer,source_ids:more.data.source_ids,evidence_ids:more.data.evidence_ids});
 }
 assert.equal(new Set(answers).size,4);assert.equal(calls,0);
 const horal=await invoke('POST',{question:'Tell me more',history:[{role:'user',text:'What was hard about Horal?'}]});
 assert.deepEqual(horal.data.source_ids,['horal']);assert.match(horal.data.answer,/marketplace/i);
 const fresh=await invoke('POST',{question:'Tell me more'});assert.equal(fresh.code,200);assert.deepEqual(fresh.data.source_ids,['about']);
 delete process.env.GROQ_API_KEY;
 const noKey=await invoke('POST',{question:'Vista banking'});assert.equal(noKey.code,200);assert.equal(noKey.data.fallback,true);assert.deepEqual(noKey.data.source_ids,['vista-itss']);
 process.env.GROQ_API_KEY='test-only-not-a-real-key';
 for(const failure of ['http','empty','network']){
  global.fetch=async()=>failure==='http'?{ok:false,status:429}:failure==='empty'?{ok:true,json:async()=>({choices:[]})}:Promise.reject(new Error('offline'));
  const fallback=await invoke('POST',{question:'What was hard about Horal?'});assert.equal(fallback.code,200);assert.equal(fallback.data.fallback,true);assert.deepEqual(fallback.data.source_ids,['horal']);
 }
 global.fetch=originalFetch;
 if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey;
 console.log('Agent tests: health, origin guard, retrieval, role comparison, contextual follow-ups, varied facts, untrusted history and provider failure fallback passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
