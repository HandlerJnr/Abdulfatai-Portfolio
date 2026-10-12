from pathlib import Path
from lxml import html,etree
from copy import deepcopy
import re
root=Path(__file__).resolve().parents[1]/'dist'
base=html.fromstring((root/'simple/index.html').read_text())
header=etree.tostring(base.find('body/header'),encoding='unicode',method='html')
footer=etree.tostring(base.find('body/footer'),encoding='unicode',method='html')
def classes(el):return set(el.get('class','').split())
mapClasses={'portfolio-project-card':'simple-project','project-thumbnail-wrapper':'simple-project-image','single-project-content':'simple-project-copy','project-list':'simple-project-grid','library-grid':'simple-library-grid','brand-card-grid':'simple-library-grid','teams':'simple-library-grid','library-card':'simple-library-card','portfolio-panel':'simple-library-card','form-status':'form-status'}
for source in list(root.rglob('index.html')):
 route='/'+str(source.parent.relative_to(root))
 if route.startswith('/simple') or route=='/.' or route.startswith('/work/'):continue
 doc=html.fromstring(source.read_text());titleNodes=doc.xpath('//h1|//h2[contains(@class,"hero-title")]');title=titleNodes[0].text_content().strip() if titleNodes else doc.find('.//title').text
 body=doc.find('body');content=html.Element('div',attrib={'class':'simple-case-content'})
 for section in body:
  if section.tag!='section':continue
  cls=classes(section)
  if cls & {'hero-section','footer-section','cta-section'}:continue
  content.append(deepcopy(section))
 for button in list(content.xpath('//*[@data-ai-preview]')):
  template=doc.xpath('//*[@id="'+button.get('data-ai-preview')+'"]')
  details=html.Element('details');summary=html.Element('summary');summary.text=button.get('data-ai-title') or 'View details';details.append(summary)
  if template:
   for child in template[0]:details.append(deepcopy(child))
  button.getparent().replace(button,details)
 for el in list(content.iter()):
  if not isinstance(el.tag,str):continue
  old=classes(el)
  if el.tag in ['script','style'] or (el.tag=='img' and not el.get('alt') and '/assets/current/' not in el.get('src','')):
   if el.getparent() is not None:el.getparent().remove(el)
   continue
  keep={'id','href','src','alt','width','height','loading','download','target','rel','open','name','type','value','required','placeholder','for','rows','cols','method','action','data-contact-form'}
  if el.tag in ['svg','path','circle','rect','line','polyline','polygon','text','g']:keep.update({'viewBox','fill','stroke','d','cx','cy','r','x','y','width','height','points','stroke-width','transform'})
  for key in list(el.attrib):
   if key not in keep:del el.attrib[key]
  mapped=[new for oldclass,new in mapClasses.items() if oldclass in old]
  if mapped:el.set('class',' '.join(mapped))
  if el.tag=='img':el.set('loading','lazy');el.attrib.pop('height',None)
 content.set('class','simple-case-content')
 p=root/'simple'/route.strip('/');p.mkdir(parents=True,exist_ok=True)
 markup='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' — Jamiu Abdulfatai</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/simple-view.css"><link rel="stylesheet" href="/assets/portfolio-mode.css"><link rel="stylesheet" href="/assets/portfolio-view-transition.css"><script src="/assets/portfolio-view.js" defer></script><script src="/assets/simple-content.js" defer></script></head><body class="simple-view simple-case"><a class="simple-skip" href="#main">Skip to content</a>'+header+'<main id="main" class="simple-container"><div class="simple-case-toolbar"><a href="/simple">← Portfolio</a><a href="'+route+'" data-portfolio-view="visual">View visual page ↗</a></div><header class="simple-case-heading"><h1>'+title+'</h1></header>'+etree.tostring(content,encoding='unicode',method='html')+'</main>'+footer+'</body></html>'
 (p/'index.html').write_text(markup)
# Every flat internal page link stays flat. Only explicit mode switches may cross modes.
for p in (root/'simple').rglob('index.html'):
 doc=html.fromstring(p.read_text())
 for a in doc.xpath('//a[@href]'):
  href=a.get('href')
  if a.get('data-portfolio-view')=='visual':continue
  if href=='/':a.set('href','/simple');continue
  if href.startswith('/') and not href.startswith(('/simple','/assets','/api')):
   a.set('href','/simple'+href)
  if href=='/simple#main' and a.text_content().strip().startswith('03'):a.set('href','/simple/about')
 for a in doc.xpath('//nav[@id="simple-navigation"]/div/a'):
  if 'About me' in a.text_content():a.set('href','/simple/about')
 p.write_text('<!doctype html>\n'+etree.tostring(doc,encoding='unicode',method='html'))
p=root/'assets/portfolio-view.js';s=p.read_text().replace("path.startsWith('/simple/work/')?path.replace('/simple',''):'/'","path!=='/simple'?path.replace('/simple',''):'/'").replace("path.startsWith('/work/')?'/simple'+path:'/simple'","path!=='/'?'/simple'+path:'/simple'");p.write_text(s)
print('Flat routes:',len(list((root/'simple').rglob('index.html'))))
