# Strategia SEO + GEO – sito SSL

Bozza di lavoro, 2 ottobre 2026. "GEO" qui copre **due cose**: (a) *Generative Engine Optimization* = farsi citare da ChatGPT, Perplexity, Google AI Overviews, Claude; (b) **SEO locale** = farsi trovare in Sardegna (Siniscola, Nuoro, Olbia, Dorgali, Sedilo). Per questo business pesano entrambe: chi cerca "corso sicurezza lavoratori" lo fa quasi sempre con un luogo in mente.

Principio guida: **nessuna promessa di posizionamento o citazione**. Si controlla solo la qualità, la chiarezza e la verificabilità dei contenuti; i motori decidono. E regola già in `CLAUDE.md`: niente dati inventati, schema markup identico al testo visibile.

---

## 1. Chi cerca e cosa (mappa delle intenzioni)

Le parole chiave qui sotto sono **ipotesi da validare** con Google Search Console del vecchio sito, Bing Webmaster e uno strumento keyword (Ahrefs/Semrush): non ho dati di volume.

| Intento | Esempi di ricerca | Pagina bersaglio | Peso locale |
|---|---|---|---|
| "Cosa devo fare per essere in regola" | corso sicurezza lavoratori obbligatorio, formazione 81/08 cosa serve | Hub `/formazione/` + pagine corso | alto |
| Corso specifico + luogo | corso antincendio Nuoro, corso primo soccorso Siniscola, corso preposti Sardegna | pagina corso | **molto alto** |
| Patentino macchine | patentino muletto Sardegna, corso PLE Nuoro, corso escavatore | corsi attrezzature | molto alto |
| HACCP | corso HACCP Nuoro, attestato alimentarista Sardegna, manuale HACCP ristorante | `/formazione/haccp/`, consulenza alimentare | molto alto |
| F-Gas | patentino frigorista Sardegna, certificazione F-Gas esame IMQ, rinnovo patentino frigorista, certificazione impresa F-Gas | `/f-gas/` (persone/imprese) | alto (poche sedi d'esame) |
| Documenti | DVR costo, redazione DVR Nuoro, DUVRI cos'è, POS cantiere | consulenza | alto |
| Domande informative | ogni quanto si aggiorna il corso preposti, il corso lavoratori fatto altrove vale?, il DVR è obbligatorio con un dipendente? | **FAQ e guide** | basso (qui entrano i motori generativi) |
| Scuole/enti | educazione ambientale scuole Sardegna, laboratori CEAS Cala Gonone | CEAS | alto |
| Brand | servizi sicurezza lavoro siniscola, SSL Siniscola | home, chi siamo | — |

Modificatori geografici da coprire con naturalezza (nel testo, non in elenchi spam): Siniscola, Nuoro e provincia, Baronia, Olbia/Gallura, Orosei, Dorgali/Cala Gonone, Sedilo/Oristano, "in tutta la Sardegna", "in azienda".

---

## 2. Architettura e link interni

- **Hub e spoke**: ogni hub (`/formazione/`, `/f-gas/`, `/consulenza/`, `/ceas/`) linka tutti i figli; ogni figlio linka l'hub, 2–3 corsi correlati e il servizio collegato (es. corso preposti → corso lavoratori + DVR).
- **Una pagina = una intenzione**: pagina dedicata solo per i corsi ad alta ricerca (lista in `struttura-contenuti.md`); gli altri come sezioni con ancora nella pagina di categoria, ma **con `<h2>` e testo propri** così sono citabili.
- **URL**: minuscoli, senza accenti, stabili, con slash finale; i vecchi URL con 301 (mappa nell'handoff §8). Mai cambiare un URL dopo il lancio senza redirect.
- **Breadcrumb** visibili e in JSON-LD su tutte le pagine interne.
- **Niente pagine "città"** doorway (es. "corso muletto Olbia" duplicato): una sezione "Dove facciamo i corsi" reale (sede, in azienda, CEAS) basta e non è spam.

---

## 3. Regole on-page (template)

| Elemento | Regola |
|---|---|
| `<title>` | `Corso {nome} {luogo/Sardegna} – {durata/chiave} | Servizi Sicurezza Lavoro`, max ~60 car. Unico per pagina. |
| meta description | 140–160 car., promessa concreta + CTA ("Durata, aggiornamento e iscrizione"). Oggi il sito vecchio non ne ha nessuna. |
| H1 | uno solo, contiene il termine che la gente cerca ("Corso per preposti"), non slogan. |
| Prima schermata | **risposta in 2–3 righe** (cos'è, per chi, quanto dura) + box "In sintesi". È ciò che i motori estraggono. |
| Struttura | H2 come domande o sezioni chiare: A chi serve · Durata e aggiornamento · Come si svolge · Cosa si riceve · Costi/preventivo · FAQ. |
| Dati normativi | tabella o elenco con numeri esatti + riferimento di legge linkato alla fonte (Gazzetta Ufficiale, ASR, sito ministero) + **"Verificato il {data}"** visibile (`ultimaVerificaNormativa`). |
| Autore/revisore | firma di chi ha verificato (es. RSPP abilitato del team) con link a Chi siamo: segnale di competenza per un settore regolamentato. |
| Immagini | foto reali, `alt` descrittivo, WebP/AVIF, dimensioni fisse, nomi file parlanti. |
| Lunghezza | quanto serve a rispondere; niente riempitivi. Le pagine corso attuali sono troppo povere: aggiungere programma, modalità reali, requisiti, esempi di settore. |
| CTA | stessa azione su tutte (preventivo/telefono/WhatsApp), mai tra i dati strutturati. |

---

## 4. Dati strutturati (schema.org) per tipo di pagina

Regola ferrea: **il markup riflette solo ciò che è scritto nella pagina**. Niente campi con segnaposto, niente recensioni inventate, niente prezzi non pubblicati.

| Pagina | Tipi |
|---|---|
| Tutte | `Organization` (+`LocalBusiness`/`EducationalOrganization`), `WebSite`, `BreadcrumbList` |
| Home / Contatti | Organization completa: nome, `url`, `logo`, telefono, email, P.IVA (`vatID`), orari, `address` della sede legale, `areaServed` (Sardegna), `sameAs` (Facebook, Instagram, Google Business Profile, scheda IMQ OdV, scheda INFEAS/Regione) |
| Scheda corso | `Course` (nome, descrizione, `provider`, lingua); `FAQPage` se le FAQ sono reali |
| Consulenza | `Service` con `provider`, `areaServed`; `FAQPage` |
| CEAS | `Place`/`TouristInformationCenter` o `LocalBusiness` per ciascuna sede con indirizzo e coordinate; collegati a Organization |
| F-Gas | `Course` + `FAQPage`; evento `Event` per le sessioni d'esame **solo** quando ci sono date reali |
| Guide/FAQ lunghe | `Article` con `datePublished`/`dateModified` |

Implementato: componente `Schema` in `Base.astro` (Organization + WebSite sempre; BreadcrumbList se la pagina passa le briciole; `FAQPage` solo se nessuna risposta è un segnaposto).

---

## 5. GEO – farsi citare dai motori generativi

Cosa fa citare una fonte (pratiche consolidate, non garanzie):

1. **Fatti chiari, brevi, autonomi.** Un blocco che si capisce senza il resto della pagina ("Il corso per preposti dura 12 ore, con aggiornamento di 6 ore ogni 2 anni, ai sensi dell'ASR 17/04/2025"). Tabelle e liste per durate/aggiornamenti.
2. **Coerenza ovunque.** Stessi numeri nel sito, su Google Business Profile, nelle schede esterne. Un'incoerenza (oggi: ore di Preposti e Lavoratori errate) viene vista e penalizza la fiducia.
3. **Fonti primarie linkate** (norma, ASR, IMQ). I motori preferiscono chi cita la fonte.
4. **Freschezza dichiarata**: data di verifica visibile e `dateModified` nel markup.
5. **Entità ben definita**: chi è SSL, dove, che accreditamenti ha, chi sono le persone. Pagina Chi siamo ricca (team, titoli, accreditamenti con numeri verificabili) + `sameAs`.
6. **Menzioni esterne**: elenco ufficiale IMQ degli OdV, Regione Sardegna/INFEAS per i CEAS, associazioni di categoria, scuole/enti partner, Camera di Commercio. Contano più delle pagine del sito stesso.
7. **HTML statico, contenuto nel DOM**: Astro lo garantisce; FAQ con `<details>` restano leggibili anche chiuse; niente testo solo in immagini.
8. **Non bloccare i crawler AI.** `robots.txt` permette `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` (scelta modificabile). **Attenzione a Cloudflare**: l'opzione "Block AI bots / AI Labyrinth / managed robots.txt" può bloccarli per default. Va controllata nella dashboard prima del lancio.
9. **`llms.txt`**: file con elenco ragionato delle pagine chiave. Nessun grande motore ha confermato di usarlo; costo zero, lo includo come extra, non come pilastro.
10. **Contenuto che risponde alle domande reali** (le FAQ del vecchio sito sono un buon inizio): "il corso fatto in un'altra azienda è valido?", "cosa rischio se non aggiorno?", "quanto costa un DVR?" (anche solo come "da X a Y, dipende da…" se Davide vuole esporsi).

Cosa **non** fare: testo scritto per i bot, FAQ gonfiate, schema non corrispondente, pagine duplicate per città, recensioni finte, articoli IA non verificati su materia di legge (rischio reputazionale e di sicurezza).

---

## 6. SEO locale

- **Google Business Profile** per ogni sede: Siniscola (sede operativa da confermare), CEAS Dorgali–Cala Gonone, CEAS Omodeo–Sedilo. Categorie giuste (centro di formazione, consulente di sicurezza sul lavoro, centro di educazione ambientale), orari, foto, servizi, link UTM alle pagine giuste. **Serve decidere l'indirizzo della sede operativa** (3 versioni oggi).
- **NAP identico** (nome, indirizzo, telefono) su sito, GBP, Facebook, Instagram, directory.
- **Recensioni**: chiederle ai clienti soddisfatti dopo il corso (link diretto, risposta a tutte). Mai recensioni nel markup finché non sono reali e visibili.
- Directory utili: PagineGialle, elenco IMQ, Regione/INFEAS, camera di commercio, associazioni (Confartigianato, CNA, Confcommercio).
- Mappa: immagine statica + link a Maps (niente iframe, per privacy e velocità).

---

## 7. Tecnica

| Voce | Stato | Azione |
|---|---|---|
| Sitemap | `@astrojs/sitemap` attivo | Inviare a Search Console e Bing al lancio |
| robots.txt | da generare | Fatto: dinamico, `Disallow: /` finché `PUBLIC_INDEXABLE` non è `true` |
| `noindex` staging | attivo | Passa a indicizzabile impostando `PUBLIC_INDEXABLE=true` nelle variabili di build Cloudflare al lancio |
| Canonical, OG, Twitter | canonical e OG base presenti | Aggiungere immagine OG per pagina |
| Redirect 301 | non fatti | File `_redirects`/regole Cloudflare dalla mappa dell'handoff, test URL per URL |
| Core Web Vitals | buona base statica | Obiettivo Lighthouse ≥ 95 mobile; font Google caricato da fonts.googleapis (valutare self-host: più veloce e senza chiamata a terzi, anche per GDPR) |
| 404 | presente | Aggiungere link utili |
| Analytics | da attivare | Cloudflare Web Analytics (senza cookie) |
| Lingua | `lang="it"`, contenuti solo in italiano | Valutare in futuro EN per turisti CEAS |
| Immagini | da inserire | `astro:assets`, WebP/AVIF, max 200 KB |

---

## 8. Migrazione senza perdere ranking

1. **Prima del lancio**: ottenere accesso a Google Search Console del dominio e salvare le pagine con più clic/impressioni e le query. Servono a decidere cosa non rompere.
2. Mappare i 69 URL (handoff §8) → 301; le pagine eliminate (formazione professionale) verso `/formazione/` o 410 se non c'è equivalente.
3. Lasciare invariati dove possibile i titoli delle pagine che oggi portano traffico.
4. Dopo il lancio: inviare sitemap, controllare "Copertura/Indicizzazione", errori 404 e posizioni per 4–8 settimane.

---

## 9. Misurazione

- Search Console + Bing Webmaster (clic, impressioni, query, pagine).
- Cloudflare Web Analytics; in particolare **referrer da AI** (chatgpt.com, perplexity.ai, gemini, copilot, claude.ai).
- Test mensile manuale di ~20 domande reali ("corso muletto vicino a Siniscola", "patentino frigorista in Sardegna", "ogni quanto si aggiorna il corso preposti") su ChatGPT, Perplexity, Google AI Mode, annotando se SSL è citata e con quali dati (soprattutto se i dati citati sono giusti).
- Telefonate/richieste dal modulo con campo "come ci hai conosciuto".

---

## 10. Decisioni e input che servono

1. Accesso a **Google Search Console** (e se esiste, Google Analytics) del dominio attuale.
2. Esistenza e proprietà dei profili **Google Business** e social; link esatti per `sameAs`.
3. Indirizzo definitivo sede operativa; coordinate dei due CEAS.
4. Consenso a esporre **prezzi o fasce** (molto utile per ricerche "quanto costa…").
5. Chi firma/revisiona i contenuti normativi (nome, titolo) per i segnali di competenza.
6. Politica sui crawler AI: **consentirli tutti** (proposta) o solo alcuni.
7. Se vogliamo una sezione **Guide/Blog** (poche guide ben fatte su scadenze e obblighi) oppure solo pagine di servizio.
