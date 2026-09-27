const body=document.body;
const header=document.getElementById('siteHeader');
const menuButton=document.getElementById('menuButton');
const mobileNav=document.getElementById('mobileNav');
const themeHandle=document.getElementById('themeHandle');
const pullRope=document.getElementById('pullRope');
const pullLabel=document.getElementById('pullLabel');

const savedTheme=localStorage.getItem('jamiu-theme');
if(savedTheme==='light'){body.classList.add('theme-light');}
syncThemeState();

function syncThemeState(){
  const light=body.classList.contains('theme-light');
  themeHandle.setAttribute('aria-pressed',String(light));
  pullLabel.textContent=light?'pull for dark':'pull for light';
  document.querySelector('meta[name="theme-color"]').setAttribute('content',light?'#f1eee4':'#071827');
}
function toggleTheme(){
  body.classList.toggle('theme-light');
  localStorage.setItem('jamiu-theme',body.classList.contains('theme-light')?'light':'dark');
  syncThemeState();
}

window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>24);
},{passive:true});
header.classList.toggle('scrolled',window.scrollY>24);

menuButton.addEventListener('click',()=>{
  const open=mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
}));

let dragStart=0;
let dragDistance=0;
let didDrag=false;
themeHandle.addEventListener('pointerdown',(event)=>{
  dragStart=event.clientY;
  dragDistance=0;
  didDrag=false;
  themeHandle.setPointerCapture(event.pointerId);
});
themeHandle.addEventListener('pointermove',(event)=>{
  if(!themeHandle.hasPointerCapture(event.pointerId)) return;
  dragDistance=Math.max(0,Math.min(92,event.clientY-dragStart));
  if(dragDistance>5) didDrag=true;
  themeHandle.style.transform='translateY('+dragDistance+'px)';
  pullRope.style.height=(112+dragDistance)+'px';
});
themeHandle.addEventListener('pointerup',(event)=>{
  if(themeHandle.hasPointerCapture(event.pointerId)) themeHandle.releasePointerCapture(event.pointerId);
  if(dragDistance>58) toggleTheme();
  themeHandle.style.transform='';
  pullRope.style.height='';
  setTimeout(()=>{didDrag=false;},50);
});
themeHandle.addEventListener('click',(event)=>{
  if(didDrag){event.preventDefault();return;}
  toggleTheme();
});

document.querySelectorAll('.filter').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(item=>{
      item.classList.remove('active');
      item.setAttribute('aria-selected','false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected','true');
    const filter=button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      card.hidden=!(filter==='all'||card.dataset.category===filter);
    });
  });
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.case-link').forEach(button=>{
  button.addEventListener('click',()=>{
    const dialog=document.getElementById(button.dataset.dialog);
    if(dialog) dialog.showModal();
  });
});
document.querySelectorAll('.case-dialog').forEach(dialog=>{
  const close=dialog.querySelector('.dialog-close');
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    const rect=dialog.getBoundingClientRect();
    const inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
    if(!inside) dialog.close();
  });
});
