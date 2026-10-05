(()=>{
 const form=document.querySelector('.home-chat-form');if(!form)return;
 form.addEventListener('submit',event=>{
  const question=form.elements.q.value.trim();if(!question)return;
  event.preventDefault();
  try{
   const token=crypto.randomUUID();sessionStorage.setItem('jamiu-agent-pending-v1',JSON.stringify({token,question:question.slice(0,700),created:Date.now()}));location.assign('/ask/?start='+encodeURIComponent(token));
  }catch{location.assign('/ask/?q='+encodeURIComponent(question.slice(0,700)));}
 });
})();
