import json, unittest
from types import SimpleNamespace
from test_grounding import a, original

class Continuity(unittest.TestCase):
 def setUp(self):
  a.update(original);a['DOMAIN_PROOF_ROUTES']=()
 def test_old_groq_history_continues_the_same_project(self):
  history=a['normalise_history']([{'role':'user','text':'Tell me about Vista Digital Banking'},{'role':'assistant','text':'He designed banking journeys across four subsidiaries.'}])
  query=a['conversation_query']('English and French?',history)
  self.assertIn('Vista',query)
  self.assertNotIn('four subsidiaries',query)
 def test_explicit_topic_change_does_not_drag_in_old_projects(self):
  history=[{'role':'user','content':'Tell me about Vista Digital Banking'}]
  self.assertEqual(a['conversation_query']('What tools does he use?',history),'What tools does he use?')
  self.assertEqual(a['conversation_query']('Tell me about Horal',history),'Tell me about Horal')
 def test_short_followups_use_latest_topic_not_all_previous_topics(self):
  history=[{'role':'user','content':'Tell me about Vista Digital Banking'},{'role':'user','content':'Tell me about Horal'}]
  query=a['conversation_query']('What was his role?',history)
  self.assertIn('Horal',query);self.assertNotIn('Vista',query)
 def test_relevant_project_evidence_precedes_generic_education(self):
  class Node:
   def __init__(self,rid,text):self.node_id=rid+text;self.text=text;self.metadata={'record_id':rid,'label':'section'}
  vista=Node('vista-itss','English and French are available at sign-in; currencies remain visible in the banking interface.')
  edu=Node('education','His MSc in User Experience Design is ongoing at Brighton.')
  a['RECORD_NODES']={'vista-itss':[vista],'education':[edu]}
  a['GLOBAL_RETRIEVER']=SimpleNamespace(retrieve=lambda q:[SimpleNamespace(node=edu,score=100),SimpleNamespace(node=vista,score=1)])
  retrieved,_=a['retrieve']('What about English and French?',[{'role':'user','content':'Tell me about Vista Digital Banking'}],'conversation',{})
  self.assertTrue(retrieved.startswith('SOURCE ID: vista-itss'))
  sources=a['grounding_sources'](retrieved)
  self.assertTrue(any('sign-in' in source['text'] for source in sources.values()))
 def test_provider_failure_does_not_answer_a_new_question_with_old_topic(self):
  sources={'old':{'text':'Vista banking journeys support English and French across four subsidiaries.','status':'documented'}}
  answer,_,refs=a['published_reply']('What tools does he use?',[{'role':'user','content':'Tell me about Vista Digital Banking'}],sources)
  self.assertNotIn('Vista',answer);self.assertEqual(refs,[])
 def test_established_facts_are_answered_without_a_model(self):
  history=[{'role':'user','content':'Tell me about Vista Digital Banking'}]
  language=a['verified_knowledge_reply']('What about English and French?',history)
  self.assertIn('sign-in',language[0])
  self.assertEqual(language[1],['record:vista-itss'])
  authorship=a['verified_knowledge_reply']('Did he build this portfolio himself?',history)
  self.assertIn('Figma',authorship[0])
  self.assertIsNone(a['verified_knowledge_reply']('Compare his experience for this role',history))
 def test_real_project_role_survives_short_headers(self):
  record=next(r for r in a['RECORD_LIST'] if r['id']=='horal')
  nodes=[SimpleNamespace(node_id=str(i),text=line,metadata={'record_id':'horal','label':'section'}) for i,line in enumerate(record['text'].splitlines()) if line.strip()]
  a['RECORD_NODES']={'horal':nodes}
  a['GLOBAL_RETRIEVER']=SimpleNamespace(retrieve=lambda q:[])
  retrieved,_=a['retrieve']('What was his role?',[{'role':'user','content':'Tell me about Horal'}],'conversation',{})
  sources=a['grounding_sources'](retrieved)
  self.assertTrue(any('End-to-end product designer' in source['text'] for source in sources.values()))
  reply=a['verified_knowledge_reply']('What was his role in that project?',[{'role':'user','content':'Tell me about Horal'}])
  self.assertIn('End-to-end product designer',reply[0])
  self.assertIn('He designed',reply[0])
 def test_project_specific_unknown_tools_are_not_replaced_by_general_skills(self):
  self.assertIsNone(a['verified_knowledge_reply']('What tools did he use on Vista?',[]))
 def test_fast_answer_can_anchor_later_followups(self):
  query=a['conversation_query']('Why that approach?',[{'role':'assistant','content':'Earlier answer','support_ids':['record:vista-itss']}])
  self.assertIn('Vista',query)
 def test_prompt_keeps_restored_conversation(self):
  history=[{'role':'user','content':'Tell me about Vista Digital Banking'},{'role':'assistant','content':'He built a shared design system.'}]
  prompt=a['build_prompt']('Why that approach?',history,'','conversation',{})
  self.assertIn('He built a shared design system.',prompt)
if __name__=='__main__':unittest.main()
