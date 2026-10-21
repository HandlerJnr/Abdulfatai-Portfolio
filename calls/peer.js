/* Browser-to-browser media. No third-party video SDK, STUN server or analytics. */
(()=>{'use strict';
class PortfolioPeer{
 constructor({role,send,iceServers=[],localVideo,remoteVideo,onState=()=>{}}){this.role=role;this.send=send;this.localVideo=localVideo;this.remoteVideo=remoteVideo;this.onState=onState;this.pending=[];this.closed=false;this.pc=new RTCPeerConnection({iceServers});
  this.pc.onicecandidate=e=>{if(e.candidate&&!this.closed)this.send({type:'candidate',candidate:e.candidate.toJSON()}).catch(()=>this.onState('Connection message failed. Please end the call and try again.'));};
  this.pc.ontrack=e=>{this.remoteVideo.srcObject=e.streams[0]||new MediaStream([e.track]);this.remoteVideo.play().catch(()=>{});};
  this.pc.onconnectionstatechange=()=>{const state=this.pc.connectionState;this.onState(state==='connected'?'Connected':state==='failed'?'This network could not connect. End the call and try another network.':state==='disconnected'?'Connection interrupted. Reconnecting…':state==='closed'?'Call ended.':'Connecting…');};
 }
 async start(){
  if(!navigator.mediaDevices?.getUserMedia)throw Error('Use HTTPS or localhost to enable your camera and microphone.');
  const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:{width:{ideal:640},height:{ideal:480},frameRate:{ideal:20,max:24}}});
  if(this.closed){stream.getTracks().forEach(t=>t.stop());return;}
  this.stream=stream;this.localVideo.srcObject=stream;this.localVideo.muted=true;this.localVideo.play().catch(()=>{});stream.getTracks().forEach(track=>this.pc.addTrack(track,stream));
 }
 async offer(){const offer=await this.pc.createOffer();await this.pc.setLocalDescription(offer);await this.send({type:'offer',sdp:offer.sdp});}
 async receive(message){
  if(this.closed)return;
  if(message.type==='candidate'){
   if(!this.pc.remoteDescription){this.pending.push(message.candidate);return;}
   await this.pc.addIceCandidate(message.candidate);return;
  }
  if(!['offer','answer'].includes(message.type))return;
  await this.pc.setRemoteDescription({type:message.type,sdp:message.sdp});
  for(const candidate of this.pending.splice(0))await this.pc.addIceCandidate(candidate);
  if(message.type==='offer'&&this.role==='host'){const answer=await this.pc.createAnswer();await this.pc.setLocalDescription(answer);await this.send({type:'answer',sdp:answer.sdp});}
 }
 toggle(kind){const tracks=this.stream?.getTracks().filter(t=>t.kind===kind)||[];const enabled=!tracks.some(t=>t.enabled);tracks.forEach(t=>{t.enabled=enabled});return enabled;}
 close(){this.closed=true;this.pc.onicecandidate=null;this.pc.ontrack=null;this.pc.close();this.stream?.getTracks().forEach(t=>t.stop());this.localVideo.srcObject=null;this.remoteVideo.srcObject=null;}
}
window.PortfolioPeer=PortfolioPeer;
})();
