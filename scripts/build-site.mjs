import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
const base='https://jamiudesigns.vercel.app';
const targets=[
  ['jamiu-headshot.png',920],
  ['jamiu-collaborating.png',1400],
  ['jamiu-speaking.png',1400],
  ['current/4909a5304b49849e.png',1600],
  ['current/3dba0379260ff953.png',1600],
  ['current/126420b958731015.png',1600],
  ['current/3b6af72f0aceca7f.jpg',1600],
  ['current/7ab8c9113b79cfb4.jpg',1600]
];
const optimized=new Map();
let saved=0;
await fs.mkdir(path.join(dist,'assets','optimized'),{recursive:true});
for(const [source,width] of targets){
  const input=path.join(dist,'assets',source);
  const outputName=source.replace(/^current\//,'').replace(/\.[^.]+$/,'.webp');
  const output=path.join(dist,'assets','optimized',outputName);
  try{
    const sourceStat=await fs.stat(input);
    await sharp(input,{failOn:'error'}).rotate().resize({width,withoutEnlargement:true}).webp({quality:86,effort:4}).toFile(output);
    const resultStat=await fs.stat(output);
    if(resultStat.size>=sourceStat.size*.92){await fs.unlink(output);continue;}
    const oldUrl='/assets/'+source;
    const newUrl='/assets/optimized/'+outputName;
    optimized.set(oldUrl,newUrl);
    saved+=sourceStat.size-resultStat.size;
  }catch(error){
    console.warn('Skipped image optimisation for '+source+': '+error.message);
  }
}
function escapeAttr(text){return String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
function plain(text){
  return String(text).replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
}
async function filesIn(dir){
  const children=await fs.readdir(dir,{withFileTypes:true});
  const results=[];
  for(const entry of children){
    const child=path.join(dir,entry.name);
    if(entry.isDirectory())results.push(...await filesIn(child));
    else if(child.endsWith('.html'))results.push(child);
  }
  return results;
}
let count=0;
const urls=[];
for(const file of await filesIn(dist)){
  let html=await fs.readFile(file,'utf8');
  const rel=path.relative(dist,file).replaceAll(path.sep,'/');
  const route=rel==='index.html'?'/':'/'+rel.replace(/\/index\.html$/,'');
  // Only replace image sources; existing links to the original image stay functional.
  html=html.replace(/(<img\b[^>]*?\bsrc=")([^"]+)(")/g,(full,prefix,src,suffix)=>
    prefix+(optimized.get(src)||src)+suffix);
  if(route==='/'){
    const hero=optimized.get('/assets/jamiu-headshot.png');
    if(hero&&!html.includes('as="image" href="'+hero+'"'))
      html=html.replace('</head>','<link rel="preload" as="image" href="'+hero+'" fetchpriority="high"></head>');
  }
  // Remove inherited theme export metadata.
  html=html.replace(/\sdata-wf-domain="[^"]*"/g,'');
  html=html.replace(/<meta\s+content="Webflow"\s+name="generator"\s*\/?>/gi,'');
  const oldTitle=plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'Jamiu Abdulfatai | Product Designer');
  const opening=html.match(/<p\s+class="hero-subtitle(?:\s+[^"]*)?"[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  const descDefault="I'm Jamiu, a product designer in Brighton. I work on banking, student payments, marketplaces and AI products.";
  const desc=plain(opening||html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]||descDefault).slice(0,220);
  const canonical=base+route;
  // Use each page's real feature image where possible, then fall back to the portrait.
  const pageImage=html.match(/<img\b[^>]*\bsrc="([^"]+)"[^>]*class="project-details-thumbnail"/i)?.[1]||
    html.match(/<img\b[^>]*\bsrc="([^"]+)"[^>]*class="project-thumbnail"/i)?.[1]||
    optimized.get('/assets/jamiu-headshot.png')||'/assets/jamiu-headshot.png';
  const imageURL=base+pageImage;
  const metas=[
    '<link rel="canonical" href="'+escapeAttr(canonical)+'">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Jamiu Abdulfatai">',
    '<meta property="og:title" content="'+escapeAttr(oldTitle)+'">',
    '<meta property="og:description" content="'+escapeAttr(desc)+'">',
    '<meta property="og:url" content="'+escapeAttr(canonical)+'">',
    '<meta property="og:image" content="'+escapeAttr(imageURL)+'">',
    '<meta name="twitter:card" content="summary_large_image">'
  ].join('');
  html=html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/gi,'');
  html=html.replace(/<meta\s+(?:property="og:[^"]+"|name="twitter:card")\s+content="[^"]*"\s*\/?>/gi,'');
  html=html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    '<meta name="description" content="'+escapeAttr(desc)+'">');
  html=html.replace('</head>',metas+'</head>');
  // Replace a remaining generic agency CTA with a direct, personal invitation.
  html=html.replace(/<span class="cta-title-highlight">Ready to Create<\/span> with Jamiu &amp; bring your next idea to life\?/g,
    '<span class="cta-title-highlight">Have something in mind?</span> I\\'d love to hear about it.');
  await fs.writeFile(file,html,'utf8');
  if(!['/404','/privacy-policy','/terms-and-conditions'].includes(route))urls.push(canonical);
  count++;
}
urls.sort();
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>'  <url><loc>'+url.replaceAll('&','&amp;')+'</loc></url>').join('\n')+'\n</urlset>\n';
await fs.writeFile(path.join(dist,'sitemap.xml'),xml);
await fs.writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+base+'/sitemap.xml\n');
console.log('Built '+count+' portfolio pages with canonical and share metadata; optimised '+optimized.size+' images, saving '+Math.round(saved/1024)+' KB in the source image set.');
