(()=>{
 const key='jamiu-portfolio-view';
 const save=value=>{try{localStorage.setItem(key,value)}catch{}};
 const path=location.pathname.replace(/\/$/,'')||'/';
 const simple=path==='/simple'||path.startsWith('/simple/');
 if(simple)save('simple');
 const visualPath=simple?(path!=='/simple'?path.replace('/simple',''):'/'):path;
 const simplePath=simple?path:(path!=='/'?'/simple'+path:'/simple');
 const mode=document.createElement('nav');mode.className='portfolio-mode-switch';mode.setAttribute('aria-label','Portfolio view');
 mode.innerHTML='<a href="'+visualPath+'" data-portfolio-view="visual"'+(!simple?' aria-current="page"':'')+'>Visual</a><a href="'+simplePath+'" data-portfolio-view="simple"'+(simple?' aria-current="page"':'')+'>Simple</a>';
 if(simple){document.querySelector('.portfolio-mode-mount')?.replaceWith(mode)}
 else{
  const wrapper=document.querySelector('.header .nav-wrapper'),trigger=wrapper?.querySelector('.portfolio-menu-trigger');
  wrapper?.querySelector('.portfolio-view-control')?.remove();
  if(trigger)wrapper.insertBefore(mode,trigger);
 }
 if(simple){
  const trigger=document.querySelector('.simple-menu-trigger'),menu=document.querySelector('#simple-navigation');
  const setOpen=open=>{
   if(!trigger||!menu)return;
   menu.hidden=!open;menu.inert=!open;trigger.setAttribute('aria-expanded',String(open));trigger.setAttribute('aria-label',open?'Close navigation':'Open navigation');document.body.classList.toggle('simple-menu-open',open);
   document.querySelectorAll('body>main,body>footer').forEach(el=>el.inert=open);
  };
  trigger?.addEventListener('click',()=>setOpen(trigger.getAttribute('aria-expanded')!=='true'));
  menu?.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',event=>{
   if(trigger?.getAttribute('aria-expanded')!=='true')return;
   if(event.key==='Escape'){setOpen(false);trigger.focus()}
   if(event.key==='Tab'){event.preventDefault();const controls=[trigger,...menu.querySelectorAll('a')],i=controls.indexOf(document.activeElement);controls[(i+(event.shiftKey?-1:1)+controls.length)%controls.length].focus()}
  });
  const header=document.querySelector('.simple-header');
  const measure=()=>document.documentElement.style.setProperty('--simple-header-height',header.getBoundingClientRect().height+'px');
  measure();if(typeof ResizeObserver!=='undefined')new ResizeObserver(measure).observe(header);
  addEventListener('pageshow',()=>setOpen(false));
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
