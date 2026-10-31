import io,json,unittest
from unittest.mock import Mock
from test_grounding import a,original
class ConversationState(unittest.TestCase):
 def setUp(self):a.update(original)
 def resolve(self,q,h):return a['resolve_conversation_turn'](q,a['normalise_history'](h),{})
 def pending(self):return [{'role':'user','text':'What did you sacrifice to meet the deadline?'},{'role':'assistant','text':'Which project do you mean?','intent':'clarification'}]
 def test_any_project_keeps_the_unanswered_deadline_question(self):
  for q in ['pick any of his project','pick one','choose a project','you choose','any is fine']:
   turn=self.resolve(q,self.pending());target=a['recruiter_answer_target'](turn['question'])
   self.assertTrue(turn['continued'],q);self.assertEqual(target['focus'],'deadline_tradeoff',q);self.assertTrue(target['projects'],q)
 def test_named_selection_changes_scope_without_changing_the_question(self):
  turn=self.resolve('Horal please',self.pending());target=a['recruiter_answer_target'](turn['question'])
  self.assertEqual(target['focus'],'deadline_tradeoff');self.assertEqual(target['projects'],['horal'])
 def test_ordinal_uses_the_order_presented_not_catalog_order(self):
  h=self.pending();h[-1]['text']='Which project: Horal, Vista or Kremor AI?'
  turn=self.resolve('the second one',h);self.assertEqual(turn['selected_projects'],['vista-itss'])
 def test_explicit_new_questions_reset_the_pending_task(self):
  for q in ['What qualifications does he have?','Instead tell me about Horal','What makes Horal unique?','How did he build this portfolio?']:
   self.assertEqual(self.resolve(q,self.pending())['question'],q)
 def test_short_elaboration_retains_the_task_and_project(self):
  h=[{'role':'user','text':'How do you know Horal worked?'},{'role':'assistant','text':'It shipped, but improvements have not been measured.','conversation_context':{'request':'How do you know Horal worked?','projects':['horal']}}]
  for q in ['Why?','Tell me more','Could you please explain more','anything else?','Really? Tell me more','What?']:
   turn=self.resolve(q,h);self.assertEqual(a['recruiter_answer_target'](turn['question'])['focus'],'outcome_evidence',q);self.assertIn('horal',turn['selected_projects'])
 def test_non_project_clarification_keeps_its_original_question(self):
  h=[{'role':'user','text':'Tell me about his leadership'},{'role':'assistant','text':'Would you like to know about technical leadership or design leadership?','intent':'clarification'}]
  turn=self.resolve('technical',h);self.assertIn('leadership',turn['question']);self.assertIn('technical',turn['question']);self.assertTrue(turn['continued'])
 def test_state_survives_the_history_window_and_restored_content_format(self):
  h=[{'role':'assistant','content':'Which project?', 'intent':'clarification','conversation_context':{'request':'What was sacrificed to meet the deadline?','projects':['horal']}}]
  turn=self.resolve('Horal',h);self.assertEqual(a['recruiter_answer_target'](turn['question'])['focus'],'deadline_tradeoff')
 def test_two_project_comparison_resolves_pronouns(self):
  h=[{'role':'user','text':'Tell me about Horal and Vista'},{'role':'assistant','text':'Horal is a marketplace; Vista is banking.'}]
  turn=self.resolve('Compare them',h);self.assertIn('Horal',turn['question']);self.assertIn('Vista',turn['question'])
 def test_selection_after_an_old_wrong_overview_still_recovers_the_task(self):
  h=self.pending()+[{'role':'user','text':'pick any of his project'},{'role':'assistant','text':'He worked at Kremor AI.'}]
  turn=self.resolve('Use Horal',h);self.assertEqual(a['recruiter_answer_target'](turn['question'])['focus'],'deadline_tradeoff')
 def test_no_history_does_not_invent_a_pending_question(self):
  self.assertFalse(self.resolve('Horal',[])['continued'])
 def test_unsupported_hype_is_rejected_but_actual_contribution_remains_valid(self):
  source={'f':{'text':'He worked on model benchmarking and annotation.'}}
  bad={'kind':'grounded','claims':[{'text':'He demonstrated extraordinary expertise in AI.','source_id':'f'}]}
  with self.assertRaisesRegex(RuntimeError,'unsupported_superlative'):a['validate_grounded_reply'](json.dumps(bad),source)
  bad['claims'][0]['text']='He worked on model benchmarking and annotation.';self.assertIn('benchmarking',a['validate_grounded_reply'](json.dumps(bad),source))
 def test_simple_acknowledgement_does_not_repeat_the_previous_answer(self):
  h=[{'role':'user','text':'Tell me about Horal'},{'role':'assistant','text':'It is a marketplace.'}]
  self.assertFalse(self.resolve('yes',h)['continued'])
 def test_current_subject_survives_after_the_named_turn_is_truncated(self):
  h=[{'role':'assistant','text':'Here are the details.','conversation_context':{'request':'Tell me about Horal','projects':['horal']}}]
  target=a['recruiter_answer_target']('How do you know it worked?',a['normalise_history'](h))
  self.assertEqual(target['projects'],['horal'])
 def test_request_handler_passes_resolved_intent_to_generation(self):
  a['retrieve']=Mock(return_value=('',[]));a['checked_answer']=Mock(return_value=('Jamiu can explain the deadline decision directly.','test',['boundary']));a['json_response']=Mock();a['DOMAIN_PROOF_ROUTES']=()
  payload=json.dumps({'question':'pick any of his project','history':self.pending(),'page_context':{'page_id':'about'}}).encode()
  h=a['handler'].__new__(a['handler']);h.headers={'content-length':str(len(payload))};h.rfile=io.BytesIO(payload);h.do_POST()
  self.assertEqual(a['checked_answer'].call_count,1);self.assertIn('deadline',a['checked_answer'].call_args.args[0]);self.assertIn('deadline',h.conversation_context['request'])
if __name__=='__main__':unittest.main()
