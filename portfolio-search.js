(()=>{
const launcher=document.createElement('button');
launcher.className='portfolio-search-launch';
launcher.textContent="Ask Jamiu's agent";
launcher.setAttribute('aria-haspopup','dialog');
document.body.append(launcher);

const dialog=document.createElement('dialog');
dialog.className='portfolio-search';
dialog.setAttribute('aria-labelledby','portfolio-search-title');
dialog.innerHTML='<header class="search-heading"><div><span class="search-kicker">A shortcut to the work</span><h2 id="portfolio-search-title">What would you like to know?</h2></div><button type="button" class="search-close" aria-label="Close portfolio agent">Close</button></header><p class="search-mode"><span class="agent-dot" aria-hidden="true"></span><span>Portfolio agent · grounded in published work · instant fallback built in.</span></p><div class="search-conversation" aria-live="polite" aria-relevant="additions"><p class="search-welcome">Ask about Jamiu’s experience, projects, design decisions, skills or background. The agent answers from the work published on this portfolio and points you to the strongest evidence.</p></div><div class="search-suggestions"><button>Show me fintech work</button><button>What did you do at Bizinc?</button><button>How do you approach design systems?</button><button>Experience and skills</button></div><form class="search-form"><label for="portfolio-question">Ask the portfolio agent</label><div><input id="portfolio-question" type="search" maxlength="400" placeholder="e.g. What kind of product designer is Jamiu?" autocomplete="off" required><button type="submit">Ask</button></div></form>';
document.body.append(dialog);

const conversation=dialog.querySelector('.search-conversation');
const input=dialog.querySelector('input');
const form=dialog.querySelector('form');
const submit=form.querySelector('button');
let records;
let loading;
let lastProject;
let history=[];

function text(tag,value,className){
  const el=document.createElement(tag);
  el.textContent=value;
  if(className)el.className=className;
  return el;
}

const stop=new Set('a an the i you your me my what how did do does is are was were at in on to of and for about show tell can has have with it work project projects please he him his she her hers they them their theirs who whom jamiu abdulfatai'.split(' '));
const groups=[
  ['fintech','banking','bank','finance','financial','payments','payment','currency','currencies','loans','investment'],
  ['branding','brand','logo','logos','identity','merchandise'],
  ['skills','experience','career','background','education','about','cv','resume','strength','strengths','capability','capabilities'],
  ['research','testing','test','usability','discovery','findings'],
  ['systems','system','components','component','tokens','library'],
  ['ai','generative','artificial','intelligence','agent','automation','llm','model','models'],
  ['contact','email','hire','hiring','recruiter','availability','available','pricing','sponsorship'],
  ['manager','management','lead','leadership','team','stakeholder','stakeholders','developer','developers','engineering']
];

const broadPatterns=[
  /\bhow good\b/i,
  /\bis (?:he|jamiu) (?:good|strong|experienced|senior|capable|worth hiring)\b/i,
  /\bwhy (?:should (?:we|i|a team) )?(?:hire|choose|pick) (?:him|jamiu)\b/i,
  /\bwould you hire (?:him|jamiu)\b/i,
  /\bwhat (?:kind|type) of (?:designer|product designer)\b/i,
  /\bwhat (?:are )?(?:his|jamiu'?s) strengths\b/i,
  /\bwhat makes (?:him|jamiu)\b/i,
  /\btell me about (?:him|jamiu)\b/i,
  /\bwho is (?:he|jamiu)\b/i,
  /\bhow experienced\b/i,
  /\bhow strong\b/i,
  /\bhow capable\b/i,
  /\boverall\b/i
];

function tokens(q){
  return q.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(t=>t.length>1&&!stop.has(t));
}

function hasSpecificSubject(q){
  const clean=q.toLowerCase();
  const named=Array.isArray(records)&&records.some(record=>{
    if(['about','credentials','cv'].includes(record.id))return false;
    const id=record.id.replace(/-/g,' ');
    const title=record.title.toLowerCase();
    return clean.includes(id)||clean.includes(title);
  });
  return named||/\b(?:fintech|banking|bank|payments?|branding|logos?|identity|research|testing|usability|design systems?|components?|tokens?|ai|generative|llm|automation|healthcare|marketplace|saas|dashboard|mobile|responsive|figma|prototype|prototyping)\b/i.test(clean);
}

function isBroadQuestion(q){
  const clean=q.trim();
  const words=tokens(clean);
  const specific=hasSpecificSubject(clean);
  return (!specific&&broadPatterns.some(pattern=>pattern.test(clean))) ||
    (!specific&&/\b(?:he|him|his)\b/i.test(clean)&&words.length<=3) ||
    (!specific&&words.length<=2&&/\b(?:good|strong|experienced|capable|hire|hiring|strengths?)\b/i.test(clean));
}

function isFollowUp(q){
  const clean=q.trim();
  const words=tokens(clean);
  return history.length>0 && (
    words.length<=3 ||
    /^(and|also|what about|why|how so|how about|tell me more|more|really|which one|what else)\b/i.test(clean) ||
    /\b(?:it|that|this|there|they|them|he|him|his)\b/i.test(clean)
  );
}

function lastUserQuestion(){
  for(let i=history.length-1;i>=0;i--) if(history[i].role==='user') return history[i].text||'';
  return '';
}

function getRecord(id){
  return records.find(record=>record.id===id);
}

function uniqueRecords(items){
  const seen=new Set();
  return items.filter(record=>record&&!seen.has(record.id)&&(seen.add(record.id),true));
}

function broadEvidence(){
  return uniqueRecords([
    getRecord('about'),
    getRecord('credentials'),
    getRecord('bizinc'),
    getRecord('vista-itss'),
    getRecord('kremor-ai'),
    getRecord('system')
  ]).slice(0,6);
}

function rank(q){
  if(isBroadQuestion(q)) return broadEvidence();

  const context=isFollowUp(q)?lastUserQuestion()+' '+q:q;
  const words=tokens(context);
  const expanded=new Set(words);
  groups.forEach(group=>{
    if(group.some(word=>words.includes(word)))group.forEach(word=>expanded.add(word));
  });

  let matches=records.map(record=>{
    const title=record.title.toLowerCase();
    const body=(record.summary+' '+record.text).toLowerCase();
    let score=0;

    words.forEach(word=>{
      if(title.includes(word))score+=18;
      if(record.id===word)score+=25;
    });

    expanded.forEach(word=>{
      if(new RegExp('\\b'+word+'\\b','i').test(body))score+=words.includes(word)?4:1;
    });

    if(words.some(word=>['cv','resume'].includes(word))&&record.id==='cv')score+=40;
    if(words.some(word=>['contact','email','hire','hiring','recruiter','availability','available','pricing','sponsorship','experience','skills','education','strength','strengths'].includes(word))&&record.id==='about')score+=34;
    if(words.some(word=>['hire','hiring','recruiter','strength','strengths','recognition','award','reference','references'].includes(word))&&record.id==='credentials')score+=32;
    if(words.some(word=>['branding','logos','logo','identity'].includes(word))&&record.id==='logos')score+=30;
    if(words.some(word=>['systems','system','components','tokens','library'].includes(word))&&record.id==='system')score+=30;

    return {record,score};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score);

  let found=matches.slice(0,5).map(item=>item.record);

  if(!found.length&&lastProject) found=[lastProject,getRecord('about')];
  if(!found.length) found=[getRecord('about'),getRecord('credentials')];

  if(!found.some(record=>record?.id==='about')) found.push(getRecord('about'));

  return uniqueRecords(found).slice(0,6);
}
function scoredChunks(record,q){
  const words=tokens(q);
  return record.text.split(/\n/).filter(Boolean).map((value,index)=>({
    value,
    index,
    score:words.reduce((total,word)=>total+(value.toLowerCase().includes(word)?1:0),0)+
      (/what did|contribut|role|own|responsib/i.test(q)&&/what i owned/i.test(value)?10:0)
  })).sort((a,b)=>b.score-a.score||a.index-b.index);
}

function excerpt(record,q){
  const chosen=scoredChunks(record,q)[0]?.value||record.summary;
  const clean=chosen.replace(/^\d+\s+[^:]+:\s*/,'');
  if(clean.length<=620)return clean;
  const end=clean.slice(0,620).lastIndexOf('. ');
  return clean.slice(0,end>200?end+1:600)+(end>200?'':'…');
}

function evidence(record,q){
  if(isBroadQuestion(q)){
    return (record.text||record.summary).slice(0,3200);
  }
  const query=isFollowUp(q)?lastUserQuestion()+' '+q:q;
  const chunks=scoredChunks(record,query).slice(0,4).sort((a,b)=>a.index-b.index).map(item=>item.value.replace(/^\d+\s+[^:]+:\s*/,''));
  const combined=chunks.join('\n');
  return (combined||record.summary).slice(0,3200);
}
async function getRecords(){
  if(records)return records;
  if(!loading){
    loading=fetch('/portfolio-knowledge.json?v=1')
      .then(response=>{if(!response.ok)throw Error();return response.json()})
      .then(data=>records=data)
      .catch(error=>{loading=null;throw error});
  }
  return loading;
}

function sourceCards(found){
  const cards=text('div','','search-results');
  found.forEach(record=>{
    const link=document.createElement('a');
    link.href=record.url;
    link.className='search-result';

    if(record.image){
      const image=document.createElement('img');
      image.src=record.image;
      image.alt='';
      image.loading='lazy';
      link.append(image);
    }else{
      link.append(text('span',record.title.slice(0,1),'search-monogram'));
    }

    const copy=text('div');
    copy.append(text('strong',record.title),text('span',record.summary));
    link.append(copy);
    cards.append(link);
  });
  return cards;
}

async function askAgent(question,found){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),19000);
  try{
    const response=await fetch('/api/agent',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question,
        sources:found.map(record=>({
          id:record.id,
          title:record.title,
          summary:record.summary,
          evidence:evidence(record,question),
          url:record.url
        })),
        history:history.slice(-8),
        intent:isBroadQuestion(question)?'broad':'specific'
      }),
      signal:controller.signal
    });
    let data={};
    try{data=await response.json()}catch{}
    if(!response.ok||!data.answer)throw Error(data.error||'Agent unavailable');
    return data.answer;
  }finally{
    clearTimeout(timer);
  }
}

function localAnswer(found,q){
  if(isBroadQuestion(q)){
    return 'Based on the published portfolio, Jamiu has evidence of working across complex product areas rather than only visual UI. His published work includes progression from intern to UI/UX Manager at Bizinc, multi-market banking work on Vista that received ITSS recognition, end-to-end design across Kremor AI, and professional references from the Bizinc CEO and Kremor AI founder. The portfolio also shows work across fintech, SaaS, marketplaces and AI, with design-system and developer-handoff experience. Some outcome figures in the case studies are aggregate or not independently verified, so they should be read with that limitation.';
  }
  if(!found.length)return 'I couldn’t find a clear match in the published portfolio. Try a project name, banking, branding, design systems, research, AI, or experience. For details that aren’t published, contact Jamiu directly.';
  const primary=found[0];
  const second=found.find(record=>record.id!==primary.id&&record.id!=='about');
  const first=excerpt(primary,q);
  return second?first+' A related example is '+second.title+': '+second.summary:first;
}
async function ask(q){
  q=q.trim();
  if(!q)return;

  submit.disabled=true;
  conversation.append(text('p',q,'search-question'));

  const response=text('div','','search-answer is-thinking');
  response.append(text('p','Looking through the portfolio…'));
  conversation.append(response);
  input.value='';

  try{
    await getRecords();
    const found=rank(q);
    const fallback=localAnswer(found,q);
    let answer=fallback;
    let usedAgent=false;

    if(found.length){
      try{
        answer=await askAgent(q,found);
        usedAgent=true;
      }catch{
        answer=fallback;
      }
    }

    response.classList.remove('is-thinking');
    response.replaceChildren();
    response.append(text('p',answer));

    const meta=text('p',usedAgent?'Agent answer · grounded in the published portfolio.':'Instant portfolio match · the hosted agent is temporarily unavailable.','search-answer-meta');
    response.append(meta);

    if(found.length){
      lastProject=found.find(record=>!['about','credentials','cv'].includes(record.id))||found[0];
      response.append(text('span','Explore the evidence','search-kicker'));
      response.append(sourceCards(found.slice(0,3)));
    }

    history.push({role:'user',text:q},{role:'assistant',text:answer});
    history=history.slice(-8);
  }catch{
    response.classList.remove('is-thinking');
    response.replaceChildren(text('p','The portfolio index could not load. Please try again, or browse selected work from the menu.'));
  }finally{
    submit.disabled=false;
    conversation.scrollTop=response.offsetTop-conversation.offsetTop;
  }
}

const mobileAgent=window.matchMedia('(max-width:600px), (pointer:coarse)');

function closeAgent(){
  if(document.activeElement&&dialog.contains(document.activeElement)&&typeof document.activeElement.blur==='function'){
    document.activeElement.blur();
  }
  input.blur();
  requestAnimationFrame(()=>{
    if(dialog.open)dialog.close();
  });
}

launcher.addEventListener('click',()=>{
  dialog.showModal();
  getRecords().catch(()=>{});
  // Desktop gets immediate keyboard focus. On phones, wait for an intentional tap
  // so Safari never changes the visual viewport just from opening the drawer.
  if(!mobileAgent.matches)input.focus({preventScroll:true});
});

dialog.querySelector('.search-close').addEventListener('click',closeAgent);

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
  input.blur();
  requestAnimationFrame(()=>launcher.focus({preventScroll:true}));
});

form.addEventListener('submit',event=>{
  event.preventDefault();
  ask(input.value);
});

dialog.querySelectorAll('.search-suggestions button').forEach(button=>{
  button.addEventListener('click',()=>ask(button.textContent));
});
})();
