import ast,io,json,os,re,urllib.request,urllib.error,urllib.parse,unittest
from pathlib import Path
from http.server import BaseHTTPRequestHandler
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
t=ast.parse((ROOT/'api/agent.py').read_text());t.body=[n for n in t.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))]
a=dict(json=json,os=os,re=re,urllib=__import__('urllib'),BaseHTTPRequestHandler=BaseHTTPRequestHandler,MODEL='test-model')
exec(compile(t,'agent.py','exec'),a)
originals=a.copy()
class Upstream(io.BytesIO):
 def __enter__(self):return self
 def __exit__(self,*args):self.close()
def upstream(events):return Upstream(('\n'.join('data: '+(json.dumps(x) if isinstance(x,dict) else x) for x in events)+'\n').encode())
class Tests(unittest.TestCase):
 def setUp(self):
  a.update(originals)
  a['model_endpoint']=lambda:('https://provider.invalid/chat','secret','test')
 def test_provider_unicode_stream(self):
  data=upstream([{'choices':[{'delta':{'content':'Hello '}}]},{'choices':[{'delta':{'reasoning':'private'}}]},{'choices':[{'delta':{'content':'₦500,000'},'finish_reason':'stop'}]},'[DONE]'])
  with patch('urllib.request.urlopen',return_value=data):self.assertEqual(''.join(a['stream_model']('test')),'Hello ₦500,000')
  self.assertTrue(data.closed)
 def test_truncated_provider_stream_is_error(self):
  with patch('urllib.request.urlopen',return_value=upstream([{'choices':[{'delta':{'content':'partial'}}]}])):
   with self.assertRaises(RuntimeError):list(a['stream_model']('test'))
 def test_secret_not_in_stream_errors(self):
  with patch('urllib.request.urlopen',side_effect=ValueError('secret')):
   with self.assertRaisesRegex(RuntimeError,'model_stream_unavailable'):list(a['stream_model']('test'))
 def request(self):
  h=a['handler'].__new__(a['handler']);h.wfile=io.BytesIO();h.send_response=lambda status:None;h.send_header=lambda *args:None;h.end_headers=lambda:None;return h
 def test_wire_protocol_and_evidence(self):
  a.update(stream_model=lambda p:(part for part in ['First ','reply.']),select_proof_ids=lambda *args:[],evidence_links=lambda *args:[{'label':'Press coverage','url':'https://example.com'}])
  h=self.request();h.stream_reply('prompt',[],'q',[],'evidence',{})
  events=[json.loads(line) for line in h.wfile.getvalue().splitlines()]
  self.assertEqual([e['type'] for e in events],['status','delta','delta','done']);self.assertEqual(events[-1]['answer'],'First reply.');self.assertEqual(events[-1]['evidence_links'][0]['label'],'Press coverage')
 def test_partial_failure_has_no_false_completion(self):
  def broken(p):yield 'partial';raise RuntimeError('provider secret')
  a['stream_model']=broken;h=self.request();h.stream_reply('prompt',[],'q',[],'conversation',{})
  data=h.wfile.getvalue().decode();self.assertIn('"type": "error"',data);self.assertNotIn('"type": "done"',data);self.assertNotIn('secret',data)
 def test_clarification_respects_context(self):
  self.assertIn('technical leadership',a['contextual_clarification']('leadership',[]));self.assertEqual(a['contextual_clarification']('leadership',[{'role':'user','content':'OAU'}]),'')
if __name__=='__main__':unittest.main()
