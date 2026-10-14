import type { APIRoute } from 'astro';
import { consulenze } from '../data/consulenze';
import { tuttiICorsi, urlCorso } from '../data/catalogo-corsi';

// llms.txt: elenco ragionato delle pagine chiave. Nessun motore ne ha confermato l'uso: extra a costo zero.
export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site).href;
  const corpo = `# Servizi Sicurezza Lavoro snc

> Formazione obbligatoria D.Lgs. 81/08, consulenza (DVR, DUVRI, POS, HACCP), certificazione F-Gas. Sede a Siniscola (NU), Zona Industriale comparto C lotto 24A, Sardegna.

## Servizi
- [Formazione](${u('/formazione/')}): corsi sicurezza sul lavoro, attrezzature, rischi specifici, HACCP
${tuttiICorsi.map(({ corso: c }) => `  - [${c.nome}](${u(urlCorso(c))}): ${c.per}`).join(String.fromCharCode(10))}
- [Calendario corsi](${u('/formazione/calendario/')}): edizioni con data fissata
- [Certificazione F-Gas](${u('/f-gas/')}): corso ed esame per frigoristi e installatori
- [Patentino F-Gas per frigoristi](${u('/f-gas/patentino-frigoristi/')}): corso di preparazione, esame IMQ a Siniscola, prossime sessioni
- [Certificazione F-Gas d'impresa](${u('/f-gas/certificazione-impresa/')}): requisiti e accompagnamento fino al certificato IMQ dell'impresa
- [Consulenza](${u('/consulenza/')}): elenco dei servizi di consulenza
${consulenze.map((c) => `  - [${c.breve}](${u(`/consulenza/${c.slug}/`)}): ${c.riassunto}`).join(String.fromCharCode(10))}

## Azienda
- [Chi siamo](${u('/chi-siamo/')})
- [Contatti](${u('/contatti/')}): 320 407 0573 (WhatsApp), 0784 1949743, info@servizisicurezzalavoro.it
`;
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
