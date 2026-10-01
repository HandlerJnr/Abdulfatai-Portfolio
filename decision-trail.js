(()=>{
const existing=document.querySelector('.decision-trail');
const trail=existing||document.createElement('aside');
if(!existing){
  trail.className='decision-trail';
  trail.hidden=true;
  trail.setAttribute('aria-live','polite');
  trail.innerHTML='<span class="decision-trail-rule" aria-hidden="true"></span><div class="decision-trail-copy"><small>DESIGN DECISION TRAIL</small><span class="decision-trail-meta"></span><strong class="decision-trail-title"></strong><p class="decision-trail-body"></p></div>';
  document.body.append(trail);
}
const meta=trail.querySelector('.decision-trail-meta');
const title=trail.querySelector('.decision-trail-title');
const body=trail.querySelector('.decision-trail-body');
const homeHost=document.body;
let currentHost=homeHost;
let sources=[];
let currentKey='';
let ticking=false;

const clean=(value,max=180)=>{
  const text=(value||'').replace(/\s+/g,' ').trim();
  return text.length>max?text.slice(0,max-1).trimEnd()+'…':text;
};
const textOf=(el,selector)=>clean(el?.querySelector(selector)?.textContent||'');

function syncHost(){
  const dialogs=[...document.querySelectorAll('dialog[open]')];
  const next=dialogs.length?dialogs[dialogs.length-1]:homeHost;
  if(next!==currentHost){
    currentHost=next;
    next.append(trail);
  }
}
function add(el,getData){
  if(el)sources.push({el,getData});
}
function caseLabel(heading){
  const h=heading.toLowerCase();
  if(h.includes('what i owned'))return 'COLLABORATION';
  if(h.includes('challenge'))return 'VALUE';
  if(h.includes('tricky')||h.includes('rationale')||h.includes('design decision'))return 'RATIONALE';
  if(h.includes('impact')||h.includes('evidence'))return 'IMPACT';
  if(h.includes('validate')||h.includes('test next'))return 'VALIDATION';
  return 'PROCESS';
}
function caseBody(section,heading){
  const decision=[...section.querySelectorAll('p')].find(p=>/decision made:/i.test(p.textContent));
  if(/rationale|design decision/i.test(heading)&&decision)return clean(decision.textContent.replace(/decision made:/i,''));
  return textOf(section,'p, li');
}
function rebuild(){
  sources=[];
  document.querySelectorAll('.project-story-signals article').forEach(article=>{
    add(article,()=>({
      label:textOf(article,'span').toUpperCase()||'PROJECT SIGNAL',
      title:textOf(article,'span'),
      body:textOf(article,'p')
    }));
  });
  document.querySelectorAll('.value-framework-grid article').forEach(article=>{
    add(article,()=>({
      label:textOf(article,'h3').toUpperCase(),
      title:textOf(article,'h3'),
      body:textOf(article,'p')
    }));
  });
  const work=document.querySelector('.work-accordion-section');
  add(work,()=>{
    const card=work.querySelector('.featured-project.is-active')||work.querySelector('.featured-project');
    return {
      label:'SELECTED PROJECT',
      title:textOf(card,'h3'),
      body:textOf(card,'.featured-project-content>p:not(.featured-card-kicker)')
    };
  });
  const bio=document.querySelector('.biography');
  add(bio,()=>{
    const paragraphs=bio.querySelectorAll('.bio-copy p');
    return {
      label:'COLLABORATION',
      title:'How I work with teams',
      body:clean(paragraphs[1]?.textContent||paragraphs[0]?.textContent||'')
    };
  });
  const testimonials=document.querySelector('.testimonials');
  add(testimonials,()=>({
    label:'COLLABORATION',
    title:'Collaboration in practice',
    body:textOf(testimonials,'.subheading')
  }));
  document.querySelectorAll('.case-section').forEach(section=>{
    const heading=textOf(section,'h2');
    if(!heading)return;
    add(section,()=>({
      label:caseLabel(heading),
      title:heading,
      body:caseBody(section,heading)
    }));
  });
  schedule();
}
function bestSource(){
  const line=innerHeight*.46;
  let best=null;
  let bestScore=Infinity;
  sources.forEach((source,index)=>{
    if(!source.el.isConnected)return;
    if(currentHost!==homeHost&&!currentHost.contains(source.el))return;
    const r=source.el.getBoundingClientRect();
    if(r.bottom<110||r.top>innerHeight-70||r.width<20||r.height<20)return;
    const distance=r.top<=line&&r.bottom>=line?0:Math.min(Math.abs(r.top-line),Math.abs(r.bottom-line));
    const score=distance+(index*.001);
    if(score<bestScore){bestScore=score;best={...source,index};}
  });
  return best;
}
function render(){
  ticking=false;
  syncHost();
  const source=bestSource();
  if(!source){
    trail.hidden=true;
    currentKey='';
    return;
  }
  const data=source.getData();
  if(!data?.title&&!data?.body){trail.hidden=true;return;}
  const key=[data.label,data.title,data.body].join('|');
  trail.hidden=false;
  if(key===currentKey)return;
  currentKey=key;
  meta.textContent=String(source.index+1).padStart(2,'0')+' / '+String(sources.length).padStart(2,'0')+' · '+(data.label||'PROCESS');
  title.textContent=data.title||data.label||'Design decision';
  body.textContent=data.body||'';
  trail.classList.remove('is-updating');
  void trail.offsetWidth;
  trail.classList.add('is-updating');
}
function schedule(){
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(render);
}
document.addEventListener('scroll',schedule,true);
addEventListener('resize',schedule,{passive:true});

const observer=new MutationObserver(records=>{
  let rebuildNeeded=false;
  let renderNeeded=false;
  for(const record of records){
    if(record.type==='childList')rebuildNeeded=true;
    if(record.type==='attributes'){
      if(record.attributeName==='open')rebuildNeeded=true;
      if(record.attributeName==='class'&&record.target.matches?.('.featured-project'))renderNeeded=true;
    }
  }
  if(rebuildNeeded){
    clearTimeout(observer.timer);
    observer.timer=setTimeout(rebuild,80);
  }else if(renderNeeded) schedule();
});
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['open','class']});

rebuild();
})();