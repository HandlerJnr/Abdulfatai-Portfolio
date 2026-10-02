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

const stop=new Set('a an the i you your me my what how did do does is are was were at in on to of and for about show tell can has have with it work project projects please'.split(' '));
const groups=[
  ['fintech','banking','bank','finance','financial','payments','payment','currency','currencies','loans','investment'],
  ['branding','brand','logo','logos','identity','merchandise'],
  ['skills','experience','career','background','education','about','cv','resume'],
  ['research','testing','test','usability','discovery','findings'],
  ['systems','system','components','component','tokens','library'],
  ['ai','generative','artificial','intelligence','agent','automation'],
  ['contact','email','hire','availability','available','pricing','sponsorship']
];

function tokens(q){
  return q.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(t=>t.length>1&&!stop.has(t));
}

function rank(q){
  const words=tokens(q);
  const expanded=new Set(words);
  groups.forEach(group=>{
    if(group.some(word=>words.includes(word)))group.forEach(word=>expanded.add(word));
  });

  let matches=records.map(record=>{
    const title=record.title.toLowerCase();
    const body=(record.summary+' '+record.text).toLowerCase();
    let score=0;
    words.forEach(word=>{if(title.includes(word))score+=15});
    expanded.forEach(word=>{
      if(new RegExp('\\b'+word+'\\b','i').test(body))score+=words.includes(word)?3:1;
    });
    if(words.some(word=>['cv','resume'].includes(word))&&record.id==='cv')score+=35;
    if(words.some(word=>['contact','email','hire','availability','available','pricing','sponsorship','experience','skills','education'].includes(word))&&record.id==='about')score+=25;
    if(words.some(word=>['branding','logos','logo','identity'].includes(word))&&record.id==='logos')score+=25;
    return {record,score};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score);

  if(!words.length&&lastProject)matches=[{record:lastProject,score:1}];
  return matches.slice(0,3).map(item=>item.record);
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
  const chunks=scoredChunks(record,q).slice(0,4).sort((a,b)=>a.index-b.index).map(item=>item.value.replace(/^\d+\s+[^:]+:\s*/,''));
  const combined=chunks.join('\n');
  return (combined||record.summary).slice(0,3000);
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
        history:history.slice(-6)
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
  if(!found.length)return 'I couldn’t find a clear match in the published portfolio. Try a project name, banking, branding, design systems, research, AI, or experience. For details that aren’t published, contact Jamiu directly.';
  return excerpt(found[0],q);
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
      lastProject=found[0];
      response.append(text('span','Explore the evidence','search-kicker'));
      response.append(sourceCards(found));
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

launcher.addEventListener('click',()=>{
  dialog.showModal();
  getRecords().catch(()=>{});
  input.focus();
});

dialog.querySelector('.search-close').addEventListener('click',()=>dialog.close());

dialog.addEventListener('click',event=>{
  if(event.target===dialog){
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  }
});

dialog.addEventListener('close',()=>launcher.focus());

form.addEventListener('submit',event=>{
  event.preventDefault();
  ask(input.value);
});

dialog.querySelectorAll('.search-suggestions button').forEach(button=>{
  button.addEventListener('click',()=>ask(button.textContent));
});
})();
