const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');

const script=fs.readFileSync(path.join(__dirname,'../portfolio-agent.js'),'utf8');
const styles=fs.readFileSync(path.join(__dirname,'../portfolio-agent.css'),'utf8');
const knowledge=JSON.parse(fs.readFileSync(path.join(__dirname,'../portfolio-knowledge.json'),'utf8'));
const begin=script.indexOf("const CONTACT_PHONE=");
const end=script.indexOf('function renderAgentAnswer(value){',begin);
assert(begin>=0&&end>begin,'Contact helpers must exist');

function node(tag,value,className){
 return {tag,textContent:value,className,attrs:{},children:[],
  setAttribute(k,v){this.attrs[k]=v},append(...parts){this.children.push(...parts)},
  set href(value){this.attrs.href=value},get href(){return this.attrs.href}};
}
const context={text:node};
vm.createContext(context);
vm.runInContext(script.slice(begin,end)+
 'globalThis.contact={shouldOfferContact,renderContactActions,CONTACT_PHONE,CONTACT_EMAIL}',context);
const {shouldOfferContact,renderContactActions,CONTACT_PHONE,CONTACT_EMAIL}=context.contact;
assert.equal(CONTACT_PHONE,'+447344383739');
assert.equal(CONTACT_EMAIL,'aabdulfataijamiu@gmail.com');

for(const [question,expected] of [
 ["What are his weaknesses?",true],
 ["Where could he improve?",true],
 ["How do I contact Jamiu?",true],
 ["Can I call him?",true],
 ["May I send him an email?",true],
 ["Is he available for freelance projects?",true],
 ["Let's arrange an interview",true],
 ["Would you like to work with him?",true],
 ["What are the weaknesses of this project?",false],
 ["Explain the banking case study",false],
 ["Describe Vista Digital Banking",false],
]){
 assert.equal(shouldOfferContact(question),expected,question);
}
const card=renderContactActions();
assert.equal(card.attrs['aria-label'],'Contact Jamiu');
assert.equal(card.children[1].children.length,4);
const [phone,email]=card.children[1].children;
assert.equal(phone.href,'tel:+447344383739');
assert(email.href.startsWith('mailto:aabdulfataijamiu@gmail.com?subject='));
assert.equal(phone.children[1].children[1].textContent,'+44 7344 383739');
assert.equal(email.children[1].children[1].textContent,CONTACT_EMAIL);
assert(styles.includes('.agent-contact-links'),'Actions are styled for both modes');
assert(styles.includes('.agent-contact-link:focus-visible'),'Keyboard links are accessible');
assert(styles.includes('@media(max-width:991px)'),'Mobile viewport styles exist');
assert(script.includes('shouldOfferContact(previousQuestion)'),'Contact links survive chat restoration');
assert(script.includes('contact:offerContact'),'Contact visibility is saved per reply');
assert(knowledge.find(r=>r.id==='about').text.includes(CONTACT_PHONE));
console.log('Contextual call and email links, mobile actions, and restored messages passed.');

