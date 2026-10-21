const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../portfolio-agent.js'),'utf8');
const start=source.indexOf('function setChatView(next){'),end=source.indexOf("viewButton.addEventListener('click'",start);
const classes=()=>({value:new Set(),toggle(k,on){on?this.value.add(k):this.value.delete(k)},contains(k){return this.value.has(k)}});
function fixture(desktop=true){
 const body={classList:classes(),style:{overflow:'hidden'}},dialog={open:true,inert:false,classList:classes(),style:{},getBoundingClientRect:()=>({left:100,top:100,width:600,height:600}),close(){this.open=false},show(){this.open=true;this.modal=false},showModal(){this.open=true;this.modal=true},contains:()=>true};
 const input={value:'A draft question',focus(){}},conversation={scrollTop:173};
 const context={dialog,profile:{scrollTop:55},dockViewport:{matches:desktop},chatView:'focused',savedOverflow:'',document:{body,activeElement:input},input,conversation,reduceAgentMotion:{matches:true},syncViewControl(){},positionDock(){},resizeComposer(){},saveConversation(){},profileScroll:0,fullScreenViewport:{matches:!desktop},lockAgentPage(){},updateAgentViewport(){}};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);return context;
}
const c=fixture();vm.runInContext("setChatView('docked')",c);
assert.equal(c.dialog.modal,false);assert.equal(c.document.body.style.overflow,'');assert(c.document.body.classList.contains('agent-is-docked'));
assert.equal(c.input.value,'A draft question');assert.equal(c.conversation.scrollTop,173);
vm.runInContext("setChatView('focused')",c);
assert.equal(c.dialog.modal,true);assert.equal(c.document.body.style.overflow,'hidden');assert(!c.document.body.classList.contains('agent-is-docked'));
assert.equal(c.input.value,'A draft question');assert.equal(c.conversation.scrollTop,173);assert.equal(c.profile.scrollTop,55);
const phone=fixture(false);vm.runInContext("setChatView('docked')",phone);assert.equal(phone.chatView,'focused');
console.log('Chat view switching preserves the draft and scroll, releases browsing, and stays focused on mobile.');
