const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../portfolio-agent.js','utf8');
const rules=source.slice(source.indexOf('const INPUT_CLARIFICATION='),source.indexOf('\nfunction text('));
const context={};vm.createContext(context);vm.runInContext(rules+'\nlet inputVocabulary=portfolioVocabulary([]);',context);
for(const question of ['interesting','fair enough','got it','really?','nice','hmm','haha','lol'])assert.equal(vm.runInContext('needsClarification('+JSON.stringify(question)+')',context),false,question);
for(const question of ['asdfqwerty','jdsjksdjksd',''])assert.equal(vm.runInContext('needsClarification('+JSON.stringify(question)+')',context),true,question);
console.log('Browser input checks passed: conversational reactions reach the agent; empty/random input still requests clarification.');
