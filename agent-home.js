(()=>{
 const form=document.querySelector('.home-chat-form');if(!form)return;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const question=form.elements.q.value.trim();if(!question)return;
  window.portfolioAgent.open(question);
 });
 document.querySelectorAll('[data-home-question]').forEach(button=>button.addEventListener('click',()=>window.portfolioAgent.open(button.dataset.homeQuestion)));
})();
