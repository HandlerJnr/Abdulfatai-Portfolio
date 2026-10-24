const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const agent=fs.readFileSync(require('path').join(__dirname,'../portfolio-agent.js'),'utf8');
const search=fs.readFileSync(require('path').join(__dirname,'../search/search-portfolio.js'),'utf8');
function node(tag,value,cls){return {tag,textContent:value,className:cls,children:[],attrs:{},append(...c){this.children.push(...c)},setAttribute(k,v){this.attrs[k]=v},set href(v){this.attrs.href=v},get href(){return this.attrs.href}}}
const begin=agent.indexOf('const CONTACT_PHONE='),end=agent.indexOf('function renderAgentAnswer',begin);
const ctx={text:node};vm.createContext(ctx);vm.runInContext(agent.slice(begin,end)+';globalThis.helpers={shouldOfferContact,renderContactActions}',ctx);
for(const q of ['LinkedIn?','How do I contact him?','His email address','phone number','social media'])assert(ctx.helpers.shouldOfferContact(q),q);
const card=ctx.helpers.renderContactActions();assert.deepEqual(card.children[1].children.map(n=>n.href),['tel:+447344383739','mailto:aabdulfataijamiu@gmail.com?subject=Enquiry%20from%20Jamiu%E2%80%99s%20portfolio','https://www.linkedin.com/in/jamiudesign/','https://www.facebook.com/Handler.Jnr/']);
const close=agent.match(/dialog.addEventListener\('close',\(\)=>\{([\s\S]*?)\n\}\);/)[1];
for(const prior of ['','auto']){
const c={dialog:{open:false,classList:{remove(){}}},chatView:'focused',profile:null,document:{body:{style:{overflow:'hidden'},classList:{remove(){}}}},savedOverflow:prior,unlockAgentPage(){c.document.body.style.overflow='hidden'},window:{ltLenis:{start(){c.started=true}}},syncViewControl(){},saveConversation(){},input:{blur(){}},launcher:{setAttribute(){},focus(){}},requestAnimationFrame(fn){fn()}};vm.runInNewContext('(function(){'+close+'})()',c);assert.equal(c.document.body.style.overflow,prior);assert(c.started);}
const setTab=search.slice(search.indexOf(' function setTab('),search.indexOf(' function setBusy('));
assert(setTab.includes("state.page='/';"));assert(!setTab.includes("state.page='/'+tab"));
console.log('Passed: scroll restoration, LinkedIn/email/phone actions, and inline tab routing.');
