import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const corsi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/corsi' }),
  schema: z.object({
    titolo: z.string(),
    sottotitolo: z.string(),
    categoria: z.enum(['sicurezza', 'attrezzature', 'rischi-specifici', 'alimentare']),
    destinatari: z.string(),
    riferimentoNormativo: z.string(),
    durata: z.string(),
    aggiornamento: z.string(),
    modalita: z.array(z.string()),
    attestato: z.string(),
    // OBBLIGATORIO: data in cui qualcuno ha verificato i dati normativi su fonte ufficiale
    ultimaVerificaNormativa: z.coerce.date(),
    paginaPropria: z.boolean().default(false),
    faq: z.array(z.object({ domanda: z.string(), risposta: z.string() })).optional(),
  }),
});

export const collections = { corsi };
