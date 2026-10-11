"""Page-by-page reference layout repair. dist is the authoritative static site."""
from pathlib import Path
from lxml import html, etree
import copy, json, re, hashlib, urllib.request, concurrent.futures
from urllib.parse import urlsplit, unquote
P=Path(__file__).resolve().parents[1];D=P/'dist';S=P/'source-data'
M=json.loads((S/'asset-map.json').read_text());C=json.loads((S/'current/assets.json').read_text())
C.update({k.replace('https://jamiudesigns.vercel.app',''):v for k,v in list(C.items()) if k.startswith('https://jamiudesigns.vercel.app')})
needed={}
def cls(e,c):return e.xpath('descendant-or-self::*[contains(concat(" ",normalize-space(@class)," ")," '+c+' ")]')
def text(e,t):
 for ch in list(e):e.remove(ch)
 e.text=t
 return e
def highlight(e,a,b):
 text(e,a);span=etree.SubElement(e,'span',{'class':'highlight-title'});span.text=b

def remove(e):
 if e.getparent() is not None:e.getparent().remove(e)
def ref(n):return html.parse(str(S/'reference-pages'/(n+'.html'))).getroot()
def local(u):
 if u in C:return C[u]
 if u.startswith('https://cdn.prod.website-files.com/'):
  dest=M.get(u,'/assets/'+hashlib.sha256(u.encode()).hexdigest()[:16]+Path(urlsplit(u).path).suffix);M[u]=dest
  if not (D/dest.lstrip('/')).exists():needed[u]=dest
  return dest
 return u

def clean(e):
 e=copy.deepcopy(e)
 for x in e.iter():
  for k in list(x.attrib):
   if k in ['data-w-id','srcset','sizes','style'] or k.startswith('data-commerce'):del x.attrib[k]
  if x.tag=='img':x.set('src',local(x.get('src','')))
  if x.get('class'):x.set('class',x.get('class').replace(' w--current',''))
 return e
projects=[]
for e in cls(html.parse(str(S/'current/work.html')),'x-project'):
 a=e.xpath('.//a[starts-with(@href,"/work/")]')[0]
 projects.append(dict(route=a.get('href').rstrip('/'),title=e.xpath('.//h2')[0].text_content(),desc=cls(e,'x-description')[0].text_content(),cover=local(e.xpath('.//img')[0].get('src'))))

def fill_project(card,p,featured=False):
 a=cls(card,'single-project')[0];a.set('href',p['route']);a.attrib.pop('aria-current',None)
 content=cls(a,'single-project-content')[0];text(content.xpath('./h4')[0],p['title']);text(content.xpath('./p')[0],p['desc'])
 im=cls(a,'project-thumbnail')[0];im.set('src',p['cover']);im.set('alt',p['title']+' — product design');im.set('width','1240');im.set('height','860')
 if featured:text(cls(a,'project-left-content')[0].xpath('./h3')[0],'Featured project')
 return card

# WORK: original one featured row + original two-column collection. Not two copies of rows.
workref=ref('project');work=html.parse(str(D/'work/index.html')).getroot();body=work.find('body')
feature=clean(cls(workref,'project-section')[0]);fill_project(cls(feature,'w-dyn-item')[0],projects[0],True)
grid=clean(cls(workref,'project-section')[1]);text(cls(grid,'section-label')[0],'My work');text(cls(grid,'section-title')[0],'All projects');text(cls(grid,'section-subtitle')[0],'A selection of fintech, SaaS, marketplace, healthcare and AI products I’ve designed.')
parent=cls(grid,'project-list')[0];proto=copy.deepcopy(parent[0])
for e in list(parent):remove(e)
for p in projects:parent.append(fill_project(copy.deepcopy(proto),p))
old=cls(work,'project-section');at=body.index(old[0])
for e in old:remove(e)
body.insert(at,feature);body.insert(at+1,grid)
workfile=D/'work/index.html';workfile.write_bytes(html.tostring(work,encoding='utf8',doctype='<!DOCTYPE html>'))

# ABOUT: use original sections and target content slots, never all paragraphs or all images.
a=html.parse(str(D/'about/index.html')).getroot();ar=ref('about');abody=a.find('body');hero=cls(a,'hero-section')[0];hero_ref=clean(cls(ar,'hero-section')[0]);
text(cls(hero_ref,'section-label')[0],'About me');text(cls(hero_ref,'hero-title')[0],'Discover Jamiu');text(cls(hero_ref,'hero-subtitle')[0],'I’m Jamiu Abdulfatai, a product designer based in Brighton, UK. I make complex products clearer and easier to use.');hero_ref.set('id','main-content');abody.replace(hero,hero_ref)
mission=clean(cls(ar,'mission-section')[0]);highlight(cls(mission,'about-top-title')[0],'I believe useful design makes ', 'complicated things feel simple')
left=cls(mission,'mission-left-top-content')[0];text(left.xpath('./h4')[0],'My approach')
copytext=['I design fintech, SaaS, marketplace and AI products, from understanding the problem to the screens and components developers build.','I map user journeys, write requirements and create reusable systems with founders, product teams and developers.','I owned mobile and web design at Horal, shaped payment journeys at Radius, grew into design leadership at Bizinc and worked on banking across four markets at Vista.']
for e,t in zip(left.xpath('./p'),copytext):text(e,t)
cta=cls(mission,'button-style-02')[0];cta.set('href','/contact');text(cls(cta,'button-text-style-02')[0],'Let’s talk')
im=cls(mission,'mission-image')[0];im.set('src','/assets/jamiu-collaborating.png');im.set('alt','Jamiu working with collaborators');im.set('width','1082');im.set('height','1322')
badge=cls(mission,'mission-image-card')[0];badge.set('href','/work');badge.attrib.pop('aria-current',None);text(cls(badge,'counter-card-number')[0],'13');text(cls(badge,'counter-card-label')[0],'Selected projects across web and mobile')
about=clean(cls(ar,'about-section')[0]);text(cls(about,'section-label')[0],'Behind the work');text(cls(about,'section-title')[0],'Why work with me');text(cls(about,'section-subtitle')[0],'I bring product ownership, clear communication and attention to the details that make a design work in practice.')
for e,u,alt in zip(cls(about,'about-image'),['/assets/jamiu-speaking.png','/assets/jamiu-collaborating.png'],['Jamiu speaking at an event','Jamiu collaborating on a design project']):e.set('src',u);e.set('alt',alt);e.set('width','1240');e.set('height','1322')
highlight(cls(about,'about-bottom-title')[0],'Research, clarity and craft — ', 'from the first question to delivery')
for card,number,label,desc in zip(cls(about,'single-counter'),['13','4','96+'],['Selected projects','Banking markets','AI evaluations'],['Web and mobile work across fintech, SaaS, marketplaces, healthcare and AI.','Digital banking design for four West African subsidiaries at Vista.','Comparative model and visual-quality evaluation; separate from usability research.']):
 text(cls(card,'counter-number')[0],number);text(cls(card,'counter-title')[0],label);text(cls(card,'counter-subtitle')[0],desc)
values=clean(cls(ar,'values-section')[0]);text(cls(values,'section-label')[0],'Design values');text(cls(values,'section-title')[0],'How I approach design');text(cls(values,'section-subtitle')[0],'The principles I bring to research, collaboration and the finished product.')
for card,(title,desc) in zip(cls(values,'single-value'),[('Clarity','Make the next step easy to understand.'),('Curiosity','Ask useful questions and test assumptions.'),('Integrity','Be clear about contributions and evidence.'),('Collaboration','Build shared understanding with the team.')]):text(card.xpath('.//h4')[0],title);text(cls(card,'values-subtitle')[0],desc)
experience=clean(cls(ar,'team-section')[0]);text(cls(experience,'section-label')[0],'Experience');text(cls(experience,'section-title')[0],'Where I’ve contributed');text(cls(experience,'section-subtitle')[0],'Product design and collaboration across live platforms, financial services and AI.')
for card,p,role in zip(cls(experience,'single-team-member'),[projects[2],projects[4],projects[3]],['UI/UX Manager','UI/UX Designer & Frontend Developer','Product design & AI evaluation']):
 text(cls(card,'member-name')[0],p['title']);text(cls(card,'member-designation')[0],role);im=cls(card,'member-image')[0];im.set('src',p['cover']);im.set('alt',p['title']+' — selected product work');link=etree.Element('a',href=p['route'],attrib={'class':'experience-project-link','aria-label':'Read '+p['title']+' case study'});wrapper=cls(card,'member-image-wrapper')[0];card.replace(wrapper,link);link.append(wrapper)
# Keep the authentic design-to-build content, remove the repeated copied biography.
extra=next((e for e in abody.xpath('./section') if e.get('class')=='padding-bottom'),None)
if extra is not None:
 auth=cls(extra,'authentic-content')[0]
 for child in list(auth):
  if child.tag=='a' or 'About Jamiu.' in child.text_content()[:100]:remove(child)
 for e in auth.xpath('.//h4'):
  if e.text_content().strip()=='About Jamiu.':
   top=e.getparent()
   if top in list(auth):remove(top)
for name,new in [('mission-section',mission),('about-section',about),('values-section',values),('team-section',experience)]:old=cls(a,name)[0];old.getparent().replace(old,new)
(D/'about/index.html').write_bytes(html.tostring(a,encoding='utf8',doctype='<!DOCTYPE html>'))

route_ref={'/':'index','/work':'project','/about':'about','/services':'service','/process':'how-we-work','/contact':'contact-us','/credentials':'testimonial','/system':'testimonial','/brand':'testimonial','/ai':'testimonial','/privacy-policy':'privacy-policy','/terms-and-conditions':'terms-and-conditions','/404':'404'}
service_ref=['search-engine-optimization','content-marketing','social-media-marketing','email-marketing','influencer-marketing','analytics-and-reporting']
service_routes=['product-design','ux-research','ui-visual-design','interaction-design','design-systems','prototyping-testing']
route_ref.update({'/services/'+slug:'service__'+r for slug,r in zip(service_routes,service_ref)})
for p in projects:route_ref[p['route']]='project__vision-scale-drive'
# Normalize common reference components across all pages.
faq_proto=clean(cls(ref('index'),'single-faq')[0])
for f in D.rglob('*.html'):
 d=html.parse(str(f)).getroot();route='/'+str(f.parent.relative_to(D));route='/' if route=='/.' else route;r=ref(route_ref[route])
 # Restore only decorative assets to their exact reference class. Personal content photos remain personal.
 decorated={}
 for im in r.xpath('//img[@class]'):
  cl=im.get('class')
  if re.search(r'shape|icon|arrow|sticker',cl):decorated.setdefault(cl,im)
 for im in d.xpath('//img[@class]'):
  cl=im.get('class')
  if cl in decorated:im.set('src',local(decorated[cl].get('src')));im.set('alt','')
 # Restore the original section spacing classes on shared sections.
 for sec in d.xpath('//body/section'):
  base=(sec.get('class','').split() or [''])[0]
  refs=cls(r,base)
  if len(refs)==1 and base not in ['project-section','testimonial-section'] and not cls(sec,'authentic-content'):sec.set('class',refs[0].get('class'))
 # Native FAQs, retaining the reference icon, text and answer geometry.
 for holder in cls(d,'faq-s'):
  entries=[]
  for old in list(holder):
   question=old.xpath('.//summary')[0].text_content().strip() if old.tag=='details' else ''
   paragraphs=old.xpath('.//p');answer=' '.join(p.text_content() for p in paragraphs)
   if question:entries.append((question,answer))
  if entries:
   for e in list(holder):remove(e)
   for question,answer in entries:
    item=etree.Element('details',{'class':'single-faq'});summary=etree.SubElement(item,'summary',{'class':'question'});icon=etree.SubElement(summary,'span',{'class':'faq-icon-box','aria-hidden':'true'});icon.text='+'
    etree.SubElement(summary,'h4',{'class':'question-title'}).text=question
    panel=etree.SubElement(item,'div',{'class':'answer'});inner=etree.SubElement(panel,'div',{'class':'answer-inner'});etree.SubElement(inner,'p',{'class':'answer-content'}).text=answer;holder.append(item)
 # Original references contain real white-on-navy headings; strip lingering invalid inline transforms.
 for e in d.xpath('//*[@style]'):
  if not e.get('data-process-disclosure') is not None:e.attrib.pop('style',None)
 for e in d.xpath('//*[@srcset]'):e.attrib.pop('srcset',None)
 for im in cls(d,'project-thumbnail'):
  im.set('width','1240');im.set('height','860')
 for im in cls(d,'project-details-thumbnail'):im.set('width','1240');im.set('height','860')
 for im in cls(d,'choose-us-image'):im.set('width','1082');im.set('height','1424')
 for im in cls(d,'testimonial-author-image'):im.set('width','800');im.set('height','948')
 # Duplicated contact links add unintended height; keep one email and one social link.
 if route=='/contact':
  for card in cls(d,'single-quick-contact')+cls(d,'contact-card'):
   seen=set()
   for link in card.xpath('.//a'):
    key=(link.get('href'),link.text_content())
    if key in seen:remove(link)
    seen.add(key)
 # All old-portfolio navigation resolves inside this standalone project.
 for e in d.xpath('//*[@href]'):
  u=e.get('href','');url=urlsplit(u)
  if url.hostname in ['jamiudesigns.vercel.app','abdulfataijamiu.surge.sh']:
   path=url.path.rstrip('/') or '/';path={'/logos':'/brand','/academic-proofreader':'/ai'}.get(path,path);fragment=url.fragment
   if url.path.rstrip('/')=='/logos':fragment='logos'
   if url.path.rstrip('/')=='/academic-proofreader':fragment='academic-proofreader'
   e.set('href',path+('#'+fragment if fragment else ''));e.attrib.pop('target',None);e.attrib.pop('rel',None)
 for e in d.xpath('//img'):
  u=e.get('src','')
  if u in C:e.set('src',C[u])
 # Extra subject pages must present their own content, rather than identical credential summaries.
 if route in ['/system','/brand','/ai']:
  for e in cls(d,'review-section'):remove(e)
  for e in cls(d,'testimonial-section'):e.set('class','portfolio-content-section section-padding')
 elif route=='/credentials':
  for e in cls(d,'testimonial-section'):e.set('class','portfolio-content-section padding-bottom')
  for e in cls(d,'review-author-designation'):text(e,'Supporting document below')
 if route=='/ai':
  for e in d.xpath('//article'):
   if 'Academic' in e.text_content() and 'proof' in e.text_content().lower():e.set('id','academic-proofreader')
  for e in d.xpath('//p'):
   if 'The live portfolio agent is one example' in e.text_content():text(e,'I use AI to make ideas testable and workflows more useful. My agent work connects questions to product knowledge and supporting evidence; the case studies describe the approach.')
   if 'ask the portfolio agent' in e.text_content():text(e,'Open a case study to read the evidence behind a specific claim.')
  for e in d.xpath('//a[@href="/ai#academic-proofreader"]'):text(e,'Read the concept details')
 if route=='/brand':
  auth=cls(d,'authentic-content')[0]
  logos=etree.Element('section',id='logos');etree.SubElement(logos,'h4').text='Logos & marks'
  src=html.parse(str(S/'current/home.html'))
  for template in src.xpath('//template[@id="identity-uxd" or @id="identity-herlux"]'):
   for child in template:logos.append(copy.deepcopy(child))
  for im in logos.xpath('.//img'):
   im.set('src',local(im.get('src','')));im.attrib.pop('srcset',None);im.attrib.pop('style',None)
  auth.insert(2,logos)
  for link in auth.xpath('.//a[@href="/brand#logos"]'):text(link,'View logo projects ↓')
 # Page shell is the only hero; remove duplicated introductions imported from the previous portfolio.
 if route in ['/system','/brand','/ai','/credentials']:
  auth=cls(d,'authentic-content')[0]
  first=next(iter(auth),None)
  if first is not None and ('Back to portfolio' in first.text_content()[:100] or ('Back to portfolio' in first.text_content() and first.tag=='section')):remove(first)
  for e in auth.xpath('.//a'):
   if e.text_content().strip()=='Back to portfolio':text(e,'Back to home')
 # Clean resource href aliases in documents and source-only controls.
 for e in d.xpath('//a[@aria-current]'):e.attrib.pop('aria-current',None)
 for e in d.xpath('//header//a|//*[contains(@class,"header")]//a'):
  if e.get('href','').rstrip('/')==route.rstrip('/'):e.set('aria-current','page')
 # Single canonical component stylesheet; original CSS owns all reference spacing.
 head=d.find('head')
 for e in head.xpath('./link[@rel="stylesheet"]'):
  if e.get('href') in ['/assets/portfolio.css','/assets/personal.css','/assets/reference-repair.css']:remove(e)
 head.append(etree.Element('link',rel='stylesheet',href='/assets/portfolio.css'))
 f.write_bytes(html.tostring(d,encoding='utf8',doctype='<!DOCTYPE html>'))

# Download only exact source assets missing locally. User photos are unchanged.
def download(item):
 u,localpath=item;dest=D/localpath.lstrip('/');dest.parent.mkdir(parents=True,exist_ok=True)
 dest.write_bytes(urllib.request.urlopen(u,timeout=40).read());return localpath
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 for name in ex.map(download,needed.items()):print('Restored',name)
(S/'asset-map.json').write_text(json.dumps(M,indent=2))
print('Repaired every active route using its reference page structure.')
