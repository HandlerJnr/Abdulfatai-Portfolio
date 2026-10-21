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
 def test_stream_request_uses_working_client_identity(self):
  data=upstream([{'choices':[{'delta':{'content':'reply'},'finish_reason':'stop'}]}])
  with patch('urllib.request.urlopen',return_value=data) as request:
   list(a['stream_model']('test'))
  self.assertEqual(request.call_args.args[0].get_header('User-agent'),'JamiuPortfolio/1.0')
 def test_rate_limit_does_not_show_draft_or_repeat_requests(self):
  issue=RuntimeError('groq_http_429_rate_limit_exceeded');issue.retry_after=12
  a['checked_answer']=lambda *args: (_ for _ in ()).throw(issue)
  h=a['handler'].__new__(a['handler']);h.wfile=io.BytesIO();h.send_response=lambda *args:None;h.send_header=lambda *args:None;h.end_headers=lambda:None
  h.stream_reply('prompt',[],'q',[],'conversation',{})
  events=[json.loads(line) for line in h.wfile.getvalue().splitlines()]
  self.assertEqual(events[-1]['code'],'rate_limit');self.assertEqual(events[-1]['retry_after'],12)
  self.assertFalse(any(e['type'] in ('delta','done') for e in events))
if __name__=='__main__':unittest.main()
