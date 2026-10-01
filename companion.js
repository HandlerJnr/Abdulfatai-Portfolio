(()=>{
const companion=document.querySelector('#portfolio-companion');
const summon=document.querySelector('.summon-companion');
if(!companion||!summon)return;
const message=companion.querySelector('.companion-message');
const dismiss=companion.querySelector('.companion-dismiss');
const pip=companion.querySelector('.pip');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(pointer:fine)');
let summoned=false,bubbleOpen=false,bubbleTimer=0,tickleTimer=0,tickling=false;
let currentTip='',previousMessage='',lastTipKey='';
let pointerX=innerWidth-90,pointerY=innerHeight-90,targetX=innerWidth-90,targetY=innerHeight-90,currentX=targetX,currentY=targetY,raf=0;
let lastPointerSeen=false;

const tips={
  work:'You’re in selected work. Hover a project to compare it, then Preview opens the complete case study without leaving this page.',
  logos:'You’re in Logos & Marks — a quick look at identity systems and how the marks live across real applications.',
  about:'You’re in About — a short overview of Jamiu’s product-design background across fintech, SaaS and AI.',
  testimonials:'You’re at collaborator feedback — references that speak to delivery, communication and design quality.',
  contact:'You’re at the contact section. Email is the quickest way to start a conversation.'
};
const classTips=[
  ['professional-intro','You’re at the introduction — a quick summary of the kind of complex product work Jamiu takes on.'],
  ['library-teaser','You’re in the wider portfolio — brand work, design systems, credentials and supporting evidence.']
];
const projectTips={
  bizinc:'Bizinc is a two-sided marketplace: customer discovery and booking on one side, business operations on the other.',
  'vista-itss':'Vista is multi-market digital banking, with entity context, approvals and localisation across four subsidiaries.',
  'kremor-ai':'Kremor connects AI-assisted fashion creation to the real production workflow behind the garment.'
};

function clearBubbleTimer(){clearTimeout(bubbleTimer);bubbleTimer=0}
function setBubble(open,autoClose=false){
  bubbleOpen=open;
  companion.classList.toggle('bubble-closed',!open);
  dismiss.tabIndex=open?0:-1;
  dismiss.setAttribute('aria-hidden',open?'false':'true');
  clearBubbleTimer();
  if(open&&autoClose)bubbleTimer=setTimeout(()=>setBubble(false),3800);
}
function sectionContext(){
  const node=document.elementFromPoint(Math.min(innerWidth-1,innerWidth*.5),Math.min(innerHeight-1,innerHeight*.43));
  const section=node?.closest('main>section');
  if(!section)return {key:'intro',text:'I’m Pip. I’ll keep the tour brief and point out what matters as you browse.'};
  if(section.id&&tips[section.id])return {key:section.id,text:tips[section.id]};
  for(const [cls,text] of classTips)if(section.classList.contains(cls))return {key:cls,text};
  return {key:'browse',text:'I’m here if you want a quick read on what you’re looking at.'};
}
function setTip(key,text,show=false){
  if(!text)return;
  currentTip=text;lastTipKey=key;
  if(!tickling){message.textContent=text;previousMessage=text}
  if(show)setBubble(true,true);
}
function updateContext(show=false){
  const ctx=sectionContext();
  if(ctx.key!==lastTipKey||show)setTip(ctx.key,ctx.text,show);
}
function settle(){
  tickling=false;
  companion.classList.remove('is-tickled');
  message.textContent=previousMessage||currentTip;
}
function tickle(){
  if(!summoned)return;
  if(!tickling)previousMessage=message.textContent||currentTip;
  tickling=true;
  companion.classList.add('is-tickled');
  message.textContent='Hehe — still here.';
  clearTimeout(tickleTimer);
  tickleTimer=setTimeout(settle,700);
}
function clampTarget(x,y){
  const bubbleAllowance=bubbleOpen?220:54;
  const minX=bubbleOpen?Math.min(220,innerWidth-54):8;
  const minY=bubbleOpen?104:8;
  return {
    x:Math.max(minX,Math.min(innerWidth-54,x)),
    y:Math.max(minY,Math.min(innerHeight-58,y))
  };
}
function animate(){
  if(!summoned||reduced.matches||!finePointer.matches){raf=0;return}
  const clamped=clampTarget(targetX,targetY);
  currentX+=(clamped.x-currentX)*.14;
  currentY+=(clamped.y-currentY)*.14;
  companion.style.transform=`translate3d(${currentX}px,${currentY}px,0)`;
  const rect=pip.getBoundingClientRect();
  const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const eyeX=Math.max(-2.2,Math.min(2.2,(pointerX-cx)/38));
  const eyeY=Math.max(-1.8,Math.min(1.8,(pointerY-cy)/38));
  pip.style.setProperty('--eye-x',eyeX.toFixed(2)+'px');
  pip.style.setProperty('--eye-y',eyeY.toFixed(2)+'px');
  raf=requestAnimationFrame(animate);
}
function startFollowing(){
  if(reduced.matches||!finePointer.matches){
    companion.style.transform='';
    companion.classList.add('is-docked');
    return;
  }
  companion.classList.remove('is-docked');
  if(!lastPointerSeen){
    pointerX=innerWidth-90;pointerY=innerHeight-90;
    targetX=innerWidth-72;targetY=innerHeight-78;
    currentX=targetX;currentY=targetY;
  }
  if(!raf)raf=requestAnimationFrame(animate);
}
function summonPip(){
  if(summoned)return;
  summoned=true;
  summon.hidden=true;
  companion.hidden=false;
  companion.classList.add('is-summoned');
  updateContext(true);
  startFollowing();
}
summon.addEventListener('click',summonPip);
dismiss.addEventListener('click',e=>{e.stopPropagation();setBubble(false);pip.focus()});
pip.addEventListener('click',()=>{updateContext(false);if(!bubbleOpen)setBubble(true,true);else tickle()});
pip.addEventListener('pointerenter',()=>{if(summoned&&!bubbleOpen)tickle()});
pip.addEventListener('pointerleave',()=>{clearTimeout(tickleTimer);tickleTimer=setTimeout(settle,350)});

addEventListener('pointermove',e=>{
  pointerX=e.clientX;pointerY=e.clientY;lastPointerSeen=true;
  if(!summoned||reduced.matches||!finePointer.matches)return;
  const offsetX=e.clientX>innerWidth-110?-58:22;
  const offsetY=e.clientY>innerHeight-110?-64:26;
  targetX=e.clientX+offsetX;
  targetY=e.clientY+offsetY;
},{passive:true});

addEventListener('scroll',()=>{if(summoned)updateContext(false)},{passive:true});
addEventListener('resize',()=>{if(summoned&&!reduced.matches&&finePointer.matches){targetX=Math.min(targetX,innerWidth-54);targetY=Math.min(targetY,innerHeight-58)}},{passive:true});

document.querySelectorAll('[data-project]').forEach(button=>{
  const show=()=>{
    if(!summoned)return;
    const text=projectTips[button.dataset.project];
    if(text)setTip(button.dataset.project,text,bubbleOpen);
  };
  button.addEventListener('focus',show);
  button.addEventListener('pointerenter',show);
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&summoned&&bubbleOpen&&!document.querySelector('dialog[open]'))setBubble(false);
});
})();