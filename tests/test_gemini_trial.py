import ast, io, json, os, re, unittest, urllib.request, urllib.error, urllib.parse
from pathlib import Path
from unittest.mock import patch
tree=ast.parse((Path(__file__).resolve().parents[1]/"api/agent.py").read_text())
tree.body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ("clip","model_endpoint","call_model")]
ctx=dict(json=json,os=os,re=re,urllib=__import__("urllib"),MODEL="gemini-3.1-flash-lite",model_messages=lambda p:[{"role":"system","content":"Guide"},{"role":"user","content":p}])
exec(compile(tree,"agent.py","exec"),ctx)
class GeminiTrial(unittest.TestCase):
 def test_key_selects_gemini_in_preview_and_production(self):
  for env in ("preview","production"):
   with patch.dict(os.environ,{"VERCEL_ENV":env,"GEMINI_API_KEY":"test-key","GROQ_API_KEY":"groq-key"},clear=True):
    self.assertEqual(ctx["model_endpoint"]()[2],"gemini")
 def test_missing_gemini_key_retains_groq(self):
  with patch.dict(os.environ,{"GROQ_API_KEY":"groq-key"},clear=True):
   self.assertEqual(ctx["model_endpoint"]()[2],"groq")
 def test_native_request_and_citation_round_trip(self):
  requests=[]
  class Response:
   def __enter__(self):return self
   def __exit__(self,*args):pass
   def read(self):return json.dumps({"candidates":[{"content":{"parts":[{"text":json.dumps({"kind":"grounded","purpose":"answer","answer":"","claims":[{"text":"He uses Figma.","source_id":"e0"}]})}]}}],"usageMetadata":{"promptTokenCount":20,"candidatesTokenCount":10,"totalTokenCount":30}}).encode()
  def request(req,timeout):requests.append(req);return Response()
  prompt="GROUNDING_REVIEW_TASK\nInstructions\n"+json.dumps({"evidence":{"passage:long-original-id":{"text":"He uses Figma."}}})
  with patch.dict(os.environ,{"GEMINI_API_KEY":"test-key"},clear=True),patch.object(urllib.request,"urlopen",side_effect=request):
   answer,provider=ctx["call_model"](prompt)
  req=requests[0];body=json.loads(req.data);config=body["generationConfig"]
  self.assertTrue(req.full_url.endswith("/models/gemini-3.1-flash-lite:generateContent"))
  self.assertNotIn("Authorization",req.headers)
  self.assertEqual(config["maxOutputTokens"],1100)
  self.assertEqual(config["thinkingConfig"],{"thinkingLevel":"minimal"})
  self.assertEqual(config["responseJsonSchema"]["properties"]["claims"]["items"]["properties"]["source_id"]["enum"],["e0"])
  self.assertEqual(json.loads(answer)["claims"][0]["source_id"],"passage:long-original-id")
  self.assertIn('"e0"',body["contents"][0]["parts"][0]["text"])
  self.assertEqual(provider,"gemini")
 def test_gemini_quota_never_calls_other_provider(self):
  error=urllib.error.HTTPError("https://generativelanguage.googleapis.com",429,"quota",{},io.BytesIO(b'{"error":{"details":[]}}'))
  with patch.dict(os.environ,{"GEMINI_API_KEY":"test-key","GROQ_API_KEY":"groq-key"},clear=True),patch.object(urllib.request,"urlopen",side_effect=error) as request:
   with self.assertRaisesRegex(RuntimeError,"gemini_http_429"):ctx["call_model"]("test")
   self.assertEqual(request.call_count,1)
 def test_timeout_is_bounded_and_no_retry_storm(self):
  with patch.dict(os.environ,{"GEMINI_API_KEY":"test-key"},clear=True),patch.object(urllib.request,"urlopen",side_effect=TimeoutError()) as request:
   with self.assertRaisesRegex(RuntimeError,"model_network"):ctx["call_model"]("test")
   self.assertEqual(request.call_count,1)
   self.assertEqual(request.call_args.kwargs["timeout"],22)
if __name__=="__main__":unittest.main()
