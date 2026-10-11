/* In-page portfolio workspace. Reuses the site's existing portfolioAgent instance,
   evidence cards, conversation state and server-side /api/agent retrieval. */
(()=>{
 'use strict';
 const root=document.querySelector('#workspace');
 if(!root)return;
 const dialog=root.querySelector('.portfolio-search.search-embedded');
 const viewer=root.querySelector('.workspace-viewer');
 const welcome=root.querySelector('[data-workspace-empty]');
 const content=root.querySelector('[data-workspace-content]');
 const frame=root.querySelector('[data-workspace-frame]');
 const native=root.querySelector('[data-workspace-native]');
 const title=root.querySelector('[data-workspace-resource-title]');
 const address=root.querySelector('[data-workspace-address]');
 const full=root.querySelector('[data-workspace-open-full]');
 const back=root.querySelector('.workspace-back');
 if(!dialog||!viewer||!frame||!content)return;

 let lastFocus=null;
 let selectedUrl='';
 const STORAGE_KEY='jamiu-workspace-evidence-v1';
 const onMobile=()=>window.matchMedia('(max-width:680px)').matches;
 const permitted=url=>['http:','https:'].includes(url.protocol);
 const local=url=>url.origin===window.location.origin;

 function nativeCard(url,label,description,img){
  native.replaceChildren();
  if(img&&img.startsWith('/')){
   const cover=document.createElement('img');cover.src=img;cover.alt='';
   cover.loading='lazy';native.append(cover);
  }
  const heading=document.createElement('h3');heading.textContent=label;
  const copy=document.createElement('p');
  copy.textContent=description||'This resource is part of Jamiu’s published portfolio. Use the link above to view it in full.';
  const link=document.createElement('a');link.href=url.href;
  link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open this resource in a new tab ↗';
  native.append(heading,copy,link);
 }
 function renderPage(url,label,summary,image){
  selectedUrl=url.href;
  title.textContent=label||'Portfolio resource';
  address.textContent=url.pathname+url.search+url.hash;
  full.href=url.href;
  welcome.hidden=true;
  content.hidden=false;
  frame.hidden=false;
  native.hidden=true;
  // Embedding the homepage inside its own resource viewer would recursively
  // embed the workspace; show a native preview for that specific record.
  if(url.pathname==='/'||url.pathname==='/index.html'){
   frame.hidden=true;frame.removeAttribute('src');
   native.hidden=false;
   nativeCard(url,label||'About Jamiu',summary,image);
  }else{
   native.replaceChildren();
   // The viewer only embeds content hosted by this same portfolio origin.
   // External sites open in a new tab instead of being framed.
   frame.src=url.href;
  }
  viewer.classList.add('has-resource');
  if(onMobile()){
   lastFocus=document.activeElement;
   viewer.classList.add('is-open');
   document.body.classList.add('workspace-preview-open');
   back.focus({preventScroll:true});
  }
  try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify({url:url.pathname+url.search+url.hash,label,summary,image}))}catch{}
 }
 function openResource(raw,label,summary='',image=''){
  let url;
  try{url=new URL(raw,window.location.href)}catch{return}
  if(!permitted(url))return;
  if(!local(url)){
   // Many live applications disallow iframe embedding. Never claim they're embedded.
   window.open(url.href,'_blank','noopener,noreferrer');
   return;
  }
  renderPage(url,label,summary,image);
 }
 function resetResource(){
  frame.removeAttribute('src');frame.hidden=false;
  native.replaceChildren();native.hidden=true;
  content.hidden=true;welcome.hidden=false;
  viewer.classList.remove('has-resource','is-open');
  document.body.classList.remove('workspace-preview-open');
  selectedUrl='';
  try{sessionStorage.removeItem(STORAGE_KEY)}catch{}
  if(onMobile()&&lastFocus&&lastFocus.isConnected){
   lastFocus.focus({preventScroll:true});
  }
  lastFocus=null;
 }
 root.querySelectorAll('[data-workspace-resource]').forEach(button=>{
  button.addEventListener('click',()=>openResource(button.dataset.workspaceResource,button.dataset.resourceTitle||button.textContent.trim()));
 });
 dialog.addEventListener('click',event=>{
  const a=event.target.closest('a.search-result');
  if(!a||!dialog.contains(a))return;
  event.preventDefault();
  const title=a.querySelector('strong')?.textContent?.trim()||'Portfolio resource';
  const description=a.querySelector('div>span')?.textContent?.trim()||'';
  const image=a.querySelector('img')?.getAttribute('src')||'';
  openResource(a.href,title,description,image);
 });
 back?.addEventListener('click',resetResource);
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&viewer.classList.contains('is-open')){
   event.preventDefault();resetResource();
  }
 });
 // Preserve resource selection while moving between chat messages in this tab.
 try{
  const data=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null');
  if(data&&typeof data.url==='string'&&data.url.startsWith('/')&&!data.url.startsWith('//')){
   openResource(data.url,String(data.label||'Portfolio resource'),String(data.summary||''),String(data.image||''));
  }
 }catch{}
 // If the user is on mobile, never leave an invisible fixed overlay blocking scrolling
 // after a resize while the resource is open.
 window.addEventListener('resize',()=>{
  if(!onMobile()){
   viewer.classList.remove('is-open');
   document.body.classList.remove('workspace-preview-open');
  }else if(selectedUrl){
   viewer.classList.add('is-open');
   document.body.classList.add('workspace-preview-open');
  }
 },{passive:true});
 frame.addEventListener('load',()=>{
  if(!frame.src)return;
  try{
   const url=new URL(frame.contentWindow.location.href);
   if(local(url)){
    address.textContent=url.pathname+url.search+url.hash;
    full.href=url.href;
   }
  }catch{/* Same-origin pages are expected; leave original source URL for PDF viewers. */}
 });
})();
