(()=>{
 const nav=document.querySelector('.case-chapters'),body=document.querySelector('.case-body');
 if(!nav||!body)return;
 const header=document.querySelector('header#top');
 function headerOffset(){const height=header?.getBoundingClientRect().height||0;document.documentElement.style.setProperty('--case-header-height',height+'px');return height}
 headerOffset();
 if(header&&'ResizeObserver' in window)new ResizeObserver(headerOffset).observe(header);
 addEventListener('resize',headerOffset,{passive:true});
 const list=nav.querySelector('div'),tabs=[...list.querySelectorAll('a')];
 if(!tabs.length)return;
 const panels=tabs.map((tab,i)=>{
  const panel=document.createElement('div');panel.className='case-tab-panel';panel.id='case-panel-'+i;
  panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','case-tab-'+i);panel.tabIndex=0;
  tab.id='case-tab-'+i;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panel.id);
  return panel;
 });
 const starts=new Map(tabs.map((tab,i)=>[tab.hash.slice(1),i]));
 const indexFor=label=>tabs.findIndex(tab=>tab.textContent.trim()===label);
 const design=indexFor('Design'),outcome=indexFor('Outcome');
 let current=0;
 for(const child of [...body.children]){
  if(child.matches('.case-next')||child.matches('p[style]'))continue;
  if(starts.has(child.id))current=starts.get(child.id);
  let target=current;
  if(child.matches('.case-gallery')&&design>=0)target=design;
  if(child.matches('.metric-row,.metric-note,.measurement-note')&&outcome>=0)target=outcome;
  panels[target].append(child);
 }
 body.prepend(...panels);list.setAttribute('role','tablist');list.setAttribute('aria-label','Case study topics');
 function select(index,updateURL=false){
  const wasPinned=nav.getBoundingClientRect().top<=headerOffset()+2;
  tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;tab.removeAttribute('aria-current');panels[i].hidden=!active});
  if(updateURL){
   history.replaceState(null,'',tabs[index].hash);
   if(wasPinned)requestAnimationFrame(()=>scrollTo({top:Math.max(0,scrollY+body.getBoundingClientRect().top-headerOffset()-nav.offsetHeight),behavior:'instant'}));
  }
 }
 function fromHash(){
  const id=location.hash.slice(1),target=document.getElementById(id);
  const index=panels.findIndex(panel=>panel===target||panel.contains(target));
  select(index>=0?index:0);
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',event=>{event.preventDefault();select(i,true)});
  tab.addEventListener('keydown',event=>{
   let next=i;
   if(event.key==='ArrowRight')next=(i+1)%tabs.length;
   else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=tabs.length-1;
   else return;
   event.preventDefault();select(next,true);tabs[next].focus();
  });
 });
 addEventListener('hashchange',fromHash);fromHash();
})();
