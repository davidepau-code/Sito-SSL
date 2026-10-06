# HANDOFF – Nuovo sito Servizi Sicurezza Lavoro (SSL)

> Da incollare/allegare come primo messaggio in Claude Code. Insieme a questo file allega anche `brief-claude-design-sito-ssl.md` (prompt di stile + testi placeholder) e, quando pronti, gli export di Claude Design.
> Data handoff: 2 ottobre 2026 · Referente: Davide (davide.pau@servizisicurezzalavoro.it)

---

## 0. Cosa ti chiedo di fare (Claude Code)

1. **Setup repository GitHub** (privato) – nome proposto: `sito-ssl`. Account: [personale di Davide / organizzazione aziendale "servizisicurezzalavoro" – DA DECIDERE, consigliata l'organizzazione].
2. **Scaffold progetto Astro** (sito statico) con la struttura e i content collections descritti sotto.
3. **Setup Cloudflare** (Workers con static assets, o Pages) collegato al repo GitHub con deploy automatico su push. Per ora **solo indirizzo provvisorio `*.workers.dev`**: NON collegare il dominio reale.
4. Creare `CLAUDE.md` nel repo = guida interna per chi modificherà il sito con l'IA (vedi §9).
5. Implementare le pagine seguendo lo stile del §6 e i testi del brief, poi iterare con Davide.

Davide deve fare login personalmente su GitHub e Cloudflare (non inserire credenziali per lui). Chiedere conferma prima di autorizzare l'app Cloudflare su GitHub.

---

## 1. Contesto azienda

- **Servizi Sicurezza Lavoro snc** (SSL) – Siniscola (NU), Sardegna. Attiva da quasi 20 anni.
- Formazione e consulenza per la sicurezza sul lavoro (D.Lgs. 81/08), HACCP, F-Gas; gestisce due CEAS.
- P.IVA 01313770917 · Tel +39 0784 1949743 · info@servizisicurezzalavoro.it
- Sede legale: Loc. Salapattu snc – 08029 Siniscola (NU)
- Sede operativa: **[DA CONFERMARE: Z.I. comparto C lotto 24A oppure Via Olbia 21 – 08029 Siniscola]** (il sito attuale le riporta entrambe: incoerenza da risolvere)
- Orari: Lun–Ven 9–13 / 15–19
- CEAS Dorgali – Cala Gonone: Viale Bue Marino 1 – 08022 Cala Gonone (NU) – aperto tutto l'anno
- CEAS Omodeo – Sedilo: Museo del Territorio, SP26 – 09076 Sedilo (OR) – aperto tutto l'anno
- Social: Facebook, Instagram (link da recuperare dal sito attuale) · WhatsApp: [numero da chiedere]

---

## 2. Decisioni prese

| Tema | Decisione |
|---|---|
| Piattaforma | Rifare **da zero**, sito **statico con Astro** (output HTML/CSS puro). Niente WordPress. |
| Hosting sito | **Cloudflare** (gratis, uso commerciale ammesso). NON Vercel Hobby (vieta uso commerciale). |
| Dominio + email | Restano su **Aruba**. Downgrade piano a fine contratto (oggi ~300 €/anno → solo dominio+email ~45–75 €/anno a seconda delle caselle). |
| Area clienti | **Eliminata** (non serve più). |
| Formazione professionale disoccupati / corsi autofinanziati | **Eliminati** dal sito. |
| F-Gas | **Sezione principale** dedicata. Corso + **esame di certificazione con IMQ** in sede. |
| CEAS | **Tenuti** come sezione propria (elemento distintivo), separata da formazione/consulenza. |
| Gestione contenuti | Modifiche future fatte dai colleghi tramite IA (Claude) seguendo `CLAUDE.md`; ogni modifica passa da anteprima prima della pubblicazione. |
| Stile | "Liquid glass" professionale con colori SSL (arancio + antracite), border radius generosi, animazioni fluide (dettagli §6). |

---

> **Aggiornamento 2 ottobre 2026 (stato reale del sito, prevale su quanto scritto sotto dove diverso).**
> - **Corsi**: niente content collection né pagina per singolo corso. Il catalogo sta in `src/data/catalogo-corsi.ts` (fonte: database Notion "Elenco Corsi"), pubblicato su `/formazione/catalogo/` (4 aree: Sicurezza sul lavoro, Macchine e attrezzature, Rischi specifici, Alimentare e HACCP). Le varianti (es. rischio basso/medio/alto, tipi di carrello) sono righe dentro la scheda.
> - **Catalogo senza prezzi**: ogni corso ha ore, modalità, aggiornamento e spiegazione breve; il prezzo si dà solo su richiesta.
> - **Strumento "Scopri cosa ti serve"** su `/formazione/` (dati in `src/data/normativa.ts`, motore in `src/scripts/motore.ts`), con link precompilati dalla home (`?caso=assunto|macchine|haccp`). Dettagli e punti da far validare a un RSPP: `docs/schema-normativo.md`.
> - **Navigazione**: Astro ClientRouter (header persistente, pillola del menu che scorre); script comuni in `src/scripts/sito.ts`.
> - **Pagine presenti**: Home, Formazione, Catalogo corsi, F-Gas, Consulenza (+ sicurezza sul lavoro), CEAS, Chi siamo, Contatti, Pubbliche amministrazioni (placeholder), Privacy, Cookie, 404. Pagine HACCP/ATEX/rischi-specifici separate e `consulenza/sicurezza-alimentare` NON esistono (ATEX tolta dal catalogo).
> - **Contatti e dati azienda**: sempre da `src/data/azienda.ts`. Numeri in homepage (dal 2008, +10.000 corsisti, +500 aziende) forniti dalla direzione.
> - Sezioni §3-§4 qui sotto: l'esempio di schema `corsi` e la mappa del sito sono quelli iniziali di progetto.

## 3. Stack tecnico proposto

- **Astro** (ultima versione stabile), output statico.
- CSS: CSS moderno con custom properties (design tokens) – evitare framework pesanti; Tailwind accettabile se preferito.
- **Content collections** in Markdown/MDX con schema (zod) per: `consulenze`, `fgas`, `ceas`, `faq` (i corsi NON usano più una collection: vedi nota di aggiornamento).
- Immagini: `astro:assets` (WebP/AVIF, dimensioni responsive). Nessuna immagine > 200 KB.
- Moduli (contatto/preventivo/iscrizione): funzione Cloudflare (Worker) che invia email, oppure Formspree come fallback. Anti-spam: Cloudflare Turnstile. Consenso privacy obbligatorio.
- SEO: `@astrojs/sitemap`, meta title/description per pagina, Open Graph, canonical, JSON-LD (`LocalBusiness`/`EducationalOrganization`, `Course` per le schede corso, `FAQPage`, `BreadcrumbList`).
- Redirect 301 dai vecchi URL (file `_redirects` o regole Cloudflare) – vedi §8.
- Analytics: Cloudflare Web Analytics (cookieless) → niente banner cookie per l'analytics. Se si usa Google Maps embed serve consenso: preferire immagine statica + link a Maps.
- Performance target: Lighthouse ≥ 95 su mobile, pagina < 500 KB.

### Esempio schema `corsi` (storico, non più in uso)
```ts
{
  titolo: string,
  slug: string,
  categoria: 'sicurezza' | 'attrezzature' | 'rischi-specifici' | 'alimentare',
  destinatari: string,
  riferimentoNormativo: string,     // es. "D.Lgs. 81/08 art. 37 – ASR 17/04/2025"
  durata: string,                   // es. "4 h generale + 4/8/12 h specifica"
  aggiornamento: string,            // es. "6 h ogni 5 anni"
  modalita: string[],               // aula | videoconferenza | e-learning
  attestato: string,
  ultimaVerificaNormativa: date,    // OBBLIGATORIO: data in cui qualcuno ha verificato i dati
  paginaPropria: boolean,           // true = pagina dedicata, false = sezione nella pagina di categoria
  faq?: {domanda, risposta}[]
}
```

---

## 4. Mappa del sito

```
/                                   Home
/formazione/                        Panoramica formazione
  /formazione/sicurezza-sul-lavoro/ Lavoratori, Preposti, Dirigenti, Datore di lavoro, RLS, Antincendio, Primo soccorso
  /formazione/attrezzature/         Carrelli elevatori, PLE, Gru, MMT, Trattori, Manutenzione del verde
  /formazione/rischi-specifici/     Spazi confinati, ATEX
  /formazione/haccp/                HACCP / OSA
/f-gas/                             Corso ed esame IMQ, supporto imprese, FAQ, novità Reg. UE 2024/573
/consulenza/
  /consulenza/<servizio>/  una pagina per servizio (dati in src/data/consulenze.ts, dal Listino consulenze Notion): dvr, aggiornamento-dvr, duvri, pos, haccp, iso-9001, collaudo-acustico (+ F-Gas impresa su /f-gas/#impresa). Struttura: /consulenza/ ha 4 tessere (Sicurezza sul lavoro -> elenco /consulenza/sicurezza-sul-lavoro/, Sicurezza alimentare -> /consulenza/haccp/, ISO 9001, Collaudo acustico). Redirect in public/_redirects.
/ceas/                              CEAS Dorgali–Cala Gonone e CEAS Omodeo–Sedilo
/chi-siamo/
/contatti/                          Contatti + modulo preventivo
/privacy/  /cookie/
```

Scelta attuale: nessuna pagina dedicata per i singoli corsi (tranne F-Gas). Tutti i corsi stanno nel catalogo `/formazione/catalogo/`, con ancora per ogni scheda (`#lavoratori`, `#carrelli`, …).

---

## 5. Contenuti

- Testi placeholder completi per Home, scheda corso (Lavoratori), F-Gas, DVR, CEAS, Chi siamo, Contatti → **vedi `brief-claude-design-sito-ssl.md`, sezione 3**.
- I testi tra [parentesi quadre] vanno completati da Davide/colleghi. Non inventare numeri, date d'esame, accreditamenti o testimonianze.
- Le descrizioni dei corsi del vecchio sito possono essere usate come base **ma i dati normativi vanno rifatti** (vedi §7).

---

## 6. Stile (sintesi – versione completa nel brief, sezione 1)

- **Liquid glass professionale**: ispirato ad Apple ma non una copia. Navbar a pillola fluttuante in vetro; card/pannelli traslucidi (opacità 55–75%, `backdrop-filter: blur(20–30px)`, bordo 1px chiaro semitrasparente, highlight superiore, ombre ampie e diffuse) sopra sfondi con blob/mesh gradient lenti nei colori SSL o foto reali sfocate.
- **Colori**: arancio SSL (accento/CTA/blob, anche varianti ambra), antracite SSL (testi, sezioni scure, vetro scuro), bianco e grigi caldi. Verde naturale solo nella sezione CEAS.
- **Radius**: pulsanti e navbar a pillola; card 24–32px; immagini 20–28px; input 14–16px. Scala unica (token).
- **Tipografia**: sans moderno (Inter/Manrope), titoli grandi, corpo 17–18px.
- **Animazioni fluide**: easing spring/ease-out 250–500ms, hover card con sollevamento e highlight che segue il cursore, navbar che si compatta allo scroll, blob lentissimi, accordion fluidi, reveal allo scroll delicato **ma contenuto sempre visibile anche senza animazione/JS**. Rispettare `prefers-reduced-motion`.
- **Mai**: cartoon, icone 3D colorate, stock generiche, testo grigio chiaro su vetro.
- **Accessibilità**: WCAG AA anche sopra il vetro; fallback senza blur (`@supports not (backdrop-filter…)`); blur moderato su mobile.
- **Mobile**: barra fissa in basso con "Chiama" e "WhatsApp"; CTA "Richiedi preventivo" sempre visibile nell'header.
- Se Davide porta export/mockup da Claude Design, quelli hanno priorità su questa sintesi.

---

## 7. Dati normativi – ATTENZIONE

Il sito attuale contiene dati errati/superati. Usare come riferimento l'**Accordo Stato-Regioni del 17 aprile 2025** (Rep. Atti n. 59/CSR, in vigore dal 24/05/2025). Dati già verificati:

| Corso | Durata | Aggiornamento | Note |
|---|---|---|---|
| Lavoratori | 4 h generale + 4/8/12 h specifica (rischio basso/medio/alto) | 6 h ogni 5 anni | Il vecchio sito diceva 4/6/8 h: **errato** |
| Preposti | **12 h** | **6 h ogni 2 anni** | No e-learning (aula o videoconferenza sincrona). Vecchio sito: 8 h / 5 anni: **superato** |
| Dirigenti | 12 h | 6 h ogni 5 anni | |
| Verifica finale | Test (min. 30 domande corsi / 10 aggiornamenti, soglia 70%) o colloquio | | Frequenza minima 90% |

Da verificare sul testo ufficiale prima di pubblicare: corso Datore di lavoro (nuovo obbligo ASR 2025), RSPP/ASPP, RLS, antincendio (DM 2/9/2021), primo soccorso (DM 388/03), attrezzature (ASR 2012 aggiornato), spazi confinati, HACCP (normativa regionale Sardegna), F-Gas (Reg. UE 2024/573 e norme nazionali di attuazione).
Fonte testo ufficiale: https://www.asr2025.it/conferenza-stato-regioni-del-17-aprile-2025/

**Regola**: ogni scheda ha il campo `ultimaVerificaNormativa`; nessun dato normativo va inventato o modificato dall'IA senza fonte.

F-Gas / IMQ: verificare con Davide la formula esatta ("esame in sede con IMQ" / "centro d'esame IMQ" / "in collaborazione con IMQ") e se è autorizzato l'uso del logo IMQ.

---

## 8. Migrazione dal sito attuale (da fare SOLO a sito pronto)

Sito attuale: WordPress + Elementor su hosting Aruba (WooCommerce, Customer Area). Sitemap: https://www.servizisicurezzalavoro.it/wp-sitemap-posts-page-1.xml (69 URL).

**Redirect 301 principali** (vecchio → nuovo):
```
/about-us/                                        → /chi-siamo/
/about-us/contact/                                → /contatti/
/about-us/privacy/                                → /privacy/
/about-us/cookies/                                → /cookie/
/about-us/ceas/                                   → /ceas/
/consulenza/sicurezza-sul-lavoro/                 → /consulenza/sicurezza-sul-lavoro/ (pagina elenco DVR/DUVRI/POS)
/consulenza/sicurezza-alimentare/                 → /consulenza/haccp/
/consulenza/envsafety/                            → /consulenza/
/consulenza/sdg/                                  → /ceas/
/servizi/sicurezza-sul-lavoro/dvr/                → /consulenza/dvr/   (oggi 404 ma indicizzata)
/formazione-lavoro/                               → /formazione/
/formazione-lavoro/corsisicurezzalavoro/*         → /formazione/sicurezza-sul-lavoro/… (mappare 1:1 per lavoratori, preposti, dirigenti, rls, antincendio, primosoccorso, rsppdl, spp)
/formazione-lavoro/corsisicurezzalavoro/spaziconfinati/ , /atex/ → /formazione/rischi-specifici/
/formazione-lavoro/catalogoattrezzature/*         → /formazione/attrezzature/ (muletto → pagina dedicata carrelli)
/formazione-lavoro/formazione-haccp/*             → /formazione/haccp/
/formazione-lavoro/formazione-ambiente/*          → /f-gas/
/formazioneprofessionale/*                        → /formazione/   (sezione eliminata)
/customer-area/* , /area-riservata/               → /             (eliminata)
/calender/ , /privacygoogleform/                  → /
```

**Passaggio DNS (delicato – farlo con Davide):**
1. Esportare TUTTI i record DNS attuali da Aruba (MX, SPF/TXT, DKIM, DMARC, autodiscover, CNAME, eventuale PEC).
2. Aggiungere il dominio a Cloudflare (piano Free) e verificare che i record importati coincidano al 100%.
3. Cambiare i nameserver su Aruba → Cloudflare. Il dominio resta registrato su Aruba.
4. Collegare Custom Domain `servizisicurezzalavoro.it` + `www` al Worker; redirect www → apex (o viceversa).
5. Testare invio/ricezione email e sito. Disattivare l'URL `workers.dev`.
6. Inviare la nuova sitemap a Google Search Console.
7. Solo dopo: downgrade piano Aruba a scadenza contratto (verificare n. caselle email e spazio usato: Linux Basic = 5 caselle da 1 GB; Linux Easy = caselle illimitate).

### Lista "da fare al lancio" (aggiunta 2026-10-05)

**A. Contenuti da chiudere prima di pubblicare**
- [ ] Validazione dei dati normativi (corsi, durate, scadenze) da parte di un RSPP.
- [ ] Dati dubbi del catalogo (trattori a ruote e cingoli, pompe CLS, autogru 14/22 h, preposto 12 vs 16 h, corsi combinati "su richiesta").
- [~] Testi F-Gas: esami (categorie, requisiti, prove, esito, documenti) e FAQ scritti il 2026-10-05 dal regolamento IMQ PR PART PRS/FGAS-2015/2067 Rev. 5 del 26/02/2026; da far confermare a Michela/IMQ (costi, tempi; confermato da Davide: esame teorico e pratico in sede a Siniscola). Costi e tempi: volutamente NON indicati sul sito (decisione di Davide, 2026-10-06). Date sessioni: ultimo sabato del mese, tutte "da confermare"; dicembre mostrato come "Dicembre (data da definire)" senza giorno.
- [~] Risposte alle 4 FAQ della home scritte il 2026-10-06 (lavoratori, preposti, DVR, F-Gas climatizzatore): da far verificare a un RSPP e, per F-Gas, a Michela. Restano da fare i testi di CEAS e Pubbliche amministrazioni e le foto reali.
- [~] "Chi siamo": accreditamento Regione Sardegna (macrotipologie B, C), affiliazione IMQ e certificazione ISO 9001 DNV GL inseriti il 2026-10-06 su indicazione di Davide. Da fare: verificare con Flavio il nome attuale dell'ente (DNV GL oggi è "DNV"), scadenza/numero del certificato, uso del logo IMQ; sezione team con ruoli (da vedere con Flavio); foto reale del team.
- [~] Informativa privacy e cookie: bozza completa scritta il 2026-10-05 (titolare, finalità, destinatari Cloudflare/Resend/Google, diritti). Da far rivedere al consulente privacy; confermare in particolare i tempi di conservazione (richieste senza seguito: 12 mesi) e il fornitore della posta (Aruba?). Banner cookie con consenso per la mappa di Google, conforme alle Linee guida del Garante 10/6/2021 (Accetta/Rifiuta con pari evidenza, X = continua senza accettare, link Preferenze cookie nel footer, scelta valida 12 mesi); caratteri Manrope ospitati sul sito (niente Google Fonts). Se si aggiunge Analytics o altri servizi esterni, aggiornare le due pagine e il banner.
- [~] Modulo contatti: invio reale FUNZIONANTE (Worker `worker/index.ts` + Resend, segreto `RESEND_API_KEY` su Cloudflare; account Resend creato con info@). RIMANDATO, serve l'accesso al pannello Aruba: verificare il dominio su Resend aggiungendo il sottodominio `send.servizisicurezzalavoro.it` (3 record DNS: TXT DKIM, MX, TXT SPF; non toccare i record della posta esistenti). Poi: cambiare `EMAIL_DA` in `Sito SSL <sito@send.servizisicurezzalavoro.it>`, riattivare `EMAIL_CC` (davide.pau@servizisicurezzalavoro.it) in `wrangler.jsonc`, togliere `dettaglio` dalla risposta d'errore in `worker/index.ts`. Facoltativo: Turnstile.
- [ ] Mappa in Contatti: sostituire con il codice "Incorpora una mappa" della scheda Google dell'attività (oggi il segnaposto cade su "Zona Industriale").

**B. Passaggio al dominio** (vedi sezione sopra: DNS, Custom Domain, redirect 301, test email).

**C. Indicizzazione**
- [ ] Impostare `PUBLIC_INDEXABLE=true` nella build di produzione su Cloudflare e ripubblicare (toglie il `noindex`).
- [ ] Controllare che `site` in `astro.config.mjs` sia il dominio definitivo (oggi `https://www.servizisicurezzalavoro.it`; deve coincidere con www/apex scelto).
- [x] `robots.txt` generato da `src/pages/robots.txt.ts`: blocca tutto finché `PUBLIC_INDEXABLE` non è `true`, poi apre e indica la sitemap (si aggiorna da solo).
- [ ] Verificare nel codice sorgente della pagina pubblicata che non ci sia più `noindex` e che i canonical puntino al dominio vero.

**D. Google Search Console**
- [ ] Creare la proprietà di tipo "Dominio" (copre www/apex, http/https).
- [ ] Verificare con record DNS TXT (dove stanno i DNS: Cloudflare dopo il cambio nameserver, altrimenti Aruba). Lasciare il record per sempre.
- [ ] Inviare `https://<dominio>/sitemap-index.xml` in Sitemap.
- [ ] Richiedere l'indicizzazione della home con "Controllo URL".
- [ ] Dopo 1–2 settimane: controllare Copertura/Pagine, 404 provenienti dal vecchio sito (redirect mancanti) e Core Web Vitals.
- [ ] Opzionale: Google Business Profile (scheda Maps) con indirizzo, orari e sito nuovi; eventuale Google Analytics/misurazione con banner cookie.

**E. Dopo il lancio**
- [ ] Prova di invio/ricezione email, test modulo contatti, test WhatsApp (principale e Michela) da telefono.
- [ ] Disattivare l'URL `workers.dev`; downgrade Aruba solo a scadenza contratto.

---

## 9. `CLAUDE.md` da creare nel repo (guida interna)

Deve contenere almeno:
- Cosa è il sito, a chi parla, tono di voce (chiaro, concreto, professionale, "tu" o "voi" – [decidere]).
- Dove stanno i contenuti (`src/data/catalogo-corsi.ts` per i corsi) e come aggiungere/modificare un corso, una FAQ, una data d'esame F-Gas.
- **Regola normativa**: non modificare durate, periodicità o riferimenti di legge senza fonte; aggiornare `ultimaVerificaNormativa`.
- Regole di stile (token colori/radius, componenti esistenti da riusare, non introdurre nuovi colori).
- Flusso: lavorare su branch → anteprima Cloudflare → approvazione di [Davide / referente] → merge su `main` = pubblicazione.
- Checklist prima del merge: build ok, nessun link rotto, immagini ottimizzate, meta description presente.
- Affiancare una guida breve per i colleghi (non tecnica) in `docs/guida-colleghi.md`.

---

## 10. Domande ancora aperte (chiedere a Davide)

1. Account GitHub: personale o organizzazione aziendale?
2. Indirizzo sede operativa definitivo.
3. Numero WhatsApp aziendale.
4. CEAS: descrizione attività (laboratori scuole, escursioni, eventi, visite).
5. F-Gas: durata corso, prossime sessioni d'esame, servizi per le imprese, uso logo IMQ.
6. Numeri reali per la home (lavoratori formati, aziende, certificati F-Gas) e anno di fondazione.
7. Accreditamenti (es. Regione Sardegna) da mostrare.
8. Foto reali disponibili (aula, sedi, CEAS, attrezzature).
9. Logo in formato vettoriale (SVG) e codici colore esatti del brand SSL.
10. Chi riceve le richieste dai moduli (email di destinazione).


### Aggiornamento 2026-10-05 – Consulenza
Una pagina per servizio (DVR, aggiornamento DVR, DUVRI, POS, manuale HACCP, ISO 9001, collaudo acustico). Testi in bozza scritti dal Listino consulenze Notion + norme: da far verificare da un RSPP. Non presenti nel listino e quindi non create: piano di emergenza, stress lavoro-correlato, valutazione rumore/vibrazioni (inclusa nel DVR).
