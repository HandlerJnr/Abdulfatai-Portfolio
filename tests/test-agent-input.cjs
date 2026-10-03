// Run with node tests/test-agent-input.cjs. Exercise the actual submit flow in a DOM stub.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('portfolio-search.js','utf8');
const rule=source.slice(source.indexOf('// Keep this conservative'),source.indexOf('function text('));
const ask=source.slice(source.indexOf('async function ask(q)'),source.indexOf('const mobileAgent='));
const cases=JSON.parse(fs.readFileSync('tests/agent-input-cases.json','utf8'));
(async()=>{
 for(const {question,clarify} of cases){
  let loads=0,calls=0;
  const node=()=>({children:[],append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},classList:{remove(){}},dataset:{},offsetTop:0});
  const context={busy:false,submit:{disabled:false},input:{value:question,focus(){}},conversation:node(),history:[],
    dialog:{querySelector:()=>({})},text:(tag,value)=>({...node(),value}),renderAgentAnswer:answer=>({answer}),
    getRecords:async()=>{loads++},rank:()=>[],localAnswer:()=>'',askAgent:async()=>{calls++;return {answer:'Grounded answer',sourceIds:[]}},getRecord:()=>null};
  vm.createContext(context);
  vm.runInContext(rule+ask+';globalThis.run=ask;',context);
  await context.run(question);
  assert.equal(calls,clarify?0:1,question);
  assert.equal(loads,clarify?0:1,question);
  assert.equal(context.history.length,clarify?0:2,question);
  assert.equal(context.submit.disabled,false,question);
  if(clarify){
   assert.equal(context.input.value,question,'Keep draft for completion');
   const reply=context.conversation.children.at(-1);
   assert.match(reply.children[0].answer,/Keep typing/);
  }
 }
 console.log(`Passed ${cases.length} frontend submission cases.`);
})().catch(error=>{console.error(error);process.exitCode=1});
