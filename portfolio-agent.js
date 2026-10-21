(()=>{
const launcher=document.createElement('button');
launcher.className='portfolio-search-launch';
launcher.type='button';
launcher.innerHTML='<img src="/assets/db99cb95c28524de.png" width="36" height="36" alt=""><span class="sr-only">Chat with Jamiu’s portfolio agent</span>';
launcher.title='Chat about Jamiu’s work';
launcher.setAttribute('aria-label','Ask about Jamiu’s work');
launcher.setAttribute('aria-haspopup','dialog');
launcher.setAttribute('aria-expanded','false');
document.body.append(launcher);

const dialog=document.createElement('dialog');
dialog.className='portfolio-search';
dialog.setAttribute('aria-labelledby','portfolio-search-title');
dialog.innerHTML='<header class="search-heading"><div><span class="search-kicker">[A guide to the work]</span><h2 id="portfolio-search-title">Ask about Jamiu.</h2></div><button type="button" class="search-close" aria-label="Close portfolio agent"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15"/></svg></button></header><p class="search-mode"><span class="agent-dot" aria-hidden="true"></span><span>AI guide to the published portfolio.</span></p><div class="search-conversation" data-lenis-prevent role="log" aria-label="Portfolio conversation" aria-live="polite" aria-relevant="additions"><p class="search-welcome">A question is a good place to start.</p></div><form class="search-form"><label for="portfolio-question">Ask about the work, the decisions or the person behind it.</label><div><textarea id="portfolio-question" rows="1" maxlength="700" placeholder="Ask anything about Jamiu’s work" autocomplete="off" enterkeyhint="send" aria-label="Message the portfolio agent"></textarea><button type="submit" aria-label="Send question"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button></div></form>';
document.body.append(dialog);

const conversation=dialog.querySelector('.search-conversation');
const input=dialog.querySelector('textarea');
input.setAttribute('data-lenis-prevent','');
const form=dialog.querySelector('form');
const submit=form.querySelector('button');
let records;
let roleDescription="";
let selectedProofId="",proofRequest=0;
const proofCache=new Map();
let loading;
let lastProject;
let history=[];
let busy=false;
let inputVocabulary;
const SESSION_KEY='jamiu-agent-session-v2';
let turns=[];
let originContext=null;
let originUrl='';
const welcomeLines=[
 'What would you like to know?',
 'Have a role in mind? Let’s talk about it.',
 'Looking for a particular kind of experience?',
 'Curious about a project? Ask away.',
 'What matters most in your next designer?',
 'Let’s find the work that’s relevant to you.'
];
let welcomeIndex=Math.floor(Math.random()*welcomeLines.length);
function renderWelcome(){
 const state=text('div','','search-welcome-state');
 const emblem=text('div','','agent-welcome-emblem');emblem.setAttribute('aria-hidden','true');
 const icon=document.createElement('img');icon.src='/assets/db99cb95c28524de.png';icon.alt='';icon.width=64;icon.height=64;emblem.append(icon);
 const headline=text('p',welcomeLines[welcomeIndex],'search-welcome');headline.setAttribute('aria-hidden','true');
 const accessible=text('p','Ask about Jamiu’s work, experience or a role you’re hiring for.','sr-only');
 state.append(emblem,headline,accessible);conversation.replaceChildren(state);dialog.classList.remove('has-conversation');
}
renderWelcome();
setInterval(()=>{
 if(!dialog.open||document.hidden||dialog.classList.contains('has-conversation')||input.value.trim()||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const headline=conversation.querySelector('.search-welcome-state .search-welcome');if(!headline)return;
 welcomeIndex=(welcomeIndex+1+Math.floor(Math.random()*(welcomeLines.length-1)))%welcomeLines.length;
 headline.textContent=welcomeLines[welcomeIndex];
 headline.animate?.([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
},7500);
function saveConversation(){
  try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({version:1,updated:Date.now(),history,turns:turns.slice(-24),draft:input.value.slice(0,700),originContext,originUrl}));}catch{}
}
function restoreConversation(){
  try{
    const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');
    if(!saved||saved.version!==1||Date.now()-saved.updated>86400000)return;
    history=Array.isArray(saved.history)?saved.history.filter(t=>['user','assistant'].includes(t.role)&&typeof t.text==='string').slice(-8):[];
    turns=Array.isArray(saved.turns)?saved.turns.filter(t=>['user','assistant'].includes(t.role)&&typeof t.text==='string').slice(-24):[];
    originContext=saved.originContext&&typeof saved.originContext.pathname==='string'?saved.originContext:null;
    originUrl=typeof saved.originUrl==='string'&&saved.originUrl.startsWith('/')&&!saved.originUrl.startsWith('//')?saved.originUrl:'';
    input.value=typeof saved.draft==='string'?saved.draft.slice(0,700):'';resizeComposer();
    if(turns.length){dialog.classList.add('has-conversation');conversation.querySelector('.search-welcome-state')?.remove();conversation.replaceChildren();turns.forEach(turn=>{
      if(turn.role==='user')conversation.append(text('p',turn.text,'search-question'));
      else{const response=text('div','','search-answer');response.append(renderAgentAnswer(turn.text));if(turn.meta)response.append(text('p',turn.meta,'search-answer-meta'));const found=(turn.sourceIds||[]).map(id=>getRecord(id)).filter(Boolean);if(found.length)response.append(sourceCards(found));conversation.append(response);}
    });conversation.scrollTop=conversation.scrollHeight;}
  }catch{}
}
function resizeComposer(){
 const previous=input.getBoundingClientRect().height||44;
 input.style.transition='none';
 input.style.height='auto';
 const cap=Math.min(168,Math.max(88,(window.visualViewport?.height||innerHeight)*.24));
 const measured=input.scrollHeight;
 const next=Math.max(44,Math.min(measured,cap));
 input.style.height=previous+'px';
 void input.offsetHeight;
 input.style.removeProperty('transition');
 input.style.height=next+'px';
 input.style.overflowY=measured>cap?'auto':'hidden';
}
input.addEventListener('input',()=>{resizeComposer();saveConversation()});
input.addEventListener('keydown',event=>{
 if(event.key==='Enter'&&!event.shiftKey&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.isComposing){event.preventDefault();if(!busy&&input.value.trim())form.requestSubmit()}
});
addEventListener('resize',resizeComposer);

// Keep this conservative rule aligned with api/agent.py and the shared test cases.
const INPUT_CLARIFICATION="Keep typing, ask me anything about Jamiu’s work, experience, skills, or this page.";
const FRAGMENT_WORDS=new Set(["a", "an", "the", "i", "me", "my", "you", "your", "he", "his", "she", "her", "it", "its", "we", "our", "they", "their", "this", "that", "these", "those", "is", "are", "was", "were", "be", "been", "being", "am", "do", "does", "did", "can", "could", "would", "should", "will", "shall", "may", "might", "must", "of", "to", "for", "from", "in", "on", "at", "by", "with", "and", "or", "but", "if", "as", "about", "what", "which", "who", "whom", "whose", "when", "where", "how", "tell", "ask", "show", "please"]);
function portfolioVocabulary(items){
  const vocabulary=new Set(["hi", "hello", "hey", "thanks", "thank", "cheers", "yes", "no", "okay", "ok", "more", "why", "explain", "help", "cv", "ux", "ui", "ai", "js", "go", "pricing", "price", "salary", "availability", "available", "contact", "email", "phone", "remote", "freelance", "hiring", "hire", "resume", "r\u00e9sum\u00e9", "portfolio", "work", "skills", "experience", "projects", "process", "rates", "rate", "cost"]);
  items.forEach(record=>{
    const words=['id','title','summary','text'].map(field=>String(record[field]||'')).join(' ').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
    words.forEach(word=>vocabulary.add(word));
  });
  return vocabulary;
}
function needsClarification(value){
  if(/^(?:who is he|what does he do|what is (?:this|it))\s*[?!.]*$/i.test(String(value||'').trim()))return false;
  if(/\bc(?:\+\+|#)/i.test(String(value||'')))return false;
  const tokens=String(value||'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  return !tokens.some(token=>Array.from(token).length>1&&!FRAGMENT_WORDS.has(token)&&(!inputVocabulary||inputVocabulary.has(token)));
}

function text(tag,value,className){
  const el=document.createElement(tag);
  el.textContent=value;
  if(className)el.className=className;
  return el;
}

function cleanAgentOutput(value){
  return String(value||'')
    .replace(/https?:\/\/(?:www\.)?jamiuabdulfatai\.com(?=\/|\b)/gi,location.origin)
    .replace(/\u2014/g,', ')
    .replace(/<br\s*\/?\s*>/gi,'\n')
    .replace(/<[^>]+>/g,' ')
    .replace(/【[^】]{1,80}】/g,'')
    .replace(/\[\s*(?:about|credentials|cv|horal|pay4me|radius|bizinc|vista(?:-itss)?|kremor(?:-ai)?|chalant(?:-ai)?|synqit|archi-tek|arete|settle|shortlet-lagos|loan-investment-app|project-management-dashboard|brand|logos|system|technical-skills)\s*\]/gi,'')
    .replace(/[ \t]+\n/g,'\n')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function appendInline(parent,value){
  const input=String(value||'').replace(/\*\*\s*\*\*/g,'');
  const pattern=/\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s]+)/g;
  let cursor=0;
  let match;
  while((match=pattern.exec(input))){
    if(match.index>cursor)parent.append(document.createTextNode(input.slice(cursor,match.index)));
    if(match[1]){
      const strong=document.createElement('strong');
      strong.textContent=match[1].trim();
      parent.append(strong);
    }else{
      const anchor=document.createElement('a');
      anchor.href=match[3]||match[4];
      anchor.target='_blank';
      anchor.rel='noopener';
      anchor.textContent=match[2]||match[4];
      parent.append(anchor);
    }
    cursor=pattern.lastIndex;
  }
  if(cursor<input.length)parent.append(document.createTextNode(input.slice(cursor)));
}

function renderAgentAnswer(value){
  const body=text('div','','search-answer-body');
  const source=cleanAgentOutput(value);
  if(!source){
    body.append(text('p','I couldn’t produce a readable answer. Please try asking that another way.'));
    return body;
  }

  const lines=source.split('\n');
  const isTableLine=line=>/^\s*\|.*\|\s*$/.test(line);
  const isTableDivider=line=>/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim());
  let i=0;

  while(i<lines.length){
    const line=lines[i].trim();
    if(!line){i++;continue;}

    // Gracefully render a markdown table if a model ever returns one,
    // even though the prompt now asks it not to.
    if(isTableLine(lines[i])&&i+1<lines.length&&isTableDivider(lines[i+1])){
      const wrap=text('div','','agent-table-wrap');
      const table=document.createElement('table');
      const thead=document.createElement('thead');
      const tr=document.createElement('tr');
      cells(lines[i]).forEach(cell=>{
        const th=document.createElement('th');
        appendInline(th,cell);
        tr.append(th);
      });
      thead.append(tr);
      table.append(thead);
      i+=2;
      const tbody=document.createElement('tbody');
      while(i<lines.length&&isTableLine(lines[i])){
        const row=document.createElement('tr');
        cells(lines[i]).forEach(cell=>{
          const td=document.createElement('td');
          appendInline(td,cell);
          row.append(td);
        });
        tbody.append(row);
        i++;
      }
      table.append(tbody);
      wrap.append(table);
      body.append(wrap);
      continue;
    }

    const heading=line.match(/^(#{1,4})\s+(.+)$/);
    if(heading){
      const h=document.createElement(heading[1].length<=2?'h3':'h4');
      appendInline(h,heading[2]);
      body.append(h);
      i++;
      continue;
    }

    if(/^[-*•]\s+/.test(line)){
      const ul=document.createElement('ul');
      while(i<lines.length&&/^[-*•]\s+/.test(lines[i].trim())){
        const li=document.createElement('li');
        appendInline(li,lines[i].trim().replace(/^[-*•]\s+/,''));
        ul.append(li);
        i++;
      }
      body.append(ul);
      continue;
    }

    if(/^\d+[.)]\s+/.test(line)){
      const ol=document.createElement('ol');
      while(i<lines.length&&/^\d+[.)]\s+/.test(lines[i].trim())){
        const li=document.createElement('li');
        appendInline(li,lines[i].trim().replace(/^\d+[.)]\s+/,''));
        ol.append(li);
        i++;
      }
      body.append(ol);
      continue;
    }

    const paragraph=[];
    while(i<lines.length){
      const current=lines[i].trim();
      if(!current){i++;break;}
      if(paragraph.length&&(
        /^#{1,4}\s+/.test(current)||
        /^[-*•]\s+/.test(current)||
        /^\d+[.)]\s+/.test(current)||
        (isTableLine(lines[i])&&i+1<lines.length&&isTableDivider(lines[i+1]))
      ))break;
      paragraph.push(current.replace(/^\|\s*|\s*\|$/g,''));
      i++;
    }
    const p=document.createElement('p');
    appendInline(p,paragraph.join(' '));
    body.append(p);
  }

  return body;
}

const stop=new Set('a an the i you your me my what how did do does is are was were at in on to of and for about show tell can could would should has have had with it this that these those please he him his she her hers they them their theirs who whom jamiu abdulfatai really very just'.split(' '));

function tokens(q){
  return String(q||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(t=>t.length>1&&!stop.has(t));
}

function recentUserContext(q){
  const current=String(q||'').trim();
  if(asksAboutCurrentPage(current)||!history.length)return current;
  const followup=/^(?:more|why|(?:tell me |explain |show me )?more(?: about (?:it|that|this))?|(?:what|how|why|can|does|did|is|are|was|were)\b.{0,100}\b(?:it|that|this|those|them|their)\b.*)[?!.]*$/i;
  if(!followup.test(current))return current;
  const words=new Set(current.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
  if(records?.some(record=>words.has(record.id)))return current;
  const previous=history.filter(item=>item.role==='user'&&item.text).slice(-2).map(item=>item.text);
  return [...previous,current].join(' ');
}

function getRecord(id){
  return records.find(record=>record.id===id);
}

function uniqueRecords(items){
  const seen=new Set();
  return items.filter(record=>record&&!seen.has(record.id)&&(seen.add(record.id),true));
}

function recordScore(record,q){
  const query=recentUserContext(q);
  const words=tokens(query);
  if(!words.length)return 0;

  const title=record.title.toLowerCase();
  const summary=record.summary.toLowerCase();
  const body=record.text.toLowerCase();
  const id=record.id.replace(/-/g,' ');
  let score=0;

  words.forEach(word=>{
    if(title.includes(word))score+=12;
    if(id.includes(word))score+=10;
    if(summary.includes(word))score+=5;
    const hits=body.split(word).length-1;
    score+=Math.min(hits,6);
  });

  const phrase=query.toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
  if(phrase.length>3){
    if(title.includes(phrase))score+=30;
    if(summary.includes(phrase))score+=12;
    if(body.includes(phrase))score+=8;
  }

  return score;
}

const domainProofRoutes=[
  {terms:['branding','brand identity','brand design','graphic design','graphics design','graphic designer','visual identity','visual design','pitch deck','pitch decks','collateral','brand guideline','brand guidelines'],ids:['brand','logos','credentials']},
  {terms:['logo','logos','logo design','logomark','wordmark','mark design'],ids:['logos','brand','credentials']},
  {terms:['design system','design systems','component library','component libraries','design tokens','tokens','ui kit','ui kits','style guide','style guides','design foundation','design foundations','component','components'],ids:['system','vista-itss','bizinc','shortlet-lagos']},
  {terms:['ui design','interface design','user interface','visual ui','ui designer'],ids:['system','horal','bizinc','vista-itss','credentials']},
  {terms:['ux design','user experience','ux designer','product design','product designer','user journey','user journeys','wireframe','wireframes','prototype','prototyping','usability','user research','research'],ids:['settle','synqit','horal','kremor-ai','credentials']},
  {terms:['fintech','banking','bank','payment','payments','financial product','financial products','cross-border payment','cross border payment','lending','loan','investment'],ids:['pay4me','vista-itss','loan-investment-app']},
  {terms:['marketplace','b2b2c','ecommerce','e-commerce','commerce','seller','buyer','booking platform','two-sided','two sided'],ids:['horal','bizinc','shortlet-lagos','synqit']},
  {terms:['artificial intelligence','generative ai','gen ai','ai product','ai products','ai design','ai tool','ai tools','llm','agentic','ai agent','ai agents','langgraph','lang graph','huggingface','hugging face'],ids:['technical-skills','kremor-ai','chalant-ai','synqit','archi-tek','credentials']},
  {terms:['coding','code','front-end development','frontend development','html','css','javascript','react','react js','react.js','c sharp','c#','python','programming'],ids:['technical-skills','system','credentials']},
  {terms:['healthcare','healthtech','health tech','medical','care platform'],ids:['arete']},
  {terms:['service design','service platform','service platforms','student experience','relocation','onboarding journey'],ids:['settle','arete','pay4me']},
  {terms:['responsive design','responsive','mobile design','web design','mobile app','web app','front end','frontend'],ids:['technical-skills','system','horal','shortlet-lagos','pay4me']},
  {terms:['leadership','design leadership','manager','management','team leadership','mentoring','mentor'],ids:['bizinc','credentials']},
  {terms:['developer collaboration','engineering collaboration','handoff','developer handoff','working with developers','work with developers'],ids:['credentials','bizinc','vista-itss','system']},
  {terms:['accessibility','accessible','inclusive design'],ids:['system','credentials','arete']},
  {terms:['typography','hierarchy','navigation design'],ids:['system','credentials','brand']},
  {terms:['award','awards','certification','certifications','credential','credentials','recommendation','recommendations','reference','references','testimonial','testimonials','recognition'],ids:['credentials']}
];

function domainProofRecords(q){
  const context=recentUserContext(q).toLowerCase();
  const ids=[];
  domainProofRoutes.forEach(route=>{
    if(route.terms.some(term=>context.includes(term))){
      route.ids.forEach(id=>{if(!ids.includes(id))ids.push(id)});
    }
  });
  return ids.map(id=>getRecord(id)).filter(Boolean);
}

function rank(q){
  const pageRecord=currentPageRecord();
  if(pageRecord&&asksAboutCurrentPage(q))return [pageRecord];

  const domain=domainProofRecords(q);
  if(domain.length)return uniqueRecords(domain).slice(0,6);

  const named=records.filter(r=>q.toLowerCase().includes(r.title.toLowerCase())||q.toLowerCase().includes(r.id.replace(/-/g,' ')));
  if(named.length)return uniqueRecords(named).slice(0,3);
  if(/experience|skills|background|career|education|what kind of|who is|about jamiu/i.test(q))return uniqueRecords([getRecord('about'),getRecord('credentials'),getRecord('bizinc')]);
  const scored=records.map(record=>({record,score:recordScore(record,q)}))
    .sort((a,b)=>b.score-a.score);

  const topScore=scored[0]?.score||0;
  const useful=scored.filter(item=>item.score>0).slice(0,5).map(item=>item.record);
  const context=tokens(recentUserContext(q));

  if(topScore<5||context.length<=1){
    return uniqueRecords([getRecord('about'),getRecord('credentials'),lastProject,...useful]).slice(0,6);
  }

  return uniqueRecords([...useful,getRecord('about')]).slice(0,6);
}

function scoredChunks(record,q){
  const query=recentUserContext(q);
  const words=tokens(query);
  return record.text.split(/\n/).filter(Boolean).map((value,index)=>{
    const lower=value.toLowerCase();
    let score=0;
    words.forEach(word=>{
      const hits=lower.split(word).length-1;
      score+=Math.min(hits,4);
    });
    return {value,index,score};
  }).sort((a,b)=>b.score-a.score||a.index-b.index);
}

function excerpt(record,q){
  const chosen=scoredChunks(record,q)[0]?.value||record.summary;
  const clean=chosen.replace(/^\d+\s+[^:]+:\s*/,'');
  if(clean.length<=620)return clean;
  const end=clean.slice(0,620).lastIndexOf('. ');
  return clean.slice(0,end>200?end+1:600)+(end>200?'':'…');
}

function evidence(record,q){
  const chunks=record.text.split(/\n/).filter(Boolean);
  if(!chunks.length)return record.summary;

  const selected=[];
  const add=value=>{
    if(value&&!selected.includes(value))selected.push(value);
  };

  // Give the model a representative slice of every case study, regardless of wording.
  add(chunks[0]);
  add(chunks[1]);
  add(chunks.find(value=>/impact|outcome|evidence|limits/i.test(value)));
  add(chunks.find(value=>/validate next|test next|would validate/i.test(value)));

  // Add the sections whose language is closest to the current conversation.
  scoredChunks(record,q).slice(0,2).forEach(item=>add(item.value));

  const compact=selected.map(value=>value.replace(/^\d+\s+[^:]+:\s*/,'')).join('\n');
  return (record.summary+'\n'+compact).slice(0,2800);
}
async function getRecords(){
  if(records)return records;
  if(!loading){
    loading=Promise.all([
      fetch('/portfolio-knowledge.json?v=20261021-agent').then(response=>{if(!response.ok)throw Error();return response.json()}),
      fetch('/technical-capabilities.json?v=20261021-agent').then(response=>{if(!response.ok)throw Error();return response.json()})
    ])
      .then(([portfolio,technical])=>records=[...portfolio.filter(record=>record.id!==technical.id),technical])
      .catch(error=>{loading=null;throw error});
  }
  return loading;
}

// Resolve work mentioned by name in the assistant's answer; avoid stale previews.
function projectsInAnswer(answer,question){
 if(!records||!/\b(project|work|portfolio|case stud|show|preview|open|view|best|strongest|b2b|fintech|marketplace|design)\b/i.test(question))return [];
 const lower=cleanAgentOutput(answer).toLowerCase();
 const aliases={'vista-itss':['vista digital banking','vista banking','vista'],
   'pay4me':['radius / pay4me','radius','pay4me'],
   'archi-tek':['archi-tek','architek'],
   'kremor-ai':['kremor ai','kremor'],
   'chalant-ai':['chalant ai','chalant']};
 return records.filter(record=>record.url.startsWith('/work/')).map(record=>{
  const names=[record.title.toLowerCase(),...(aliases[record.id]||[])];
  const positions=names.map(name=>{
   const at=lower.indexOf(name);if(at<0)return -1;
   const before=lower[at-1]||' ',after=lower[at+name.length]||' ';
   return /[a-z0-9]/.test(before)||/[a-z0-9]/.test(after)?-1:at;
  }).filter(at=>at>=0);
  const urlAt=lower.indexOf(record.url.toLowerCase());
  if(urlAt>=0)positions.push(urlAt);
  return {record,index:positions.length?Math.min(...positions):-1};
 }).filter(item=>item.index>=0).sort((a,b)=>a.index-b.index).slice(0,3).map(item=>item.record);
}
function sourceCards(found){
 const cards=text('div','','search-results');
 uniqueRecords(found).forEach(record=>{
  const link=document.createElement('a');link.href=record.url;link.className='search-result';
  link.setAttribute('aria-label',dockViewport.matches?'Preview '+record.title:'Open '+record.title);
  link.addEventListener('click',event=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   if(dockViewport.matches){
    event.preventDefault();
    if(chatView==='docked')setChatView('focused');
    showProof(record);
   }else closeAgent();
  });
  if(record.image){
   const image=document.createElement('img');image.src=record.image;image.alt='';image.loading='lazy';link.append(image);
  }else link.append(text('span',record.title.slice(0,1),'search-monogram'));
  const copy=text('div');
  copy.append(text('strong',record.title),text('span',record.summary),
    text('span',dockViewport.matches?'Select to preview ↗':'Open case study ↗','agent-source-action'));
  link.append(copy);cards.append(link);
 });
 return cards;
}

function normaliseCurrentPath(value){
  const path=String(value||'/').split('?')[0].replace(/\/+$/,'');
  return path||'/';
}

function activeProjectPath(){
 const open=document.querySelector('[data-feed-modal]');
 if(!open||open.getAttribute('aria-hidden')==='true'||getComputedStyle(open).display==='none')return '';
 const slug=open.querySelector('[data-detail-tabs]')?.getAttribute('data-detail-tabs');
 return slug?'/work/'+slug+'/':'';
}
function currentPageRecord(){
  if(!records)return null;
  if(selectedProofId&&chatView==='focused'&&dockViewport.matches)return getRecord(selectedProofId);
  if(window.location.hash==='#ai-practice')return getRecord('ai-practice');
  const modalRecord=records.find(record=>record.url===activeProjectPath());if(modalRecord)return modalRecord;
  const current=normaliseCurrentPath(window.location.pathname);
  const currentHash=window.location.hash||'';
  const exactHash=records.find(record=>{
    try{
      const url=new URL(record.url,window.location.origin);
      return currentHash&&url.hash===currentHash&&normaliseCurrentPath(url.pathname)===current;
    }catch{return false}
  });
  if(exactHash)return exactHash;
  return records.find(record=>{
    try{
      const url=new URL(record.url,window.location.origin);
      if(/\.pdf$/i.test(url.pathname))return false;
      return !url.hash&&normaliseCurrentPath(url.pathname)===current;
    }catch{
      return false;
    }
  })||records.find(record=>{
    try{
      const url=new URL(record.url,window.location.origin);
      return normaliseCurrentPath(url.pathname)===current;
    }catch{return false}
  })||null;
}

function currentPageContext(){
  const record=currentPageRecord();
  return {
    page_id:record?.id||'',
    pathname:selectedProofId&&chatView==='focused'&&record?new URL(record.url,location.origin).pathname:activeProjectPath()||window.location.pathname,
    hash:window.location.hash||'',
    title:document.title||record?.title||'',
    record_title:record?.title||''
  };
}

function asksAboutCurrentPage(q){
  return /\b(this project|this page|this screen|this section|current page|what am i looking at|what is this page|what's this page|tell me about this|explain this page|explain this screen|what does this mean|what is this about|what's this about)\b/i.test(String(q||''));
}

async function askAgent(question){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),55000);
  try{
    const response=await fetch('/api/agent',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question,
        job_description:roleDescription,
        history:history.slice(-10),
        page_context:currentPageContext()
      }),
      signal:controller.signal
    });
    let data={};
    try{data=await response.json()}catch{}
    if(!response.ok||!data.answer){
      const error=new Error(data.error||'Agent unavailable');
      error.code=data.code||'agent-unavailable';
      throw error;
    }
    return {
      answer:data.answer,
      sourceIds:Array.isArray(data.source_ids)?data.source_ids:[],
      model:data.model||''
    };
  }finally{
    clearTimeout(timer);
  }
}
function localAnswer(found,q){
  if(!found.length)return 'I couldn’t find matching published information. Try a project name or ask about Jamiu’s experience.';
  const pageRecord=currentPageRecord();
  if(pageRecord&&asksAboutCurrentPage(q))return pageRecord.title+': '+pageRecord.summary;
  return found.slice(0,2).map(record=>record.title+': '+excerpt(record,q)).join('\n\n');
}
function showInputClarification(q){
  dialog.classList.add('has-conversation');conversation.querySelector('.search-welcome-state')?.remove();
  if(q){conversation.append(text('p',q,'search-question'));turns.push({role:'user',text:q});}
  const response=text('div','','search-answer');
  response.append(renderAgentAnswer(INPUT_CLARIFICATION));
  conversation.append(response);
  turns.push({role:'assistant',text:INPUT_CLARIFICATION});saveConversation();
  conversation.scrollTop=response.offsetTop-conversation.offsetTop;
  input.focus({preventScroll:true});
}
async function ask(q){
  q=q.trim();if(!q)return;
   dialog.dispatchEvent(new CustomEvent('agent-question'));
  if(busy)return;
  if(needsClarification(q)){
    showInputClarification(q);
    return;
  }
  dialog.classList.add('has-conversation');conversation.querySelector('.search-welcome-state')?.remove();
  busy=true;
  submit.disabled=true;dialog.querySelector('.search-clear').disabled=true;conversation.setAttribute('aria-busy','true');
  conversation.append(text('p',q,'search-question'));
  turns.push({role:'user',text:q});

  const response=text('div','','search-answer is-thinking');
  response.append(text('p','Looking through the portfolio…'));
  conversation.append(response);
  input.value='';resizeComposer();

  try{
    await getRecords();
    if(!inputVocabulary)inputVocabulary=portfolioVocabulary(records);
    if(needsClarification(q)){
      input.value=q;
      response.classList.remove('is-thinking');
      response.replaceChildren(renderAgentAnswer(INPUT_CLARIFICATION));
      turns.push({role:'assistant',text:INPUT_CLARIFICATION});saveConversation();
      input.focus({preventScroll:true});
      return;
    }
    const found=rank(q);
    const fallbackRecords=asksAboutCurrentPage(q)?found:found.filter(record=>recordScore(record,q)>0);
    const fallback=localAnswer(fallbackRecords,q);
    let answer=fallback;
    let usedAgent=false;
    let evidenceCards=[];

    try{
      const result=await askAgent(q);
      answer=result.answer;
      usedAgent=true;
      evidenceCards=result.sourceIds.map(id=>getRecord(id)).filter(Boolean).slice(0,2);
    }catch(error){
      answer=roleDescription?'I couldn’t complete the role comparison right now. Please try again shortly. Your description is still available to review.':fallback;
      response.dataset.agentError=error?.code||'agent-unavailable';
    }

    // Suggestions are clickable choices, never an automatic preview.
    const mentionedProjects=projectsInAnswer(answer,q);
    if(mentionedProjects.length){
      evidenceCards=uniqueRecords([...mentionedProjects,...evidenceCards.filter(record=>record.url.startsWith('/work/'))]).slice(0,3);
      if(dockViewport.matches&&chatView==='focused')clearProofForSuggestions();
    }
    response.classList.remove('is-thinking');
    response.replaceChildren();
    response.append(renderAgentAnswer(answer));

    const hasEvidence=usedAgent&&evidenceCards.length>0;
    const meta=text(
      'p',
      usedAgent
        ? (hasEvidence?'Supporting portfolio evidence is linked below.':'Portfolio conversation.')
        : (roleDescription?'Role comparison is temporarily unavailable.':'Live chat is unavailable right now. These are matching excerpts from the portfolio.'),
      'search-answer-meta'
    );
    dialog.querySelector('.search-mode>span:last-child').textContent=usedAgent
      ? (hasEvidence?'Portfolio conversation · Supporting evidence below.':'Portfolio conversation')
      : 'Portfolio search · Live chat temporarily unavailable.';
    if(!usedAgent)response.append(meta);

    if(evidenceCards.length){
      lastProject=evidenceCards.find(record=>!['about','credentials','cv'].includes(record.id))||evidenceCards[0];
      response.append(text('span',mentionedProjects.length?'Choose a project to preview':'Portfolio proof','search-kicker'));
      response.append(sourceCards(evidenceCards));
    }

    turns.push({role:'assistant',text:answer,sourceIds:evidenceCards.map(r=>r.id),meta:meta.textContent});
    dialog.dispatchEvent(new CustomEvent('agent-answer',{detail:{answer,usedAgent}}));

    // Search excerpts are not model replies and must not steer later conversation.
    if(usedAgent){
      history.push({role:'user',text:q},{role:'assistant',text:answer});
      history=history.slice(-8);
    }
  }catch{
    response.classList.remove('is-thinking');
    response.replaceChildren(text('p','The portfolio index could not load. Please try again, or browse selected work from the menu.'));
  }finally{
    busy=false;
    submit.disabled=false;dialog.querySelector('.search-clear').disabled=false;conversation.setAttribute('aria-busy','false');
    saveConversation();
    conversation.scrollTop=response.offsetTop-conversation.offsetTop;
  }
}

const reduceAgentMotion=matchMedia('(prefers-reduced-motion:reduce)');
let closingAgent=false;
let savedOverflow='';
let chatView='focused';
const dockViewport=matchMedia('(min-width:992px)');
const profile=document.querySelector('.home-panel_component');
let profileScroll=0;
const windowControls=text('div','','search-window-controls');
const closeButton=dialog.querySelector('.search-close');
const viewButton=text('button','','search-view-toggle');viewButton.type='button';
windowControls.append(viewButton,closeButton);dialog.querySelector('.search-heading').append(windowControls);
function syncViewControl(){
 viewButton.hidden=!dockViewport.matches||!profile;
 const docked=chatView==='docked';
 document.querySelectorAll('[data-feed-modal]').forEach(modal=>modal.setAttribute('aria-modal',String(!docked)));
 viewButton.setAttribute('aria-label',docked?'Expand chat to centred view':'Dock chat on the left and browse projects');
 viewButton.title=docked?'Expand chat':'Browse alongside projects';
 viewButton.setAttribute('aria-pressed',String(docked));
 viewButton.innerHTML=docked?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 4v16M7 9l-2 3 2 3"/></svg>';
}
function positionDock(){
 if(chatView!=='docked'||!profile||!dialog.open)return;
 const rect=profile.getBoundingClientRect();
 const edge=16;
 const top=edge,left=Math.max(edge,rect.left+edge);
 const width=Math.max(240,rect.width-edge*2);
 const height=Math.max(240,innerHeight-edge*2);
 for(const [key,value] of Object.entries({left,top,width,height}))dialog.style.setProperty('--agent-dock-'+key,value+'px');
 document.body.style.setProperty('--agent-project-left',Math.max(0,rect.right)+'px');
}
function setChatView(next){
 if(next==='docked'&&(!dockViewport.matches||!profile))next='focused';
 if(next===chatView||!dialog.open){syncViewControl();return;}
 const before=dialog.getBoundingClientRect(),focus=document.activeElement,conversationScroll=conversation.scrollTop;
 // Reopen the same dialog without rebuilding it: draft, messages and scroll survive.
 dialog.close();chatView=next;
 const docked=next==='docked';
 dialog.classList.toggle('is-docked',docked);document.body.classList.toggle('agent-is-docked',docked);
 dialog.inert=false;
 if(docked){
  profileScroll=profile.scrollTop;profile.scrollTop=0;
  document.body.style.overflow=savedOverflow;dialog.show();positionDock();
 }else{
  if(profile)profile.scrollTop=profileScroll;
  dialog.showModal();document.body.style.overflow='hidden';
 }
 if(fullScreenViewport.matches)lockAgentPage();
 updateAgentViewport();
 syncViewControl();
 if(!reduceAgentMotion.matches&&dialog.animate){
  const after=dialog.getBoundingClientRect();
  dialog.animate([{transformOrigin:'top left',transform:'translate('+(before.left-after.left)+'px,'+(before.top-after.top)+'px) scale('+(before.width/after.width)+','+(before.height/after.height)+')',opacity:.85},{transformOrigin:'top left',transform:'translate(0,0) scale(1,1)',opacity:1}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
 }
 (dialog.contains(focus)?focus:input).focus({preventScroll:true});resizeComposer();conversation.scrollTop=conversationScroll;saveConversation();
}
viewButton.addEventListener('click',()=>setChatView(chatView==='focused'?'docked':'focused'));
dockViewport.addEventListener('change',()=>{if(!dockViewport.matches&&chatView==='docked')setChatView('focused');syncViewControl()});
addEventListener('resize',positionDock);addEventListener('scroll',positionDock,{passive:true});
document.addEventListener('portfolio:sectionchange',positionDock);
syncViewControl();

dialog.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();if(!chatActions.hidden){setActionsOpen(false);actionToggle.focus({preventScroll:true})}else closeAgent()}});
const mobileAgent=window.matchMedia('(max-width:600px), (pointer:coarse)');
const fullScreenViewport=window.matchMedia('(max-width:991px)');
let mobileScrollLock=null;
function lockAgentPage(){
 if(!fullScreenViewport.matches||mobileScrollLock)return;
 const body=document.body,html=document.documentElement;
 mobileScrollLock={y:window.scrollY,position:body.style.position,top:body.style.top,
  left:body.style.left,right:body.style.right,width:body.style.width,htmlOverflow:html.style.overflow};
 body.style.position='fixed';body.style.top='-'+mobileScrollLock.y+'px';
 body.style.left='0';body.style.right='0';body.style.width='100%';
 html.style.overflow='hidden';
 body.classList.add('agent-mobile-active');html.classList.add('agent-mobile-active');
 window.ltLenis?.stop();
}
function unlockAgentPage(){
 if(!mobileScrollLock)return;
 const body=document.body,html=document.documentElement,prior=mobileScrollLock;
 mobileScrollLock=null;
 body.style.position=prior.position;body.style.top=prior.top;
 body.style.left=prior.left;body.style.right=prior.right;body.style.width=prior.width;
 html.style.overflow=prior.htmlOverflow;
 body.classList.remove('agent-mobile-active');html.classList.remove('agent-mobile-active');
 window.scrollTo(0,prior.y);
 window.ltLenis?.start();
}
function updateAgentViewport(){
 if(!dialog.open)return;
 if(!fullScreenViewport.matches){
  dialog.style.removeProperty('--agent-visual-height');
  dialog.style.removeProperty('--agent-visual-top');
  dialog.classList.remove('has-virtual-keyboard');return;
 }
 const viewport=window.visualViewport,height=Math.round(viewport?.height||window.innerHeight);
 dialog.classList.toggle('has-virtual-keyboard',height<window.innerHeight-120);
 dialog.style.setProperty('--agent-visual-height',height+'px');
 // Keep the workspace still while iOS pans the virtual viewport for the keyboard.
 dialog.style.setProperty('--agent-visual-top','0px');
}
let viewportUpdateFrame=0;
function requestAgentViewportUpdate(){
 if(viewportUpdateFrame)return;
 viewportUpdateFrame=requestAnimationFrame(()=>{viewportUpdateFrame=0;updateAgentViewport()});
}
window.visualViewport?.addEventListener('resize',requestAgentViewportUpdate);
window.addEventListener('resize',requestAgentViewportUpdate);
fullScreenViewport.addEventListener('change',()=>{
 if(!dialog.open)return;
 if(fullScreenViewport.matches)lockAgentPage();else unlockAgentPage();
 requestAgentViewportUpdate();
});

function closeAgent(){
  if(!dialog.open||closingAgent)return;
  if(!chatActions.hidden)setActionsOpen(false);
  closingAgent=true;input.blur();
  if(reduceAgentMotion.matches||!dialog.animate){dialog.close();closingAgent=false;return;}
  const exit=dialog.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(12px)'}],{duration:160,easing:'ease-in'});
  exit.finished.catch(()=>{}).then(()=>{if(dialog.open)dialog.close();closingAgent=false});
}

launcher.addEventListener('click',()=>{
  if(dialog.open){input.focus({preventScroll:true});return;}
  document.querySelector('.portfolio-navigation button[aria-expanded=\"true\"]')?.click();
  dialog.inert=false;
  input.disabled=false;input.readOnly=false;
  savedOverflow=document.body.style.overflow;chatView='focused';
  dialog.classList.remove('is-docked');document.body.classList.remove('agent-is-docked');
  dialog.showModal();document.body.style.overflow='hidden';syncViewControl();lockAgentPage();updateAgentViewport();
  launcher.setAttribute('aria-expanded','true');
  getRecords().catch(()=>{});
  // A deliberate launcher tap opens a ready-to-type chat on desktop and touch devices.
  if(!fullScreenViewport.matches)input.focus({preventScroll:true});resizeComposer();
});

dialog.querySelector('.search-close')?.addEventListener('click',closeAgent);

dialog.addEventListener('click',event=>{
  if(event.target===dialog){
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeAgent();
  }
});

dialog.addEventListener('cancel',event=>{
  event.preventDefault();
  closeAgent();
});

dialog.addEventListener('close',()=>{
  if(dialog.open)return; // Switching views queues a close event before reopening.
  if(chatView==='docked'&&profile)profile.scrollTop=profileScroll;
  chatView='focused';dialog.classList.remove('is-docked');document.body.classList.remove('agent-is-docked');syncViewControl();
  document.body.style.overflow=savedOverflow;
  unlockAgentPage();
  dialog.classList.remove('has-virtual-keyboard');
  saveConversation();
  input.blur();
  launcher.setAttribute('aria-expanded','false');
  requestAnimationFrame(()=>launcher.focus({preventScroll:true}));
});

form.addEventListener('submit',event=>{
  event.preventDefault();
  ask(input.value);
});


const clear=document.createElement('button');clear.type='button';clear.className='search-clear';clear.textContent='New conversation';
clear.addEventListener('click',()=>{if(busy)return;roleDescription="";roleFileToken++;roleText.value="";rolePanel.hidden=true;conversation.hidden=false;updateRoleAction();history=[];turns=[];lastProject=null;originContext=null;originUrl='';input.value='';resizeComposer();renderWelcome();if(!mobileAgent.matches)input.focus({preventScroll:true});dialog.querySelector('.search-context-link')?.remove();dialog.dispatchEvent(new CustomEvent('agent-question'));saveConversation();});
const fitButton=text('button','Compare a role','role-fit-action');fitButton.type='button';
const chatActions=text('div','','search-chat-actions');chatActions.id='agent-chat-actions';chatActions.hidden=true;chatActions.append(clear,fitButton);
const actionHost=text('div','','agent-action-host');
const actionToggle=text('button','⋯','agent-actions-toggle');actionToggle.type='button';
actionToggle.setAttribute('aria-label','Chat options');
actionToggle.setAttribute('aria-expanded','false');
actionToggle.setAttribute('aria-controls',chatActions.id);
function setActionsOpen(open){chatActions.hidden=!open;actionToggle.setAttribute('aria-expanded',String(open))}
actionToggle.addEventListener('click',()=>setActionsOpen(chatActions.hidden));
chatActions.addEventListener('click',event=>{if(event.target.closest('button'))setActionsOpen(false)});
document.addEventListener('pointerdown',event=>{if(!chatActions.hidden&&!actionHost.contains(event.target))setActionsOpen(false)});
actionHost.append(actionToggle,chatActions);windowControls.insertBefore(actionHost,closeButton);
const rolePanel=text('section','','role-fit-panel');rolePanel.hidden=true;rolePanel.setAttribute('aria-label','Job description comparison');rolePanel.setAttribute('data-lenis-prevent','');
rolePanel.innerHTML='<div class="role-fit-heading"><h3>Compare a role</h3><button type="button" data-role-cancel aria-label="Return to chat">Back to chat</button></div><p>Paste the job description, or upload it and check the extracted text before comparing.</p><div class="role-fit-file-row"><button type="button" data-role-upload>Upload PDF or Word</button><span>PDF or .docx · Up to 2 MB</span><input type="file" accept=".pdf,.docx" hidden></div><label for="role-description">Job description</label><textarea id="role-description" maxlength="12000" placeholder="Paste the role and its main requirements here…"></textarea><p class="role-fit-status" role="status" aria-live="polite"></p><p class="role-fit-privacy">Files are processed for text extraction and aren’t saved by this site. When you compare, the reviewed text is sent to the AI provider. Please leave out confidential or personal information.</p><div class="role-fit-buttons"><button type="button" data-role-remove hidden>Remove role</button><button type="button" data-role-compare disabled>Compare with Jamiu’s work</button></div>';
const roleText=rolePanel.querySelector('textarea'),roleFile=rolePanel.querySelector('input[type=file]'),roleStatus=rolePanel.querySelector('.role-fit-status'),compareRole=rolePanel.querySelector('[data-role-compare]'),uploadRole=rolePanel.querySelector('[data-role-upload]');
let parsingRole=false,roleFileToken=0;
function updateRoleAction(){fitButton.textContent=roleDescription?'Review role':'Compare a role';rolePanel.querySelector('[data-role-remove]').hidden=!roleDescription}
function syncRoleText(){compareRole.disabled=parsingRole||roleText.value.trim().length<80;roleStatus.textContent=roleText.value.length.toLocaleString()+' / 12,000 characters';}
function closeRolePanel(){rolePanel.hidden=true;conversation.hidden=false;if(!fullScreenViewport.matches)input.focus({preventScroll:true});resizeComposer()}
fitButton.addEventListener('click',()=>{rolePanel.hidden=false;conversation.hidden=true;roleText.value=roleDescription||roleText.value;syncRoleText();updateRoleAction();roleText.focus({preventScroll:true})});
rolePanel.querySelector('[data-role-cancel]').addEventListener('click',closeRolePanel);
roleText.addEventListener('input',syncRoleText);
uploadRole.addEventListener('click',()=>roleFile.click());
rolePanel.querySelector('[data-role-remove]').addEventListener('click',()=>{roleDescription='';roleText.value='';updateRoleAction();closeRolePanel()});
roleFile.addEventListener('change',async()=>{
 const file=roleFile.files?.[0];if(!file)return;
 const token=++roleFileToken;
 if(!/\.(pdf|docx)$/i.test(file.name)){roleStatus.textContent='Please choose a PDF or Word .docx file.';return}
 if(file.size>2*1024*1024){roleStatus.textContent='Please choose a file smaller than 2 MB.';return}
 parsingRole=true;compareRole.disabled=true;uploadRole.disabled=true;roleStatus.textContent='Reading '+file.name+'…';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
 try{
  const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  const response=await fetch('/api/job-description',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filename:file.name,content_base64:btoa(binary)}),signal:controller.signal});
  const result=await response.json();if(token!==roleFileToken)return;
  if(!response.ok||!result.text)throw Error(result.error||'The document could not be read. Paste the description instead.');
  roleText.value=result.text;roleStatus.textContent='Text extracted. Review it below before comparing.';if(!rolePanel.hidden)roleText.focus({preventScroll:true});
 }catch(error){roleStatus.textContent=error.name==='AbortError'?'Reading timed out. Try again or paste the description.':error.message}
 finally{clearTimeout(timer);parsingRole=false;uploadRole.disabled=false;compareRole.disabled=roleText.value.trim().length<80;roleFile.value=''}
});
compareRole.addEventListener('click',async()=>{
 if(busy||parsingRole)return;
 const description=roleText.value.trim();if(description.length<80||description.length>12000){syncRoleText();return}
 roleDescription=description;updateRoleAction();closeRolePanel();await ask('Compare this job description with Jamiu’s published experience.');
});
const workspace=text('div','','agent-workspace');
const library=text('nav','','agent-library');library.setAttribute('aria-label','Portfolio pages and projects');library.setAttribute('data-lenis-prevent','');
const centre=text('section','','agent-chat-column');centre.setAttribute('aria-label','Chat');
const proof=text('aside','','agent-proof');proof.setAttribute('aria-label','Selected work preview');proof.setAttribute('data-lenis-prevent','');
centre.append(conversation,rolePanel,form);workspace.append(library,centre,proof);dialog.append(workspace);
proof.append(text('p','[Preview]','search-kicker'),text('p','Select a project to see its work.','agent-proof-empty'));
function clearProofForSuggestions(){
 proofRequest++;selectedProofId='';markSelection();
 proof.replaceChildren(text('p','[Preview]','search-kicker'),text('p','Choose a project from the conversation to preview it here.','agent-proof-empty'));
}
function markSelection(){library.querySelectorAll('[data-agent-record]').forEach(button=>{const active=button.dataset.agentRecord===selectedProofId;button.classList.toggle('is-selected',active);if(active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current')})}
function initWorkspaceNavigation(){
 library.replaceChildren(text('p','[Portfolio]','search-kicker'));
 const group=document.createElement('details');group.className='agent-project-group';group.open=true;
 const summary=text('summary','Projects');group.append(summary);
 const list=text('div','','agent-project-list');
 function item(record,host){const button=text('button',record.title,'agent-library-item');button.type='button';button.dataset.agentRecord=record.id;button.addEventListener('click',()=>showProof(record));host.append(button)}
 records.filter(record=>record.url.startsWith('/work/')).forEach(record=>item(record,list));group.append(list);library.append(group);
 for(const id of ['brand','logos','system','credentials']){const record=getRecord(id);if(record)item(record,library)}
 markSelection();
}
async function proofSource(record){
 const url=new URL(record.url,location.origin),slug=url.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
 if(slug){const local=document.querySelector('[data-feed-detail="'+slug+'"]');if(local)return local}
 if(!proofCache.has(url.pathname)){
  const task=fetch(url.pathname,{credentials:'same-origin'}).then(async response=>{if(!response.ok)throw Error('Preview unavailable');return new DOMParser().parseFromString(await response.text(),'text/html')});
  proofCache.set(url.pathname,task);task.catch(()=>proofCache.delete(url.pathname));
 }
 const doc=await proofCache.get(url.pathname);
 const source=slug?doc.querySelector('[data-feed-detail="'+slug+'"]'):doc.querySelector('.section_feed');
 if(!source)throw Error('Preview unavailable');
 if(slug&&!document.querySelector('[data-feed-detail="'+slug+'"]')){
  let storage=document.querySelector('.agent-project-sources');if(!storage){storage=document.createElement('div');storage.className='agent-project-sources';storage.hidden=true;document.body.append(storage)}
  storage.append(document.importNode(source,true));
 }
 return source;
}
async function showProof(record){
 if(!record)return;
 const token=++proofRequest;selectedProofId=record.id;markSelection();
 proof.replaceChildren(text('p','[Preview]','search-kicker'),text('h3',record.title,'agent-proof-title'));
 if(record.image){const img=document.createElement('img');img.src=record.image;img.alt=record.title+' preview';img.className='agent-proof-image';proof.append(img)}
 proof.append(text('p',record.summary,'agent-proof-summary'));
 const details=text('div','','agent-proof-details');details.setAttribute('aria-busy','true');proof.append(details);
 const open=text('a',record.url.startsWith('/work/')?'Open full case study ↗':'Open portfolio section ↗','agent-proof-open');open.href=record.url;open.setAttribute('aria-label', 'Open '+record.title+' full page');proof.insertBefore(open,details);
 const setOpenAction=()=>{
  const slug=new URL(record.url,location.origin).pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
  if(slug&&document.querySelector('[data-feed-detail="'+slug+'"]'))open.setAttribute('data-feed-open',slug);else if(!slug)open.setAttribute('data-section-step','');
 };
 setOpenAction();open.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;setChatView('docked')});
 proof.scrollTop=0;
 try{
  const source=await proofSource(record);if(token!==proofRequest)return;
  details.replaceChildren();
  const project=record.url.startsWith('/work/');
  if(project){
   const image=source.querySelector('.feed-detail_gallery img');
   if(image&&!proof.querySelector('.agent-proof-image')){const img=document.createElement('img');img.src=image.getAttribute('src');img.alt=image.alt||record.title+' preview';img.className='agent-proof-image';details.append(img)}
   const role=source.querySelector('.project-role');if(role)details.append(text('p',role.textContent,'agent-proof-role'));
   const panels=[...source.querySelectorAll('[data-detail-panel]')];
   for(const panel of panels){
    const disclosure=document.createElement('details');disclosure.className='agent-proof-disclosure';disclosure.open=panel===panels[0];
    const heading=panel.querySelector('h3');disclosure.append(text('summary',heading?.textContent||'Project details'));
    const body=text('div');for(const node of panel.querySelectorAll('p,li')){const copy=text('p',node.textContent);body.append(copy)}
    disclosure.append(body);details.append(disclosure);
   }
  }else{
   const grid=text('div','','agent-proof-grid');const seen=new Set();
   for(const image of source.querySelectorAll('.feed_card img,.project-card_media img')){
    const src=image.getAttribute('src');if(!src||seen.has(src))continue;seen.add(src);
    const img=document.createElement('img');img.src=src;img.alt=image.alt||record.title;img.loading='lazy';grid.append(img);if(seen.size===6)break;
   }
   details.append(grid);
  }
  details.removeAttribute('aria-busy');setOpenAction();
 }catch{if(token===proofRequest){details.removeAttribute('aria-busy');details.append(text('p','The full page is available through the link below.','agent-proof-role'))}}
}
const ready=getRecords().then(()=>{inputVocabulary=portfolioVocabulary(records);initWorkspaceNavigation();restoreConversation();}).catch(()=>{library.append(text('p','Project list could not load.'))});
window.portfolioAgent={open:async(question='')=>{
  if(!dialog.open)launcher.click();
  await ready;
  if(question.trim()){input.value=question.slice(0,700);await ask(input.value);}
}};
document.querySelectorAll('[data-agent-open]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('.navigation.is-open .navigation-toggle')?.click();
  window.portfolioAgent.open();
}));
})();

