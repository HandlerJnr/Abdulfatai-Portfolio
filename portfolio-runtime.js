/* Portfolio interactions: native DOM, accessible dialogs and UK-local time. */
(()=>{
'use strict';
const $=(s,root=document)=>root.querySelector(s),all=(s,root=document)=>[...root.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
function animate(el,frames,options={}){if(!reduced()&&el?.animate)el.animate(frames,{duration:220,easing:'ease-out',...options})}
const app=window.Portfolio={refresh(){window.portfolioScroll?.resize?.()}};
function boot(){
 const html=document.documentElement;
 function theme(dark){html.dataset.theme=dark?'dark':'light';document.body.classList.toggle('theme-dark',dark);all('[data-theme-label]').forEach(el=>el.classList.toggle('is--active',(el.dataset.themeLabel==='dark')===dark));$('[data-theme-toggle]')?.setAttribute('aria-pressed',String(dark))}
 let dark=html.dataset.theme==='dark';theme(dark);
 $('[data-theme-toggle]')?.addEventListener('click',()=>{dark=!dark;theme(dark);try{localStorage.setItem('theme',dark?'dark':'light')}catch{}});
 const clock=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 const tick=()=>{all('[data-clock]').forEach(el=>el.textContent=clock.format(new Date())+' UK');all('[data-clock-location]').forEach(el=>el.textContent='Brighton, UK')};tick();setInterval(tick,1000);
 const welcome=$('[data-welcome]');if(welcome){let show=false;try{show=!sessionStorage.getItem('welcomeShown')&&!/Chrome-Lighthouse/.test(navigator.userAgent);sessionStorage.setItem('welcomeShown','1')}catch{}if(show&&!reduced()){welcome.classList.add('is--shown');welcome.style.display='flex';animate(welcome,[{opacity:1},{opacity:0}],{delay:650,duration:300});setTimeout(()=>{welcome.classList.remove('is--shown');welcome.style.display='none'},950)}else{welcome.classList.remove('is--shown');welcome.style.display='none'}}
 all('[data-avatar-cycle]').forEach(root=>{const img=$('img',root),photos=(root.dataset.srcs||'').split(',').filter(Boolean);if(!img||photos.length<2||reduced())return;let i=0;setInterval(()=>{if(document.hidden)return;i=(i+1)%photos.length;img.src=photos[i];animate(img,[{opacity:.35},{opacity:1}],{duration:400})},6000)});
 const modal=$('[data-feed-modal]');if(!modal)return;
 const panel=$('[data-feed-panel]',modal),body=$('[data-feed-modal-body]',modal),backdrop=$('[data-feed-backdrop]',modal),count=$('[data-feed-count]',modal),status=$('[data-feed-status]',modal);
 if(!panel||!body)return;
 let current=null,opener=null,overflow='',inerted=[],outside=false;
 const focusable=()=>all('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',modal).filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
 const ids=()=>[...new Set(all('[data-feed-open]').filter(el=>el.getClientRects().length).map(el=>el.dataset.feedOpen))];
 function lock(){inerted=[];for(let branch=modal;branch.parentElement&&branch!==document.body;branch=branch.parentElement){for(const child of branch.parentElement.children){if(child===branch||child.inert||child.matches('script,style,.portfolio-search,.portfolio-search-launch'))continue;child.inert=true;inerted.push(child)}}overflow=document.body.style.overflow;document.body.style.overflow='hidden';window.portfolioScroll?.stop?.()}
 function unlock(){inerted.forEach(el=>el.inert=false);inerted=[];document.body.style.overflow=overflow;window.portfolioScroll?.start?.()}
 function open(id){
  const source=$('[data-feed-detail="'+CSS.escape(id)+'"]');if(!source)return;
  const first=current===null;const trigger=$('[data-feed-open="'+CSS.escape(id)+'"]');const group=trigger?.closest('details');if(group)group.open=true;
  if(first){opener=document.activeElement;lock()}
  current=id;body.replaceChildren(...all(':scope > *',source).map(el=>el.cloneNode(true)));
  all('[id]',body).forEach(el=>el.removeAttribute('id'));all('[data-src]',body).forEach(el=>el.setAttribute('src',el.dataset.src));
  const title=$('h2',body);if(title){title.id='feed-modal-title';modal.setAttribute('aria-labelledby',title.id)}else{modal.removeAttribute('aria-labelledby')}
  all('video',body).forEach(v=>{v.muted=true;v.play()?.catch(()=>{})});body.scrollTop=0;
  const list=ids(),index=list.indexOf(id);if(count)count.textContent=(index+1)+' / '+list.length;if(status)status.textContent=(title?.textContent||'Project')+', '+(index+1)+' of '+list.length;
  modal.style.display='flex';modal.setAttribute('aria-hidden','false');panel.style.opacity='1';panel.style.transform='none';if(backdrop)backdrop.style.opacity='1';
  animate(panel,[{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'none'}]);
  if(first)focusable()[0]?.focus({preventScroll:true});history.replaceState(history.state,'','#'+encodeURIComponent(id));
 }
 function close(){if(current===null)return;current=null;all('video',body).forEach(v=>v.pause());modal.style.display='none';modal.setAttribute('aria-hidden','true');body.replaceChildren();if(status)status.textContent='';unlock();history.replaceState(history.state,'',location.pathname+location.search);opener?.focus?.({preventScroll:true})}
 function step(direction){const list=ids();if(list.length)open(list[(list.indexOf(current)+direction+list.length)%list.length])}
 document.addEventListener('click',event=>{const trigger=event.target.closest('[data-feed-open]');if(!trigger||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;if(!$('[data-feed-detail="'+CSS.escape(trigger.dataset.feedOpen)+'"]'))return;event.preventDefault();open(trigger.dataset.feedOpen)});
 $('[data-feed-close]',modal)?.addEventListener('click',close);$('[data-feed-prev]',modal)?.addEventListener('click',()=>step(-1));$('[data-feed-next]',modal)?.addEventListener('click',()=>step(1));
 modal.addEventListener('pointerdown',e=>{outside=e.target===modal||e.target===backdrop});modal.addEventListener('click',e=>{if(outside&&(e.target===modal||e.target===backdrop))close();outside=false});
 document.addEventListener('keydown',event=>{if(current===null||event.defaultPrevented)return;if(event.key==='Escape'){event.preventDefault();close()}else if(!event.target.closest('input,textarea,select,[contenteditable]')&&event.key==='ArrowLeft'){event.preventDefault();step(-1)}else if(!event.target.closest('input,textarea,select,[contenteditable]')&&event.key==='ArrowRight'){event.preventDefault();step(1)}else if(event.key==='Tab'){const list=focusable(),first=list[0],last=list.at(-1);if(!first){event.preventDefault();return}if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
 document.addEventListener('portfolio:sectionchange',()=>{if(current!==null)close();app.refresh()});
 let hash='';try{hash=decodeURIComponent(location.hash.slice(1))}catch{}if(hash)open(hash);
 app.openProject=open;app.closeProject=close;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
