"""Current-site integrity checks; no browser or provider credentials required."""
import hashlib,re,unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
class Cleanup(unittest.TestCase):
 def test_no_foreign_template_identity_or_export_runtime(self):
  patterns=[r'Alex Marlow',r'Helsinki',r'Field Notes',r'Webflow',r'website-files\.com',r'data-wf-',r'window\.LT\b',r'window\.Webflow',r'lately-template',r'w-dyn-',r'w-mod-',r'w-icon-']
  for path in ROOT.rglob('*'):
   if '.git' in path.parts or path.suffix not in {'.html','.css','.js','.json','.md'} or path.relative_to(ROOT).parts[0] in {'tests','vendor'}:continue
   for pattern in patterns:self.assertIsNone(re.search(pattern,path.read_text(),re.I),(str(path),pattern))
 def test_every_local_page_resource_exists(self):
  for path in ROOT.rglob('*.html'):
   if '.git' in path.parts:continue
   for tag,attrs in Page(path.read_text()).tags:
    values=[attrs.get('src','')]
    if tag=='link' and attrs.get('rel') in {'stylesheet','icon','apple-touch-icon'}:values.append(attrs.get('href',''))
    if tag=='meta' and attrs.get('property')=='og:image':values.append(attrs.get('content','').replace('https://jamiudesigns.vercel.app',''))
    for value in values:
     if value.startswith('/') and not value.startswith('//'):
      self.assertTrue((ROOT/value.split('?')[0].split('#')[0].lstrip('/')).is_file(),(str(path),value))
 def test_current_classic_pages_use_owned_runtime_and_styles(self):
  pages=[ROOT/'index.html',*(ROOT/'work').glob('*/index.html'),*[ROOT/d/'index.html' for d in ['works','brand','logos','credentials','system']]]
  for path in pages:
   text=path.read_text();self.assertIn('/portfolio-runtime.js',text);self.assertIn('/portfolio-base.css',text)
   self.assertNotIn('No images yet.',text)
 def test_template_project_aliases_are_not_published(self):
  import json
  aliases={r['source'] for r in json.loads((ROOT/'vercel.json').read_text())['redirects']}
  for slug in ['agentic','brewbot','journey-desk','div-supply-landing','smooov','puffer-asterisk','fullstack','texture-generator']:
   self.assertNotIn('/work/'+slug,aliases)
 def test_asterisk_logo_is_preserved(self):
  expected={
   'f95d10d8a47beaf3.png':'84c227a98559e4dd2d4a4f23425424864537cee819e21bef0a8d832e98153053',
   '89c9212e84021797.png':'870bcac29469b0960a930755b62dda50281afe364789f003bc06998fb7ae33a3',
   'e397328bfc0c4cdb.png':'030a7c5fdbfb270221def41e7700e6e915899dda6dbf2859a3ff5de029d3bbd0',
   '9e67fb62e89440c7.png':'8136557951d88f47659c9066dd01bdd21444b5c9c162228237dda454ebc51644',
   'db99cb95c28524de.png':'ad51f860e2da6f8182783483e69412620117294e134480965a2bd2444f40263c',
  }
  for name,digest in expected.items():self.assertEqual(hashlib.sha256((ROOT/'assets'/name).read_bytes()).hexdigest(),digest)
if __name__=='__main__':unittest.main()
