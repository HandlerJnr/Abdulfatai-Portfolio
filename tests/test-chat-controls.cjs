const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../portfolio-agent.js'),'utf8');
const opening=source.match(/launcher\.addEventListener\('click',(\(\)=>\{[\s\S]*?\n\})\);/)[1];
for(const mobile of [false,true]){
 let focused=0;
 const dialog={open:false,inert:true,classList:{remove(){}},showModal(){assert.equal(this.inert,false);this.open=true}};
 const input={disabled:true,readOnly:true,focus(){focused++}};
 const attributes={};
 const context={dialog,input,launcher:{setAttribute:(k,v)=>attributes[k]=v},document:{body:{style:{overflow:''},classList:{remove(){}}},querySelector:()=>null},syncViewControl(){},resizeComposer(){},getRecords:()=>Promise.resolve(),mobileAgent:{matches:mobile}};
 vm.createContext(context);vm.runInContext('('+opening+')()',context);
 assert.equal(dialog.open,true);assert.equal(dialog.inert,false);
 assert.equal(input.disabled,false);assert.equal(input.readOnly,false);assert.equal(focused,1);
 assert.equal(attributes['aria-expanded'],'true');
}
assert(source.includes('document.body.append(launcher)'));
assert(source.includes('/assets/db99cb95c28524de.png'));
assert(!source.includes('launchHost'));
assert(!source.includes('agent-project-launch'));
const keyboard=source.match(/dialog\.addEventListener\('keydown',(event=>\{[^\n]+\})\);/)[1];
const keyContext={prevented:0,stopped:0,closeAgent(){}};
vm.runInNewContext('('+keyboard+')({key:"a",stopPropagation(){stopped++},preventDefault(){prevented++}})',keyContext);
assert.equal(keyContext.prevented,0);assert.equal(keyContext.stopped,1);
console.log('Chat launcher, focus recovery and editable-input checks passed.');
