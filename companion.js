(()=>{
const summon=document.querySelector('.summon-companion');
const picker=document.querySelector('#companion-picker');
const companion=document.querySelector('#portfolio-companion');
if(!summon||!picker||!companion)return;

const closeButton=picker.querySelector('.companion-picker-close');
const randomButton=picker.querySelector('.companion-random');
const dismissSelection=picker.querySelector('.companion-dismiss-selection');
const options=[...picker.querySelectorAll('.companion-option')];
const image=companion.querySelector('.companion-character-img');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(pointer:fine)');

let active=null;
let targetX=innerWidth-110,targetY=innerHeight-110;
let currentX=targetX,currentY=targetY;
let lastX=targetX;
let raf=0;
const homeHost=document.body;
let currentHost=homeHost;

function syncFloatingHost(){
  const openDialogs=[...document.querySelectorAll('dialog[open]')];
  const nextHost=openDialogs.length?openDialogs[openDialogs.length-1]:homeHost;
  if(nextHost===currentHost)return;
  currentHost=nextHost;
  nextHost.append(summon,picker,companion);
}
const dialogObserver=new MutationObserver(records=>{
  if(records.some(record=>record.type==='attributes'&&record.attributeName==='open'))syncFloatingHost();
});
dialogObserver.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['open']});

function setPicker(open){
  picker.hidden=!open;
  summon.setAttribute('aria-expanded',String(open));
  summon.classList.toggle('is-open',open);
  companion.classList.toggle('picker-open',open);
  if(open)requestAnimationFrame(()=>picker.querySelector('.companion-option')?.focus({preventScroll:true}));
}
function summonLabel(name){
  summon.querySelector('span').textContent=name?'Companion active':'Choose your sidekick';
  summon.querySelector('strong').textContent=name?'Change companion':'Summon a companion';
  dismissSelection.disabled=!name;
}
function burst(){
  if(reduced.matches)return;
  const fx=document.createElement('span');
  fx.className='companion-burst';
  for(let i=0;i<7;i++){
    const bit=document.createElement('i');
    bit.style.setProperty('--angle',(i*(360/7))+'deg');
    bit.style.setProperty('--distance',(22+Math.random()*18)+'px');
    bit.style.setProperty('--delay',(Math.random()*.08)+'s');
    fx.append(bit);
  }
  companion.append(fx);
  setTimeout(()=>fx.remove(),850);
}
function dismissCompanion(){
  active=null;
  companion.hidden=true;
  companion.classList.remove('is-arriving','is-docked');
  companion.style.transform='';
  companion.style.removeProperty('--companion-tilt');
  image.src='';
  options.forEach(o=>o.classList.remove('is-selected'));
  if(raf){cancelAnimationFrame(raf);raf=0}
  summonLabel(null);
  setPicker(false);
  try{sessionStorage.removeItem('portfolio-companion')}catch{}
}
function choose(option){
  if(!option)return;
  active={id:option.dataset.companion,name:option.dataset.name,src:option.dataset.src};
  image.src=active.src;
  image.alt='';
  options.forEach(o=>o.classList.toggle('is-selected',o===option));
  companion.hidden=false;
  companion.classList.remove('is-arriving');
  void companion.offsetWidth;
  companion.classList.add('is-arriving');
  summonLabel(active.name);
  setPicker(false);
  try{sessionStorage.setItem('portfolio-companion',active.id)}catch{}
  startFollowing();
  burst();
}
function clamp(x,y){
  const w=86,h=86,pad=8;
  return {x:Math.max(pad,Math.min(innerWidth-w-pad,x)),y:Math.max(pad,Math.min(innerHeight-h-pad,y))};
}
function animate(){
  if(!active||reduced.matches||!finePointer.matches){raf=0;return}
  const c=clamp(targetX,targetY);
  currentX+=(c.x-currentX)*.15;
  currentY+=(c.y-currentY)*.15;
  const dx=currentX-lastX;
  const tilt=Math.max(-10,Math.min(10,dx*1.9));
  companion.style.setProperty('--companion-tilt',tilt.toFixed(2)+'deg');
  companion.style.transform='translate3d('+currentX+'px,'+currentY+'px,0)';
  lastX=currentX;
  raf=requestAnimationFrame(animate);
}
function startFollowing(){
  if(!active)return;
  if(reduced.matches||!finePointer.matches){
    companion.classList.add('is-docked');
    companion.style.transform='';
    return;
  }
  companion.classList.remove('is-docked');
  if(!raf)raf=requestAnimationFrame(animate);
}

summon.addEventListener('click',()=>setPicker(picker.hidden));
closeButton.addEventListener('click',()=>setPicker(false));
options.forEach(option=>option.addEventListener('click',()=>choose(option)));
dismissSelection.addEventListener('click',dismissCompanion);
randomButton.addEventListener('click',()=>{
  const pool=options.filter(o=>o.dataset.companion!==active?.id);
  choose(pool[Math.floor(Math.random()*pool.length)]||options[0]);
});
document.addEventListener('pointerdown',e=>{
  if(!picker.hidden&&!picker.contains(e.target)&&!summon.contains(e.target))setPicker(false);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!picker.hidden){setPicker(false);summon.focus()}
});
addEventListener('pointermove',e=>{
  if(!active||reduced.matches||!finePointer.matches)return;
  const right=e.clientX>innerWidth-130;
  const bottom=e.clientY>innerHeight-130;
  targetX=e.clientX+(right?-92:28);
  targetY=e.clientY+(bottom?-94:30);
},{passive:true});
addEventListener('resize',()=>{syncFloatingHost();startFollowing()},{passive:true});

syncFloatingHost();
summonLabel(null);

try{
  const saved=sessionStorage.getItem('portfolio-companion');
  if(saved){
    const option=options.find(o=>o.dataset.companion===saved);
    if(option)choose(option);
  }
}catch{}
})();