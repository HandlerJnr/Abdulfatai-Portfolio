import importlib.util,json,urllib.request,urllib.error,http.cookiejar,tempfile,threading,unittest,time,struct,socket
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);value=importlib.util.module_from_spec(spec);spec.loader.exec_module(value);return value
server_module=module('call_server',ROOT/'self-hosted-calls/server.py');stun=module('call_stun',ROOT/'self-hosted-calls/stun.py')
class Calls(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.store=server_module.Store(Path(self.tmp.name)/'state.sqlite','test-password',['https://preview.example']);self.server=server_module.make_server('127.0.0.1',0,self.store,ROOT);self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start();self.base='http://127.0.0.1:'+str(self.server.server_port);self.host=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.visitor=urllib.request.build_opener()
 def tearDown(self):self.server.shutdown();self.server.server_close();self.tmp.cleanup()
 def api(self,path,data=None,token=None,host=False,origin=None):
  headers={'Content-Type':'application/json'}
  if token:headers['Authorization']='Bearer '+token
  if origin:headers['Origin']=origin
  request=urllib.request.Request(self.base+'/calls-api'+path,data=json.dumps(data).encode() if data is not None else None,headers=headers)
  try:
   with (self.host if host else self.visitor).open(request) as r:return r.status,json.load(r)
  except urllib.error.HTTPError as e:return e.code,json.load(e)
 def available(self):
  self.assertEqual(self.api('/login',{'password':'test-password'},host=True)[0],200);self.api('/availability',{'online':True},host=True)
 def create(self,name='Recruiter'):
  status,call=self.api('/calls',{'name':name,'reason':'Discuss the Vista project'});self.assertEqual(status,201,call);return call
 def test_full_request_accept_signal_end_flow(self):
  self.available();call=self.create();id=call['id'];token=call['token'];self.assertEqual(self.api('/calls/'+id,token=token)[1]['state'],'waiting')
  self.assertEqual(self.api('/calls/'+id+'/accept',{},token=token)[0],403)
  self.assertEqual(self.api('/calls/'+id+'/signal',{'message':{'type':'offer','sdp':'test'}},token=token)[0],409)
  self.assertEqual(self.api('/calls/'+id+'/accept',{},host=True)[0],200)
  self.assertFalse(self.api('/availability')[1]['available'])
  for body,sender in [({'type':'candidate','candidate':{'candidate':'test'}},'visitor'),({'type':'offer','sdp':'test-offer'},'visitor'),({'type':'answer','sdp':'test-answer'},'host')]:
   self.assertEqual(self.api('/calls/'+id+'/signal',{'message':body},token=token if sender=='visitor' else None,host=sender=='host')[0],200)
  host_events=self.api('/calls/'+id,host=True)[1]['signals'];self.assertEqual([x['message']['type'] for x in host_events],['candidate','offer'])
  visitor_events=self.api('/calls/'+id,token=token)[1]['signals'];self.assertEqual(visitor_events[0]['message']['type'],'answer')
  self.assertEqual(self.api('/calls/'+id+'?after='+str(visitor_events[-1]['seq']),token=token)[1]['signals'],[])
  self.api('/calls/'+id+'/end',{},token=token);self.assertEqual(self.api('/calls/'+id,host=True)[1]['state'],'ended');self.assertTrue(self.api('/availability')[1]['available'])
 def test_unauthorized_and_cross_origin_access(self):
  self.available();call=self.create();self.assertEqual(self.api('/calls/'+call['id'],token='wrong')[0],404);self.assertEqual(self.api('/host')[0],401)
  self.assertEqual(self.api('/availability',origin='https://evil.example')[0],403);self.assertEqual(self.api('/availability',origin='https://preview.example')[0],200)
 def test_only_one_accepted_call(self):
  self.available();one=self.create('One');two=self.create('Two');self.assertEqual(self.api('/calls/'+one['id']+'/accept',{},host=True)[0],200);self.assertEqual(self.api('/calls/'+two['id']+'/accept',{},host=True)[0],409)
 def test_offline_expiry_and_decline(self):
  self.assertEqual(self.api('/calls',{'name':'Name','reason':'Reason'})[0],409);self.available();call=self.create();self.api('/calls/'+call['id']+'/decline',{},host=True);self.assertEqual(self.api('/calls/'+call['id'],token=call['token'])[1]['state'],'declined')
  second=self.create();
  with self.store.db() as c:c.execute('UPDATE calls SET expires=? WHERE id=?',(time.time()-1,second['id']))
  self.assertEqual(self.api('/calls/'+second['id'],token=second['token'])[1]['state'],'expired');self.store.heartbeat=time.time()-21;self.assertFalse(self.api('/availability')[1]['available'])
 def test_rate_limit_and_safe_static_files(self):
  self.available();[self.create(str(i)) for i in range(3)];self.assertEqual(self.api('/calls',{'name':'Fourth','reason':'Reason'})[0],429)
  for path in ['/self-hosted-calls/server.py','/../AGENTS.md']:
   with self.assertRaises(urllib.error.HTTPError):urllib.request.urlopen(self.base+path)
 def test_stun_binding_and_invalid_packets(self):
  tx=b'123456789012';packet=struct.pack('!HHI12s',1,0,stun.COOKIE,tx);reply=stun.binding_response(packet,('203.0.113.1',54321));kind,length,cookie,rtx=struct.unpack('!HHI12s',reply[:20]);self.assertEqual((kind,length,cookie,rtx),(0x101,12,stun.COOKIE,tx));self.assertEqual(struct.unpack('!H',reply[26:28])[0]^(stun.COOKIE>>16),54321);self.assertIsNone(stun.binding_response(b'invalid',('127.0.0.1',1)))
if __name__=='__main__':unittest.main()
