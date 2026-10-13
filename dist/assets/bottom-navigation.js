(()=>{'use strict';
const simple=document.body.classList.contains('simple-view');
const header=document.querySelector(simple?'.simple-header':'.header');
const menu=document.querySelector(simple?'#simple-navigation':'#primary-navigation');
const trigger=document.querySelector(simple?'.simple-menu-trigger':'.portfolio-menu-trigger');
if(!header||!menu||!trigger)return;
const prefix=simple?'/simple':'';
const current=location.pathname.replace(/\/$/,'')||'/';
const route=path=>prefix+(path==='/'?(simple?'':'/'):path);
const dock=document.createElement('nav');dock.className='bottom-nav';dock.setAttribute('aria-label','Primary navigation');
for(const [label,path] of [['Home','/'],['Work','/work'],['Menu',null],['About','/about'],['Contact','/contact']]){
 if(!path){trigger.classList.add('bottom-nav-menu');trigger.innerHTML='<span class="bottom-menu-bars" aria-hidden="true"><i></i><i></i></span>';trigger.setAttribute('aria-label','Open more navigation');dock.append(trigger);continue;}
 const a=document.createElement('a');a.href=route(path);a.textContent=label;
 if(current===a.getAttribute('href')||(path==='/work'&&current.startsWith(prefix+'/work/')))a.setAttribute('aria-current','page');
 dock.append(a);
}
const inner=document.createElement('div');inner.className='bottom-menu-inner';
const layout=document.createElement('div');layout.className='bottom-menu-layout';
const intro=document.createElement('div');intro.className='bottom-menu-intro';
const label=document.createElement('p');label.className='bottom-menu-label';label.textContent='EXPLORE MY PORTFOLIO';
const title=document.createElement('h2');title.textContent='A few sides to my work.';
const description=document.createElement('p');description.className='bottom-menu-description';description.textContent='The process, the experiments and the work behind the screens.';
const art=document.createElement('img');art.src='/assets/6f8532bae2bb560e.svg';art.alt='';art.width=38;art.height=37;art.setAttribute('aria-hidden','true');intro.append(label,title,description,art);layout.append(intro);
const groups=[
 ['How I work', [['Expertise','/services'],['My design process','/process']]],
 ['What I explore', [['AI practice','/ai'],['Graphic design','/graphic-design']]],
 ['Behind the work', [['Credentials','/credentials'],['Design systems','/system']]]
];
groups.forEach(([heading,links],index)=>{
 const panel=document.createElement('section');panel.className='bottom-menu-group';panel.dataset.tone=String(index+1);
 const top=document.createElement('div');top.className='bottom-menu-group-heading';
 const h=document.createElement('h3');h.textContent=heading;
 const icon=document.createElement('img');icon.src=index===1?'/assets/d7c19f194c1b075c.svg':'/assets/6b9726d2f057323d.svg';icon.alt='';icon.width=24;icon.height=24;icon.setAttribute('aria-hidden','true');top.append(h,icon);panel.append(top);
 const grid=document.createElement('div');grid.className='bottom-menu-grid';
 links.forEach(([name,path],i)=>{const a=document.createElement('a');a.href=route(path);const text=document.createElement('span');text.textContent=name;const number=document.createElement('span');number.className='bottom-menu-link-number';number.textContent=String(i+1).padStart(2,'0');number.setAttribute('aria-hidden','true');a.append(text,number);if(current===a.getAttribute('href'))a.setAttribute('aria-current','page');grid.append(a)});
 panel.append(grid);layout.append(panel);
});
inner.append(layout);
const footer=document.createElement('div');footer.className='bottom-menu-footer';
const cv=document.createElement('a');cv.href='/assets/current/ef8b414be47f498c.pdf';cv.download='Abdulfatai_Jamiu_CV.pdf';cv.textContent='Download CV';footer.append(cv);
const mode=document.querySelector('.portfolio-mode-switch');if(mode)footer.append(mode);
inner.append(footer);menu.replaceChildren(inner);
header.replaceChildren(dock,menu);header.classList.add('bottom-header');document.body.classList.add('bottom-navigation-enabled');
})();
