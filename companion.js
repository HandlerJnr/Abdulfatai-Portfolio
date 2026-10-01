(()=>{
const companionMountMarkup="<button class=\"summon-companion\" type=\"button\" aria-controls=\"companion-picker\" aria-expanded=\"false\"><span>Choose your sidekick</span><strong>Summon a companion</strong></button><div class=\"companion-picker\" id=\"companion-picker\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"companion-picker-title\" hidden><div class=\"companion-picker-head\"><div><span>POCKET-SIZED CHAOS</span><strong id=\"companion-picker-title\">Who’s coming with you?</strong></div><button class=\"companion-picker-close\" type=\"button\" aria-label=\"Close companion picker\" title=\"Close\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25\"/></svg></button></div><div class=\"companion-grid\"><button class=\"companion-option\" type=\"button\" data-companion=\"piplup\" data-name=\"Piplup\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Piplup</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"clefairy\" data-name=\"Clefairy\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Clefairy</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"eevee\" data-name=\"Eevee\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Eevee</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"charmander\" data-name=\"Charmander\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Charmander</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"raichu\" data-name=\"Raichu\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Raichu</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"psyduck\" data-name=\"Psyduck\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Psyduck</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"jigglypuff\" data-name=\"Jigglypuff\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Jigglypuff</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"cubone\" data-name=\"Cubone\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Cubone</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"mew\" data-name=\"Mew\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Mew</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"pikachu\" data-name=\"Pikachu\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Pikachu</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"bulbasaur\" data-name=\"Bulbasaur\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Bulbasaur</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"meowth\" data-name=\"Meowth\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Meowth</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"squirtle\" data-name=\"Squirtle\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Squirtle</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"gengar\" data-name=\"Gengar\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Gengar</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"espeon\" data-name=\"Espeon\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Espeon</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"lucario\" data-name=\"Lucario\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Lucario</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"sylveon\" data-name=\"Sylveon\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Sylveon</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"charizard\" data-name=\"Charizard\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Charizard</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"rowlet\" data-name=\"Rowlet\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Rowlet</span></button><button class=\"companion-option\" type=\"button\" data-companion=\"yveltal\" data-name=\"Yveltal\" data-src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png\"><span class=\"companion-option-art\"><img src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png\" alt=\"\" loading=\"lazy\" decoding=\"async\"></span><span>Yveltal</span></button></div><div class=\"companion-picker-foot\"><span>Choose anytime. Dismiss anytime.</span><div class=\"companion-picker-actions\"><button class=\"companion-dismiss-selection\" type=\"button\">Dismiss companion</button><button class=\"companion-random\" type=\"button\">Surprise me</button></div></div></div><aside id=\"portfolio-companion\" class=\"portfolio-companion pokemon-companion\" aria-label=\"Selected companion\" hidden><span class=\"companion-shadow\" aria-hidden=\"true\"></span><button class=\"companion-character\" type=\"button\" aria-label=\"Pop companion confetti\"><img class=\"companion-character-img\" src=\"\" alt=\"\"></button></aside>";
if(!document.querySelector('.summon-companion')||!document.querySelector('#companion-picker')||!document.querySelector('#portfolio-companion')){
  document.querySelector('.summon-companion')?.remove();
  document.querySelector('#companion-picker')?.remove();
  document.querySelector('#portfolio-companion')?.remove();
  document.body.insertAdjacentHTML('beforeend',companionMountMarkup);
}
const summon=document.querySelector('.summon-companion');
const picker=document.querySelector('#companion-picker');
const companion=document.querySelector('#portfolio-companion');
if(!summon||!picker||!companion)return;

const closeButton=picker.querySelector('.companion-picker-close');
const randomButton=picker.querySelector('.companion-random');
const dismissSelection=picker.querySelector('.companion-dismiss-selection');
const options=[...picker.querySelectorAll('.companion-option')];
const image=companion.querySelector('.companion-character-img');
const character=companion.querySelector('.companion-character');
character.addEventListener('click',()=>{if(active){wake();react('happy',850);burst()}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(pointer:fine)');
const themeRoot=document.documentElement;
const themes={
  piplup:{accent:'#4f7fb8',accent2:'#d2a64c',soft:'#eaf2f8',ink:'#17324d',on:'#ffffff',confetti:['#4f7fb8','#78a8d1','#d2a64c','#e9c979','#dceaf5','#2d5d8e']},
  clefairy:{accent:'#d985a5',accent2:'#a86486',soft:'#fae9f0',ink:'#5d3044',on:'#ffffff',confetti:['#d985a5','#efb2c9','#a86486','#f4d7e2','#c785aa','#7c5870']},
  eevee:{accent:'#a56c43',accent2:'#d6b27f',soft:'#f5ebdf',ink:'#4b3020',on:'#ffffff',confetti:['#a56c43','#d6b27f','#f2dfc5','#7b4f33','#c89261','#ead2ae']},
  charmander:{accent:'#d8672d',accent2:'#f1a04a',soft:'#fff0e3',ink:'#552312',on:'#ffffff',confetti:['#d8672d','#f1a04a','#f6c15d','#ef7741','#ffd39a','#9c3d1e']},
  raichu:{accent:'#c77920',accent2:'#8a653a',soft:'#f8ecd8',ink:'#472b0d',on:'#ffffff',confetti:['#c77920','#e2a944','#8a653a','#f1ce7a','#b35f1d','#6f4b2c']},
  psyduck:{accent:'#d8b52d',accent2:'#5c86aa',soft:'#faf3d7',ink:'#44390c',on:'#2f2917',confetti:['#d8b52d','#f2d765','#5c86aa','#8cb0cb','#f6e79b','#b08d18']},
  jigglypuff:{accent:'#d783a5',accent2:'#ad6488',soft:'#fae9f1',ink:'#5c3145',on:'#ffffff',confetti:['#d783a5','#efb1c8','#ad6488','#f7d7e4','#c97aa0','#8e5572']},
  cubone:{accent:'#886749',accent2:'#c19a6b',soft:'#f1e8de',ink:'#3c2c20',on:'#ffffff',confetti:['#886749','#c19a6b','#e2c6a3','#6c513b','#b48355','#d8b88e']},
  mew:{accent:'#cf8faf',accent2:'#8875b0',soft:'#f8eaf3',ink:'#4f3043',on:'#ffffff',confetti:['#cf8faf','#eebbd1','#8875b0','#b8a6d5','#f5d8e6','#a66b91']},
  pikachu:{accent:'#d5b21e',accent2:'#514a3a',soft:'#fff7d6',ink:'#3d3307',on:'#2e2917',confetti:['#d5b21e','#f1d64d','#514a3a','#f7e78d','#bd9412','#e5bf28']},
  bulbasaur:{accent:'#4f9871',accent2:'#5a8db4',soft:'#e8f4ed',ink:'#244a35',on:'#ffffff',confetti:['#4f9871','#76b48f','#5a8db4','#8ab4d0','#b5d9c4','#397c59']},
  meowth:{accent:'#b99a4e',accent2:'#78613a',soft:'#f7f0da',ink:'#40340f',on:'#2f2917',confetti:['#b99a4e','#e0c77f','#78613a','#f0dfaa','#9d7d32','#d3b565']},
  squirtle:{accent:'#4e96b5',accent2:'#8c6747',soft:'#e7f4f7',ink:'#234450',on:'#ffffff',confetti:['#4e96b5','#7eb6cd','#8c6747','#c29a72','#b8dce7','#347b9a']},
  gengar:{accent:'#7151a0',accent2:'#9e73b5',soft:'#eee8f5',ink:'#332348',on:'#ffffff',confetti:['#7151a0','#9e73b5','#b79acb','#5c3f8d','#d0bce0','#825daf']},
  espeon:{accent:'#8d6ab1',accent2:'#d179a2',soft:'#f1e9f7',ink:'#3f2c52',on:'#ffffff',confetti:['#8d6ab1','#b596cc','#d179a2','#edb5cb','#6f4f96','#d9cae7']},
  lucario:{accent:'#2f79a8',accent2:'#d2a43a',soft:'#e6f1f7',ink:'#18394d',on:'#ffffff',confetti:['#2f79a8','#65a7cc','#d2a43a','#f0cb68','#1f536f','#a8cedf']},
  sylveon:{accent:'#d77fa6',accent2:'#69a8c9',soft:'#faeaf3',ink:'#5b3047',on:'#ffffff',confetti:['#d77fa6','#efb3cc','#69a8c9','#a8d2e5','#f4d6e3','#4f8eae']},
  charizard:{accent:'#df6a2d',accent2:'#2c98a9',soft:'#fff0e4',ink:'#572411',on:'#ffffff',confetti:['#df6a2d','#f39a50','#2c98a9','#67bec8','#f6c36c','#9e431f']},
  rowlet:{accent:'#638d58',accent2:'#b88b4e',soft:'#edf4e9',ink:'#2e4829',on:'#ffffff',confetti:['#638d58','#8db183','#b88b4e','#d7b77f','#d9ead3','#496f42']},
  yveltal:{accent:'#b73b48',accent2:'#302d34',soft:'#f8e8ea',ink:'#47191f',on:'#ffffff',confetti:['#b73b48','#e06b75','#302d34','#6a626e','#f0a1a8','#8e2833']}
};
const themeProps=['--poke-accent','--poke-accent-2','--poke-soft','--poke-ink','--poke-on-accent'];

function applyTheme(id){
  const theme=themes[id];
  if(!theme){
    themeRoot.classList.remove('companion-themed');
    themeRoot.removeAttribute('data-companion-theme');
    themeProps.forEach(prop=>themeRoot.style.removeProperty(prop));
    document.body.classList.remove('companion-route-themed');
    return;
  }
  themeRoot.classList.add('companion-themed');
  themeRoot.dataset.companionTheme=id;
  themeRoot.style.setProperty('--poke-accent',theme.accent);
  themeRoot.style.setProperty('--poke-accent-2',theme.accent2);
  themeRoot.style.setProperty('--poke-soft',theme.soft);
  themeRoot.style.setProperty('--poke-ink',theme.ink);
  themeRoot.style.setProperty('--poke-on-accent',theme.on);
  document.body.classList.add('companion-route-themed');
}

let active=null;
let targetX=innerWidth-110,targetY=innerHeight-110;
let currentX=targetX,currentY=targetY;
let lastX=targetX;
let raf=0;
let perchTarget=null;
const perchSelector='button:not(:disabled),a.button';
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
  companion.querySelector('.companion-burst')?.remove();
  const fx=document.createElement('span');
  fx.className='companion-burst';
  fx.setAttribute('aria-hidden','true');
  const colors=themes[active?.id]?.confetti||['#f5c451','#ef6f6c','#5e8ff7','#6fc49a','#a979e9','#ff9a52'];
  const count=18;
  for(let i=0;i<count;i++){
    const angle=(Math.PI*2/count)*i+(Math.random()-.5)*.22;
    const distance=34+Math.random()*34;
    const bit=document.createElement('i');
    if(i%4===0)bit.classList.add('is-round');
    const size=4+Math.random()*4;
    bit.style.setProperty('--confetti-x',(Math.cos(angle)*distance).toFixed(1)+'px');
    bit.style.setProperty('--confetti-y',(Math.sin(angle)*distance).toFixed(1)+'px');
    bit.style.setProperty('--confetti-size',size.toFixed(1)+'px');
    bit.style.setProperty('--confetti-color',colors[i%colors.length]);
    bit.style.setProperty('--confetti-delay',(Math.random()*.07).toFixed(2)+'s');
    bit.style.setProperty('--confetti-spin',((Math.random()>.5?1:-1)*(180+Math.random()*420)).toFixed(0)+'deg');
    fx.append(bit);
  }
  companion.append(fx);
  setTimeout(()=>fx.remove(),1050);
}
function isPerchable(el){
  if(!(el instanceof Element))return false;
  const target=el.closest(perchSelector);
  if(!target||target.closest('.companion-picker'))return false;
  if(target===companion||target.closest('#portfolio-companion'))return false;
  if(target.matches('[aria-disabled="true"],[hidden]'))return false;
  const rect=target.getBoundingClientRect();
  if(rect.width<18||rect.height<18||rect.bottom<0||rect.top>innerHeight)return false;
  const style=getComputedStyle(target);
  if(style.display==='none'||style.visibility==='hidden'||style.pointerEvents==='none')return false;
  return target;
}
function nearbyPerch(x,y,origin){
  const direct=isPerchable(origin);
  if(direct)return direct;
  const probes=[
    [0,-22],[22,0],[0,22],[-22,0],
    [16,-16],[16,16],[-16,16],[-16,-16]
  ];
  for(const [dx,dy] of probes){
    const px=Math.max(0,Math.min(innerWidth-1,x+dx));
    const py=Math.max(0,Math.min(innerHeight-1,y+dy));
    const found=isPerchable(document.elementFromPoint(px,py));
    if(found)return found;
  }
  return null;
}
function setPerch(target){
  if(target===perchTarget)return;
  perchTarget?.classList.remove('companion-perch-target');
  perchTarget=target;
  if(perchTarget){
    perchTarget.classList.add('companion-perch-target');
    companion.classList.remove('is-perched');
    void companion.offsetWidth;
    companion.classList.add('is-perched');
    companion.style.setProperty('--companion-tilt','0deg');
  }else{
    companion.classList.remove('is-perched');
  }
}
function perchPosition(){
  if(!perchTarget||!perchTarget.isConnected)return null;
  const rect=perchTarget.getBoundingClientRect();
  if(rect.bottom<0||rect.top>innerHeight||rect.right<0||rect.left>innerWidth)return null;
  const x=rect.left+(rect.width/2)-43;
  const y=rect.top-78;
  return clamp(x,y);
}
function dismissCompanion(){
  clearTimeout(restTimer);clearTimeout(reactionTimer);reacting=false;delete companion.dataset.state;
  setPerch(null);
  active=null;
  companion.hidden=true;
  companion.classList.remove('is-arriving','is-docked','is-perched');
  companion.style.transform='';
  companion.style.removeProperty('--companion-tilt');
  image.src='';
  options.forEach(o=>o.classList.remove('is-selected'));
  if(raf){cancelAnimationFrame(raf);raf=0}
  summonLabel(null);
  setPicker(false);
  applyTheme(null);
  try{sessionStorage.removeItem('portfolio-companion')}catch{}
}
function choose(option,{celebrate=true}={}){
  if(!option)return;
  setPerch(null);
  active={id:option.dataset.companion,name:option.dataset.name,src:option.dataset.src};
  applyTheme(active.id);
  image.src=active.src;
  state('idle');wake();
  character.setAttribute('aria-label','Pop confetti with '+active.name);
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
  if(celebrate)burst();
}
let restTimer=0,reactionTimer=0,reacting=false;
function refreshArtwork(){
  if(!active)return;
  const animated=active.id==='piplup';
  companion.classList.toggle('has-sprite',animated);
  const src=animated?(reduced.matches||document.hidden||companion.dataset.state==='sleepy'?'/assets/companions/piplup-still.png':'/assets/companions/piplup.gif'):active.src;
  if(image.getAttribute('src')!==src)image.src=src;
}
function state(value){companion.dataset.state=value;refreshArtwork()}
function wake(){
  if(!active)return;
  clearTimeout(restTimer);
  if(companion.dataset.state==='sleepy')state('idle');
  restTimer=setTimeout(()=>{if(active&&!reacting)state('sleepy')},12000);
}
function react(value,duration){
  if(!active||reduced.matches)return;
  reacting=true;clearTimeout(reactionTimer);state(value);
  reactionTimer=setTimeout(()=>{reacting=false;if(active)state('idle')},duration);
}
character.addEventListener('pointerenter',()=>{wake();react('curious',1000)});
character.addEventListener('focus',()=>{wake();react('curious',1000)});
reduced.addEventListener('change',()=>{if(raf){cancelAnimationFrame(raf);raf=0}reacting=false;clearTimeout(reactionTimer);if(active){state('idle');startFollowing()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf){cancelAnimationFrame(raf);raf=0}clearTimeout(restTimer)}else if(active){wake();startFollowing()}refreshArtwork()});
function clamp(x,y){
  const w=86,h=86,pad=8;
  return {x:Math.max(pad,Math.min(innerWidth-w-pad,x)),y:Math.max(pad,Math.min(innerHeight-h-pad,y))};
}
function animate(){
  if(!active||document.hidden||reduced.matches||!finePointer.matches){raf=0;return}
  let c=perchPosition();
  if(perchTarget&&!c){
    setPerch(null);
    c=clamp(targetX,targetY);
  }
  if(!c)c=clamp(targetX,targetY);
  const distance=Math.hypot(c.x-currentX,c.y-currentY);
  if(!reacting&&companion.dataset.state!=='sleepy')state(distance>4?'moving':'idle');
  const ease=perchTarget?.isConnected ? .24 : .15;
  currentX+=(c.x-currentX)*ease;
  currentY+=(c.y-currentY)*ease;
  const dx=currentX-lastX;
  const tilt=perchTarget?0:Math.max(-10,Math.min(10,dx*1.9));
  companion.style.setProperty('--companion-tilt',tilt.toFixed(2)+'deg');
  companion.style.transform='translate3d('+currentX+'px,'+currentY+'px,0)';
  lastX=currentX;
  if(distance>0.5)raf=requestAnimationFrame(animate);else raf=0;
}
function startFollowing(){
  if(!active)return;
  if(reduced.matches||!finePointer.matches){
    setPerch(null);
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
  if(companion.contains(e.target))return;
  wake();startFollowing();
  const target=nearbyPerch(e.clientX,e.clientY,e.target);
  setPerch(target);
  if(target)return;
  const right=e.clientX>innerWidth-130;
  const bottom=e.clientY>innerHeight-130;
  targetX=e.clientX+(right?-92:28);
  targetY=e.clientY+(bottom?-94:30);
},{passive:true});
addEventListener('scroll',()=>{wake();if(perchTarget&&!raf)raf=requestAnimationFrame(animate)},{passive:true});
addEventListener('resize',()=>{syncFloatingHost();setPerch(null);startFollowing()},{passive:true});

syncFloatingHost();
summonLabel(null);
applyTheme(null);

try{
  const saved=sessionStorage.getItem('portfolio-companion');
  if(saved){
    const option=options.find(o=>o.dataset.companion===saved);
    if(option)choose(option,{celebrate:false});
  }
}catch{}
})();