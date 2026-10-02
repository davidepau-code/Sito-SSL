# Sito Servizi Sicurezza Lavoro (SSL)

Sito statico Astro di Servizi Sicurezza Lavoro snc (Siniscola, NU): formazione D.Lgs. 81/08, consulenza, certificazione F-Gas (esame IMQ), due CEAS. Pubblico: titolari/responsabili di PMI sarde, frigoristi/termoidraulici, scuole ed enti. Obiettivo: portare al contatto (preventivo, telefono, WhatsApp).

**Tono di voce**: chiaro, concreto, professionale, senza giri di parole. Forma: [DA DECIDERE con Davide: "tu" o "voi"].

## Sviluppo

- `npm run dev` (oppure `astro dev --background`, poi `astro dev stop/status/logs`), `npm run build`, `npm run preview`.
- Hosting: Cloudflare Workers con static assets (`wrangler.jsonc`). Deploy automatico su push a `main`. Per ora solo URL `*.workers.dev`: **NON collegare il dominio reale** senza Davide (vedi HANDOFF §8).
- Le pagine hanno `noindex` finché il dominio non è collegato: va tolto in `src/layouts/Base.astro` al lancio.

## Dove sono i contenuti

- Corsi: catalogo in `src/data/catalogo-corsi.ts` (fonte: Notion "Elenco Corsi"), pagina `/formazione/catalogo/`. Nessuna pagina per singolo corso: le varianti stanno dentro la scheda.
- Per aggiungere un corso: copia `lavoratori.md`, cambia nome file e campi. Per una FAQ: aggiungi una voce a `faq`.
- Collezioni previste e non ancora create: `consulenze`, `fgas`, `ceas`, `faq` (sessioni d'esame F-Gas qui).

## REGOLA NORMATIVA (non derogabile)

Non modificare durate, periodicità o riferimenti di legge senza una fonte ufficiale. Ogni modifica a dati normativi aggiorna `ultimaVerificaNormativa`. Riferimento: Accordo Stato-Regioni 17/04/2025 (Rep. Atti n. 59/CSR, in vigore dal 24/05/2025), https://www.asr2025.it/conferenza-stato-regioni-del-17-aprile-2025/
Non inventare mai numeri, date d'esame, accreditamenti o testimonianze. I testi tra [parentesi quadre] sono da completare da un umano.

## Stile

- Token in `src/styles/global.css` (colori, raggi `--r-*`, easing). Non introdurre nuovi colori né raggi fuori scala. Verde solo nella sezione CEAS.
- Vetro = classe `.vetro`; card = `.card`; pulsanti = `.btn .btn-primario|.btn-vetro`; entrata allo scroll = `.reveal`. Riusa i componenti esistenti.
- Il contenuto deve restare visibile senza JS/animazioni; rispettare `prefers-reduced-motion`; contrasto WCAG AA sopra il vetro.
- Immagini via `astro:assets`, WebP/AVIF, max 200 KB. Niente stock generiche, cartoon, icone 3D.

## Flusso di lavoro

Lavora su un branch → anteprima Cloudflare → approvazione di Davide → merge su `main` = pubblicazione.
Checklist prima del merge: `npm run build` ok, nessun link rotto, immagini ottimizzate, meta description presente in ogni pagina.

## Documentazione

Mappa del sito, decisioni e redirect: `docs/HANDOFF-sito-ssl.md`. Guida per i colleghi: `docs/guida-colleghi.md`. Astro: https://docs.astro.build

Repository: https://github.com/davidepau-code/Sito-SSL (privato). Anteprima/produzione provvisoria: https://sito-ssl.davidepau99.workers.dev
