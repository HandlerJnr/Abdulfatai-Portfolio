import json,unittest
from unittest.mock import Mock
from test_grounding import a,original
class Relevance(unittest.TestCase):
 def setUp(self):a.update(original)
 def test_deadline_question_never_quotes_an_unrelated_product_description(self):
  sources={'passage:kremor-ai:1':{'text':'Someone may know the occasion, textile or feeling they want without knowing how to prompt an AI tool.'}}
  reply,_,refs=a['published_reply']('What did you sacrifice to meet the deadline?',[],sources)
  self.assertNotIn('textile',reply);self.assertIn('cut, kept or postponed',reply);self.assertIn('contact Jamiu',reply);self.assertEqual(refs,['boundary'])
 def test_paraphrased_deadline_questions_share_the_evidence_requirement(self):
  for q in ['What did he drop to meet the deadline?','Which features were postponed because of time?','What did you sacrifice?']:
   target=a['recruiter_answer_target'](q,[{'role':'user','content':'Tell me about Horal'}])
   self.assertEqual(target['focus'],'deadline_tradeoff',q);self.assertEqual(target['projects'],['horal'])
 def test_ambiguous_redesign_question_clarifies_instead_of_picking_a_project(self):
  history=[{'role':'user','content':'Can he code?'},{'role':'assistant','content':'He works on fractional ownership.','support_ids':['passage:shortlet-lagos:1']}]
  reply=a['contextual_clarification']('How do you know the redesign worked?',history,{'page_id':'about'})
  self.assertIn('Which project',reply)
 def test_project_page_and_explicit_project_establish_scope(self):
  self.assertEqual(a['recruiter_answer_target']('How do you know it worked?',[],{'page_id':'horal'})['projects'],['horal'])
  self.assertEqual(a['recruiter_answer_target']('How do you know Vista worked?',[{'role':'user','content':'Horal'}])['projects'],['vista-itss'])
 def test_general_method_advice_is_not_success_evidence(self):
  raw=json.dumps({'kind':'grounded','claims':[{'text':'He questions business rules to improve usability.','source_id':'passage:horal:1'}]})
  sources={'passage:horal:1':{'text':'He questions business rules.'}}
  with self.assertRaisesRegex(RuntimeError,'outcome_evidence'):a['validate_answer_target'](raw,sources,{'focus':'outcome_evidence','projects':['horal']})
 def test_future_validation_priority_is_not_completed_research(self):
  raw=json.dumps({'kind':'grounded','claims':[{'text':'He integrates research practices to ensure effective outcomes.','source_id':'passage:shortlet-lagos:1'}]})
  evidence={'passage:shortlet-lagos:1':{'text':'Investor comprehension of fractional ownership remains a validation priority.'}}
  with self.assertRaisesRegex(RuntimeError,'outcome_evidence'):a['validate_answer_target'](raw,evidence,{'focus':'outcome_evidence','projects':['shortlet-lagos']})
 def test_actual_delivery_and_measurement_limits_are_relevant(self):
  raw=json.dumps({'kind':'grounded','claims':[{'text':'Horal is live on web, iOS and Android; task-completion improvements have not been measured.','source_id':'passage:horal:1'}]})
  a['validate_answer_target'](raw,{'passage:horal:1':{'text':'Horal is live on web, iOS and Android. No task-completion results are measured.'}},{'focus':'outcome_evidence','projects':['horal']})
 def test_another_projects_passage_cannot_answer_a_deadline_followup(self):
  raw=json.dumps({'kind':'grounded','claims':[{'text':'The Kremor workflow connects textiles to production.','source_id':'passage:kremor-ai:1'}]})
  with self.assertRaisesRegex(RuntimeError,'wrong_project'):a['validate_answer_target'](raw,{'passage:kremor-ai:1':{'text':'Textiles and production.'}},{'focus':'deadline_tradeoff','projects':['horal']})
 def test_ordinary_design_decisions_do_not_establish_a_deadline_sacrifice(self):
  raw=json.dumps({'kind':'grounded','claims':[{'text':'He prioritised visible verification.','source_id':'passage:horal:1'}]})
  with self.assertRaisesRegex(RuntimeError,'deadline_evidence'):a['validate_answer_target'](raw,{'passage:horal:1':{'text':'Verification appears at the store level.'}},{'focus':'deadline_tradeoff','projects':['horal']})
 def test_off_topic_draft_is_privately_repaired_before_display(self):
  sources={'passage:kremor-ai:x':{'text':'The product connects textiles to garment production.'},'boundary':{'text':'Specific deadline decisions require Jamiu’s own account and direct contact.'}}
  wrong={'kind':'grounded','claims':[{'text':'The product connects textiles to production.','source_id':'passage:kremor-ai:x'}]}
  right={'kind':'grounded','claims':[{'text':'Jamiu can explain what was cut or postponed for the deadline directly.','source_id':'boundary'}]}
  a['call_model']=Mock(side_effect=[(json.dumps(wrong),'test'),(json.dumps(right),'test')])
  prompt=a['build_prompt']('What did he sacrifice to meet the deadline?',[{'role':'user','content':'Tell me about Horal'}],'','conversation',{})
  answer,_,refs=a['checked_answer'](prompt,sources)
  self.assertNotIn('textiles',answer);self.assertEqual(refs,['boundary']);self.assertEqual(a['call_model'].call_count,2)
if __name__=='__main__':unittest.main()
