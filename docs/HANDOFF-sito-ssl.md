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

## 3. Stack tecnico proposto

- **Astro** (ultima versione stabile), output statico.
- CSS: CSS moderno con custom properties (design tokens) – evitare framework pesanti; Tailwind accettabile se preferito.
- **Content collections** in Markdown/MDX con schema (zod) per: `corsi`, `consulenze`, `fgas`, `ceas`, `faq`.
- Immagini: `astro:assets` (WebP/AVIF, dimensioni responsive). Nessuna immagine > 200 KB.
- Moduli (contatto/preventivo/iscrizione): funzione Cloudflare (Worker) che invia email, oppure Formspree come fallback. Anti-spam: Cloudflare Turnstile. Consenso privacy obbligatorio.
- SEO: `@astrojs/sitemap`, meta title/description per pagina, Open Graph, canonical, JSON-LD (`LocalBusiness`/`EducationalOrganization`, `Course` per le schede corso, `FAQPage`, `BreadcrumbList`).
- Redirect 301 dai vecchi URL (file `_redirects` o regole Cloudflare) – vedi §8.
- Analytics: Cloudflare Web Analytics (cookieless) → niente banner cookie per l'analytics. Se si usa Google Maps embed serve consenso: preferire immagine statica + link a Maps.
- Performance target: Lighthouse ≥ 95 su mobile, pagina < 500 KB.

### Esempio schema `corsi`
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
  /consulenza/sicurezza-sul-lavoro/ DVR, DUVRI, POS, valutazioni rischi, piani di emergenza
  /consulenza/sicurezza-alimentare/ Manuale HACCP, autocontrollo, audit
/ceas/                              CEAS Dorgali–Cala Gonone e CEAS Omodeo–Sedilo
/chi-siamo/
/contatti/                          Contatti + modulo preventivo
/privacy/  /cookie/
```

Pagine dedicate (alta ricerca Google): Lavoratori, Preposti, Antincendio, Primo soccorso, Carrelli elevatori (muletto), HACCP, F-Gas. Gli altri corsi come sezioni dentro la pagina di categoria.

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
/consulenza/sicurezza-sul-lavoro/                 → /consulenza/sicurezza-sul-lavoro/
/consulenza/sicurezza-alimentare/                 → /consulenza/sicurezza-alimentare/
/consulenza/envsafety/                            → /consulenza/
/consulenza/sdg/                                  → /ceas/
/servizi/sicurezza-sul-lavoro/dvr/                → /consulenza/sicurezza-sul-lavoro/   (oggi 404 ma indicizzata)
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

---

## 9. `CLAUDE.md` da creare nel repo (guida interna)

Deve contenere almeno:
- Cosa è il sito, a chi parla, tono di voce (chiaro, concreto, professionale, "tu" o "voi" – [decidere]).
- Dove stanno i contenuti (`src/content/corsi/…`) e come aggiungere/modificare un corso, una FAQ, una data d'esame F-Gas.
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
