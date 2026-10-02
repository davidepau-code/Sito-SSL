import type { APIRoute } from 'astro';

// llms.txt: elenco ragionato delle pagine chiave. Nessun motore ne ha confermato l'uso: extra a costo zero.
export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site).href;
  const corpo = `# Servizi Sicurezza Lavoro snc

> Formazione obbligatoria D.Lgs. 81/08, consulenza (DVR, DUVRI, POS, HACCP), certificazione F-Gas e due Centri di Educazione Ambientale (CEAS). Sede a Siniscola (NU), Sardegna.

## Servizi
- [Formazione](${u('/formazione/')}): corsi sicurezza sul lavoro, attrezzature, rischi specifici, HACCP
- [Certificazione F-Gas](${u('/f-gas/')}): corso ed esame per frigoristi e installatori
- [Consulenza](${u('/consulenza/')}): documento di valutazione dei rischi, sicurezza alimentare
- [CEAS](${u('/ceas/')}): educazione ambientale a Cala Gonone (Dorgali) e Sedilo

## Azienda
- [Chi siamo](${u('/chi-siamo/')})
- [Contatti](${u('/contatti/')}): +39 0784 1949743, info@servizisicurezzalavoro.it
`;
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
