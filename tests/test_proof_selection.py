import unittest
from test_agent_input import agent

class ProofSelectionTests(unittest.TestCase):
    def test_general_skills_do_not_trigger_cards(self):
        intent=agent['response_intent']('What are his design skills?',[],{})
        self.assertFalse(agent['should_show_sources'](intent))
        self.assertEqual(agent['select_proof_ids']('He designs banking products including Vista.',['vista-itss'],'skills',intent),[])

    def test_only_sources_discussed_are_shown(self):
        self.assertEqual(agent['select_proof_ids']('Vista shows his debit-card and loan-flow work.',['pay4me','vista-itss','loan-investment-app'],'Show me banking work','navigation'),['vista-itss'])

    def test_no_random_proof(self):
        self.assertEqual(agent['select_proof_ids']('He works across web and mobile.',['horal','bizinc','credentials'],'Prove it','evidence'),[])

    def test_two_proofs_maximum(self):
        self.assertEqual(len(agent['select_proof_ids']('Vista, Radius and Horal are examples.',['vista-itss','pay4me','horal'],'Compare','evidence')),2)

    def test_explicit_reference_request(self):
        intent=agent['response_intent']('Can I see a founder reference?',[],{})
        self.assertTrue(agent['should_show_sources'](intent))
        self.assertEqual(agent['select_proof_ids']('The founder reference is in Certifications & awards.',['credentials'],'reference',intent),['credentials'])
