(()=>{
const header=document.querySelector('header#top');
if(header){
  const syncHeader=()=>header.classList.toggle('is-scrolled',scrollY>8);
  syncHeader();
  addEventListener('scroll',syncHeader,{passive:true});
}

// Keep section navigation below the live header, including wrapped mobile bars.
const sectionNav=document.querySelector('.library-tabs');
if(sectionNav){
  const syncSectionOffsets=()=>{
    document.documentElement.style.setProperty('--section-header-height',(header?.getBoundingClientRect().height||0)+'px');
    document.documentElement.style.setProperty('--section-nav-height',sectionNav.getBoundingClientRect().height+'px');
  };
  syncSectionOffsets();
  if('ResizeObserver' in window){
    const observer=new ResizeObserver(syncSectionOffsets);
    if(header)observer.observe(header);
    observer.observe(sectionNav);
  }
  addEventListener('resize',syncSectionOffsets,{passive:true});
}

const timeNodes=[...document.querySelectorAll('.footer-clock-time')];
const dateNodes=[...document.querySelectorAll('.footer-clock-date')];
if(!timeNodes.length&&!dateNodes.length)return;

const zone='Europe/London';
const timeFormatter=new Intl.DateTimeFormat('en-GB',{
  timeZone:zone,
  hour:'2-digit',
  minute:'2-digit',
  second:'2-digit',
  hour12:false,
  timeZoneName:'short'
});
const dateFormatter=new Intl.DateTimeFormat('en-GB',{
  timeZone:zone,
  weekday:'short',
  day:'2-digit',
  month:'short',
  year:'numeric'
});

function upperDate(parts){
  const map=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  return ((map.weekday||'')+' · '+(map.day||'')+' '+(map.month||'')+' '+(map.year||'')).toUpperCase();
}
function updateClock(){
  const now=new Date();
  const time=timeFormatter.format(now);
  const date=upperDate(dateFormatter.formatToParts(now));
  timeNodes.forEach(node=>{
    node.textContent=time;
    node.dateTime=now.toISOString();
  });
  dateNodes.forEach(node=>{
    node.textContent=date;
    node.dateTime=now.toISOString().slice(0,10);
  });
}
updateClock();
const timer=setInterval(updateClock,1000);
addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();