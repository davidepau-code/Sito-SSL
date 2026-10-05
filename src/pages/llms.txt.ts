import type { APIRoute } from 'astro';
import { consulenze } from '../data/consulenze';

// llms.txt: elenco ragionato delle pagine chiave. Nessun motore ne ha confermato l'uso: extra a costo zero.
export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site).href;
  const corpo = `# Servizi Sicurezza Lavoro snc

> Formazione obbligatoria D.Lgs. 81/08, consulenza (DVR, DUVRI, POS, HACCP), certificazione F-Gas e due Centri di Educazione Ambientale (CEAS). Sede a Siniscola (NU), Zona Industriale comparto C lotto 24A, Sardegna.

## Servizi
- [Formazione](${u('/formazione/')}): corsi sicurezza sul lavoro, attrezzature, rischi specifici, HACCP
- [Certificazione F-Gas](${u('/f-gas/')}): corso ed esame per frigoristi e installatori
- [Consulenza](${u('/consulenza/')}): elenco dei servizi di consulenza
${consulenze.map((c) => `  - [${c.breve}](${u(`/consulenza/${c.slug}/`)}): ${c.riassunto}`).join(String.fromCharCode(10))}
- [CEAS](${u('/ceas/')}): educazione ambientale a Cala Gonone (Dorgali) e Sedilo

## Azienda
- [Chi siamo](${u('/chi-siamo/')})
- [Contatti](${u('/contatti/')}): 320 407 0573 (WhatsApp), 0784 1949743, info@servizisicurezzalavoro.it
`;
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
