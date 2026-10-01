(()=>{
const CHANNEL='jamiu-portfolio-presence-v1';
const TTL=12000;
const HEARTBEAT=4000;
const MOVE_INTERVAL=55;
const palette=['#A15C45','#3A7D78','#6C63A8','#68864A','#B07A2C','#3E6F9A'];
const id=(crypto.randomUUID?.()||('visitor-'+Math.random().toString(36).slice(2)));
const color=palette[Math.floor(Math.random()*palette.length)];
const peers=new Map();
let hidden=false,lastMove=0,lastSection='',socket=null;

const status=document.createElement('aside');
status.className='live-presence';
status.innerHTML='<div class="live-presence-copy"><span class="live-presence-dot" aria-hidden="true"></span><div><small>LIVE PRESENCE</small><strong>Just you exploring</strong></div></div><button class="live-presence-toggle" type="button">Hide visitors</button>';

const layer=document.createElement('div');
layer.className='presence-layer';
layer.setAttribute('aria-hidden','true');
document.body.append(status,layer);

let currentHost=document.body;
function syncHost(){
  const dialogs=[...document.querySelectorAll('dialog[open]')];
  const next=dialogs.length?dialogs[dialogs.length-1]:document.body;
  if(next===currentHost)return;
  currentHost=next;
  next.append(layer,status);
}
new MutationObserver(records=>{
  if(records.some(r=>r.type==='attributes'&&r.attributeName==='open'))syncHost();
}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['open']});

function sectionName(){
  const open=document.querySelector('dialog[open]');
  if(open?.classList.contains('project-drawer'))return 'a project case study';
  if(open?.classList.contains('identity-drawer'))return 'a brand story';
  if(open?.classList.contains('cv-drawer'))return 'the CV';
  const node=document.elementFromPoint(innerWidth*.5,Math.min(innerHeight-1,innerHeight*.45));
  const section=node?.closest('main>section[id]');
  if(!section)return 'the portfolio';
  const names={work:'featured work',about:'about',logos:'logos & marks',testimonials:'kind words',contact:'contact'};
  return names[section.id]||section.id.replace(/-/g,' ');
}

function labelFor(peer){
  return peer.country?'Visitor from '+peer.country:'Another visitor';
}
function cursorFor(peer){
  let el=layer.querySelector('[data-presence-id="'+CSS.escape(peer.id)+'"]');
  if(el)return el;
  el=document.createElement('span');
  el.className='presence-cursor';
  el.dataset.presenceId=peer.id;
  el.innerHTML='<i></i><span></span>';
  layer.append(el);
  return el;
}
function render(){
  const now=Date.now();
  for(const [peerId,peer] of peers){
    if(now-peer.lastSeen>TTL){
      peers.delete(peerId);
      layer.querySelector('[data-presence-id="'+CSS.escape(peerId)+'"]')?.remove();
      continue;
    }
    const el=cursorFor(peer);
    el.style.setProperty('--presence-color',peer.color||'#3A7D78');
    el.style.transform='translate3d('+(peer.x*innerWidth)+'px,'+(peer.y*innerHeight)+'px,0)';
    el.querySelector('span').textContent=labelFor(peer);
    el.title=peer.section?'Viewing '+peer.section:'';
  }
  const total=peers.size+1;
  status.querySelector('strong').textContent=total===1?'Just you exploring':total+' people exploring now';
  status.classList.toggle('has-visitors',peers.size>0);
  layer.hidden=hidden;
  status.classList.toggle('visitors-hidden',hidden);
  status.querySelector('.live-presence-toggle').textContent=hidden?'Show visitors':'Hide visitors';
}
function receive(msg){
  if(!msg||msg.id===id)return;
  if(msg.type==='leave'){
    peers.delete(msg.id);
    layer.querySelector('[data-presence-id="'+CSS.escape(msg.id)+'"]')?.remove();
    render();
    return;
  }
  peers.set(msg.id,{
    id:msg.id,
    x:Number.isFinite(msg.x)?msg.x:.5,
    y:Number.isFinite(msg.y)?msg.y:.5,
    color:msg.color||'#3A7D78',
    country:msg.country||null,
    section:msg.section||'',
    lastSeen:Date.now()
  });
  render();
}

let bc=null;
try{
  bc=new BroadcastChannel(CHANNEL);
  bc.addEventListener('message',e=>receive(e.data));
}catch{}

function storageReceive(e){
  if(e.key!==CHANNEL||!e.newValue)return;
  try{receive(JSON.parse(e.newValue))}catch{}
}
addEventListener('storage',storageReceive);

const wsUrl=document.querySelector('meta[name="portfolio-presence-ws"]')?.content||window.PORTFOLIO_PRESENCE_WS||'';
if(wsUrl){
  try{
    socket=new WebSocket(wsUrl);
    socket.addEventListener('message',e=>{try{receive(JSON.parse(e.data))}catch{}});
  }catch{}
}

function send(payload){
  const msg={...payload,id,color,section:lastSection||sectionName(),t:Date.now()};
  if(bc)bc.postMessage(msg);
  else{
    try{
      localStorage.setItem(CHANNEL,JSON.stringify(msg));
      localStorage.removeItem(CHANNEL);
    }catch{}
  }
  if(socket?.readyState===WebSocket.OPEN){
    try{socket.send(JSON.stringify(msg))}catch{}
  }
}

function heartbeat(){
  lastSection=sectionName();
  send({type:'heartbeat'});
}
heartbeat();
const heartbeatTimer=setInterval(heartbeat,HEARTBEAT);
const cleanupTimer=setInterval(render,3000);

addEventListener('pointermove',e=>{
  const now=performance.now();
  if(now-lastMove<MOVE_INTERVAL)return;
  lastMove=now;
  lastSection=sectionName();
  send({type:'cursor',x:e.clientX/innerWidth,y:e.clientY/innerHeight});
},{passive:true});

addEventListener('scroll',()=>{
  const section=sectionName();
  if(section!==lastSection){lastSection=section;send({type:'heartbeat'})}
},{passive:true});

status.querySelector('.live-presence-toggle').addEventListener('click',()=>{
  hidden=!hidden;
  render();
});

addEventListener('pagehide',()=>{
  send({type:'leave'});
  clearInterval(heartbeatTimer);
  clearInterval(cleanupTimer);
  bc?.close();
});

syncHost();
render();
})();