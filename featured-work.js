(()=> {
  const filterButtons=[...document.querySelectorAll('[data-project-filter]')];
  const filterStatus=document.querySelector('[data-project-filter-status]');
  const items=[...document.querySelectorAll('[data-project-item]')];

  if(!filterButtons.length||!items.length)return;

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

  filterButtons.forEach(button=>{
    button.addEventListener('click',()=>applyFilter(button.dataset.projectFilter||'all'));
  });

  applyFilter('all');
})();