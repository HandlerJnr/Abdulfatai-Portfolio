(()=>{
const launcher=document.createElement('button');
launcher.className='portfolio-search-launch';
launcher.textContent="Ask Jamiu's agent";
launcher.setAttribute('aria-haspopup','dialog');
document.body.append(launcher);

const dialog=document.createElement('dialog');
dialog.className='portfolio-search';
dialog.setAttribute('aria-labelledby','portfolio-search-title');
dialog.innerHTML='<header class="search-heading"><div><span class="search-kicker">A shortcut to the work</span><h2 id="portfolio-search-title">What would you like to know?</h2></div><button type="button" class="search-close" aria-label="Close portfolio agent">Close</button></header><p class="search-mode"><span class="agent-dot" aria-hidden="true"></span><span>Explore Jamiu’s work, experience and design decisions.</span></p><div class="search-conversation" aria-live="polite" aria-relevant="additions"><p class="search-welcome">Ask anything about Jamiu’s published work in your own words — Start with a project or a question about his experience.</p></div><div class="search-suggestions"><button>Show me fintech work</button><button>What did you do at Bizinc?</button><button>How do you approach design systems?</button><button>Experience and skills</button></div><form class="search-form"><label for="portfolio-question">Ask the portfolio agent</label><div><input id="portfolio-question" type="search" maxlength="700" placeholder="e.g. What kind of product designer is Jamiu?" autocomplete="off" required><button type="submit">Ask</button></div></form>';
document.body.append(dialog);

const conversation=dialog.querySelector('.search-conversation');
const input=dialog.querySelector('input');
const form=dialog.querySelector('form');
const submit=form.querySelector('button');
let records;
let loading;
let lastProject;
let history=[];
let busy=false;

function text(tag,value,className){
  const el=document.createElement(tag);
  el.textContent=value;
  if(className)el.className=className;
  return el;
}

function cleanAgentOutput(value){
  return String(value||'')
    .replace(/<br\s*\/?\s*>/gi,'\n')
    .replace(/<[^>]+>/g,' ')
    .replace(/【[^】]{1,80}】/g,'')
    .replace(/\[\s*(?:about|credentials|cv|horal|pay4me|radius|bizinc|vista(?:-itss)?|kremor(?:-ai)?|chalant(?:-ai)?|synqit|archi-tek|arete|settle|shortlet-lagos|loan-investment-app|project-management-dashboard|brand|logos|system)\s*\]/gi,'')
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
  const currentWords=tokens(current);
  if(currentWords.length>5||!history.length||!(/\b(it|that|this|those|their|more|why)\b/i.test(current)))return current;
  const previous=[];
  for(let i=history.length-1;i>=0&&previous.length<2;i--){
    if(history[i].role==='user'&&history[i].text)previous.unshift(history[i].text);
  }
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
  {terms:['artificial intelligence','generative ai','gen ai','ai product','ai products','ai design','ai tool','ai tools','llm','agentic','ai agent','ai agents'],ids:['kremor-ai','chalant-ai','synqit','archi-tek','credentials']},
  {terms:['healthcare','healthtech','health tech','medical','care platform'],ids:['arete']},
  {terms:['service design','service platform','service platforms','student experience','relocation','onboarding journey'],ids:['settle','arete','pay4me']},
  {terms:['responsive design','responsive','mobile design','web design','mobile app','web app','front end','frontend'],ids:['system','horal','shortlet-lagos','pay4me']},
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
    loading=fetch('/portfolio-knowledge.json?v=20261003-domain-proof')
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

async function askAgent(question){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),55000);
  try{
    const response=await fetch('/api/agent',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question,
        history:history.slice(-10)
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
  return found.slice(0,2).map(record=>record.title+': '+excerpt(record,q)).join('\n\n');
}
async function ask(q){
  q=q.trim();
  if(!q||busy)return;
  busy=true;
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
    let evidenceCards=found.slice(0,2);

    try{
      const result=await askAgent(q);
      answer=result.answer;
      usedAgent=true;
      evidenceCards=result.sourceIds.map(id=>getRecord(id)).filter(Boolean).slice(0,3);
    }catch(error){
      answer=fallback;
      response.dataset.agentError=error?.code||'agent-unavailable';
    }

    response.classList.remove('is-thinking');
    response.replaceChildren();
    response.append(renderAgentAnswer(answer));

    const hasEvidence=usedAgent&&evidenceCards.length>0;
    const meta=text(
      'p',
      usedAgent
        ? (hasEvidence?'Supporting portfolio evidence is linked below.':'Portfolio conversation.')
        : 'Live chat is unavailable right now. These are matching excerpts from the portfolio.',
      'search-answer-meta'
    );
    dialog.querySelector('.search-mode>span:last-child').textContent=usedAgent
      ? (hasEvidence?'Portfolio conversation · Supporting evidence below.':'Portfolio conversation')
      : 'Portfolio search · Live chat temporarily unavailable.';
    response.append(meta);

    if(evidenceCards.length){
      lastProject=evidenceCards.find(record=>!['about','credentials','cv'].includes(record.id))||evidenceCards[0];
      response.append(text('span',usedAgent?'Portfolio proof':'Read these projects','search-kicker'));
      response.append(sourceCards(evidenceCards));
    }

    history.push({role:'user',text:q},{role:'assistant',text:answer});
    history=history.slice(-8);
  }catch{
    response.classList.remove('is-thinking');
    response.replaceChildren(text('p','The portfolio index could not load. Please try again, or browse selected work from the menu.'));
  }finally{
    busy=false;
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
