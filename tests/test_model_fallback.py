import ast, io, json, os, re, unittest, urllib.request, urllib.error
from pathlib import Path
from unittest.mock import patch
source=ast.parse((Path(__file__).resolve().parents[1]/'api/agent.py').read_text())
source.body=[n for n in source.body if isinstance(n,ast.FunctionDef) and n.name in ('clip','call_model')]
ctx=dict(json=json,os=os,re=re,urllib=__import__('urllib'),MODEL='openai/gpt-oss-120b',model_endpoint=lambda:('https://api.groq.com/openai/v1/chat/completions','test-token','groq'),model_messages=lambda p:[{'role':'user','content':p}])
exec(compile(source,'agent.py','exec'),ctx)
class Fallback(unittest.TestCase):
 def test_rate_limit_uses_one_alternate_with_json_mode(self):
  calls=[]
  class Response:
   def __enter__(self):return self
   def __exit__(self,*args):pass
   def read(self):return json.dumps({'choices':[{'message':{'content':'{"kind":"social","answer":"Hello!","claims":[]}'}}]}).encode()
  def request(req,timeout):
   calls.append(json.loads(req.data))
   if len(calls)==1:raise urllib.error.HTTPError(req.full_url,429,'rate limited',{},io.BytesIO(b'{}'))
   return Response()
  with patch.object(urllib.request,'urlopen',side_effect=request):
   answer,provider=ctx['call_model']('GROUNDING_REVIEW_TASK\ntest')
  self.assertEqual(len(calls),2)
  self.assertEqual(calls[1]['model'],'llama-3.3-70b-versatile')
  self.assertEqual(calls[1]['response_format'],{'type':'json_object'})
  self.assertNotIn('reasoning_effort',calls[1])
  self.assertEqual(json.loads(answer)['answer'],'Hello!')
 def test_both_rate_limited_stop_after_two_attempts(self):
  def request(req,timeout):raise urllib.error.HTTPError(req.full_url,429,'rate limited',{},io.BytesIO(b'{}'))
  with patch.object(urllib.request,'urlopen',side_effect=request) as mock:
   with self.assertRaisesRegex(RuntimeError,'groq_http_429'):ctx['call_model']('test')
   self.assertEqual(mock.call_count,2)
if __name__=='__main__':unittest.main()
