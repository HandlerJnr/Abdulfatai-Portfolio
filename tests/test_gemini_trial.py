import ast, io, json, os, re, unittest, urllib.request, urllib.error
from pathlib import Path
from unittest.mock import patch
tree=ast.parse((Path(__file__).resolve().parents[1]/"api/agent.py").read_text())
tree.body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ("clip","model_endpoint","call_model")]
ctx=dict(json=json,os=os,re=re,urllib=__import__("urllib"),MODEL="gemini-3.1-flash-lite",model_messages=lambda p:[{"role":"user","content":p}])
exec(compile(tree,"agent.py","exec"),ctx)
class GeminiTrial(unittest.TestCase):
 def test_preview_uses_gemini(self):
  with patch.dict(os.environ,{"VERCEL_ENV":"preview","GEMINI_API_KEY":"test-key","GROQ_API_KEY":"groq-key"},clear=True):
   self.assertEqual(ctx["model_endpoint"]()[2],"gemini")
 def test_production_stays_on_groq(self):
  with patch.dict(os.environ,{"VERCEL_ENV":"production","GEMINI_API_KEY":"test-key","GROQ_API_KEY":"groq-key"},clear=True):
   self.assertEqual(ctx["model_endpoint"]()[2],"groq")
 def test_request_uses_gemini_compatible_options(self):
  requests=[]
  class Response:
   def __enter__(self):return self
   def __exit__(self,*args):pass
   def read(self):return json.dumps({"choices":[{"message":{"content":'{"kind":"social","claims":[],"answer":"Hello!"}'}}],"usage":{"prompt_tokens":20,"completion_tokens":10,"total_tokens":30}}).encode()
  def request(req,timeout):requests.append(req);return Response()
  with patch.dict(os.environ,{"VERCEL_ENV":"preview","GEMINI_API_KEY":"test-key"},clear=True),patch.object(urllib.request,"urlopen",side_effect=request):
   answer,provider=ctx["call_model"]("GROUNDING_REVIEW_TASK\ntest")
  body=json.loads(requests[0].data)
  self.assertEqual(provider,"gemini")
  self.assertEqual(body["model"],"gemini-3.1-flash-lite")
  self.assertNotIn("max_completion_tokens",body)
  self.assertEqual(body["max_tokens"],1100)
  self.assertEqual(body["reasoning_effort"],"minimal")
 def test_gemini_quota_error_never_calls_paid_provider(self):
  error=urllib.error.HTTPError("https://generativelanguage.googleapis.com",429,"quota",{},io.BytesIO(b'{"error":{"details":[{"violations":[{"quotaValue":"20","quotaMetric":"requests"}]}]}}'))
  with patch.dict(os.environ,{"VERCEL_ENV":"preview","GEMINI_API_KEY":"test-key","GROQ_API_KEY":"groq-key"},clear=True),patch.object(urllib.request,"urlopen",side_effect=error) as request:
   with self.assertRaisesRegex(RuntimeError,"gemini_http_429"):ctx["call_model"]("test")
   self.assertEqual(request.call_count,1)
if __name__=="__main__":unittest.main()
