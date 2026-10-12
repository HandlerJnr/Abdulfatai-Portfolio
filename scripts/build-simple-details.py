from pathlib import Path
from lxml import html,etree
import copy,re
root=Path(__file__).resolve().parents[1]/'dist'
listing=root/'simple/index.html';s=listing.read_text();s=re.sub(r'href="/work/([^"#]+)(#[^"]*)?"',r'href="/simple/work/\1\2"',s);listing.write_text(s)
base=html.fromstring(s)
header=etree.tostring(base.find('body/header'),encoding='unicode',method='html')
footer=etree.tostring(base.find('body/footer'),encoding='unicode',method='html')
for source in (root/'work').glob('*/index.html'):
 doc=html.fromstring(source.read_text());slug=source.parent.name
 title=doc.find('.//title').text.split('|')[0].strip()
 h=doc.xpath('//h2[contains(@class,"hero-title")]')
 if h:title=h[0].text_content().strip()
 content=doc.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," authentic-content ")]')[0]
 content=copy.deepcopy(content)
 # Retain the actual case study content; remove its presentation and modal behaviour.
 for el in list(content.iter()):
  if not isinstance(el.tag,str):continue
  for key in list(el.attrib):
   if key not in ['id','href','src','alt','width','height','loading','download','target','rel','open']:del el.attrib[key]
  if el.tag=='a':
   href=el.get('href','')
   if href.startswith('/work/'):el.set('href','/simple'+href)
   elif href=='/work':el.set('href','/simple#projects')
  if el.tag=='img':el.set('loading','lazy')
  if el.tag in ['script','style']:el.getparent().remove(el)
 content.set('class','simple-case-content')
 cover=doc.xpath('//img[contains(@class,"project-details-thumbnail")]')
 image=''
 if cover:image=f'<figure class="simple-case-cover"><img src="{cover[0].get("src")}" alt="{title} project overview"></figure>'
 page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' — Jamiu Abdulfatai</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/simple-view.css"><script src="/assets/portfolio-view.js" defer></script></head><body class="simple-view simple-case"><a class="simple-skip" href="#main">Skip to content</a>'+header+'<main id="main" class="simple-container"><div class="simple-case-toolbar"><a href="/simple#projects">← All projects</a><a href="/work/'+slug+'" data-portfolio-view="visual">View visual case study ↗</a></div><header class="simple-case-heading"><p class="simple-eyebrow">PRODUCT DESIGN CASE STUDY</p><h1>'+title+'</h1></header>'+image+etree.tostring(content,encoding='unicode',method='html')+'</main>'+footer+'</body></html>'
 page=page.replace('href="#projects"','href="/simple#projects"')
 dest=root/'simple/work'/slug;dest.mkdir(parents=True,exist_ok=True);(dest/'index.html').write_text(page)
# Move the visual-home entry from the hero into the shared header control.
p=root/'index.html';t=p.read_text();t=re.sub(r'<a href="/simple" data-portfolio-view="simple" class="portfolio-hero-secondary">Simple view ↗</a>','',t);p.write_text(t)
print('Built 13 simplified case studies from the existing case-study content.')
