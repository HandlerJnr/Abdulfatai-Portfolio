(()=> {
  const filterButtons=[...document.querySelectorAll('[data-project-filter]')];
  const filterStatus=document.querySelector('[data-project-filter-status]');
  const items=[...document.querySelectorAll('[data-project-item]')];
  const eyebrow=document.querySelector('[data-project-eyebrow]');
  const title=document.querySelector('[data-project-title]');
  const description=document.querySelector('[data-project-description]');

  if(!filterButtons.length||!items.length)return;

  const narratives={
    all:{
      eyebrow:'SELECTED WORK',
      title:'Real products. Different kinds of complexity.',
      description:'Start with Horal, Radius, Bizinc and Vista: a live escrow marketplace across web and mobile, cross-border education payments used by 100K+ international students, a B2B2C platform with reported +45% dashboard activation during its redesign period, and banking journeys across four localised subsidiaries. Then move into AI, healthcare, property and service platforms.'
    },
    fintech:{
      eyebrow:'FINTECH & BANKING',
      title:'Designing trust where money moves.',
      description:'Radius handles high-stakes tuition and fee payments for 100K+ international students. Vista turns multi-entity, multi-currency banking across four subsidiaries into workable corporate and retail journeys. The lending and investment work explores how complex financial products can stay understandable without hiding the rules behind them.'
    },
    marketplace:{
      eyebrow:'MARKETPLACE / B2B2C',
      title:'Both sides of the transaction have to work.',
      description:'Horal connects buyer confidence with escrow, KYC, seller operations and fulfilment across web and mobile. Bizinc joins customer discovery and booking to the tools businesses use behind the scenes, with reported +45% dashboard activation during the redesign period. Shortlet Lagos and Synqit extend that thinking into property and partnership marketplaces.'
    },
    'ai-saas':{
      eyebrow:'AI & SAAS',
      title:'AI is useful when the workflow still makes sense.',
      description:'Kremor AI connects generation to commerce and production. Chalant AI turns managing agents into a learnable workflow. Synqit, Archi-Tek and the Reporting Portal keep the same focus on making automation, decisions and handoffs clear enough for people to act on.'
    },
    platform:{
      eyebrow:'SERVICE PLATFORMS',
      title:'The interface is only one part of the service.',
      description:'Across Horal, Radius, Bizinc, Vista, Arete, Settle and other platform work, the real design problem is coordinating roles, dependencies and operational steps behind the screen. These cases show how those systems were shaped into journeys people can actually complete.'
    }
  };

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

    const copy=narratives[filter]||narratives.all;
    if(eyebrow)eyebrow.textContent=copy.eyebrow;
    if(title)title.textContent=copy.title;
    if(description)description.textContent=copy.description;

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