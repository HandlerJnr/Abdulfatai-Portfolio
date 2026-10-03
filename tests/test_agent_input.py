"""Run with python3 -m unittest discover -s tests (no model credentials needed)."""
import ast
import io
import json
from pathlib import Path
import unittest
from unittest.mock import Mock

ROOT = Path(__file__).resolve().parents[1]
# Load the actual handler and routing functions without heavyweight retrieval imports.
tree = ast.parse((ROOT / 'api/agent.py').read_text())
names = {'INPUT_CLARIFICATION', 'FRAGMENT_WORDS', 'MODEL', 'MAX_HISTORY', 'DOMAIN_PROOF_ROUTES'}
tree.body = [node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.ClassDef))
             or isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id in names for t in node.targets)]
import os
import re
import urllib.parse
from http.server import BaseHTTPRequestHandler
agent = dict(json=json, os=os, re=re, urllib=__import__('urllib'), BaseHTTPRequestHandler=BaseHTTPRequestHandler)
exec(compile(tree, str(ROOT / 'api/agent.py'), 'exec'), agent)
agent['RECORD_LIST'] = json.loads((ROOT / 'portfolio-knowledge.json').read_text())
agent['RECORD_LIST'].append(json.loads((ROOT / 'technical-capabilities.json').read_text()))
agent['RECORDS'] = {r['id']: r for r in agent['RECORD_LIST']}
agent['PATH_RECORDS'] = {'/work/horal': 'horal'}


class InputTests(unittest.TestCase):
    def test_requests(self):
        for case in json.loads((ROOT / 'tests/agent-input-cases.json').read_text()):
            with self.subTest(question=case['question']):
                retrieve = Mock(return_value=('published evidence', ['horal']))
                model = Mock(return_value=('A grounded answer.', 'test'))
                response = Mock()
                agent.update(retrieve=retrieve, call_model=model, json_response=response)
                request = agent['handler'].__new__(agent['handler'])
                body = json.dumps({'question': case['question'], 'history': [{'role': 'user', 'text': 'Horal'}],
                                   'page_context': {'page_id': 'horal', 'pathname': '/work/horal'}}).encode()
                request.headers = {'content-length': str(len(body))}
                request.rfile = io.BytesIO(body)
                request.do_POST()
                payload = response.call_args.args[2]
                self.assertEqual(response.call_args.args[1], 200)
                if case['clarify']:
                    retrieve.assert_not_called()
                    model.assert_not_called()
                    self.assertEqual(payload['intent'], 'clarification')
                    self.assertEqual(payload['source_ids'], [])
                    self.assertEqual(payload['answer'], agent['INPUT_CLARIFICATION'])
                else:
                    retrieve.assert_called_once()
                    model.assert_called_once()
                    self.assertEqual(payload['answer'], 'A grounded answer.')
                    self.assertEqual(payload['page_id'], 'horal')

    def test_existing_routes(self):
        page = {'page_id': 'horal'}
        self.assertEqual(agent['response_intent']('What am I looking at on this page?', [], page), 'page-context')
        self.assertIn('technical-skills', agent['domain_proof_ids']('React', []))
        self.assertIn('brand', agent['domain_proof_ids']('Branding', []))
        self.assertEqual(agent['response_intent']('Show me proof of his work', [], page), 'navigation')
        self.assertFalse(agent['should_show_sources']('page-context'))
        self.assertTrue(agent['should_show_sources']('domain-evidence'))
