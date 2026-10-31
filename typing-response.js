/* Reveal an already checked reply progressively; never expose an unchecked draft. */
export function typeText(value,{signal,onUpdate,isCurrent=()=>true,duration}={}){
 const chars=Array.from(String(value||''));
 const aborted=()=>signal?.aborted||!isCurrent();
 const stop=()=>new DOMException('Response stopped','AbortError');
 if(aborted())return Promise.reject(stop());
 if(!chars.length||globalThis.matchMedia?.('(prefers-reduced-motion:reduce)').matches){onUpdate?.(chars.join(''));return Promise.resolve()}
 const total=duration??Math.min(3000,Math.max(450,chars.length*12));
 return new Promise((resolve,reject)=>{
  let frame,first,last=-1,finished=false;
  function cleanup(){signal?.removeEventListener('abort',cancel);if(frame!==undefined)cancelAnimationFrame(frame)}
  function cancel(){if(finished)return;finished=true;cleanup();reject(stop())}
  function tick(now){
   if(finished)return;if(aborted()){cancel();return}
   first??=now;
   const count=Math.min(chars.length,Math.max(1,Math.floor((now-first)/total*chars.length)));
   if(count!==last){last=count;onUpdate?.(chars.slice(0,count).join(''))}
   if(count===chars.length){finished=true;cleanup();resolve();return}
   frame=requestAnimationFrame(tick);
  }
  signal?.addEventListener('abort',cancel,{once:true});
  frame=requestAnimationFrame(tick);
 });
}
