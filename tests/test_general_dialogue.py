import json,unittest
from pathlib import Path
from test_grounding import a,original
ROOT=Path(__file__).resolve().parents[1]
class GeneralDialogue(unittest.TestCase):
 def setUp(self):
  a.update(original);a['RECORD_LIST']=list(original['RECORD_LIST'])+json.loads((ROOT/'reference-catalog.json').read_text());a['RECORDS']={r['id']:r for r in a['RECORD_LIST']}
 def history(self,subjects,options=None):
  return a['normalise_history']([{'role':'user','text':'Explain his certifications'},{'role':'assistant','text':'Which certificate would you like to explore?','intent':'clarification','conversation_context':{'request':'Explain his certifications','projects':[],'subjects':subjects,'options':options or subjects}}])
 def test_document_ordinal_keeps_the_original_request(self):
  ids=['reference-efset-english-c1','reference-project-management-foundations']
  t=a['resolve_conversation_turn']('the second one',self.history(ids),{})
  self.assertEqual(t['selected_subjects'],[ids[1]]);self.assertIn('Explain his certifications',t['question']);self.assertEqual(t['selected_projects'],[])
 def test_any_brand_document_does_not_turn_into_a_product_project(self):
  ids=['reference-shortlet-lagos-brand-guide','reference-female-rise-brand-guide']
  h=self.history(ids);h[-1]['conversation_context']['request']='Explain the typography in a brand guide'
  t=a['resolve_conversation_turn']('pick any',h,{})
  self.assertEqual(t['selected_subjects'],ids[:1]);self.assertIn('typography',t['question']);self.assertEqual(t['selected_projects'],[])
 def test_pronoun_carries_document_subject_but_changes_the_question(self):
  t=a['resolve_conversation_turn']('What is its date?',self.history(['reference-efset-english-c1']),{})
  self.assertIn('What is its date?',t['question']);self.assertIn('English',t['question']);self.assertEqual(t['original_request'],'What is its date?')
 def test_more_about_that_one_stays_on_the_selected_document(self):
  t=a['resolve_conversation_turn']('Tell me more about that one',self.history(['reference-efset-english-c1']),{})
  self.assertEqual(t['selected_subjects'],['reference-efset-english-c1']);self.assertIn('Explain his certifications',t['question'])
 def test_explicit_new_collection_resets_the_task(self):
  t=a['resolve_conversation_turn']('Tell me about his branding work',self.history(['reference-efset-english-c1']),{})
  self.assertEqual(t['question'],'Tell me about his branding work');self.assertIn('brand',t['selected_subjects'])
 def test_explicit_new_question_about_same_collection_keeps_its_own_task(self):
  t=a['resolve_conversation_turn']('What other certifications does he hold?',self.history(['reference-efset-english-c1']),{})
  self.assertEqual(t['question'],'What other certifications does he hold?')
 def test_social_response_preserves_context_without_spamming_links(self):
  prev={'request':'Explain his certifications','projects':[],'subjects':['reference-efset-english-c1'],'options':['reference-efset-english-c1']}
  supports=a['ReplySupports']([],'social');refs=a['answer_references']('Glad that helps!',supports)
  ctx=a['complete_conversation_context']({'request':'thanks'},'Glad that helps!',supports,refs,prev)
  self.assertEqual(refs,[]);self.assertEqual(ctx['request'],prev['request']);self.assertEqual(ctx['subjects'],prev['subjects'])
 def test_project_overview_gets_a_reference_without_navigation_intent(self):
  refs=a['answer_references']('Horal is a marketplace.',['passage:recruiter-horal:abc'])
  self.assertEqual(refs[0]['url'],'https://jamiudesigns.vercel.app/work/horal/')
 def test_branding_answer_can_link_the_specific_verified_guide(self):
  refs=a['answer_references']('The Shortlet Lagos brand guide covers typography and colour.',['passage:brand:abc'])
  self.assertEqual(refs[0]['url'],'https://jamiudesigns.vercel.app/brand/files/shortlet-lagos-brand-guide.pdf')
 def test_certificate_answer_links_the_document_it_uses(self):
  refs=a['answer_references']('His EF SET result is C1 Advanced.',['passage:reference-efset-english-c1:abc'])
  self.assertEqual(len(refs),1);self.assertTrue(refs[0]['url'].endswith('/efset-english-c1.pdf'))
 def test_reference_urls_are_catalog_urls_never_generated_urls(self):
  refs=a['answer_references']('See EFSET at https://made-up.example/file.pdf',['passage:reference-efset-english-c1:abc'])
  self.assertTrue(all('made-up.example' not in r['url'] for r in refs))
  self.assertEqual(a['answer_references']('See this URL: https://made-up.example',[]),[])
 def test_document_subject_is_more_precise_than_its_collection(self):
  refs=a['answer_references']('His EF SET certificate reports C1.',['passage:credentials:abc'])
  ctx=a['complete_conversation_context']({'request':'Tell me about his English'},'C1',['passage:credentials:abc'],refs)
  self.assertEqual(ctx['subjects'][0],'reference-efset-english-c1');self.assertNotIn('credentials',ctx['subjects'])
 def test_every_reference_document_exists_and_has_specific_evidence(self):
  for r in json.loads((ROOT/'reference-catalog.json').read_text()):
   self.assertTrue((ROOT/r['url'].lstrip('/')).is_file());self.assertGreater(len(r['text']),60)
if __name__=='__main__':unittest.main()
