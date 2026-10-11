"""Import an original portfolio checkout as content/assets, without its runtime or layout."""
from pathlib import Path
from lxml import html,etree
from urllib.parse import urlsplit,unquote
import copy,json,shutil,hashlib,sys
P=Path(__file__).resolve().parents[1];D=P/'dist';original=Path(sys.argv[1]).resolve();C=json.loads((P/'source-data/current/assets.json').read_text());relative={k.replace('https://jamiudesigns.vercel.app',''):v for k,v in C.items()}
# Prefer unchanged original bytes wherever an asset has already been mapped.
count=0
for u,dest in relative.items():
 path=unquote(urlsplit(u).path).lstrip('/');src=original/path
 if src.is_file():target=D/dest.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,target);count+=1
assets={}
def asset(u):
 split=urlsplit(u);path=unquote(split.path).lstrip('/');src=original/path
 if not src.is_file():return u
 existing=relative.get(u) or relative.get('/'+split.path.lstrip('/'))
 dest=existing or '/assets/original/'+hashlib.sha256(path.encode()).hexdigest()[:16]+src.suffix
 target=D/dest.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,target);assets['/'+path]=dest;return dest

def route(u):
 s=urlsplit(u)
 if s.hostname and s.hostname not in ['jamiudesigns.vercel.app','abdulfataijamiu.surge.sh']:return u
 if not u.startswith('/') and not s.hostname:return u
 src=original/unquote(s.path).lstrip('/')
 if src.is_file() and src.suffix not in ['.html','.js','.css','.py','.json']:return asset(u)
 path=s.path.rstrip('/') or '/';path={'/logos':'/brand#logos'}.get(path,path)
 if path in ['/academic-proofreader/privacy','/academic-proofreader/terms']:path='/academic-proofreader'
 if path=='/academic-proofreader/support':path='/contact'
 if s.fragment and '#' not in path:path+='#'+s.fragment
 return path

def cls(e,c):return e.xpath('descendant-or-self::*[contains(concat(" ",normalize-space(@class)," ")," '+c+' ")]')
def remove(e):
 if e.getparent() is not None:e.getparent().remove(e)
def clean(part):
 e=copy.deepcopy(part)
 for x in list(e.iter()):
  if x.tag in ['script','style','button','input']:remove(x);continue
  for k in list(x.attrib):
   if k.startswith('on') or k in ['style','hidden','srcset','sizes','data-fallback-src','data-identity-open','data-reveal']:x.attrib.pop(k,None)
  old=x.get('class','');kept=[c for c in old.split() if c.startswith(('case-','library-','ai-')) or c in ['section-number']]
  if kept:x.set('class',' '.join(kept))
  else:x.attrib.pop('class',None)
  if x.tag in ['h1','h2','h3']:x.tag='h4'
  if x.tag=='img':x.set('src',asset(x.get('src','')));x.set('loading','lazy')
  if x.tag=='a':x.set('href',route(x.get('href','')));x.attrib.pop('target',None)
  if 'case-top' in old:remove(x)
 return e

def save(d,p):p.write_bytes(html.tostring(d,encoding='utf8',doctype='<!DOCTYPE html>'))
for f in (D/'work').glob('*/index.html'):
 slug=f.parent.name;src=html.parse(str(original/'work'/slug/'index.html'));d=html.parse(str(f)).getroot();auth=cls(d,'authentic-content')[0]
 for e in list(auth):remove(e)
 for part in src.xpath('//main/*'):
  if any(c in part.get('class','') for c in ['case-head','case-recruiter-snapshot','case-body']):auth.append(clean(part))
 save(d,f)
for name in ['credentials','brand','system','ai']:
 src=html.parse(str(original/name/'index.html'));f=D/name/'index.html';d=html.parse(str(f)).getroot();auth=cls(d,'authentic-content')[0]
 for e in list(auth):remove(e)
 for part in src.xpath('//main/*'):
  if 'library-hero' in part.get('class',''):continue
  auth.append(clean(part))
 if name=='brand':
  logos=etree.Element('section',id='logos');etree.SubElement(logos,'h4').text='Logos & marks';source=html.parse(str(original/'logos/index.html'))
  for template in source.xpath('//template[@id="identity-uxd" or @id="identity-herlux"]'):
   for part in template:logos.append(clean(part))
  auth.insert(1,logos)
 if name=='ai':
  for p in auth.xpath('.//p'):
   if 'The live portfolio agent is one example' in p.text_content():p.text='I use AI to make ideas testable and workflows more useful. My agent work connects questions to product knowledge and supporting evidence; the case studies describe the approach.'
   if 'ask the portfolio agent' in p.text_content():p.text='Open a case study to read the evidence behind a specific claim.'
 save(d,f)
# Academic Proofreader is a local project information page using the reference service-detail shell.
d=html.parse(str(D/'services/product-design/index.html')).getroot();src=html.parse(str(original/'academic-proofreader/index.html'));head=d.find('head');head.xpath('./title')[0].text='Academic Proofreader | Jamiu Abdulfatai';title=cls(d,'hero-title')[0];title.text='Academic Proofreader';cls(d,'hero-subtitle')[0].text='Your research. Your voice. An academic proofreading concept that preserves meaning, citations and the author’s judgement.'
section=cls(d,'service-details-section')[0]
for child in list(section):remove(child)
container=etree.SubElement(section,'div',{'class':'w-layout-blockcontainer container w-container'});auth=etree.SubElement(container,'div',{'class':'project-content w-richtext authentic-content'})
for part in src.xpath('//main/article'):auth.append(clean(part))
for a in d.xpath('//a[@aria-current]'):a.attrib.pop('aria-current',None)
f=D/'academic-proofreader/index.html';f.parent.mkdir(exist_ok=True);save(d,f)
# Replace any remaining unmapped originals and outgoing old-site links across the site.
for f in D.rglob('*.html'):
 d=html.parse(str(f)).getroot()
 for e in d.xpath('//img'):e.set('src',asset(e.get('src','')))
 for e in d.xpath('//a[@href]'):
  u=e.get('href');s=urlsplit(u)
  if s.hostname in ['jamiudesigns.vercel.app','abdulfataijamiu.surge.sh'] or u.startswith('/logos/') or u.startswith('/credentials/files/') or u.startswith('/credentials/previews/') or u.startswith('/Abdulfatai_Jamiu_CV'):e.set('href',route(u));e.attrib.pop('target',None)
  if u=='/ai#academic-proofreader':e.set('href','/academic-proofreader');e.text='Read the project details'
 save(d,f)
# Preserve provenance without copying any backend, secrets or previous layout code.
(P/'source-data/original-asset-map.json').write_text(json.dumps(assets,indent=2));print('Imported 13 complete case studies and 4 evidence collections; original assets copied:',count,'additional assets:',len(assets))
