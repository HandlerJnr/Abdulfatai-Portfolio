(()=>{
 const links=[...document.querySelectorAll('.case-chapters a[href^="#chapter-"]')];
 const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
 if(!sections.length)return;
 let queued=false;
 function update(){
  queued=false;let active=sections[0];
  for(const section of sections){if(section.getBoundingClientRect().top<=150)active=section}
  for(const link of links){if(link.hash==='#'+active.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current')}
 }
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update();
})();
