import type { APIRoute } from 'astro';

// Fino al lancio (PUBLIC_INDEXABLE diverso da "true") blocca tutto; al lancio apre e indica la sitemap.
export const GET: APIRoute = ({ site }) => {
  const aperto = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const corpo = aperto
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
