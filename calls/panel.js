(()=>{'use strict';
let configPromise,panel,request=null,peer=null,cursor=0,pollTimer=null,polling=false,joining=false;
const $=s=>panel?.querySelector(s);const make=(tag,value,cls)=>{const n=document.createElement(tag);if(value)n.textContent=value;if(cls)n.className=cls;return n};
async function config(){if(!configPromise)configPromise=fetch('/call-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}));return configPromise;}
async function api(path,data){const settings=await config();const base=String(settings.signalUrl||'').replace(/\/$/,'');if(base&&!/^https:\/\//.test(base)&&!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base))throw Error('Live walkthroughs are unavailable right now.');
 const response=await fetch(base+'/calls-api'+path,{method:data?'POST':'GET',headers:{...(data?{'Content-Type':'application/json'}:{}),...(request?{'Authorization':'Bearer '+request.token}:{})},body:data?JSON.stringify(data):undefined,credentials:'omit'});
 let result;try{result=await response.json()}catch{throw Error('Live walkthroughs are unavailable right now. You can still email Jamiu.');}if(!response.ok)throw Error(result.error||'Please try again.');return result;}
function status(value){$('[data-status]').textContent=value;}
function resetMedia(){document.querySelector('.portfolio-call-browser')?.remove();peer?.close();peer=null;joining=false;document.body.classList.remove('portfolio-call-active');document.documentElement.style.removeProperty('--portfolio-call-width');}
async function end(){const old=request;if(old)await api('/calls/'+old.id+'/end',{}).catch(()=>{});request=null;clearInterval(pollTimer);pollTimer=null;resetMedia();if(panel){panel.remove();panel=null;}}
async function tick(){if(!request||polling)return;polling=true;try{const state=await api('/calls/'+request.id+'?after='+cursor);if(!request)return;
 if(['declined','ended','cancelled','expired'].includes(state.state)){resetMedia();clearInterval(pollTimer);$('[data-join]').hidden=true;$('[data-end]').textContent='Close';status(state.state==='declined'?'Jamiu cannot take this call right now. You can email him instead.':state.state==='expired'?'This request expired. Please close it and try again later.':'The call has ended.');return;}
 if(state.state==='accepted'&&!peer){status('Jamiu accepted. Choose Join call when you’re ready.');$('[data-join]').hidden=false;}
 if(peer)for(const event of state.signals){await peer.receive(event.message);cursor=event.seq;}
 }catch{status('Connection to the host was interrupted. Checking again…');}finally{polling=false}}
async function join(){if(joining||peer||!request)return;joining=true;$('[data-join]').disabled=true;try{const settings=await api('/availability');peer=new PortfolioPeer({role:'visitor',iceServers:settings.iceServers||[],localVideo:$('[data-local]'),remoteVideo:$('[data-remote]'),send:message=>api('/calls/'+request.id+'/signal',{message}),onState:status});await peer.start();await peer.offer();$('[data-join]').hidden=true;$('[data-videos]').hidden=false;$('[data-controls]').hidden=false;status('Connecting…');window.portfolioAgent?.dock?.();document.body.classList.add('portfolio-call-active');document.documentElement.style.setProperty('--portfolio-call-width',(panel.getBoundingClientRect().width+32)+'px');}
 catch(e){resetMedia();status(e.name==='NotAllowedError'?'Camera or microphone permission was denied. You can try joining again.':e.message);}
 finally{joining=false;if(panel)$('[data-join]').disabled=false}}
async function open(){if(panel){panel.classList.remove('is-minimized');return;}
 panel=make('aside','','portfolio-call-panel');panel.setAttribute('aria-label','Live walkthrough');panel.innerHTML='<div class="call-top"><h2>Live walkthrough</h2><button type="button" data-minimize aria-label="Minimize video call">−</button></div><p data-status role="status">Checking availability…</p><form data-request hidden><label>Your name<input name="name" maxlength="80" autocomplete="name" required></label><label>What would you like to discuss?<textarea name="reason" rows="3" maxlength="500" required></textarea></label><p class="call-note">Your name and message go to Jamiu. Camera and microphone stay off until you choose to join. The call is not recorded. Request details are removed after about an hour.</p><button type="submit">Request a call</button></form><button type="button" data-join hidden>Join call</button><div data-videos class="call-videos" hidden><video data-remote autoplay playsinline></video><video data-local autoplay playsinline muted></video></div><div data-controls class="call-controls" hidden><button type="button" data-audio>Mute microphone</button><button type="button" data-video>Turn camera off</button></div><div class="call-controls"><button type="button" data-end>Close</button><a href="mailto:younghandlar@gmail.com">Email Jamiu instead</a></div>';
 window.portfolioAgent?.dock?.();const chat=document.querySelector('.portfolio-search[open]');(chat&&matchMedia('(max-width:991px)').matches?chat:document.body).append(panel);
 $('[data-end]').onclick=end;$('[data-minimize]').onclick=()=>{panel.classList.toggle('is-minimized');$('[data-minimize]').textContent=panel.classList.contains('is-minimized')?'+':'−';$('[data-minimize]').setAttribute('aria-label',panel.classList.contains('is-minimized')?'Expand video call':'Minimize video call')};
 $('[data-join]').onclick=join;$('[data-audio]').onclick=()=>{if(peer)$('[data-audio]').textContent=peer.toggle('audio')?'Mute microphone':'Unmute microphone'};$('[data-video]').onclick=()=>{if(peer)$('[data-video]').textContent=peer.toggle('video')?'Turn camera off':'Turn camera on'};
 $('[data-request]').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;try{const form=new FormData(e.target);request=await api('/calls',{name:form.get('name'),reason:form.get('reason')});cursor=0;e.target.hidden=true;$('[data-end]').textContent='Cancel request';status('Request sent. You can keep browsing while Jamiu responds.');pollTimer=setInterval(tick,800);await tick();}catch(e){status(e.message)}finally{button.disabled=false}};
 try{const result=await api('/availability');if(!panel)return;status(result.available?'Jamiu is available for a live walkthrough.':'Jamiu is unavailable right now. You can still email him.');$('[data-request]').hidden=!result.available;}catch(e){if(panel)status(e.message)}
}
// Preserve a mobile call when the chat modal closes or reopens.
const modal=document.querySelector('.portfolio-search');if(modal)new MutationObserver(()=>{if(panel&&matchMedia('(max-width:991px)').matches){const parent=modal.open?modal:document.body;if(panel.parentElement!==parent)parent.append(panel);}}).observe(modal,{attributes:true,attributeFilter:['open']});
window.addEventListener('pagehide',()=>{peer?.close();if(request){const payload=request;config().then(c=>fetch(String(c.signalUrl||'').replace(/\/$/,'')+'/calls-api/calls/'+payload.id+'/end',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+payload.token},body:'{}',credentials:'omit',keepalive:true})).catch(()=>{});}});
// Keep the call's document alive when visitors open another portfolio page.
document.addEventListener('click',event=>{
 if(!peer||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
 const link=event.target.closest('a[href]');if(!link||link.closest('.portfolio-call-panel')||link.hasAttribute('download')||link.target==='_blank'||link.hasAttribute('data-feed-open'))return;
 const raw=link.getAttribute('href');if(!raw||raw.startsWith('#'))return;
 let url;try{url=new URL(raw,location.href)}catch{return;}
 if(url.origin!==location.origin||!['http:','https:'].includes(url.protocol))return;
 event.preventDefault();event.stopImmediatePropagation();
 let browser=document.querySelector('.portfolio-call-browser');
 if(!browser){browser=make('section','','portfolio-call-browser');browser.setAttribute('aria-label','Portfolio browsing during call');const back=make('button','Back to the original page');back.type='button';back.onclick=()=>browser.remove();const frame=make('iframe');frame.title='Portfolio page during your live call';frame.addEventListener('load',()=>{try{frame.contentDocument.querySelectorAll('.portfolio-search-launch,.portfolio-search').forEach(el=>{el.hidden=true})}catch{}});browser.append(back,frame);document.body.append(browser);}
 browser.querySelector('iframe').src=url.href;
},true);
window.portfolioCall={open,end};
})();
