(()=>{'use strict';
if(window.__askJamiuMounted)return;
window.__askJamiuMounted=true;
const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='/assets/ask-jamiu.css?v=20261013-fitted-cloud';document.head.appendChild(sheet);
const SESSION_KEY='ask-jamiu-chat-v1';
const suggestions={
  home:["Which projects match a Product Designer role?","What was hard about Horal?","Show me your banking work","Compare my experience with a job"],
  project:["What was your role here?","What was the hard part?","What did you learn?","Show me another project"],
  general:["Which project should I start with?","How do you work with developers?","Compare my experience with a job","What have you learned?"]
};
const sourceInfo={
  syncai:['SyncAI','/work/syncai'],
  horal:['Horal','/work/horal'],
  pay4me:['Radius / Pay4Me','/work/pay4me'],
  'vista-itss':['Vista Digital Banking','/work/vista-itss'],
  bizinc:['Bizinc','/work/bizinc'],
  'kremor-ai':['Kremor AI','/work/kremor-ai'],
  'chalant-ai':['Chalant AI','/work/chalant-ai'],
  'archi-tek':['Archi-Tek','/work/archi-tek'],
  'shortlet-lagos':['Shortlet Lagos','/work/shortlet-lagos'],
  'loan-investment-app':['Loan & Investment App','/work/loan-investment-app'],
  'project-management-dashboard':['Reporting Portal','/work/project-management-dashboard'],
  arete:['Arete','/work/arete'],settle:['Settle','/work/settle'],
  synqit:['Synqit','/work/synqit'],about:['About me','/about'],
  cv:['About me','/about'],credentials:['Credentials','/credentials'],
  brand:['Brand & Identity','/brand'],logos:['Brand & Identity','/brand'],
  system:['Design systems','/system'],'technical-skills':['Design systems','/system'],
  'ai-practice':['AI practice','/ai']
};
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const icon=()=>'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a2 2 0 0 1 2 2v1a6 6 0 0 1 4 5.66V15a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-3.34A6 6 0 0 1 10 6V5a2 2 0 0 1 2-2Z"/><path d="M9 12h.01M15 12h.01M9 16c1.7 1.15 4.3 1.15 6 0M4 12v3m16-3v3"/></svg>';
const launch=el('button','aj-launch');launch.type='button';launch.setAttribute('aria-haspopup','dialog');launch.setAttribute('aria-controls','aj-dialog');launch.setAttribute('aria-label','Chat with Ask Jamiu, my AI portfolio version');
launch.innerHTML='<img class="aj-launch-portrait" src="/assets/jamiu-ai-avatar.webp" width="154" height="192" alt=""><span class="aj-launch-bubble" aria-hidden="true">Talk to Jamiu’s AI</span>';
launch.setAttribute('aria-label', 'Talk to Jamiu’s AI');
const dialog=el('dialog','aj-dialog');dialog.id='aj-dialog';dialog.setAttribute('aria-labelledby','aj-title');dialog.setAttribute('aria-describedby','aj-disclosure');
dialog.innerHTML='<div class="aj-shell"><header class="aj-header"><div class="aj-identity"><span class="aj-avatar"><img src="/assets/jamiu-ai-avatar.webp" alt="" width="154" height="192"></span><div><p class="aj-eyebrow">A DIFFERENT WAY TO EXPLORE MY WORK</p><h2 id="aj-title">Ask Jamiu<span class="aj-title-dot">.</span></h2></div></div><div class="aj-header-actions"><button class="aj-reset" type="button" title="Start a new conversation">New chat</button><button class="aj-close" type="button" aria-label="Close Ask Jamiu">×</button></div></header><section class="aj-intro"><span class="aj-live-dot" aria-hidden="true"></span><p id="aj-disclosure"><strong>My AI portfolio version.</strong> It speaks in my voice using published work. It isn\'t a live chat with me.</p></section><div class="aj-scroller" id="aj-scroller"><div class="aj-conversation" role="log" aria-label="Ask Jamiu conversation" aria-live="polite" aria-relevant="additions"></div><div class="aj-suggestions"></div><p class="aj-status" role="status" aria-live="polite"></p></div><form class="aj-composer"><label for="aj-question">Your question</label><div class="aj-input-wrap"><textarea id="aj-question" rows="1" maxlength="3500" placeholder="Ask me about my work or paste a job description..." aria-label="Ask Jamiu a question"></textarea><button type="submit" class="aj-send" aria-label="Send message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 16-7-7 16-2.5-6.5L4 11Zm6.5 2.5L20 4"/></svg></button></div><p class="aj-footnote">Built on my portfolio. For a real conversation, <a href="/contact">contact me</a>.</p></form></div>';
document.body.append(launch,dialog);

const closeBtn=dialog.querySelector('.aj-close'),resetBtn=dialog.querySelector('.aj-reset'),log=dialog.querySelector('.aj-conversation'),chips=dialog.querySelector('.aj-suggestions'),form=dialog.querySelector('.aj-composer'),field=dialog.querySelector('textarea'),sendBtn=dialog.querySelector('.aj-send'),status=dialog.querySelector('.aj-status'),scroller=dialog.querySelector('.aj-scroller');
let turns=[],busy=false,activeController=null,opener=null;
function save(){try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({turns:turns.slice(-24),draft:field.value.slice(0,3500)}));}catch{}}
function restore(){try{const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'{}');turns=(Array.isArray(saved.turns)?saved.turns:[]).filter(v=>v&&['user','assistant'].includes(v.role)&&typeof v.text==='string').slice(-24);field.value=typeof saved.draft==='string'?saved.draft.slice(0,3500):'';}catch{turns=[];}}
function currentSuggestions(){return location.pathname.startsWith('/work/')?suggestions.project:location.pathname==='/work'||location.pathname==='/'?suggestions.home:suggestions.general;}
function scrollDown(){requestAnimationFrame(()=>{scroller.scrollTop=scroller.scrollHeight;});}
// Parse basic Markdown as DOM nodes. Model text never becomes executable HTML.
function appendInline(target,value,rich){
  const text=String(value||'');
  if(!rich){target.append(document.createTextNode(text));return;}
  const pattern=/\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;
  let match,last=0;
  while((match=pattern.exec(text))){
    if(match.index>last)target.append(document.createTextNode(text.slice(last,match.index)));
    target.append(el(match[1]?'strong':'em','',match[1]||match[2]));
    last=pattern.lastIndex;
  }
  if(last<text.length)target.append(document.createTextNode(text.slice(last)));
}
function textBlocks(target,value,rich=false){
  const lines=String(value||'').replace(/\r\n?/g,'\n').trim().split('\n');
  let paragraph=[],list=null;
  function flushParagraph(){
    if(!paragraph.length)return;
    const p=el('p');
    appendInline(p,paragraph.join(rich?' ':'\n'),rich);
    target.append(p);paragraph=[];
  }
  function flushList(){if(list){target.append(list);list=null;}}
  for(const raw of lines){
    const line=raw.trim();
    if(!line){flushParagraph();flushList();continue;}
    const bullet=rich&&line.match(/^[-*•]\s+(.+)$/);
    const numbered=rich&&line.match(/^\d+[.)]\s+(.+)$/);
    if(bullet||numbered){
      flushParagraph();
      const tag=bullet?'ul':'ol';
      if(list&&list.tagName.toLowerCase()!==tag)flushList();
      if(!list)list=el(tag);
      const item=el('li');
      appendInline(item,(bullet||numbered)[1],true);
      list.append(item);
      continue;
    }
    flushList();
    const heading=rich&&line.match(/^#{1,4}\s+(.+)$/);
    if(heading){
      flushParagraph();
      const title=el('p','aj-message-heading');
      appendInline(title,heading[1],true);
      target.append(title);
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();flushList();
}
function addSources(parent,ids){const items=[...new Set(Array.isArray(ids)?ids:[])].filter(id=>sourceInfo[id]).slice(0,3);if(!items.length)return;const wrap=el('div','aj-sources');wrap.append(el('span','aj-sources-label','Explore the work'));for(const id of items){const info=sourceInfo[id];const a=el('a','aj-source',info[0]+'  ');a.href=info[1];a.setAttribute('aria-label','Open '+info[0]+' case study or page');wrap.append(a);}parent.append(wrap);}
function drawTurn(turn){const article=el('article','aj-message '+(turn.role==='user'?'aj-message-user':'aj-message-agent'));const name=el('span','aj-message-name',turn.role==='user'?'You':'Jamiu AI');article.append(name);const body=el('div','aj-message-body');textBlocks(body,turn.text,turn.role==='assistant');article.append(body);if(turn.role==='assistant')addSources(article,turn.source_ids);log.append(article);}
function drawWelcome(){const hero=el('div','aj-welcome');hero.innerHTML='<span class="aj-welcome-mark">A LITTLE SHORTCUT</span><h3>Hello, nice to meet you.</h3><p>Looking for a particular project? Curious about how I design, or how I work with a team? Ask away. I\'ll keep it simple.</p>';log.append(hero);}
function redraw(){log.replaceChildren();for(const t of turns)drawTurn(t);if(!turns.length)drawWelcome();chips.replaceChildren();if(!turns.length){chips.append(el('p','aj-chips-label','A few things you could ask'));for(const sample of currentSuggestions()){const b=el('button','aj-chip',sample+' ');b.type='button';b.addEventListener('click',()=>{if(sample==='Compare my experience with a job'){field.value='How does my documented design experience match this role? Please be fair about gaps.\n\nJob description:\n';resize();field.focus();scrollDown();return;}send(sample);});chips.append(b);}}if(turns.length&&turns[turns.length-1].role==='assistant'&&turns[turns.length-1].text&&!turns[turns.length-1].failed){const more=el('button','aj-more','Tell me more ↓');more.type='button';more.addEventListener('click',()=>send('Tell me more',true));chips.append(more);}resetBtn.disabled=!turns.length;scrollDown();}
function resize(){field.style.height='auto';field.style.height=Math.min(field.scrollHeight,132)+'px';}
function setBusy(next){busy=next;sendBtn.disabled=next;field.disabled=next;chips.querySelectorAll('button').forEach(x=>x.disabled=next);dialog.classList.toggle('aj-busy',next);}
function open(){opener=document.activeElement;if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}else dialog.setAttribute('open','');launch.setAttribute('aria-expanded','true');document.body.classList.add('aj-dialog-open');redraw();resize();field.focus({preventScroll:true});}
function close(){if(dialog.open&&typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
launch.addEventListener('click',open);
closeBtn.addEventListener('click',close);
dialog.addEventListener('close',()=>{document.body.classList.remove('aj-dialog-open');launch.setAttribute('aria-expanded','false');save();(opener?.isConnected?opener:launch).focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
resetBtn.addEventListener('click',()=>{if(activeController)activeController.abort();turns=[];status.textContent='';setBusy(false);field.value='';save();redraw();field.focus();});
field.addEventListener('input',()=>{resize();save();});
field.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();form.requestSubmit();}});
form.addEventListener('submit',e=>{e.preventDefault();send(field.value);});
async function send(value,followUp=false){
  const question=String(value||'').trim().slice(0,3500);if(busy||!question)return;
  status.textContent='';const history=turns.filter(t=>!t.failed).slice(-24).map(t=>({role:t.role,text:t.text,source_ids:t.source_ids||[],evidence_ids:t.evidence_ids||[]}));
  const user={role:'user',text:question};turns.push(user);field.value='';save();redraw();setBusy(true);scrollDown();
  status.textContent='Looking through my work...';
  activeController=new AbortController();
  const timeout=setTimeout(()=>activeController?.abort(),33000);
  try{
    const response=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,history,follow_up:followUp,page_context:{pathname:location.pathname,hash:location.hash,title:document.title}}),credentials:'same-origin',signal:activeController.signal});
    const payload=await response.json().catch(()=>null);
    if(!response.ok||typeof payload?.answer!=='string')throw new Error('agent_unavailable');
    turns.push({role:'assistant',text:payload.answer,source_ids:payload.source_ids||[],evidence_ids:payload.evidence_ids||[]});status.textContent=payload.fallback?'From my published portfolio':'';save();redraw();
  }catch(error){
    turns.push({role:'assistant',text:'Sorry, I’m having trouble answering right now. You can still explore my projects or reach me through the contact page. Please try again in a moment.',source_ids:[],failed:true});
    status.textContent='Could not connect to the AI service.';save();redraw();
  }finally{clearTimeout(timeout);activeController=null;setBusy(false);resize();scrollDown();if(dialog.open)field.focus({preventScroll:true});}
}
restore();redraw();resize();
})();