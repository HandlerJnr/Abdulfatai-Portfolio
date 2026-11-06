(()=>{'use strict';
const CARD_URL='https://jamiudesigns.vercel.app/card/';
const toast=document.querySelector('[data-card-toast]');
let toastTimer;
function announce(message){if(!toast)return;toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2400)}
function saveVCard(){const vcard=['BEGIN:VCARD','VERSION:3.0','N:Abdulfatai;Jamiu;;;','FN:Jamiu Abdulfatai','TITLE:Product Designer','TEL;TYPE=CELL,VOICE:+447344383739','EMAIL;TYPE=INTERNET:aabdulfataijamiu@gmail.com','URL:https://jamiudesigns.vercel.app/','URL;TYPE=LinkedIn:https://www.linkedin.com/in/jamiudesign/','END:VCARD'].join('\r\n');const blob=new Blob([vcard],{type:'text/vcard;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Jamiu-Abdulfatai.vcf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Your contact card is ready to save.')}
document.querySelector('[data-save-contact]')?.addEventListener('click',saveVCard);
document.querySelector('[data-share-card]')?.addEventListener('click',async()=>{const data={title:'Jamiu Abdulfatai — Digital Card',text:'Connect with me through my digital business card.',url:CARD_URL};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(CARD_URL);announce('Card link copied.')}}catch(error){if(error.name!=='AbortError')announce('Use Copy card link to share this page.')}});
document.querySelector('[data-copy-link]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(CARD_URL);announce('Card link copied to clipboard.')}catch{announce(CARD_URL)}});
document.querySelector('[data-open-agent]')?.addEventListener('click',()=>{if(window.portfolioAgent?.open)window.portfolioAgent.open();else announce('The assistant is loading. Try again in a moment.')});
function makeQR(){const target=document.getElementById('card-qr');if(!target||!window.QRCode)return;target.replaceChildren();new QRCode(target,{text:CARD_URL,width:126,height:126,colorDark:'#151711',colorLight:'#f4f1e8',correctLevel:QRCode.CorrectLevel.H})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makeQR,{once:true});else makeQR();
})();
