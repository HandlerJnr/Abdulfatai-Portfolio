(()=>{
 const key='jamiu-portfolio-view';
 const save=value=>{try{localStorage.setItem(key,value)}catch{}};
 const path=location.pathname.replace(/\/$/,'')||'/';
 const simple=path==='/simple'||path.startsWith('/simple/');
 if(simple)save('simple');
 if(!simple){
  const wrapper=document.querySelector('.header .nav-wrapper');
  const trigger=wrapper?.querySelector('.portfolio-menu-trigger');
  if(trigger&&!wrapper.querySelector('.portfolio-view-control')){
   const control=document.createElement('details');control.className='portfolio-view-control';
   const simplePath=path.startsWith('/work/')?'/simple'+path:'/simple';
   control.innerHTML='<summary aria-label="Choose portfolio view">View <span aria-hidden="true">⌄</span></summary><nav aria-label="Choose portfolio view"><a href="'+path+'" data-portfolio-view="visual" aria-current="page">Visual view</a><a href="'+simplePath+'" data-portfolio-view="simple">Simple view</a></nav>';
   wrapper.insertBefore(control,trigger);
   document.addEventListener('click',event=>{if(!control.contains(event.target))control.open=false});
   document.addEventListener('keydown',event=>{if(event.key==='Escape'&&control.open){control.open=false;control.querySelector('summary').focus()}});
  }
 }
 let switching=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function transition(destination,view,replace=false){
  if(switching)return;
  switching=true;
  const overlay=document.createElement('div');
  overlay.className='portfolio-view-transition';
  overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
  const text=document.createElement('p');text.textContent='Loading '+view+' view';
  const dot=document.createElement('span');dot.className='portfolio-view-transition-dot';dot.setAttribute('aria-hidden','true');
  overlay.append(dot,text);document.body.append(overlay);
  requestAnimationFrame(()=>overlay.classList.add('is-visible'));
  try{sessionStorage.setItem('portfolio-view-arrival',view)}catch{}
  setTimeout(()=>{if(replace)location.replace(destination);else location.assign(destination)},reduced()?0:280);
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[data-portfolio-view]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank')return;
  save(link.dataset.portfolioView);
  if(link.dataset.portfolioView===(simple?'simple':'visual'))return;
  event.preventDefault();transition(link.href,link.dataset.portfolioView);
 });
 try{
  const arrival=sessionStorage.getItem('portfolio-view-arrival');
  sessionStorage.removeItem('portfolio-view-arrival');
  if(arrival===(simple?'simple':'visual')&&!reduced()){
   const veil=document.createElement('div');veil.className='portfolio-view-transition is-visible';veil.setAttribute('aria-hidden','true');document.body.append(veil);
   requestAnimationFrame(()=>requestAnimationFrame(()=>{veil.classList.remove('is-visible');setTimeout(()=>veil.remove(),240)}));
  }
 }catch{}
 addEventListener('pageshow',event=>{if(!event.persisted)return;switching=false;document.querySelectorAll('.portfolio-view-transition').forEach(el=>el.remove())});
 if(path==='/'&&!new URLSearchParams(location.search).has('view')){
  try{if(localStorage.getItem(key)==='simple')transition('/simple','simple',true)}catch{}
 }
})();
