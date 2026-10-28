import ast,hashlib,io,json,os,re,urllib.request,urllib.error,urllib.parse,unittest
from pathlib import Path
from http.server import BaseHTTPRequestHandler
from unittest.mock import Mock
ROOT=Path(__file__).resolve().parents[1]
tree=ast.parse((ROOT/'api/agent.py').read_text())
tree.body=[n for n in tree.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))]
a=dict(json=json,hashlib=hashlib,os=os,re=re,urllib=__import__('urllib'),BaseHTTPRequestHandler=BaseHTTPRequestHandler,MODEL='test',MAX_HISTORY=10)
a['RECORD_LIST']=json.loads((ROOT/'portfolio-knowledge.json').read_text())
a['RECORDS']={r['id']:r for r in a['RECORD_LIST']}
a['FACT_CATALOG']=json.loads((ROOT/'agent-facts.json').read_text())['facts']
exec(compile(tree,'agent.py','exec'),a)
original=a.copy()

class Grounding(unittest.TestCase):
 def setUp(self):a.update(original)
 def test_history_normalises_both_client_formats(self):
  expected=[{'role':'user','content':'His qualification?'},{'role':'assistant','content':'PGD at AFIT.'}]
  for field in ['text','content']:
   self.assertEqual(a['normalise_history']([{'role':m['role'],field:m['content']} for m in expected]),expected)
 def test_elaboration_rejects_only_reusing_discussed_sources(self):
  sources={'old':{'text':'He designed the portfolio UI in Figma.','already_discussed':True},'new':{'text':'He structures reusable components in the implementation.','already_discussed':False}}
  reply={'kind':'grounded','purpose':'elaboration','claims':[{'text':'He designed it in Figma.','source_id':'old'}]}
  with self.assertRaisesRegex(RuntimeError,'repetition'):a['validate_grounded_reply'](json.dumps(reply),sources)
  reply['claims']=[{'text':'He structures reusable components.','source_id':'new'}]
  self.assertIn('reusable',a['validate_grounded_reply'](json.dumps(reply),sources))
  history=a['normalise_history']([{'role':'assistant','text':'Earlier reply.','support_ids':['fact:portfolio.authorship']}])
  self.assertTrue(a['grounding_sources']('',history)['fact:portfolio.authorship']['already_discussed'])
 def test_passage_ids_do_not_change_with_retrieval_order(self):
  one='SOURCE ID: about\nTITLE: About\nTEXT: Stable source passage about his work.'
  other='SOURCE ID: about\nTITLE: About\nTEXT: Another source passage.'
  first=a['grounding_sources'](one);second=a['grounding_sources'](other+'\n\n---\n\n'+one)
  source_id=next(key for key in first if key.startswith('passage:'))
  self.assertIn(source_id,second)
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
  claim_only=dict(valid);claim_only.pop('answer')
  self.assertEqual(a['validate_grounded_reply'](json.dumps(claim_only),sources),valid['answer'])
  without_quote=json.loads(json.dumps(claim_only));without_quote['claims'][0].pop('quote')
  self.assertEqual(a['validate_grounded_reply'](json.dumps(without_quote),sources),valid['answer'])
  for field,value in [('quote','a team of ten engineers'),('source_id','invented')]:
   bad=json.loads(json.dumps(valid));bad['claims'][0][field]=value
   with self.assertRaisesRegex(RuntimeError,'grounding_invalid'):a['validate_grounded_reply'](json.dumps(bad),sources)
  valid['answer']+=' He is available now.'
  with self.assertRaises(RuntimeError):a['validate_grounded_reply'](json.dumps(valid),sources)
 def test_social_mode_cannot_hide_personal_claims(self):
  self.assertEqual(a['validate_grounded_reply'](json.dumps({'answer':"You're welcome!",'kind':'social','claims':[]}),{}),"You're welcome!")
  with self.assertRaises(RuntimeError):a['validate_grounded_reply'](json.dumps({'answer':'He is a NASA engineer.','kind':'social','claims':[]}),{})
 def test_source_first_person_does_not_change_guide_identity(self):
  sources={'f':{'text':'I designed the UI in Figma and built the portfolio.'}}
  for text in ['I designed the UI in Figma.','My portfolio shows my love of design.','We built the portfolio.']:
   reply={'kind':'grounded','claims':[{'text':text,'source_id':'f'}]}
   with self.assertRaisesRegex(RuntimeError,'perspective'):a['validate_grounded_reply'](json.dumps(reply),sources)
  for text in ['He designed the UI in Figma.',"I don't have his exact design rationale.","I can't book a call."]:
   a['validate_guide_perspective'](text,sources)
  voice=a['model_messages']('GROUNDING_REVIEW_TASK\ntest')[0]['content']
  self.assertIn('never pretend to be Jamiu',voice)
  self.assertIn('Do not paraphrase the same answer',voice)
  self.assertIn('inventing personal motivations',voice)
 def test_generation_checks_prior_false_claim_without_duplicate_provider_calls(self):
  sources={'f':{'text':'Jamiu designed this portfolio in Figma.'}}
  prompt=a['build_prompt']('Which development team?',[{'role':'assistant','content':'A development team built it.'}], '', 'conversation',{})
  review={'answer':'He designed this portfolio in Figma.','kind':'grounded','claims':[{'text':'He designed this portfolio in Figma.','source_id':'f','quote':'designed this portfolio in Figma'}]}
  model=Mock(return_value=(json.dumps(review),'test'));a['call_model']=model
  answer,_,refs=a['checked_answer'](prompt,sources)
  self.assertNotIn('development team',answer);self.assertEqual(model.call_count,1)
  self.assertIn('A development team built it.',model.call_args.args[0])
 def test_corrected_structure_is_generated_once_without_leaking_bad_claims(self):
  sources={'f':{'text':'He designed this portfolio in Figma.'}}
  bad={'kind':'social','answer':'He is a NASA engineer.','claims':[]}
  good={'kind':'grounded','claims':[{'text':'He designed it in Figma.','source_id':'f'}]}
  model=Mock(side_effect=[(json.dumps(bad),'test'),(json.dumps(good),'test')]);a['call_model']=model
  prompt=a['build_prompt']('Tell me more',[], '', 'conversation',{})
  answer,_,refs=a['checked_answer'](prompt,sources)
  self.assertNotIn('NASA',answer);self.assertIn('Figma',answer)
  self.assertEqual(model.call_count,2);self.assertIn('validation_feedback',model.call_args.args[0])
 def test_only_checked_claims_are_displayed_when_redundant_answer_differs(self):
  sources={'f':{'text':'He designed this portfolio in Figma.'}}
  raw={'kind':'grounded','answer':'He works at NASA.','claims':[{'text':'He designed it in Figma.','source_id':'f'}]}
  a['call_model']=Mock(return_value=(json.dumps(raw),'test'))
  answer,_,_=a['checked_answer'](a['build_prompt']('How was it built?',[], '', 'conversation',{}),sources)
  self.assertEqual(answer,'He designed it in Figma.');self.assertNotIn('NASA',answer)
 def test_complete_reply_is_not_cut_to_two_claims(self):
  sources={str(i):{'text':t} for i,t in enumerate(['He designs payment interfaces.','He holds BSc Physics.','He holds a PGD Aerospace Engineering.','He is studying MSc UX Design at Brighton.'])}
  claims=[{'text':source['text'],'source_id':key} for key,source in sources.items()]
  a['call_model']=Mock(return_value=(json.dumps({'kind':'grounded','detail':'brief','claims':claims}),'test'))
  answer,_,refs=a['checked_answer'](a['build_prompt']('Who is Jamiu?',[], '', 'conversation',{}),sources)
  self.assertEqual(len(refs),4)
  self.assertIn('PGD',answer);self.assertIn('studying MSc',answer)
 def test_irrelevant_ui_context_is_omitted_but_qualifications_remain(self):
  sources=a['grounding_sources']('',[], 'What kind of designer is Jamiu?')
  self.assertIn('fact:education.bsc',sources);self.assertIn('fact:education.pgd',sources);self.assertIn('fact:education.msc',sources)
  self.assertNotIn('fact:ui.search-homepage',sources);self.assertNotIn('fact:portfolio.authorship',sources)
  build=a['grounding_sources']('',[], 'How did he build this portfolio?')
  self.assertIn('fact:portfolio.authorship',build)
 def test_no_draft_or_review_failure_leaks_to_stream(self):
  a['checked_answer']=Mock(side_effect=RuntimeError('grounding_invalid'))
  h=a['handler'].__new__(a['handler']);h.wfile=io.BytesIO();h.send_response=lambda *args:None;h.send_header=lambda *args:None;h.end_headers=lambda:None
  h.stream_reply('prompt',[],'q',[],'conversation',{}, {})
  events=[json.loads(l) for l in h.wfile.getvalue().splitlines()]
  self.assertEqual(events[-1]['type'],'done')
  self.assertNotIn('grounding_invalid',events[-1]['answer'])
  self.assertIn('Which would you like to see?',events[-1]['answer'])
 def test_provider_failure_returns_labelled_published_evidence(self):
  a['checked_answer']=Mock(side_effect=RuntimeError('groq_http_429'))
  sources={'passage:vista:1':{'text':'Vista supports English and French. Local currency remains visible.','status':'documented'}}
  answer,provider,refs=a['resilient_answer']('prompt',sources,'Which languages?',[], 'conversation')
  self.assertEqual(provider,'portfolio');self.assertEqual(refs,['passage:vista:1'])
  self.assertTrue(answer.startswith('His portfolio puts it this way:'))
  self.assertIn('Vista supports English and French.',answer)
 def test_role_comparison_does_not_masquerade_as_excerpt(self):
  a['checked_answer']=Mock(side_effect=RuntimeError('groq_http_429'))
  with self.assertRaises(RuntimeError):a['resilient_answer']('prompt',{},'Compare this role',[], 'job-fit')
 def test_successful_checked_answer_uses_existing_client_protocol(self):
  def checked(prompt,sources,on_review):on_review();return ('Checked reply.','test',[])
  a.update(checked_answer=checked,select_proof_ids=lambda *args:[],evidence_links=lambda *args:[])
  h=a['handler'].__new__(a['handler']);h.wfile=io.BytesIO();h.send_response=lambda *args:None;h.send_header=lambda *args:None;h.end_headers=lambda:None
  h.stream_reply('prompt',[],'q',[],'conversation',{}, {})
  events=[json.loads(l) for l in h.wfile.getvalue().splitlines()]
  self.assertEqual([e['type'] for e in events],['status','status','delta','done'])
  self.assertEqual(events[-1]['answer'],'Checked reply.')

class ContactReplies(unittest.TestCase):
 def test_contact_reply_never_denies_verified_linkedin(self):
  for q in ['give me all his contants, linkedin, facebook or any social media handle','How can I contact him?','His LinkedIn?']:
   answer=a['verified_contact_reply'](q)
   self.assertEqual(answer,'Connect with Jamiu:')
   self.assertNotIn('not provided',answer)
  self.assertEqual(a['verified_contact_reply']('all his social media'),'Connect with Jamiu:')
  self.assertIsNone(a['verified_contact_reply']('Explain Vista banking'))
  self.assertIsNone(a['verified_contact_reply']('How do customers contact the support team?'))

if __name__=='__main__':unittest.main()

