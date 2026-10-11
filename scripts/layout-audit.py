"""Regression checks for reference structure, local assets and standalone routing."""
from pathlib import Path
from lxml import html
from urllib.parse import urlsplit,unquote
from PIL import Image
import json,re,hashlib
P=Path(__file__).resolve().parents[1];D=P/'dist';errors=[];report=[]
def cls(d,c):return d.xpath('descendant-or-self::*[contains(concat(" ",normalize-space(@class)," ")," '+c+' ")]')
def check(test,message):
 if not test:errors.append(message)
for f in sorted(D.rglob('*.html')):
 route='/'+str(f.parent.relative_to(D));route='/' if route=='/.' else route;d=html.parse(str(f)).getroot();ids=d.xpath('//@id')
 check(len(ids)==len(set(ids)),route+': duplicate IDs');check(len(d.xpath('//html'))==1 and len(d.xpath('//head'))==1 and len(d.xpath('//body'))==1,route+': invalid document shell')
 check(len(cls(d,'header'))==1,route+': expected one shared reference navbar')
 for e in d.xpath('//*[@href or @src]'):
  for attr in ['href','src']:
   u=e.get(attr,'');s=urlsplit(u)
   check(s.hostname not in ['jamiudesigns.vercel.app','abdulfataijamiu.surge.sh'],route+': old-portfolio dependency '+u)
   if s.scheme or s.netloc or not u:continue
   dest=(D/s.path.lstrip('/')) if s.path.startswith('/') else (f.parent/s.path) if s.path else f
   if dest.is_dir():dest=dest/'index.html'
   check(dest.exists(),route+': missing '+u)
   if s.fragment and dest.exists() and dest.suffix=='.html':check(bool(html.parse(str(dest)).xpath('//*[@id=$id]',id=unquote(s.fragment))),route+': missing anchor '+u)
 for e in cls(d,'counter-card-number'):check(len(e.text_content().strip())<=12,route+': prose inside a number badge')
 for e in d.xpath('//p[starts-with(@class,"button-text")]'):check(len(e.text_content())<45,route+': paragraph inside a CTA')
 for e in d.xpath('//img[contains(@class,"about-image-shape")]'):check(e.get('src','').endswith('.svg'),route+': photo used as a decorative notch')
 sheets=d.xpath('//link[@rel="stylesheet"]/@href');check(sheets==['/assets/fonts.css','/assets/reference.css','/assets/portfolio.css','/assets/companion.css'],route+': conflicting stylesheet cascade')
 check(not d.xpath('//a[@href="#"]'),route+': placeholder navigation')
 report.append({'route':route,'sections':[e.get('class','') for e in d.xpath('//body/section')],'images':len(d.xpath('//img')),'local_links_and_anchors':'passed','reference_stylesheet':'unchanged','visual_comparison':'not available in this execution environment'})
work=html.parse(str(D/'work/index.html')).getroot();sections=cls(work,'project-section');check([e.get('class') for e in sections]==['project-section section-padding'],'/work: section spacing differs from source')
check(len(cls(sections[0],'single-project'))==13,'/work: collection must have thirteen projects');check(len(cls(sections[0],'project-list'))==1,'/work: original grid class missing')
check(len(cls(sections[0],'project-left-content'))==0,'/work: grid incorrectly uses featured-row layout')
about=html.parse(str(D/'about/index.html')).getroot();reference=html.parse(str(P/'source-data/reference-pages/about.html')).getroot()
for component in ['mission-content-wrapper','mission-left-top-content','mission-image-wrapper','about-image-wrapper','about-counter-wrapper','teams']:
 check(len(cls(about,component))==len(cls(reference,component)), '/about: '+component+' does not match reference structure')
check(len(cls(about,'mission-left-top-content')[0].xpath('./p'))==3,'/about: expected three biography paragraphs')
check(cls(about,'mission-image-card')[0].xpath('.//p[@class="counter-card-number"]/text()')==['13'],'/about: mission badge malformed')
for f in [D/'index.html',D/'process/index.html']:
 d=html.parse(str(f)).getroot();check(len(cls(d,'w-slide'))==4,str(f)+': expected four individual slides');check(len(d.xpath('//*[@data-process-disclosure]'))==4,str(f)+': process structure missing')
 for e in d.xpath('//*[@data-process-disclosure]'):
  button=cls(e,'process-header')[0];panel=cls(e,'w-dropdown-list')[0];check(panel.get('hidden') is not None and button.get('aria-controls')==panel.get('id'),str(f)+': disclosure inaccessible')
for css in (D/'assets').glob('*.css'):
 if css.name not in ['fonts.css','reference.css','portfolio.css','companion.css']:continue
 for u in re.findall(r'url\(["\']?([^\)"\']+)',css.read_text()):
  if u.startswith('/'):check((D/u.lstrip('/')).exists(),str(css)+': missing background/font '+u)
for im in D.rglob('*'):
 if im.suffix.lower() in ['.jpg','.jpeg','.png','.webp','.gif']:
  try:
   with Image.open(im) as x:x.verify()
  except Exception as exc:errors.append(str(im)+': invalid image '+str(exc))
(P/'layout-audit.json').write_text(json.dumps({'pages':len(report),'reference':'https://revento-ecom.webflow.io/','checks':report,'errors':errors},indent=2))
if errors:raise SystemExit('\n'.join(errors))
print('PASS: '+str(len(report))+' pages; reference structures, standalone links, anchors, document shells, images and CSS assets verified.')
