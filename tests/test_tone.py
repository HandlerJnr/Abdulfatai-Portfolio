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
  self.assertIn('15-45 words',prompt)
  self.assertIn('CURRENT VISITOR MESSAGE\nWhat did he speak about?',prompt)
  self.assertIn('Never invent',prompt)
  self.assertIn('do not reintroduce or define Jamiu',prompt)
 def test_acknowledgements_pass_client_and_server_vocabulary(self):
  source=(ROOT/'api/agent.py').read_text();tree=ast.parse(source);js=(ROOT/'portfolio-agent.js').read_text()
  constants={}
  for node in tree.body:
   if isinstance(node,ast.Assign):
    for target in node.targets:
     if isinstance(target,ast.Name) and target.id in ['FRAGMENT_WORDS','INPUT_VOCABULARY']:
      constants[target.id]=eval(compile(ast.Expression(node.value),'<constant>','eval'),{'frozenset':frozenset,'set':set})
   if isinstance(node,ast.Expr) and isinstance(node.value,ast.Call) and isinstance(node.value.func,ast.Attribute) and isinstance(node.value.func.value,ast.Name) and node.value.func.value.id=='INPUT_VOCABULARY':
    try:constants['INPUT_VOCABULARY'].update(ast.literal_eval(node.value.args[0]))
    except (ValueError,TypeError):pass
  a.update(constants)
  for q in ['interesting','fair enough','gotcha','got it','really?','nice','hmm']:
   self.assertFalse(a['needs_clarification'](q),q)
if __name__=='__main__':unittest.main()
