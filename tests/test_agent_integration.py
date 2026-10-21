import io
import json
import unittest
from pathlib import Path
from unittest.mock import Mock
from test_agent_input import agent

ROOT=Path(__file__).resolve().parents[1]

class IntegrationTests(unittest.TestCase):
    def test_current_project_routing(self):
        self.assertEqual(agent['response_intent']('Tell me about this project', [], {'page_id':'vista-itss'}), 'page-context')
        self.assertEqual(agent['normalise_page_context']({'page_id':'vista-itss','pathname':'/work/vista-digital-banking/'})['record_title'], 'Vista Digital Banking')

    def test_current_knowledge(self):
        records=json.loads((ROOT/'portfolio-knowledge.json').read_text())
        by_id={r['id']:r for r in records}
        self.assertIn('I designed Vista’s debit card and the screens for its loan application flow.',by_id['vista-itss']['text'])
        self.assertEqual(by_id['vista-itss']['url'],'/work/vista-digital-banking/')
        self.assertEqual(by_id['pay4me']['url'],'/work/radius-pay4me/')
        for record in records:
            self.assertNotIn('/post/',record['url'])
            self.assertNotIn('Helsinki',record['text'])
            self.assertNotIn('${panel',record['text'])

    def test_bad_requests_do_not_call_model(self):
        for body in (b'[]', b'broken-json', b'x'*32769):
            with self.subTest(length=len(body)):
                response=Mock();model=Mock()
                agent.update(json_response=response,call_model=model)
                request=agent['handler'].__new__(agent['handler'])
                request.headers={'content-length':str(len(body))}
                request.rfile=io.BytesIO(body)
                request.do_POST()
                self.assertIn(response.call_args.args[1],(400,413))
                model.assert_not_called()

    def test_origin_is_enforced(self):
        response=Mock();model=Mock();agent.update(json_response=response,call_model=model)
        request=agent['handler'].__new__(agent['handler'])
        request.headers={'host':'preview.vercel.app','origin':'https://unrelated.example'}
        request.do_POST()
        self.assertEqual(response.call_args.args[1],403)
        model.assert_not_called()
