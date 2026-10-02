(()=>{
 const root=document.documentElement,system=matchMedia('(prefers-color-scheme: dark)');
 let preference='system';
 try{const saved=localStorage.getItem('portfolio-theme');if(['light','dark','system'].includes(saved))preference=saved}catch{}
 function apply(){
  const resolved=preference==='system'?(system.matches?'dark':'light'):preference;
  root.dataset.theme=resolved;root.style.colorScheme=resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='dark'?'#181818':'#ffffff');
  document.querySelectorAll('[data-theme-select]').forEach(select=>select.value=preference);
 }
 apply();
 function mount(){
  document.querySelectorAll('[data-theme-select]').forEach(select=>{
   select.value=preference;
   select.addEventListener('change',()=>{preference=select.value;try{localStorage.setItem('portfolio-theme',preference)}catch{}apply()});
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 system.addEventListener('change',()=>{if(preference==='system')apply()});
 addEventListener('storage',event=>{if(event.key==='portfolio-theme'){preference=['light','dark','system'].includes(event.newValue)?event.newValue:'system';apply()}});
})();
