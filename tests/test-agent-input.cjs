// Run with node tests/test-agent-input.cjs. Exercise the actual submit flow in a DOM stub.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('portfolio-search.js','utf8');
const rule=source.slice(source.indexOf('// Keep this conservative'),source.indexOf('function text('));
const ask=source.slice(source.indexOf('function showInputClarification(q)'),source.indexOf('const mobileAgent='));
const records=[...JSON.parse(fs.readFileSync('portfolio-knowledge.json','utf8')),JSON.parse(fs.readFileSync('technical-capabilities.json','utf8'))];
const cases=JSON.parse(fs.readFileSync('tests/agent-input-cases.json','utf8'));
(async()=>{
 for(const {question,clarify} of cases){
  let loads=0,calls=0;
  const node=()=>({children:[],append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},classList:{remove(){}},dataset:{},offsetTop:0});
  const context={records,inputVocabulary:null,busy:false,submit:{disabled:false},input:{value:question,focus(){}},conversation:node(),history:[],
    dialog:{querySelector:()=>({})},text:(tag,value)=>({...node(),value}),renderAgentAnswer:answer=>({answer}),
    getRecords:async()=>{loads++},rank:()=>[],asksAboutCurrentPage:()=>false,recordScore:()=>0,localAnswer:()=>'',askAgent:async()=>{calls++;return {answer:'Grounded answer',sourceIds:[]}},getRecord:()=>null};
  vm.createContext(context);
  vm.runInContext(rule+ask+';globalThis.run=ask;',context);
  await context.run(question);
  assert.equal(calls,clarify?0:1,question);
  assert.ok(loads<=1,question);
  assert.equal(context.history.length,clarify?0:2,question);
  assert.equal(context.submit.disabled,false,question);
  if(!clarify){
   const count=context.history.length;
   context.askAgent=async()=>{throw Error('Model unavailable')};
   await context.run(question);
   assert.equal(context.history.length,count,'Fallback must not become AI history');
  }
  if(clarify){
   assert.equal(context.input.value,question,'Keep draft for completion');
   const reply=context.conversation.children.at(-1);
   assert.match(reply.children[0].answer,/Keep typing/);
  }
 }
 const history=[{role:'user',text:'logo design'},{role:'assistant',text:'Logo answer'}];
 const routing={history,records,asksAboutCurrentPage:q=>q.includes('this page')};
 vm.createContext(routing);
 const followup=source.slice(source.indexOf('function recentUserContext('),source.indexOf('function getRecord('));
 vm.runInContext(followup+';globalThis.query=recentUserContext;',routing);
 assert.equal(routing.query('React'),'React');
 assert.equal(routing.query('What am I looking at on this page?'),'What am I looking at on this page?');
 assert.match(routing.query('more'),/logo design/);
 console.log(`Passed ${cases.length} frontend submission cases.`);
})().catch(error=>{console.error(error);process.exitCode=1});
