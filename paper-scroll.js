import {createBend,supportsHtmlInCanvas} from '/vendor/canvas-ui-bend.js';
/* Canvas UI Bend integration. Reference settings: Anthony Luong's paper-curl experiment. */
const motion=matchMedia('(prefers-reduced-motion:reduce)');
const root=document.querySelector('.section_feed');
const desktop=matchMedia('(min-width:992px)');
const params=new URLSearchParams(location.search);
const status={supported:supportsHtmlInCanvas(),active:false,reason:'unsupported'};
window.portfolioPaperScroll=status;
if(root&&desktop.matches&&status.supported&&!motion.matches&&params.get('paper')!=='off'){
 let instance,host,content,source,output,previousLenis,adapter,stopped=false,restored=false;
 const initialY=scrollY;
 function wheelScroll(event){
  if(stopped||event.ctrlKey||event.metaKey)return;
  // HTML drawn inside a canvas is not a native wheel-scroll target.
  // Route input explicitly to the live project-column scroll container.
  const unit=event.deltaMode===1?16:event.deltaMode===2?content.clientHeight:1;
  event.preventDefault();
  content.scrollTop+=event.deltaY*unit;
 }
 function keyScroll(event){
  if(stopped||event.altKey||event.ctrlKey||event.metaKey||event.target.closest?.('input,textarea,select,[contenteditable],button,[role="tab"]'))return;
  const page=content.clientHeight*.85;
  const moves={ArrowDown:48,ArrowUp:-48,PageDown:page,PageUp:-page,' ':event.shiftKey?-page:page};
  if(event.key==='Home'||event.key==='End'){event.preventDefault();content.scrollTop=event.key==='Home'?0:content.scrollHeight}
  else if(event.key in moves){event.preventDefault();content.scrollTop+=moves[event.key]}
 }
 const notify=()=>{window.dispatchEvent(new Event('scroll'));window.ScrollTrigger?.update()};
 function restore(reason){
  if(restored)return;restored=true;
  const y=content?.scrollTop||0;
  instance?.destroy();
  content?.removeEventListener('scroll',notify);
  host?.removeEventListener('wheel',wheelScroll,true);
  content?.removeEventListener('keydown',keyScroll);
  if(host?.parentNode){host.before(content?.querySelector('.section_feed')||root);host.remove()}
  document.documentElement.classList.remove('has-paper-scroll');
  if(window.ltLenis===adapter)window.ltLenis=null;
  window.ScrollTrigger?.scrollerProxy(window,null);
  window.scrollTo({top:y,behavior:'instant'});
  window.ScrollTrigger?.refresh();
  status.active=false;status.reason=reason;
 }
 try{
  host=document.createElement('div');host.className='portfolio-paper-host';
  source=document.createElement('canvas');source.setAttribute('layoutsubtree','true');
  content=document.createElement('div');content.className='portfolio-paper-content';content.tabIndex=-1;
  output=document.createElement('canvas');output.className='portfolio-paper-output';output.setAttribute('aria-hidden','true');
  // Overlay dialogs stay in the native DOM above the distorted sheet.
  document.querySelectorAll('[data-feed-modal]').forEach(modal=>document.body.appendChild(modal));
  root.before(host);content.appendChild(root);source.appendChild(content);host.append(source,output);
  document.documentElement.classList.add('has-paper-scroll');
  instance=createBend({source,content,output},{zone:100,angle:32,rounding:90,perspective:1500,ease:160,smoothing:.14,tumble:0,tilt:0,direction:'in',top:true,bottom:true});
  if(!instance)throw Error('Bend renderer unavailable');
  previousLenis=window.ltLenis;
  previousLenis?.destroy?.();
  adapter={
   scrollTo(target,options={}){
    if(stopped&&!options.force)return;
    let top=typeof target==='number'?target:target==='top'?0:target==='bottom'?content.scrollHeight:0;
    const element=typeof target==='string'&&!['top','bottom'].includes(target)?document.querySelector(target):target;
    if(element?.getBoundingClientRect)top=content.scrollTop+element.getBoundingClientRect().top-content.getBoundingClientRect().top;
    content.scrollTo({top:top+(options.offset||0),behavior:options.immediate?'instant':'smooth'});
    options.onComplete?.();
   },
   stop(){stopped=true;content.style.overflowY='hidden'},
   start(){stopped=false;content.style.overflowY='auto'},
   resize(){instance?.resize()},
   get scroll(){return content.scrollTop}
  };
  window.ltLenis=adapter;
  window.ScrollTrigger?.scrollerProxy(window,{
   scrollTop(value){if(arguments.length)content.scrollTop=value;return content.scrollTop},
   scrollLeft(value){if(arguments.length)content.scrollLeft=value;return content.scrollLeft},
   getBoundingClientRect(){return{top:0,left:0,width:innerWidth,height:innerHeight}},
   scrollHeight(){return content.scrollHeight},pinType:'fixed'
  });
  content.scrollTop=initialY;
  content.addEventListener('scroll',notify,{passive:true});
  host.addEventListener('wheel',wheelScroll,{capture:true,passive:false});
  content.addEventListener('keydown',keyScroll);
  content.setAttribute('aria-label','Project column');
  content.setAttribute('role','region');
  document.addEventListener('portfolio:sectionchange',()=>instance?.resize());
  desktop.addEventListener('change',()=>{if(!desktop.matches)restore('single-column-layout')});
  motion.addEventListener('change',()=>{if(motion.matches)restore('reduced-motion')});
  output.addEventListener('webglcontextlost',()=>restore('graphics-context-lost'),{once:true});
  window.ScrollTrigger?.refresh();
  status.active=true;status.reason='active';
  const hash=location.hash.slice(1);if(hash){const target=document.getElementById(decodeURIComponent(hash));if(target)adapter.scrollTo(target,{immediate:true})}
 }catch(error){restore('renderer-fallback');console.info('Paper scroll kept the standard layout:',error.message)}
}else if(motion.matches){status.reason='reduced-motion'}
