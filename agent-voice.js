/* Optional, explicit microphone access. Typing and text answers always remain available. */
window.initAgentVoice=function(panel){
 const input=panel.querySelector('input'),form=panel.querySelector('form');
 const controls=document.createElement('div');controls.className='agent-voice-controls';
 controls.innerHTML='<div class="agent-input-modes" role="group" aria-label="Conversation input"><button type="button" data-mode="type" aria-pressed="true">Type</button><button type="button" data-mode="talk" aria-pressed="false">Talk</button></div><div class="agent-talk-tools" hidden><button type="button" class="agent-mic" aria-pressed="false">Start microphone</button><button type="button" class="agent-mute" aria-pressed="false">Mute replies</button><button type="button" class="agent-stop">Stop speaking</button></div><p class="agent-voice-status" role="status">Type a question to begin.</p><p class="agent-voice-note" hidden>Microphone starts only when you choose it. Your browser may send audio to its speech service. Review the transcript before sending; only the question text goes to the portfolio agent.</p>';
 form.append(controls);
 controls.querySelector('.agent-input-modes').append(form.querySelector('button[type="submit"]'));
 const type=controls.querySelector('[data-mode="type"]'),talk=controls.querySelector('[data-mode="talk"]'),tools=controls.querySelector('.agent-talk-tools'),mic=controls.querySelector('.agent-mic'),mute=controls.querySelector('.agent-mute'),stop=controls.querySelector('.agent-stop'),status=controls.querySelector('[role="status"]'),note=controls.querySelector('.agent-voice-note');
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const synth=window.speechSynthesis;
 let mode='type',muted=false,listening=false,recognition=null,initialDraft='',finalTranscript='',ignoreResults=false;
 function stopSpeech(){synth?.cancel();}
 function stopListening(){ignoreResults=true;if(recognition&&listening)recognition.abort();listening=false;mic.textContent='Start microphone';mic.setAttribute('aria-pressed','false');}
 function select(next){mode=next;stopSpeech();stopListening();type.setAttribute('aria-pressed',String(next==='type'));talk.setAttribute('aria-pressed',String(next==='talk'));tools.hidden=next!=='talk';note.hidden=next!=='talk';status.textContent=next==='talk'?(Recognition?'Start the microphone, speak, then review and send your question.':'Voice input is not supported in this browser. You can type and hear replies.'):'Type a question to begin.';mic.disabled=!Recognition;mute.disabled=!synth;stop.disabled=!synth;input.focus({preventScroll:true});}
 type.onclick=()=>select('type');talk.onclick=()=>select('talk');
 mic.onclick=()=>{
  if(listening){recognition.stop();return;}
  if(!Recognition)return;
  stopSpeech();initialDraft=input.value.trim();finalTranscript='';ignoreResults=false;
  recognition=new Recognition();recognition.lang='en-GB';recognition.interimResults=true;recognition.continuous=false;recognition.maxAlternatives=1;
  recognition.onstart=()=>{listening=true;mic.textContent='Finish recording';mic.setAttribute('aria-pressed','true');status.textContent='Listening… Your words will appear in the question field.';};
  recognition.onresult=event=>{
   if(ignoreResults)return;
   let interim='';for(let i=event.resultIndex;i<event.results.length;i++){if(event.results[i].isFinal)finalTranscript+=event.results[i][0].transcript+' ';else interim+=event.results[i][0].transcript;}
   input.value=[initialDraft,finalTranscript+interim].filter(Boolean).join(' ').trim().slice(0,700);input.dispatchEvent(new Event('input',{bubbles:true}));
  };
  recognition.onerror=event=>{ignoreResults=true;status.textContent=event.error==='not-allowed'||event.error==='service-not-allowed'?'Microphone permission was denied. Allow it in your browser or continue typing.':event.error==='no-speech'?'No speech detected. Try the microphone again or type your question.':event.error==='aborted'?'Microphone stopped.':'Voice input could not connect. Try again or continue typing.';};
  recognition.onend=()=>{listening=false;mic.textContent='Start microphone';mic.setAttribute('aria-pressed','false');if(!ignoreResults)status.textContent=input.value?'Review your transcript, edit if needed, then press Ask.':'No transcript captured. Try again or type.';};
  try{recognition.start();}catch{status.textContent='Microphone could not start. Please try again or type.';}
 };
 mute.onclick=()=>{muted=!muted;mute.textContent=muted?'Unmute replies':'Mute replies';mute.setAttribute('aria-pressed',String(muted));if(muted)stopSpeech();};
 stop.onclick=()=>{stopSpeech();status.textContent='Speech stopped. The written answer is still available.';};
 panel.addEventListener('agent-question',()=>{stopSpeech();stopListening();});
 panel.addEventListener('agent-answer',event=>{
  if(mode!=='talk'||muted||!synth||document.hidden)return;
  const body=panel.querySelector('.search-answer:last-child .search-answer-body');
  const spoken=body?.innerText||event.detail.answer;
  stopSpeech();const utterance=new SpeechSynthesisUtterance(spoken);utterance.lang='en-GB';utterance.rate=1;const voices=synth.getVoices();utterance.voice=voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'))||null;
  utterance.onstart=()=>status.textContent='Speaking… You can stop or mute at any time.';
  utterance.onend=()=>status.textContent='Ready for your next question.';
  utterance.onerror=()=>status.textContent='Audio could not play. Your answer is available as text.';
  synth.speak(utterance);
 });
 addEventListener('pagehide',()=>{stopSpeech();stopListening();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech();stopListening();}});
};
// Keep optional companions outside the reading and conversation area on this route.
addEventListener('DOMContentLoaded',()=>{
 if(!document.querySelector('[data-agent-page]'))return;
 const summon=document.querySelector('.summon-companion'),pet=document.querySelector('#portfolio-companion');
 if(!summon)return;
 const space=document.createElement('div');space.className='ask-companion-space';space.setAttribute('aria-label','Optional portfolio companion');space.append(summon);if(pet)space.append(pet);document.body.append(space);
});
