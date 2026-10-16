(()=>{
 'use strict';
 const section=document.querySelector('.home-featured-work');
 if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const desktop=matchMedia('(min-width: 992px) and (min-height: 700px)');
 const slides=[...section.querySelectorAll('.single-project-slider')];
 const cards=slides.map(slide=>slide.querySelector('.portfolio-project-card'));
 const mask=section.querySelector('.project-slider-mask');
 section.classList.add('motion-deck');
 mask?.removeAttribute('tabindex');
 mask?.setAttribute('aria-label','Selected design case studies');
 slides.forEach((slide,i)=>{
  slide.style.setProperty('--case-index',i);
  const number=document.createElement('span');number.className='motion-case-number';number.setAttribute('aria-hidden','true');
  number.textContent=String(i+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  cards[i]?.querySelector('.single-project-content')?.prepend(number);
 });
 const track=document.createElement('div');track.className='motion-work-track';track.setAttribute('aria-hidden','true');
 track.textContent='Scroll to explore · '+String(slides.length).padStart(2,'0')+' selected stories';
 section.querySelector('.portfolio-work-intro')?.after(track);
 const animations=new Set();
 const animate=(el,frames,options)=>{
  if(reduced.matches||typeof el.animate!=='function')return;
  const animation=el.animate(frames,options);animations.add(animation);
  animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));
 };
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(entry.target.matches('.title-wrapper')){
    animate(entry.target,[{transform:'translateY(36px) rotate(-2deg)',opacity:.35},{transform:'translateY(0) rotate(0)',opacity:1}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
   }else{
    const content=entry.target.querySelector('.single-project-content');
    if(content)animate(content,[{transform:'translateY(24px)',opacity:.2},{transform:'translateY(0)',opacity:1}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});
   }
  }),{threshold:.12});
  const heading=section.querySelector('.title-wrapper');if(heading)observer.observe(heading);
  cards.filter(Boolean).forEach(card=>observer.observe(card));
 }
 const tiles=[...document.querySelectorAll('.hero-header-wrapper .hero-title')];
 const reset=tile=>{tile.classList.remove('is-tracking');['--tile-x','--tile-y','--tile-rx','--tile-ry','--tile-r'].forEach(prop=>tile.style.removeProperty(prop))};
 tiles.forEach((tile,i)=>{
  let frame=0;
  tile.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches)return;
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const rect=tile.getBoundingClientRect();
    const x=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5));
    const y=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));
    tile.classList.add('is-tracking');
    tile.style.setProperty('--tile-x',x*12+'px');tile.style.setProperty('--tile-y',y*10-5+'px');
    tile.style.setProperty('--tile-rx',-y*12+'deg');tile.style.setProperty('--tile-ry',x*12+'deg');tile.style.setProperty('--tile-r',x*(i%2? -3:3)+'deg');
   });
  },{passive:true});
  const leave=()=>{cancelAnimationFrame(frame);reset(tile)};
  tile.addEventListener('pointerleave',leave);tile.addEventListener('pointercancel',leave);
 });
 let scheduled=false;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function render(){
  scheduled=false;
  const rect=section.getBoundingClientRect(),vh=innerHeight;
  if(rect.bottom<0||rect.top>vh)return;
  track.style.setProperty('--work-progress',clamp((vh-rect.top)/(rect.height+vh)));
  cards.forEach((card,i)=>{
   if(!card)return;
   let p=0;
   if(desktop.matches&&!reduced.matches&&slides[i+1]){
    const top=100+(i+1)*8;
    p=clamp((vh*.85-slides[i+1].getBoundingClientRect().top)/(vh*.85-top));
   }
   card.style.setProperty('--card-scale',1-p*.045);
   card.style.setProperty('--card-turn',p*(i%2? .65:-.65)+'deg');
   card.style.setProperty('--card-lift',-p*12+'px');
  });
 }
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(render)}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 reduced.addEventListener('change',()=>{animations.forEach(animation=>animation.cancel());tiles.forEach(reset);schedule()});
 fine.addEventListener('change',()=>tiles.forEach(reset));
 // A keyboard-focused case study always remains above the visual stack.
 slides.forEach(slide=>{slide.addEventListener('focusin',()=>slide.style.zIndex='20');slide.addEventListener('focusout',()=>slide.style.removeProperty('z-index'))});
 addEventListener('pageshow',schedule);render();
})();
