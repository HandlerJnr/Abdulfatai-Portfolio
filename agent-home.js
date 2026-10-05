(()=>{
 const form=document.querySelector('.home-chat-form');if(!form)return;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const question=form.elements.q.value.trim();if(!question)return;
  window.portfolioAgent.open(question);
 });
})();
