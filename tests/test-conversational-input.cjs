const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../portfolio-agent.js','utf8');const rules=source.slice(source.indexOf('const INPUT_CLARIFICATION='),source.indexOf('\nfunction text('));
const context={};vm.createContext(context);vm.runInContext(rules,context);
const cases=JSON.parse(fs.readFileSync(__dirname+'/agent-input-cases.json','utf8'));
for(const {question,clarify} of cases)assert.equal(vm.runInContext('needsClarification('+JSON.stringify(question)+')',context),clarify,JSON.stringify(question));
assert(!source.includes('portfolioVocabulary('));console.log(cases.length+' browser cases passed. Every non-empty turn reaches the model; only empty input is blocked.');
