import json,unittest
from pathlib import Path
from types import SimpleNamespace
from test_grounding import a,original
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'recruiter-knowledge.json').read_text())
class RecruiterKnowledge(unittest.TestCase):
 def setUp(self):a.update(original)
 def test_every_project_has_decision_backed_strengths(self):
  projects={r['id']:r for r in a['RECORD_LIST'] if r.get('url','').startswith('/work/')}
  self.assertEqual({p['record_id'] for p in DATA['projects']},set(projects))
  for p in DATA['projects']:
   source=projects[p['record_id']]['text']
   self.assertTrue(p['problem_role_contribution']);self.assertTrue(p['delivery_and_outcome_context'])
   for strength in p['strengths']:self.assertIn(strength['evidence'],source)
 def test_interview_questions_are_boundaries_not_fabricated_stories(self):
  topics={t['id']:t for t in DATA['recruiter_topics']}
  self.assertEqual(len(topics),17)
  for key in ['research','mistakes','disagreement','metrics','accessibility','availability']:
   self.assertIn(key,topics);self.assertTrue(topics[key]['evidence_guidance'])
 def test_dossiers_are_indexed_but_never_invent_proof_cards(self):
  records=a['recruiter_records'](DATA,a['RECORD_LIST'])
  self.assertEqual(len(records),29)
  self.assertTrue(all(r['knowledge_only'] for r in records))
  self.assertIn('escrow',next(r['text'] for r in records if r['id']=='recruiter-horal'))
 def test_named_project_retrieval_prioritises_contribution_and_strengths(self):
  dossiers=a['recruiter_records'](DATA,a['RECORD_LIST']);a['RECORD_LIST']+=dossiers
  a['RECORDS']={r['id']:r for r in a['RECORD_LIST']};a['DOMAIN_PROOF_ROUTES']=()
  a['RECORD_NODES']={r['id']:[SimpleNamespace(text=line,metadata={'record_id':r['id'],'label':'section'}) for line in r['text'].splitlines()] for r in dossiers}
  a['GLOBAL_RETRIEVER']=SimpleNamespace(retrieve=lambda q:[])
  text,_=a['retrieve']('What does Horal show about his strengths?',[],'conversation',{})
  self.assertIn('Demonstrated capability:',text);self.assertIn('Horal is live',text)
  self.assertEqual(a['topic_record_ids']('Horal'),['horal'])
 def test_provider_outage_never_quotes_interview_questions_as_owner_evidence(self):
  sources={'passage:interview-disagreement:x':{'text':'Questions: Describe a disagreement with an engineer.'}}
  answer,_,refs=a['published_reply']('Describe a disagreement he had with an engineer.',[],sources)
  self.assertNotIn('Questions:',answer);self.assertIn('Jamiu',answer);self.assertIn('directly',answer);self.assertEqual(refs,['boundary'])
 def test_project_overview_is_not_forced_into_a_personal_qualification_intro(self):
  sources=a['grounding_sources']('',[],'What kind of designer does Horal show he is?')
  self.assertNotIn('profile:qualifications',sources)
if __name__=='__main__':unittest.main()
