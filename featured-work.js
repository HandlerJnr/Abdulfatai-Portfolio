(()=> {
  const root=document.querySelector('.featured-accordion');
  if(!root)return;

  const allCards=[...root.querySelectorAll('[data-feature-card]')];
  const next=document.querySelector('[data-feature-next]');
  const filterButtons=[...document.querySelectorAll('[data-project-filter]')];
  const filterStatus=document.querySelector('[data-project-filter-status]');
  const archive=document.querySelector('.work-accordion-section>.archive');
  const archiveButtons=archive?[...archive.querySelectorAll('[data-project]')]:[];
  let activeCard=null;
  let currentFilter='all';

  const categories=el=>(el.dataset.category||'').split(/\s+/).filter(Boolean);
  const matches=(el,filter)=>filter==='all'||categories(el).includes(filter);
  const visibleCards=()=>allCards.filter(card=>!card.hidden);

  function activate(card,focus=false){
    const visible=visibleCards();
    if(!visible.length)return;
    if(typeof card==='number')card=visible[(card+visible.length)%visible.length];
    if(!card||card.hidden)card=visible[0];
    activeCard=card;

    allCards.forEach(item=>{
      const on=item===card&&!item.hidden;
      item.classList.toggle('is-active',on);
      item.setAttribute('aria-expanded',String(on));
      if(on)item.setAttribute('aria-current','true');
      else item.removeAttribute('aria-current');
    });
    if(focus)card.focus({preventScroll:true});
  }

  function labelFor(filter){
    const button=filterButtons.find(btn=>btn.dataset.projectFilter===filter);
    return button?button.textContent.trim():'Projects';
  }

  function applyFilter(filter){
    currentFilter=filter;
    filterButtons.forEach(button=>{
      const on=button.dataset.projectFilter===filter;
      button.classList.toggle('is-active',on);
      button.setAttribute('aria-pressed',String(on));
    });

    allCards.forEach(card=>{card.hidden=!matches(card,filter)});
    archiveButtons.forEach(button=>{button.hidden=!matches(button,filter)});

    const visible=visibleCards();
    const matchingArchive=archiveButtons.filter(button=>!button.hidden);

    if(archive){
      archive.hidden=filter!=='all'&&matchingArchive.length===0;
      if(filter!=='all'&&matchingArchive.length)archive.open=true;
      if(filter==='all')archive.open=false;
    }

    if(!activeCard||activeCard.hidden)activate(visible[0]);

    const total=visible.length+matchingArchive.length;
    if(filterStatus){
      filterStatus.textContent=filter==='all'
        ? `Showing all ${total} projects`
        : `Showing ${total} ${labelFor(filter)} project${total===1?'':'s'}`;
    }
  }

  allCards.forEach(card=>{
    card.addEventListener('pointerenter',()=>{if(!card.hidden)activate(card)});
    card.addEventListener('focusin',()=>{if(!card.hidden)activate(card)});
    card.addEventListener('click',event=>{if(!event.target.closest('a,button')&&!card.hidden)activate(card)});
    card.addEventListener('keydown',event=>{
      if(card.hidden)return;
      const visible=visibleCards();
      const index=visible.indexOf(card);
      if(event.key==='ArrowRight'){
        event.preventDefault();
        activate(index+1,true);
      }else if(event.key==='ArrowLeft'){
        event.preventDefault();
        activate(index-1,true);
      }
    });
  });

  next?.addEventListener('click',()=>{
    const visible=visibleCards();
    const index=Math.max(0,visible.indexOf(activeCard));
    activate(index+1,true);
  });

  filterButtons.forEach(button=>{
    button.addEventListener('click',()=>applyFilter(button.dataset.projectFilter||'all'));
  });

  applyFilter('all');
})();