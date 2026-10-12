from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]/'dist'
header='''<header class="simple-header"><div class="simple-container simple-header-inner"><a class="simple-name" href="/simple">Jamiu Abdulfatai<span>Product Designer</span></a><div class="simple-header-actions"><div class="portfolio-mode-mount"></div><button class="simple-menu-trigger" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="simple-navigation"><span aria-hidden="true"><i></i><i></i></span></button></div></div><nav id="simple-navigation" class="simple-navigation" aria-label="Main navigation" hidden inert><div class="simple-container"><p class="simple-menu-label">EXPLORE MY PORTFOLIO</p><a href="/simple#projects"><span>01</span>Projects<b aria-hidden="true">↗</b></a><a href="/simple#tools"><span>02</span>Tools & implementation<b aria-hidden="true">↗</b></a><a href="/simple#main"><span>03</span>About me<b aria-hidden="true">↗</b></a><a href="mailto:aabdulfataijamiu@gmail.com"><span>04</span>Contact<b aria-hidden="true">↗</b></a><a href="/assets/current/ef8b414be47f498c.pdf" download="Abdulfatai_Jamiu_CV.pdf"><span>05</span>Download CV<b aria-hidden="true">↓</b></a></div></nav></header>'''
for p in (root/'simple').rglob('*.html'):
 s=p.read_text();s=re.sub(r'<header class="simple-header">.*?</header>',header,s,count=1,flags=re.S)
 s=re.sub(r'<div class="simple-view-toggle".*?</div>','',s,flags=re.S)
 s=s.replace('<section class="simple-tools"','<section id="tools" class="simple-tools"')
 if p==root/'simple/index.html':
  s=s.replace('</section><section id="projects"','<aside class="simple-experience" aria-label="Experience across products"><p>EXPERIENCE ACROSS</p><div><a href="/simple/work/vista-itss">Vista Bank · ITSS ↗</a><a href="/simple/work/pay4me">Radius / Pay4Me ↗</a><a href="/simple/work/bizinc">Bizinc ↗</a><a href="/simple/work/horal">Horal ↗</a></div></aside></section><section id="projects"',1)
 if '/assets/portfolio-mode.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="/assets/portfolio-mode.css"></head>')
 p.write_text(s)
for p in root.rglob('*.html'):
 s=p.read_text()
 if '/assets/portfolio-mode.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="/assets/portfolio-mode.css"></head>')
 p.write_text(s)
p=root/'assets/portfolio-view.js';s=p.read_text();start=s.index(' if(!simple){');end=s.index(' let switching=false;',start)
replacement=''' const visualPath=simple?(path.startsWith('/simple/work/')?path.replace('/simple',''):'/'):path;
 const simplePath=simple?path:(path.startsWith('/work/')?'/simple'+path:'/simple');
 const mode=document.createElement('nav');mode.className='portfolio-mode-switch';mode.setAttribute('aria-label','Portfolio view');
 mode.innerHTML='<a href="'+visualPath+'" data-portfolio-view="visual"'+(!simple?' aria-current="page"':'')+'>Visual</a><a href="'+simplePath+'" data-portfolio-view="simple"'+(simple?' aria-current="page"':'')+'>Simple</a>';
 if(simple){document.querySelector('.portfolio-mode-mount')?.replaceWith(mode)}
 else{
  const wrapper=document.querySelector('.header .nav-wrapper'),trigger=wrapper?.querySelector('.portfolio-menu-trigger');
  wrapper?.querySelector('.portfolio-view-control')?.remove();
  if(trigger)wrapper.insertBefore(mode,trigger);
 }
 if(simple){
  const trigger=document.querySelector('.simple-menu-trigger'),menu=document.querySelector('#simple-navigation');
  const setOpen=open=>{
   if(!trigger||!menu)return;
   menu.hidden=!open;menu.inert=!open;trigger.setAttribute('aria-expanded',String(open));trigger.setAttribute('aria-label',open?'Close navigation':'Open navigation');document.body.classList.toggle('simple-menu-open',open);
   document.querySelectorAll('body>main,body>footer').forEach(el=>el.inert=open);
  };
  trigger?.addEventListener('click',()=>setOpen(trigger.getAttribute('aria-expanded')!=='true'));
  menu?.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',event=>{
   if(trigger?.getAttribute('aria-expanded')!=='true')return;
   if(event.key==='Escape'){setOpen(false);trigger.focus()}
   if(event.key==='Tab'){event.preventDefault();const controls=[trigger,...menu.querySelectorAll('a')],i=controls.indexOf(document.activeElement);controls[(i+(event.shiftKey?-1:1)+controls.length)%controls.length].focus()}
  });
  const header=document.querySelector('.simple-header');
  const measure=()=>document.documentElement.style.setProperty('--simple-header-height',header.getBoundingClientRect().height+'px');
  measure();if(typeof ResizeObserver!=='undefined')new ResizeObserver(measure).observe(header);
  addEventListener('pageshow',()=>setOpen(false));
 }
'''
p.write_text(s[:start]+replacement+s[end:])
