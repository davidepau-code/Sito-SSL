// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio definitivo: NON ancora collegato (per ora solo *.workers.dev).
export default defineConfig({
  site: 'https://www.servizisicurezzalavoro.it',
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [sitemap()],
});
