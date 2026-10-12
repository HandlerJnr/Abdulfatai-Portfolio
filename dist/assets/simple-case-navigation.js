(()=>{'use strict';
if(!document.body.classList.contains('simple-view'))return;
const content=document.querySelector('.simple-case-content');if(!content)return;
const sections=[...content.querySelectorAll('section[id]')].filter(s=>s.querySelector('h4,h2'));
if(sections.length>=3){
 const body=sections[0].parentElement;
 if(sections.every(s=>body.contains(s))){
  const layout=document.createElement('div');layout.className='simple-chapter-layout';
  const nav=document.createElement('nav');nav.className='simple-chapter-nav';nav.setAttribute('aria-label','Case study sections');
  const label=document.createElement('span');label.textContent='IN THIS PROJECT';nav.append(label);const links=[];
  for(const section of sections){const title=section.querySelector('h4,h2').cloneNode(true);title.querySelectorAll('span').forEach(n=>n.remove());const a=document.createElement('a');a.href='#'+section.id;a.textContent=title.textContent.trim();a.addEventListener('click',e=>{e.preventDefault();section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});history.replaceState(null,'','#'+section.id)});nav.append(a);links.push({a,section});}
  body.before(layout);layout.append(body,nav);
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){links.forEach(({a,section})=>{if(section===entry.target)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});}},{rootMargin:'-15% 0px -60% 0px'});sections.forEach(s=>observer.observe(s));}
 }
}
const previews=[...content.querySelectorAll('.syncai-screen-collections a')];if(!previews.length)return;
const dialog=document.createElement('dialog');dialog.className='simple-screen-dialog';dialog.setAttribute('aria-label','SyncAI screen collection preview');
const header=document.createElement('header'),title=document.createElement('strong'),close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Close preview');header.append(title,close);const stage=document.createElement('div');stage.className='simple-screen-stage';const image=document.createElement('img');stage.append(image);dialog.append(header,stage);document.body.append(dialog);let opener;
previews.forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();opener=a;title.textContent=a.dataset.pdfTitle;image.alt=title.textContent;image.src=a.getAttribute('href');dialog.showModal();close.focus();}));close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{image.removeAttribute('src');opener?.focus()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)dialog.close()}});
})();
