import ast,io,json,os,re,urllib.request,urllib.error,urllib.parse,unittest
from pathlib import Path
from http.server import BaseHTTPRequestHandler
from unittest.mock import Mock
ROOT=Path(__file__).resolve().parents[1]
tree=ast.parse((ROOT/'api/agent.py').read_text())
tree.body=[n for n in tree.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))]
a=dict(json=json,os=os,re=re,urllib=__import__('urllib'),BaseHTTPRequestHandler=BaseHTTPRequestHandler,MODEL='test')
a['RECORD_LIST']=json.loads((ROOT/'portfolio-knowledge.json').read_text())
a['RECORDS']={r['id']:r for r in a['RECORD_LIST']}
a['FACT_CATALOG']=json.loads((ROOT/'agent-facts.json').read_text())['facts']
exec(compile(tree,'agent.py','exec'),a)
original=a.copy()

class Grounding(unittest.TestCase):
 def setUp(self):a.update(original)
 def test_catalog_provenance_and_status(self):
  facts=a['FACT_CATALOG'];self.assertEqual(len({f['id'] for f in facts}),len(facts))
  for fact in facts:
   self.assertIn(fact['status'],['confirmed','ongoing','unknown'])
   self.assertTrue(fact['source']['kind']);self.assertTrue(fact['category'])
 def test_retrieval_does_not_drop_core_facts_or_trust_assistant(self):
  sources=a['grounding_sources']('unrelated material '*10000)
  self.assertIn('fact:education.pgd',sources);self.assertIn('fact:portfolio.authorship',sources)
  history=[{'role':'user','content':'How did he build this portfolio?'},{'role':'assistant','content':'A secret development team did it.'}]
  query=a['conversation_query']('which development team?',history)
  self.assertIn('portfolio',query);self.assertNotIn('secret',query)
  self.assertEqual(a['conversation_query']('Tell me about Vista Digital Banking',history),'Tell me about Vista Digital Banking')
 def test_invalid_quotes_uncovered_words_and_fake_sources_are_blocked(self):
  sources={'f':{'text':'He designed this portfolio in Figma.'}}
  valid={'answer':'He designed it in Figma.','kind':'grounded','claims':[{'text':'He designed it in Figma.','source_id':'f','quote':'designed this portfolio in Figma'}]}
  self.assertEqual(a['validate_grounded_reply'](json.dumps(valid),sources),valid['answer'])
  for field,value in [('quote','a team of ten engineers'),('source_id','invented')]:
   bad=json.loads(json.dumps(valid));bad['claims'][0][field]=value
   with self.assertRaisesRegex(RuntimeError,'grounding_invalid'):a['validate_grounded_reply'](json.dumps(bad),sources)
  valid['answer']+=' He is available now.'
  with self.assertRaises(RuntimeError):a['validate_grounded_reply'](json.dumps(valid),sources)
 def test_social_mode_cannot_hide_personal_claims(self):
  self.assertEqual(a['validate_grounded_reply'](json.dumps({'answer':"You're welcome!",'kind':'social','claims':[]}),{}),"You're welcome!")
  with self.assertRaises(RuntimeError):a['validate_grounded_reply'](json.dumps({'answer':'He is a NASA engineer.','kind':'social','claims':[]}),{})
 def test_review_rewrites_wrong_draft_instead_of_passing_it_through(self):
  sources={'f':{'text':'Jamiu designed this portfolio in Figma.'}}
  prompt=a['build_prompt']('Which development team?',[], '', 'conversation',{})
  review={'answer':'He designed this portfolio in Figma.','kind':'grounded','claims':[{'text':'He designed this portfolio in Figma.','source_id':'f','quote':'designed this portfolio in Figma'}]}
  model=Mock(side_effect=[('A development team built it.','test'),(json.dumps(review),'test')]);a['call_model']=model
  answer,_=a['checked_answer'](prompt,sources)
  self.assertNotIn('development team',answer);self.assertEqual(model.call_count,2)
  self.assertIn('A development team built it.',model.call_args.args[0])
 def test_no_draft_or_review_failure_leaks_to_stream(self):
  a['checked_answer']=Mock(side_effect=RuntimeError('grounding_invalid'))
  h=a['handler'].__new__(a['handler']);h.wfile=io.BytesIO();h.send_response=lambda *args:None;h.send_header=lambda *args:None;h.end_headers=lambda:None
  h.stream_reply('prompt',[],'q',[],'conversation',{}, {})
  events=[json.loads(l) for l in h.wfile.getvalue().splitlines()]
  self.assertEqual(events[-1]['type'],'error');self.assertFalse(any(e['type'] in ('delta','done') for e in events))
 def test_successful_checked_answer_uses_existing_client_protocol(self):
  def checked(prompt,sources,on_review):on_review();return ('Checked reply.','test')
  a.update(checked_answer=checked,select_proof_ids=lambda *args:[],evidence_links=lambda *args:[])
  h=a['handler'].__new__(a['handler']);h.wfile=io.BytesIO();h.send_response=lambda *args:None;h.send_header=lambda *args:None;h.end_headers=lambda:None
  h.stream_reply('prompt',[],'q',[],'conversation',{}, {})
  events=[json.loads(l) for l in h.wfile.getvalue().splitlines()]
  self.assertEqual([e['type'] for e in events],['status','status','delta','done'])
  self.assertEqual(events[-1]['answer'],'Checked reply.')

if __name__=='__main__':unittest.main()
