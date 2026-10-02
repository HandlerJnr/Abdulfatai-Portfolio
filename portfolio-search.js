(()=>{
const launcher=document.createElement('button');
launcher.className='portfolio-search-launch';
launcher.textContent="Ask Jamiu's agent";
launcher.setAttribute('aria-haspopup','dialog');
document.body.append(launcher);

const dialog=document.createElement('dialog');
dialog.className='portfolio-search';
dialog.setAttribute('aria-labelledby','portfolio-search-title');
dialog.innerHTML='<header class="search-heading"><div><span class="search-kicker">A shortcut to the work</span><h2 id="portfolio-search-title">What would you like to know?</h2></div><button type="button" class="search-close" aria-label="Close portfolio agent">Close</button></header><p class="search-mode"><span class="agent-dot" aria-hidden="true"></span><span>Open-source Qwen agent · server-side · grounded in Jamiu’s published portfolio.</span></p><div class="search-conversation" aria-live="polite" aria-relevant="additions"><p class="search-welcome">Ask anything about Jamiu’s published work in your own words — vague, specific, comparative or follow-up questions all work. The agent decides which portfolio evidence matters.</p></div><div class="search-suggestions"><button>Show me fintech work</button><button>What did you do at Bizinc?</button><button>How do you approach design systems?</button><button>Experience and skills</button></div><form class="search-form"><label for="portfolio-question">Ask the portfolio agent</label><div><input id="portfolio-question" type="search" maxlength="400" placeholder="e.g. What kind of product designer is Jamiu?" autocomplete="off" required><button type="submit">Ask</button></div></form>';
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

const stop=new Set('a an the i you your me my what how did do does is are was were at in on to of and for about show tell can could would should has have had with it this that these those please he him his she her hers they them their theirs who whom jamiu abdulfatai really very just'.split(' '));

function tokens(q){
  return String(q||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(t=>t.length>1&&!stop.has(t));
}

function recentUserContext(q){
  const current=String(q||'').trim();
  const currentWords=tokens(current);
  if(currentWords.length>5||!history.length)return current;
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

function rank(q){
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

async function askAgent(question){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),22000);
  try{
    const response=await fetch('/api/agent',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question,
        sources:records.map(record=>({
          id:record.id,
          title:record.title,
          summary:record.summary,
          evidence:evidence(record,question),
          url:record.url
        })),
        history:history.slice(-10)
      }),
      signal:controller.signal
    });
    let data={};
    try{data=await response.json()}catch{}
    if(!response.ok||!data.answer)throw Error(data.error||'Agent unavailable');
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
  const selected=found.length?found:uniqueRecords([getRecord('about'),getRecord('credentials'),lastProject]);
  if(!selected.length)return 'I could not load enough published portfolio context to answer that well. Try again in a moment.';

  const primary=selected[0];
  const second=selected.find(record=>record.id!==primary.id);
  const first=excerpt(primary,q);

  if(tokens(recentUserContext(q)).length<=1){
    const profile=getRecord('about');
    const credentials=getRecord('credentials');
    const parts=[
      profile?.summary,
      credentials?.summary,
      lastProject?('A representative project is '+lastProject.title+': '+lastProject.summary):''
    ].filter(Boolean);
    return parts.join(' ');
  }

  return second?first+' Related evidence: '+second.title+' — '+second.summary:first;
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
    let evidenceCards=found.slice(0,3);

    try{
      const result=await askAgent(q);
      answer=result.answer;
      usedAgent=true;
      const selected=result.sourceIds.map(id=>getRecord(id)).filter(Boolean);
      if(selected.length)evidenceCards=selected.slice(0,3);
    }catch{
      answer=fallback;
    }

    response.classList.remove('is-thinking');
    response.replaceChildren();
    response.append(text('p',answer));

    const meta=text('p',usedAgent?'Qwen agent · evidence selected from the published portfolio.':'Portfolio fallback · hosted agent temporarily unavailable.','search-answer-meta');
    response.append(meta);

    if(evidenceCards.length){
      lastProject=evidenceCards.find(record=>!['about','credentials','cv'].includes(record.id))||evidenceCards[0];
      response.append(text('span','Evidence used','search-kicker'));
      response.append(sourceCards(evidenceCards));
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
