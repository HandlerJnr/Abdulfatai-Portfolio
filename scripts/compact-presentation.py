from pathlib import Path
from lxml import html,etree
import copy
P=Path(__file__).resolve().parents[1];D=P/'dist'
def cls(e,c):return e.xpath('descendant-or-self::*[contains(concat(" ",normalize-space(@class)," ")," '+c+' ")]')
def save(d,p):p.write_bytes(html.tostring(d,encoding='utf8',doctype='<!DOCTYPE html>'))
# Leave Design Systems HTML and styling untouched; all new rules use page scopes.
for f in D.rglob('*.html'):
 if f==D/'system/index.html':continue
 d=html.parse(str(f)).getroot();route='/'+str(f.parent.relative_to(D));d.find('body').set('data-page',route)
 for card in cls(d,'single-project'):
  if not cls(card,'project-view-action'):etree.SubElement(card,'span',{'class':'project-view-action'}).text='View project ↗'
 if route.startswith('/work/'):
  for a in d.xpath('//a[@href="/work" or @href="/work/"]'):a.set('class',(a.get('class','')+' portfolio-action all-projects-action').strip());a.text='← All projects'
  for head in cls(d,'case-section'):
   for h in head.xpath('./h4[span]'):
    for span in h.xpath('./span'):
     if (span.text or '').strip().isdigit():span.set('class','case-section-number')
  for e in d.xpath('//*[div[strong] and not(@class)]'):
   if len(e.xpath('./div[strong]'))>=2:e.set('class','case-stats')
  for e in cls(d,'case-facts'):e.set('class','case-facts case-meta')
  # Group existing figure collections, including nested research artefacts.
  for e in d.xpath('//*[figure]'):
   if len(e.xpath('./figure'))>=2:e.set('class',(e.get('class','')+' project-image-grid').strip())
  for a in d.xpath('//a[starts-with(@href,"/work/")]'):
   if not cls(a,'single-project'):a.set('class',(a.get('class','')+' portfolio-action related-project-action').strip())
  for a in cls(d,'case-image-link'):a.set('target','_blank')
 save(d,f)
# Two identity cards lead to dedicated, locally rendered detail pages.
f=D/'brand/index.html';d=html.parse(str(f)).getroot();auth=cls(d,'authentic-content')[0];logos=d.xpath('//*[@id="logos"]')[0]
children=list(logos);uxd=[];herlux=[];target=uxd
for e in children:
 if e.tag=='h4' and e.text_content()=='Logos & marks':continue
 if e.tag=='p' and (e.text or '').startswith('02 /'):target=herlux
 target.append(copy.deepcopy(e))
for slug,title,desc,parts,cover in [('uxd-cohort','UXD Cohort Identity','A shared identity for the University of Brighton UX Design cohort, 2026/27.',uxd,'/assets/current/37f9b7c2aa6b8d84.jpg'),('herlux','HERLUX','A confident wordmark, an expressive portrait and a complete family of brand applications.',herlux,'/assets/current/242d9201b82a8c92.jpg')]:
 detail=copy.deepcopy(d);detail.find('body').set('data-page','/brand/'+slug);detail.find('head').xpath('./title')[0].text=title+' | Jamiu Abdulfatai'
 hero=cls(detail,'hero-section')[0];h=cls(hero,'hero-title')[0]
 for e in list(h):h.remove(e)
 h.text=title;cls(hero,'hero-subtitle')[0].text=desc
 content=cls(detail,'authentic-content')[0]
 for e in list(content):content.remove(e)
 etree.SubElement(content,'a',href='/brand',attrib={'class':'portfolio-action'}).text='← All brand projects'
 for e in parts:content.append(e)
 for holder in content.xpath('//*[figure]'):
  if len(holder.xpath('./figure'))>1:holder.set('class','project-image-grid')
 path=D/'brand'/slug/'index.html';path.parent.mkdir(exist_ok=True);save(detail,path)
# Replace the unstructured long identity section with a two-card collection.
for e in list(logos):logos.remove(e)
logos.set('class','brand-card-grid')
for slug,title,desc,cover in [('uxd-cohort','UXD Cohort Identity','Logo system · Cohort identity · Brand applications','/assets/current/37f9b7c2aa6b8d84.jpg'),('herlux','HERLUX','Logo & wordmark · Visual identity · Brand applications','/assets/current/242d9201b82a8c92.jpg')]:
 a=etree.SubElement(logos,'a',href='/brand/'+slug,attrib={'class':'brand-project-card'});etree.SubElement(a,'img',src=cover,alt=title+' brand application',loading='lazy');body=etree.SubElement(a,'div',{'class':'brand-card-copy'});etree.SubElement(body,'p').text='Brand identity';etree.SubElement(body,'h4').text=title;etree.SubElement(body,'p').text=desc;etree.SubElement(body,'span',{'class':'project-view-action'}).text='View brand project ↗'
# Secondary document collections remain available behind an explicit disclosure.
resources=etree.Element('details',{'class':'brand-resources'});etree.SubElement(resources,'summary').text='Brand guidelines, pitch decks & supporting work +'
for e in list(auth):
 if e.tag=='nav' or e.get('id') in ['guidelines','collateral']:auth.remove(e);resources.append(e)
auth.append(resources)
for a in auth.xpath('.//a[@href="/brand#logos"]'):a.text='Choose a brand project below ↓'
save(d,f)
print('Compacted project, credential, AI and brand presentation.')
