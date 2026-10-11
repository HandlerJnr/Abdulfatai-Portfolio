(()=>{
 const toggle=document.querySelector('.nav-menu-toggle');
 const nav=document.querySelector('.mini-nav');
 const rail=document.querySelector('.project-rail');
 if(!toggle||!nav)return;
 function setMenu(open,restoreFocus=false){
   nav.hidden=!open;
   toggle.setAttribute('aria-expanded',String(open));
   toggle.querySelector('.menu-glyph').textContent=open?'×':'☰';
   if(!open&&restoreFocus)toggle.focus({preventScroll:true});
 }
 toggle.addEventListener('click',()=>setMenu(nav.hidden));
 document.addEventListener('click',event=>{if(!nav.hidden&&!nav.contains(event.target)&&!toggle.contains(event.target))setMenu(false)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!nav.hidden)setMenu(false,true)});
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
 nav.querySelector('.nav-agent')?.addEventListener('click',()=>{
   setMenu(false);
   window.portfolioAgent?.open?.();
 });
 document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>{
   if(!rail)return;
   const tile=rail.querySelector('.project-tile');
   const step=(tile?.getBoundingClientRect().width||220)+13;
   rail.scrollBy({left:Number(button.dataset.slide)*step,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 }));
 rail?.addEventListener('keydown',event=>{
   if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
   event.preventDefault();
   const step=(rail.querySelector('.project-tile')?.getBoundingClientRect().width||220)+13;
   rail.scrollBy({left:(event.key==='ArrowRight'?1:-1)*step,behavior:'smooth'});
 });
})();

