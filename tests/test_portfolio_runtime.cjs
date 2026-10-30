/* Run with linkedom available in NODE_PATH; this test never contacts a provider. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {parseHTML}=require('linkedom');
const {document,window}=parseHTML(fs.readFileSync('index.html','utf8'));
let active=document.body,stored={},started=0,stopped=0;
Object.defineProperty(document,'activeElement',{get:()=>active,configurable:true});
window.HTMLElement.prototype.focus=function(){active=this};
window.HTMLElement.prototype.getClientRects=function(){return this.closest('[hidden]')?[]:[{}]};
window.HTMLElement.prototype.animate=function(){return {finished:Promise.resolve()}};
const ctx={window,document,navigator:{userAgent:'test'},matchMedia:()=>({matches:true}),localStorage:{setItem:(k,v)=>stored[k]=v},sessionStorage:{getItem:()=>true,setItem(){}},setInterval(){return 1},setTimeout(fn){fn();return 1},Intl,Date,CSS:{escape:x=>x},history:{state:{},replaceState(){}},location:{pathname:'/',search:'',hash:''}};
window.portfolioScroll={start(){started++},stop(){stopped++}};
vm.runInNewContext(fs.readFileSync('portfolio-runtime.js','utf8'),ctx);
function click(el){const event=new window.Event('click',{bubbles:true,cancelable:true});Object.defineProperty(event,'button',{value:0});el.dispatchEvent(event)}
function key(value){const event=new window.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperty(event,'key',{value});document.dispatchEvent(event)}
const toggle=document.querySelector('[data-theme-toggle]');click(toggle);assert.equal(stored.theme,'dark');assert(document.body.classList.contains('theme-dark'));click(toggle);assert.equal(stored.theme,'light');
assert.match(document.querySelector('[data-clock]').textContent,/\d\d:\d\d:\d\d UK/);
const modal=document.querySelector('[data-feed-modal]'),opener=document.querySelector('[data-feed-open]'),body=modal.querySelector('[data-feed-modal-body]');
const preserved=document.querySelector('aside');preserved.inert=true;
document.body.style.overflow='auto';opener.focus();click(opener);
assert.equal(modal.style.display,'flex');assert.equal(document.body.style.overflow,'hidden');assert.equal(stopped,1);assert(body.querySelector('h2'));assert(body.textContent.includes('Vista'));
click(modal.querySelector('[data-feed-next]'));assert(body.textContent.includes('Pay4Me'));
click(modal.querySelector('[data-feed-prev]'));assert(body.textContent.includes('Vista'));
key('Escape');assert.equal(modal.style.display,'none');assert.equal(document.body.style.overflow,'auto');assert.equal(started,1);assert.equal(active,opener);assert(preserved.inert,'pre-existing inert state must survive');
preserved.inert=false;
click(opener);click(modal.querySelector('[data-feed-close]'));assert.equal(document.body.style.overflow,'auto');assert.equal(started,2);
console.log('Native runtime: theme, UK clock, project open/next/previous/close, Escape, scroll and focus restoration passed.');
