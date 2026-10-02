import type { APIRoute } from 'astro';

// Indicizzabile solo con PUBLIC_INDEXABLE=true (variabile di build Cloudflare, da impostare al lancio).
const indicizzabile = import.meta.env.PUBLIC_INDEXABLE === 'true';

// Crawler dei motori generativi: consentiti (scelta da confermare con Davide, v. docs/seo-geo.md §5.8).
const crawlerAI = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const corpo = indicizzabile
    ? ['User-agent: *', 'Allow: /', '', ...crawlerAI.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']), `Sitemap: ${sitemap}`, '']
    : ['# Sito in anteprima: non indicizzare.', 'User-agent: *', 'Disallow: /', ''];
  return new Response(corpo.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
