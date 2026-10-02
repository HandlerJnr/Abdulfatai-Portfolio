(()=>{
 const section=document.querySelector('#about'),head=section?.querySelector('.portrait-head');
 if(!head)return;
 const wrap=head.parentElement,eye=head.querySelector('.gaze-direction'),displacement=head.querySelector('.gaze-displacement');
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),pointer=matchMedia('(pointer: fine)');
 let frame=0,x=0,y=0,tx=0,ty=0;
 function draw(){
  x+=(tx-x)*.12;y+=(ty-y)*.12;
  head.style.transform=`perspective(800px) rotateX(${-y*5}deg) rotateY(${x*8}deg) rotateZ(${x*1.5}deg)`;
  // Move the existing eye pixels through a softly masked displacement map.
  eye.setAttribute('flood-color',`rgb(${Math.round(128-x*100)},${Math.round(128-y*80)},128)`);
  displacement.setAttribute('scale',Math.abs(x)+Math.abs(y)<.005?'0':'16');
  if(Math.abs(tx-x)+Math.abs(ty-y)>.002)frame=requestAnimationFrame(draw);else frame=0;
 }
 function reset(){tx=ty=0;if(!frame)frame=requestAnimationFrame(draw)}
 function stop(){cancelAnimationFrame(frame);frame=0;x=y=tx=ty=0;head.style.transform='';displacement.setAttribute('scale','0')}
 section.addEventListener('pointermove',event=>{
  if(motion.matches||!pointer.matches||event.pointerType==='touch')return;
  const r=wrap.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  if(Math.abs(event.clientX-cx)>r.width/2+150||Math.abs(event.clientY-cy)>r.height/2+100){reset();return}
  tx=Math.max(-1,Math.min(1,(event.clientX-cx)/(r.width/2+100)));
  ty=Math.max(-1,Math.min(1,(event.clientY-cy)/(r.height/2+80)));
  if(!frame)frame=requestAnimationFrame(draw);
 });
 section.addEventListener('pointerleave',reset);
 motion.addEventListener('change',stop);pointer.addEventListener('change',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();
