// Audit rapido delle pagine generate in dist/: titoli, descrizioni, h1, link interni rotti, segnaposto.
// Uso: npx astro build && node scripts/audit-pagine.mjs
import fs from 'fs';
import path from 'path';

const root = 'dist';
const pages = [];
(function visita(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) visita(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(root);

const url = (p) => '/' + path.relative(root, p).split(path.sep).join('/').replace(/index\.html$/, '');
const urls = new Set(pages.map(url));

for (const p of pages) {
  const h = fs.readFileSync(p, 'utf8');
  const t = (h.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const d = (h.match(/<meta name="description" content="(.*?)"/) || [])[1] || '';
  const h1 = (h.match(/<h1[ >]/g) || []).length;
  const testo = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  const segnaposto = [...testo.matchAll(/\[[^\]<>]{4,90}\]/g)].map((m) => m[0]).filter((x) => !/^\[(\d|object)/.test(x));
  const link = [...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]).filter((l) => !/\.[a-z0-9]+$/i.test(l));
  const rotti = [...new Set(link)].filter((l) => !urls.has(l.endsWith('/') ? l : l + '/'));
  const imgSenzaAlt = [...h.matchAll(/<img[^>]*>/g)].filter((m) => !/alt=/.test(m[0])).length;
  console.log(
    `${url(p)} | title ${t.length} | desc ${d.length} | h1 ${h1} | noindex ${/noindex/.test(h)} | canonical ${/rel="canonical"/.test(h)} | imgSenzaAlt ${imgSenzaAlt} | linkRotti ${rotti.join(',') || '-'} | segnaposto ${segnaposto.length}${segnaposto.length ? ': ' + segnaposto.slice(0, 8).join(' ; ') : ''}`
  );
}
