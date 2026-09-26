const menuButton=document.querySelector('#menuButton');
const mobileNav=document.querySelector('#mobileNav');
menuButton?.addEventListener('click',()=>{
  const open=mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
}));

document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});
    btn.classList.add('active');btn.setAttribute('aria-selected','true');
    const filter=btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      card.hidden=!(filter==='all'||card.dataset.category===filter);
    });
  });
});

document.querySelectorAll('.faq-question').forEach(button=>{
  button.addEventListener('click',()=>{
    const item=button.closest('.faq-item');
    const isOpen=item.classList.toggle('open');
    button.setAttribute('aria-expanded',String(isOpen));
  });
});
