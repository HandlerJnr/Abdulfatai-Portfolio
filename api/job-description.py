"""Extract a job description in memory. No upload or extracted text is persisted."""
import base64
import io
import json
import re
import urllib.parse
import zipfile
import xml.etree.ElementTree as ET
from http.server import BaseHTTPRequestHandler

MAX_FILE=2*1024*1024
MAX_TEXT=12000

def extract_description(filename, data):
    if not data or len(data)>MAX_FILE:
        raise ValueError('Choose a file smaller than 2 MB.')
    extension=str(filename).lower().rsplit('.',1)[-1]
    if extension=='docx':
        if not data.startswith(b'PK'):
            raise ValueError('This does not appear to be a Word document.')
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            entries=archive.infolist()
            if len(entries)>200 or sum(item.file_size for item in entries)>8*1024*1024:
                raise ValueError('This document is too large to process. Paste the description instead.')
            raw=archive.read('word/document.xml')
            if len(raw)>2*1024*1024 or b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():
                raise ValueError('This document could not be processed. Paste its text instead.')
            root=ET.fromstring(raw)
            ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            text='\n'.join(''.join(p.itertext()) for p in root.findall('.//w:p',ns))
    elif extension=='pdf':
        if not data.startswith(b'%PDF-'):
            raise ValueError('This does not appear to be a PDF.')
        from pypdf import PdfReader
        reader=PdfReader(io.BytesIO(data),strict=False)
        if reader.is_encrypted:
            raise ValueError('Use an unlocked PDF, or paste the description.')
        if len(reader.pages)>12:
            raise ValueError('Use a PDF with no more than 12 pages, or paste the relevant description.')
        parts=[]
        for page in reader.pages:
            content=page.get_contents()
            if content is not None and len(content.get_data())>3*1024*1024:
                raise ValueError('This PDF is too complex. Paste the description instead.')
            parts.append(page.extract_text() or '')
        text='\n'.join(parts)
    else:
        raise ValueError('Upload a PDF or a Word .docx file. Older .doc files need to be saved as .docx.')
    text=re.sub(r'\n{3,}','\n\n',text.replace('\x00','')).strip()
    if len(text)<80:
        raise ValueError('Not enough readable text was found. Paste the description, or use a text-based document.')
    if len(text)>MAX_TEXT:
        raise ValueError('The description exceeds 12,000 characters. Paste the relevant requirements instead.')
    return text

def respond(handler,status,data):
    raw=json.dumps(data,ensure_ascii=False).encode()
    handler.send_response(status)
    handler.send_header('Content-Type','application/json; charset=utf-8')
    handler.send_header('Cache-Control','no-store')
    handler.send_header('Content-Length',str(len(raw)))
    handler.end_headers();handler.wfile.write(raw)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        import pypdf
        return respond(self,200,{'ok':True,'formats':['pdf','docx'],'max_bytes':MAX_FILE,'pdf_parser':pypdf.__version__})
    def do_POST(self):
        origin=self.headers.get('origin','');host=self.headers.get('host','')
        if origin and urllib.parse.urlparse(origin).netloc!=host:
            return respond(self,403,{'error':'Origin not allowed.'})
        try:
            length=int(self.headers.get('content-length','0'))
            if not 0<length<=3*1024*1024:
                return respond(self,413,{'error':'Choose a file smaller than 2 MB.'})
            body=json.loads(self.rfile.read(length))
            if not isinstance(body,dict) or not isinstance(body.get('content_base64'),str):
                return respond(self,400,{'error':'Invalid document request.'})
            data=base64.b64decode(body['content_base64'],validate=True)
            description=extract_description(body.get('filename',''),data)
            return respond(self,200,{'text':description,'characters':len(description)})
        except ValueError as error:
            return respond(self,422,{'error':str(error)[:240]})
        except Exception:
            return respond(self,422,{'error':'This document could not be read. Paste the description instead.'})
