import ast,json,unittest
from pathlib import Path
from test_streaming import a
ROOT=Path(__file__).resolve().parents[1]
class Tone(unittest.TestCase):
 def test_both_generation_paths_use_shared_system_voice(self):
  tree=ast.parse((ROOT/'api/agent.py').read_text())
  for name in ['call_model','stream_model']:
   function=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name==name)
   calls=[n for n in ast.walk(function) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='model_messages']
   self.assertEqual(len(calls),1,name)
  messages=a['model_messages']('visitor data')
  self.assertEqual([m['role'] for m in messages],['system','user'])
  self.assertIn('rather than delivering a biography',messages[0]['content'])
  self.assertIn('never pretend to be Jamiu',messages[0]['content'])
  self.assertEqual(messages[1]['content'],'visitor data')
 def test_follow_up_context_and_short_style_are_preserved(self):
  a['RECORD_LIST']=[]
  history=[{'role':'user','content':'Tell me about his OAU keynote'},{'role':'assistant','content':'He spoke at OAU.'}]
  prompt=a['build_prompt']('What did he speak about?',history,'Certificate: keynote on AI automation and youth innovation.','conversation',{})
  self.assertIn('Visitor: Tell me about his OAU keynote',prompt)
  self.assertIn('Agent: He spoke at OAU.',prompt)
  self.assertIn('Adapt the length',prompt)
  self.assertIn('CURRENT VISITOR MESSAGE\nWhat did he speak about?',prompt)
  self.assertIn('Never invent',prompt)
  self.assertIn('do not reintroduce or define Jamiu',prompt)
 def test_all_nonempty_turns_reach_the_model(self):
  for q in ['That is crazy yunno','Thatis crazy yunno','mad o','got it','?','🙂','é','asdf']:
   self.assertFalse(a['needs_clarification'](q),q)
  for q in ['', '  ', '\t\n']:
   self.assertTrue(a['needs_clarification'](q),repr(q))
if __name__=='__main__':unittest.main()

