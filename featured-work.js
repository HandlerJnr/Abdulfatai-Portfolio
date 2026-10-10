(()=> {
  const archive=document.querySelector('[data-project-archive]');
  if(!archive)return;

  const filterButtons=[...document.querySelectorAll('.more-work [data-project-filter]')];
  const filterStatus=document.querySelector('.more-work [data-project-filter-status]');
  const items=[...archive.querySelectorAll('[data-project-item]')];

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
        ? `Showing all ${count} additional projects`
        : `Showing ${count} ${labelFor(filter)} project${count===1?'':'s'}`;
    }
  }

  filterButtons.forEach(button=>{
    button.addEventListener('click',()=>applyFilter(button.dataset.projectFilter||'all'));
  });

  applyFilter('all');
})();