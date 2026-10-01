const nav=document.querySelector('.navigation');
if(nav){
  const toggle=nav.querySelector('.navigation-toggle');
  const panel=nav.querySelector('nav');
  const setNav=open=>{
    if(!toggle||!panel)return;
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    panel.hidden=!open;
    nav.classList.toggle('is-open',open);
  };
  toggle?.addEventListener('click',()=>setNav(toggle.getAttribute('aria-expanded')!=='true'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setNav(false)));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'&&!document.querySelector('dialog[open]')){
      setNav(false);toggle.focus();
    }
  });
  document.addEventListener('click',e=>{
    if(toggle?.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target))setNav(false);
  });
}