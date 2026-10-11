(()=>{
document.querySelectorAll('.x-carousel').forEach(carousel=>{const slides=[...carousel.querySelectorAll('figure')];let index=0;carousel.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>{slides[index].hidden=true;index=(index+Number(button.dataset.slide)+slides.length)%slides.length;slides[index].hidden=false;carousel.querySelector('[aria-live]').textContent=`${index+1} / ${slides.length}`;}));});
const panel=document.querySelector('#site-navigation'),toggle=document.querySelector('.navigation-toggle');if(panel&&toggle){panel.classList.add('reference-menu');const links=document.createElement('div');links.className='reference-menu-primary';links.innerHTML='<a href="/">Home</a><a href="/work/">Work</a><a href="/about/">About</a><a href="/contact/">Contact</a>';panel.prepend(links);const close=document.createElement('button');close.className='reference-menu-close';close.type='button';close.textContent='Close ×';close.addEventListener('click',()=>{toggle.click();toggle.focus()});panel.append(close);new MutationObserver(()=>document.body.classList.toggle('reference-menu-open',!panel.hidden)).observe(panel,{attributes:true,attributeFilter:['hidden']});}
// Desktop navigation uses the same destinations as the mobile menu.
const header=document.querySelector('header#top');
if(header && !header.querySelector('.reference-desktop-links') && !header.querySelector('.site-primary-nav')){
 const nav=document.createElement('nav');
 nav.className='reference-desktop-links';
 nav.setAttribute('aria-label','Primary desktop navigation');
 nav.innerHTML='<a href="/">Home</a><a href="/work/">Work</a><a href="/about/">About</a><a href="/ai/">AI practice</a><a href="/contact/">Contact</a>';
 nav.querySelectorAll('a').forEach(a=>{if(location.pathname===a.getAttribute('href'))a.setAttribute('aria-current','page')});
 header.insertBefore(nav,header.querySelector('.header-tools'));
}
// Prevent repeated project entries within a single collection, without
// removing intentional homepage previews or full individual case studies.
document.querySelectorAll('[data-project-archive],.more-work').forEach(root=>{
 const seen=new Set();
 root.querySelectorAll('[data-project-item]').forEach(card=>{
  const href=card.querySelector('a[href^="/work/"]')?.getAttribute('href');
  if(!href)return;
  const key=new URL(href,location.origin).pathname.replace(/\/$/,'');
  if(seen.has(key))card.remove();else seen.add(key);
 });
});

// Horizontal case-study navigation. Native scrolling remains available on touch and trackpads.
document.querySelectorAll('.project-gallery').forEach(gallery=>{
 const track=gallery.querySelector('.project-gallery-track');
 const prev=gallery.querySelector('.project-gallery-prev');
 const next=gallery.querySelector('.project-gallery-next');
 if(!track||!prev||!next)return;
 const step=()=>{const card=track.querySelector('.x-project');return card?card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||'0'):track.clientWidth};
 prev.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
 next.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
 const update=()=>{prev.disabled=track.scrollLeft<8;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-8};
 track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
});
const footer=document.querySelector('footer');if(footer){const button=document.createElement('button');button.className='reference-copy';button.textContent='Copy email';button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('aabdulfataijamiu@gmail.com');button.textContent='Copied';setTimeout(()=>button.textContent='Copy email',2000)}catch{button.textContent='aabdulfataijamiu@gmail.com'}});footer.append(button);}
})();
