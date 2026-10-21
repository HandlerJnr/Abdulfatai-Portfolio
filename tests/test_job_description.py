import importlib.util
import io
import json
from pathlib import Path
import unittest
import zipfile
from unittest.mock import Mock
from test_agent_input import agent

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('job_description',ROOT/'api/job-description.py')
parser=importlib.util.module_from_spec(spec);spec.loader.exec_module(parser)

def document(text):
    stream=io.BytesIO()
    with zipfile.ZipFile(stream,'w') as archive:
        archive.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>'+text+'</w:t></w:r></w:p></w:body></w:document>')
    return stream.getvalue()

class DocumentTests(unittest.TestCase):
    def test_word_extraction(self):
        text='Senior Product Designer. Design retail banking and loan journeys, collaborate with engineers and use Figma.'
        self.assertEqual(parser.extract_description('Role.docx',document(text)),text)
    def test_file_constraints(self):
        for name,data in [('old.doc',b'not a word file'),('role.pdf',b'not a PDF'),('role.docx',b'x'*(parser.MAX_FILE+1)),('role.docx',document('tiny'))]:
            with self.subTest(name=name,size=len(data)):
                with self.assertRaises(ValueError):parser.extract_description(name,data)
    def test_unsafe_word_xml(self):
        stream=io.BytesIO()
        with zipfile.ZipFile(stream,'w') as archive:archive.writestr('word/document.xml','<!DOCTYPE x [<!ENTITY test "test">]><x/>')
        with self.assertRaises(ValueError):parser.extract_description('role.docx',stream.getvalue())
    def test_comparison_request_uses_reviewed_description(self):
        description='Design a retail banking application, including debit cards and loan journeys. Credit-card experience preferred.'
        model=Mock(return_value=('Vista supports debit-card and loan-flow experience. Credit-card work is not evidenced.','test'))
        retrieve=Mock(return_value=('Vista published ownership',['vista-itss']))
        response=Mock();agent.update(call_model=model,retrieve=retrieve,json_response=response)
        request=agent['handler'].__new__(agent['handler'])
        body=json.dumps({'question':'Compare this role','job_description':description}).encode()
        request.headers={'content-length':str(len(body))};request.rfile=io.BytesIO(body);request.do_POST()
        self.assertEqual(response.call_args.args[1],200)
        self.assertEqual(response.call_args.args[2]['intent'],'job-fit')
        self.assertIn(description,retrieve.call_args.args[0]);self.assertIn(description,model.call_args.args[0])
        self.assertIn('A debit card is not a credit card',model.call_args.args[0])
        self.assertEqual(response.call_args.args[2]['source_ids'],['vista-itss'])
    def test_bad_description_never_calls_model(self):
        model=Mock();response=Mock();agent.update(call_model=model,json_response=response)
        for description in ('short','x'*12001,{'role':'invalid'}):
            request=agent['handler'].__new__(agent['handler']);body=json.dumps({'question':'Compare role','job_description':description}).encode()
            request.headers={'content-length':str(len(body))};request.rfile=io.BytesIO(body);request.do_POST()
            self.assertEqual(response.call_args.args[1],400)
        model.assert_not_called()
