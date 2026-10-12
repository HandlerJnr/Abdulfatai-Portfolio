(()=>{'use strict';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.querySelector('.header'),nav=document.querySelector('#primary-navigation'),menu=document.querySelector('.nav-trigger');
const menuState=open=>{if(!menu||!nav)return;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.hidden=!open;nav.inert=!open;nav.classList.toggle('portfolio-menu-open',open);document.body.classList.toggle('portfolio-navigation-open',open);document.querySelectorAll('body>section,body>main,body>footer').forEach(el=>{el.inert=open});};
menu?.addEventListener('click',()=>menuState(menu.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',event=>{if(event.key!=='Tab'||menu?.getAttribute('aria-expanded')!=='true')return;const controls=[menu,...nav.querySelectorAll('a[href]')];const index=controls.indexOf(document.activeElement);event.preventDefault();controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length].focus()});
window.addEventListener('pageshow',()=>menuState(false));
const explore=document.querySelector('#explore-navigation'),toggle=explore?.parentElement.querySelector('.dropdown-toggle');
const exploreState=open=>{if(!explore||!toggle)return;explore.hidden=!open;explore.classList.toggle('portfolio-open',open);toggle.setAttribute('aria-expanded',String(open))};
toggle?.addEventListener('click',()=>exploreState(toggle.getAttribute('aria-expanded')!=='true'));
document.addEventListener('click',e=>{if(explore&&!explore.parentElement.contains(e.target))exploreState(false);if(header&&!header.contains(e.target))menuState(false);if(e.target.closest('a')&&header?.contains(e.target)){exploreState(false);menuState(false)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(toggle?.getAttribute('aria-expanded')==='true'){exploreState(false);toggle.focus()}else if(menu?.getAttribute('aria-expanded')==='true'){menuState(false);menu.focus()}}});
const animations=new WeakMap();
function processState(item,open){const button=item.querySelector('.process-header'),panel=item.querySelector('.w-dropdown-list');if(!button||!panel)return;animations.get(panel)?.cancel();item.dataset.open=String(open);button.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open));item.style.backgroundColor=open?'':'var(--neutral-01)';panel.classList.toggle('portfolio-open',open);const start=panel.hidden?0:panel.getBoundingClientRect().height;panel.hidden=false;panel.style.height='auto';const end=open?panel.scrollHeight:0;const done=()=>{panel.hidden=!open;panel.style.height='';animations.delete(panel)};if(reduced()||typeof panel.animate!=='function'){done();return}const animation=panel.animate([{height:start+'px',opacity:open?0:1},{height:end+'px',opacity:open?1:0}],{duration:320,easing:'ease',fill:'both'});animations.set(panel,animation);animation.onfinish=()=>{if(animations.get(panel)!==animation)return;done();animation.cancel()};}
document.querySelectorAll('[data-process-disclosure]').forEach(item=>{const button=item.querySelector('.process-header');const change=()=>{const open=item.dataset.open!=='true';if(open)item.parentElement.querySelectorAll('[data-process-disclosure][data-open=true]').forEach(other=>{if(other!==item)processState(other,false)});processState(item,open)};button?.addEventListener('click',change);item.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&matchMedia('(hover: hover) and (pointer: fine)').matches&&item.dataset.open!=='true')change()});item.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch'&&matchMedia('(hover: hover) and (pointer: fine)').matches&&item.dataset.open==='true')processState(item,false)});button?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();change()}})});
document.querySelectorAll('.project-slider').forEach(slider=>{const mask=slider.querySelector('.w-slider-mask');if(!mask)return;const move=direction=>{const step=(mask.querySelector('.w-slide')?.getBoundingClientRect().width||mask.clientWidth)+24,max=mask.scrollWidth-mask.clientWidth;let left=mask.scrollLeft+direction*step;if(direction>0&&mask.scrollLeft>=max-2)left=0;if(direction<0&&mask.scrollLeft<=2)left=max;mask.scrollTo({left:Math.max(0,Math.min(max,left)),behavior:reduced()?'auto':'smooth'})};['left','right'].forEach(direction=>{const button=slider.querySelector('.w-slider-arrow-'+direction);if(!button)return;const go=()=>move(direction==='left'?-1:1);button.addEventListener('click',go);button.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});mask.tabIndex=0;mask.setAttribute('aria-label','Selected projects');mask.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}})});
document.querySelectorAll('[data-contact-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const field=n=>form.querySelector('[name="'+n+'"]')?.value.trim()||'';const body='Hello Jamiu,\n\n'+field('field')+'\n\nName: '+field('full-Name')+'\nEmail: '+field('email-address')+(field('phone-number')?'\nPhone: '+field('phone-number'):'');const href='mailto:aabdulfataijamiu@gmail.com?subject='+encodeURIComponent(field('subject')||'Product design enquiry')+'&body='+encodeURIComponent(body);const status=form.querySelector('.form-status');status.replaceChildren();status.append('Your email draft is ready. ');const a=document.createElement('a');a.href=href;a.textContent='Open your email app to review and send ↗';status.append(a);a.focus()}));



// Deep links reveal the evidence they point to, including artefacts inside a disclosure.
function revealProjectAnchor(){if(!location.hash)return;let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}const target=document.getElementById(id);if(!target)return;let node=target;while(node){if(node.tagName==='DETAILS')node.open=true;node=node.parentElement}requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'}))}
window.addEventListener('hashchange',revealProjectAnchor);revealProjectAnchor();

// Native dialog keeps PDF previews in the portfolio, with a direct-file fallback.
const pdfDialog=document.querySelector('[data-pdf-preview-dialog]');
if(pdfDialog){const frame=pdfDialog.querySelector('[data-pdf-preview-frame]'),picture=pdfDialog.querySelector('[data-document-preview-image]'),close=pdfDialog.querySelector('[data-pdf-preview-close]');let opener=null;
 document.querySelectorAll('[data-pdf-preview]').forEach(card=>card.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||typeof pdfDialog.showModal!=='function')return;event.preventDefault();opener=card;const src=card.dataset.pdfPreview,title=card.dataset.pdfTitle;pdfDialog.querySelector('#pdf-preview-title').textContent=title;pdfDialog.querySelector('#pdf-preview-meta').textContent=card.dataset.pdfMeta||'';pdfDialog.querySelector('#pdf-preview-summary').textContent=card.dataset.pdfSummary||'';pdfDialog.querySelector('.pdf-preview-overview').open=false;pdfDialog.querySelector('[data-pdf-preview-open]').href=src;pdfDialog.querySelector('[data-pdf-preview-download]').href=src;const isPdf=/\.pdf(?:$|[?#])/i.test(src);frame.hidden=!isPdf;picture.hidden=isPdf;if(isPdf){picture.removeAttribute('src');frame.title=title+' — PDF preview';frame.src=src+'#page=1&view=FitH&toolbar=1'}else{frame.removeAttribute('src');picture.alt=title;picture.src=src}pdfDialog.querySelector('[data-pdf-preview-open]').textContent=isPdf?'Open PDF ↗':'Open original ↗';pdfDialog.querySelector('[data-pdf-preview-download]').textContent=isPdf?'Download PDF ↓':'Download image ↓';pdfDialog.showModal();document.body.classList.add('pdf-preview-open');close.focus()}));
 close.addEventListener('click',()=>pdfDialog.close());pdfDialog.addEventListener('click',event=>{if(event.target!==pdfDialog)return;const box=pdfDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)pdfDialog.close()});
 pdfDialog.addEventListener('close',()=>{frame.removeAttribute('src');picture.removeAttribute('src');picture.hidden=true;document.body.classList.remove('pdf-preview-open');opener?.focus();opener=null});
}

const aiDialog=document.querySelector('[data-ai-preview-dialog]');
if(aiDialog){const body=aiDialog.querySelector('[data-ai-preview-body]'),close=aiDialog.querySelector('[data-ai-preview-close]');let opener=null;
 document.querySelectorAll('[data-ai-preview]').forEach(button=>button.addEventListener('click',()=>{const template=document.getElementById(button.dataset.aiPreview);if(!template)return;opener=button;aiDialog.querySelector('#ai-preview-title').textContent=button.dataset.aiTitle;body.replaceChildren(template.content.cloneNode(true));body.scrollTop=0;aiDialog.showModal();document.body.classList.add('ai-preview-open');close.focus()}));
 close.addEventListener('click',()=>aiDialog.close());aiDialog.addEventListener('click',event=>{if(event.target!==aiDialog)return;const box=aiDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)aiDialog.close()});aiDialog.addEventListener('close',()=>{body.replaceChildren();document.body.classList.remove('ai-preview-open');opener?.focus();opener=null});
}
})();
// Experience carousel uses native scrolling for touch, arrows and keyboard.
document.querySelectorAll('[data-experience-carousel]').forEach(carousel=>{const track=carousel.querySelector('.experience-carousel-track');if(!track)return;const move=direction=>{const step=track.firstElementChild.getBoundingClientRect().width+24;track.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};carousel.querySelector('[data-experience-prev]').addEventListener('click',()=>move(-1));carousel.querySelector('[data-experience-next]').addEventListener('click',()=>move(1));track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}})});
// Credential groups retain native swipe scrolling and keyboard access.
document.querySelectorAll('[data-credential-carousel]').forEach(carousel=>{const track=carousel.querySelector('.credential-carousel-track'),prev=carousel.querySelector('[data-credential-prev]'),next=carousel.querySelector('[data-credential-next]');if(!track||!prev||!next)return;const update=()=>{prev.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2};const move=direction=>track.scrollBy({left:direction*(track.firstElementChild.getBoundingClientRect().width+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});update()});
// Fixed-header offset and safe portfolio-only history navigation.
(()=>{const header=document.querySelector('.header');if(!header)return;document.body.classList.add('portfolio-fixed-nav');const measure=()=>document.documentElement.style.setProperty('--portfolio-nav-height',header.getBoundingClientRect().height+'px');measure();if(typeof ResizeObserver!=='undefined')new ResizeObserver(measure).observe(header);else window.addEventListener('resize',measure);document.querySelectorAll('[data-portfolio-back]').forEach(link=>link.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();let internal=false;try{internal=new URL(document.referrer).origin===location.origin}catch{}const go=()=>{if(internal&&history.length>1)history.back();else location.assign(link.href)};if(matchMedia('(prefers-reduced-motion: reduce)').matches)go();else{document.body.classList.add('portfolio-navigating');setTimeout(go,120)}}));window.addEventListener('pageshow',()=>{document.body.classList.remove('portfolio-navigating');measure()})})();

/* Ask Jamiu is progressively enhanced on every portfolio page. */
;(()=>{if(document.querySelector('script[data-ask-jamiu]'))return;const s=document.createElement('script');s.src='/assets/ask-jamiu.js?v=20261012-experience';s.defer=true;s.dataset.askJamiu='';document.body.appendChild(s)})();

/* Small desktop shortcuts, shown only when there is enough room. */
;(()=>{
 const navWrapper=document.querySelector('.header .nav-wrapper');
 const trigger=navWrapper?.querySelector('.portfolio-menu-trigger');
 if(!navWrapper||!trigger||navWrapper.querySelector('.portfolio-quick-nav'))return;
 const quick=document.createElement('nav');
 quick.className='portfolio-quick-nav';
 quick.setAttribute('aria-label','Quick links');
 const current=location.pathname.replace(/\/$/,'')||'/';
 for(const [name,path] of [['Work','/work'],['About','/about'],['Contact','/contact']]){
   const link=document.createElement('a');
   link.href=path;link.textContent=name;
   if(current===path||(path==='/work'&&current.startsWith('/work/')))link.setAttribute('aria-current','page');
   quick.append(link);
 }
 navWrapper.insertBefore(quick,trigger);
})();
/* Existing case study chapters become a navigable set without rewriting the story. */
;(()=>{
 const body=document.querySelector('.authentic-content .case-body');
 if(!body||document.querySelector('.case-chapter-nav'))return;
 const sections=[...body.querySelectorAll('.case-section[id]')].filter(s=>s.querySelector('h4'));
 if(sections.length<3)return;
 const nav=document.createElement('nav');
 nav.className='case-chapter-nav';nav.setAttribute('aria-label','Case study chapters');
 const scroller=document.createElement('div');scroller.className='case-chapter-scroll';scroller.setAttribute('tabindex','0');scroller.setAttribute('aria-label','Scroll horizontally through case study chapters');nav.append(scroller);
 const label=document.createElement('span');label.className='case-chapter-label';label.textContent='Jump to';scroller.append(label);
 const links=[];
 for(const section of sections){
   const heading=section.querySelector('h4').cloneNode(true);
   heading.querySelectorAll('.case-section-number').forEach(n=>n.remove());
   const title=heading.textContent.replace(/\s+/g,' ').trim();
   if(!title)continue;
   const link=document.createElement('a');link.href='#'+encodeURIComponent(section.id);
   link.textContent=title;link.setAttribute('aria-label','Jump to '+title);
   scroller.append(link);links.push({link,section});
 }
 body.before(nav);
 let active=null;
 const update=()=>{
   let selected=links[0];
   const cutoff=(document.querySelector('.header')?.getBoundingClientRect().height||82)+150;
   for(const item of links){if(item.section.getBoundingClientRect().top<=cutoff)selected=item;}
   for(const item of links){if(item===selected)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current');}
   if(selected&&selected!==active){
     active=selected;
     const x=selected.link.offsetLeft;
     const edge=x+selected.link.offsetWidth;
     if(x<scroller.scrollLeft||edge>scroller.scrollLeft+scroller.clientWidth){
       scroller.scrollTo({left:Math.max(0,x-(scroller.clientWidth-selected.link.offsetWidth)/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
     }
   }
   const rect=nav.getBoundingClientRect();
   document.body.classList.toggle('case-nav-near-bottom',rect.top<innerHeight-54&&rect.bottom>innerHeight-135&&rect.top>0);
 };
 let raf=0;
 const schedule=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;update()});};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});update();
})();
/* Quiet launchers while the visitor is reading a case study. */
;(()=>{
 if(!location.pathname.startsWith('/work/'))return;
 const update=()=>document.body.classList.toggle('portfolio-reading',scrollY>560);
 addEventListener('scroll',update,{passive:true});update();
})();
