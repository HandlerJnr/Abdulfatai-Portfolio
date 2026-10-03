(()=> {
  const root=document.querySelector('.featured-accordion');
  const cards=root?[...root.querySelectorAll('[data-feature-card]')]:[];
  const next=document.querySelector('[data-feature-next]');
  let active=0;

  function activate(index,focus=false){
    if(!cards.length)return;
    active=(index+cards.length)%cards.length;
    cards.forEach((card,i)=>{
      const on=i===active;
      card.classList.toggle('is-active',on);
      card.setAttribute('aria-expanded',String(on));
      if(on)card.setAttribute('aria-current','true');
      else card.removeAttribute('aria-current');
    });
    if(focus)cards[active].focus({preventScroll:true});
  }

  cards.forEach((card,i)=>{
    card.addEventListener('pointerenter',()=>activate(i));
    card.addEventListener('focusin',()=>activate(i));
    card.addEventListener('click',event=>{if(!event.target.closest('a,button'))activate(i)});
    card.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'){event.preventDefault();activate(i+1,true)}
      else if(event.key==='ArrowLeft'){event.preventDefault();activate(i-1,true)}
    });
  });
  next?.addEventListener('click',()=>activate(active+1,true));
  activate(0);

  const filterButtons=[...document.querySelectorAll('[data-project-filter]')];
  const filterStatus=document.querySelector('[data-project-filter-status]');
  const items=[...document.querySelectorAll('[data-project-item]')];

  const categories=item=>(item.dataset.category||'').split(/\s+/).filter(Boolean);
  const labelFor=filter=>{
    const button=filterButtons.find(btn=>btn.dataset.projectFilter===filter);
    return button?button.textContent.trim():'projects';
  };

  function applyFilter(filter){
    let count=0;
    filterButtons.forEach(button=>{
      const on=button.dataset.projectFilter===filter;
      button.classList.toggle('is-active',on);
      button.setAttribute('aria-pressed',String(on));
    });
    items.forEach(item=>{
      const visible=filter==='all'||categories(item).includes(filter);
      item.hidden=!visible;
      if(visible)count++;
    });
    if(filterStatus){
      filterStatus.textContent=filter==='all'
        ? `Showing all ${count} projects`
        : `Showing ${count} ${labelFor(filter)} project${count===1?'':'s'}`;
    }
  }

  filterButtons.forEach(button=>button.addEventListener('click',()=>applyFilter(button.dataset.projectFilter||'all')));
  applyFilter('all');
})();