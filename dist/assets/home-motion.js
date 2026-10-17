(()=>{
 'use strict';
 // Keep tactile hero typography, without changing the original project carousel.
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const tiles=[...document.querySelectorAll('.hero-header-wrapper .hero-title')];
 const reset=tile=>{
  tile.classList.remove('is-tracking');
  ['--tile-x','--tile-y','--tile-rx','--tile-ry','--tile-r'].forEach(prop=>tile.style.removeProperty(prop));
 };
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
    tile.style.setProperty('--tile-x',x*12+'px');
    tile.style.setProperty('--tile-y',y*10-5+'px');
    tile.style.setProperty('--tile-rx',-y*12+'deg');
    tile.style.setProperty('--tile-ry',x*12+'deg');
    tile.style.setProperty('--tile-r',x*(i%2?-3:3)+'deg');
   });
  },{passive:true});
  const leave=()=>{cancelAnimationFrame(frame);reset(tile)};
  tile.addEventListener('pointerleave',leave);
  tile.addEventListener('pointercancel',leave);
 });
 reduced.addEventListener('change',()=>tiles.forEach(reset));
 fine.addEventListener('change',()=>tiles.forEach(reset));
})();
