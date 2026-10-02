# Roadmap – costruzione del sito SSL

Aggiornata il 2 ottobre 2026. Si procede **per fasi**: ogni fase ha un risultato verificabile e una "definizione di fatto". Ogni fase si chiude con un push su `main` (= deploy automatico su `sito-ssl.davidepau99.workers.dev`) e una revisione di Davide. Il sito resta `noindex` fino alla Fase 7.

Legenda: ✅ fatto · 🔶 in corso/parziale · ⬜ da fare · 👤 serve Davide · 🤖 lo faccio io

---

## Cosa sappiamo dalla scheda Google Maps (letta il 2 ottobre 2026)

- **Nome**: SSL Servizi Sicurezza Lavoro · **4,6/5 con 15 recensioni** · Facebook ~2,7K follower · Instagram ~1,4K · LinkedIn ~140.
- **Indirizzo su Maps**: Zona Industriale, Comparto C, lotto 24A, 08029 Siniscola. Lo stesso compare su Ufficio Camerale, FatturatoItalia, Kompass e sulla home vecchia. L'unica voce diversa è la pagina Contatti vecchia ("Via Olbia 21"): **tutto indica Z.I. comparto C lotto 24A come sede operativa** (da confermare).
- **Telefono su Maps: 320 407 0573** (cellulare), diverso dal sito (0784 1949743). Probabile numero WhatsApp? 👤
- **Orari su Maps**: "chiude alle 18" → il sito dice 9–13 / 15–19. Da allineare. 👤
- **Categoria Maps**: "Sicurezza e salute sul lavoro in Italia" (generica). Da cambiare in "Centro di formazione" / "Consulente per la sicurezza".
- **Descrizione Maps** (scritta da SSL): "agenzia di riferimento in **Baronia** per la formazione aziendale… da Siniscola fino a Olbia, Orosei, Nuoro e comuni limitrofi". È già il posizionamento locale giusto: va riportato nel sito.
- **Ragione sociale ufficiale**: SSL Servizi Sicurezza Lavoro snc di Biselli Flavio e Veronica · REA 91555 · ATECO 85.59.2 · P.IVA 01313770917. Fondata **giugno 2008** (LinkedIn).
- **Presenza esterna già esistente**: scheda INAPP sugli enti accreditati, Ufficio Camerale, Kompass, FatturatoItalia, LinkedIn. Sono menzioni utili per i motori generativi: i dati lì devono coincidere con il sito.
- Il sito vecchio compare ancora con titolo "Formazione e Consulenza" e senza meta description.
- Nessun dato di Search Console dal vecchio sito: **si parte da zero, senza vincoli di ranking da preservare**. La migrazione è quindi più libera: servono comunque i redirect, ma non c'è "traffico storico" da proteggere.

---

## Fase 0 – Fondamenta ✅

- ✅ Progetto Astro statico, design system dal prototipo Claude Design, 12 pagine.
- ✅ Repo GitHub `davidepau-code/Sito-SSL`, deploy automatico Cloudflare (workers.dev).
- ✅ `CLAUDE.md`, guida colleghi, inventario contenuti, strategia SEO/GEO.
- ✅ Dati strutturati, `robots.txt` (crawler AI consentiti, scelta di Davide), `llms.txt`, interruttore `PUBLIC_INDEXABLE`.

## Fase 1 – Decisioni e dati che sbloccano tutto 👤

**Obiettivo**: chiudere le domande aperte prima di scrivere contenuti definitivi. Si può procedere in parallelo con la Fase 2.

Bloccanti per i testi:
- ⬜ **F-Gas/IMQ**: SSL è l'OdV accreditato IMQ (come dice il sito vecchio) o l'esame lo gestisce IMQ? Uso del logo? Certificazione imprese sì/no? Date delle prossime sessioni.
- ⬜ **Rami extra di consulenza**: ambiente/acustica e sistemi di gestione/commesse restano o no.
- ⬜ **Sede operativa**: conferma Z.I. comparto C lotto 24A (e uscita di "Via Olbia 21").
- ⬜ **Telefono/WhatsApp**: 320 407 0573 è il WhatsApp? Orari reali.
- ⬜ **Accreditamenti** (ISO 9001 DNV-GL, Regione Sardegna macroaree B e C, SIQUAS, INAPP, OdV IMQ): validi oggi? numeri/loghi.
- ⬜ **Team**: pubblicare i quattro profili? Foto? Chi è Tony Ruiu?
- ⬜ **Tono**: "tu" o "voi"? Formula storica "dal 2008".
- ⬜ **Prezzi**: mostrarli (o fasce) o solo "su preventivo".
- ⬜ **Email di destinazione** dei moduli e sede delle richieste.

Materiali:
- ⬜ Logo SVG e codici colore esatti del brand.
- ⬜ Foto reali (aula, pratica su macchine, sedi, CEAS, team, impianti F-Gas) con liberatoria per le persone.
- ⬜ Link esatti: Facebook, Instagram, LinkedIn, Google Business Profile, scheda IMQ/INAPP.
- ⬜ Elenco clienti/partner con permesso d'uso dei loghi.

**Fatto quando**: tutte le voci "Bloccanti per i testi" hanno una risposta scritta.

## Fase 2 – Sistema di contenuti e pagina pilota 🤖

**Obiettivo**: avere i "mattoni" riusabili e una pagina completa fatta bene, prima di moltiplicarla per 25.

- ⬜ Estendere lo schema `corsi`: prerequisiti, programma a moduli, verifica finale, corsi correlati, revisore e data di verifica, fonti normative (link), flag modalità (aula/online/in azienda).
- ⬜ Nuove collezioni: `consulenze`, `ceas`, `faq`, `team`, `accreditamenti`, `sessioni` (esami F-Gas, vuota finché non ci sono date reali).
- ⬜ Componenti: scheda "In sintesi" dai dati, tabella dati normativi con fonte, blocco "Verificato il… da…", corsi correlati, breadcrumb visibile, risposta-lampo in testa alla pagina.
- ⬜ JSON-LD `Course` per i corsi, `Service` per le consulenze, `Place` per i CEAS, `Event` per le sessioni (solo con date reali), `Person` per il team.
- ⬜ **Pagina pilota completa: Corso Lavoratori**, con dati ASR 2025 verificati, programma, FAQ vere, link a fonti. Revisione di Davide e di chi firma la parte normativa.
- ⬜ Procedura di verifica normativa per ogni corso (vedi sotto, "Processo corsi").

**Fatto quando**: la pagina pilota è approvata e la stessa struttura si può replicare cambiando solo il file `.md`.

### Processo corsi (ripetuto per ogni corso)
1. 🤖 Cerco la fonte ufficiale (ASR 17/04/2025, norma, circolare) e compilo i dati con il link alla fonte.
2. 🤖 Scrivo il testo (risposta-lampo, a chi serve, durata, aggiornamento, come si svolge, cosa si riceve, FAQ).
3. 👤 Revisione normativa da un RSPP abilitato del team (Flavio o Veronica Biselli): **nessuna pagina esce senza questo passaggio**.
4. 🤖 Pubblico, aggiorno `ultimaVerificaNormativa`.

## Fase 3 – Le 7 pagine che portano più richieste 🤖👤

Ordine consigliato (dalla più cercata e meno ambigua):
1. ⬜ Lavoratori (è la pilota, Fase 2)
2. ⬜ Preposti
3. ⬜ Antincendio
4. ⬜ Primo soccorso
5. ⬜ Carrelli elevatori
6. ⬜ HACCP – addetto alla manipolazione degli alimenti
7. ⬜ **F-Gas** (hub + persone + imprese): dipende dalla risposta IMQ della Fase 1

Più: ⬜ riscrittura **Home** con i contenuti reali (numeri, accreditamenti, recensioni Google *solo se mostrate come testo reale con data, mai nel markup finché non sono verificabili*), ⬜ **Chi siamo** (storia 2008, accreditamenti, team).

**Fatto quando**: le 7 pagine sono online, verificate e linkate dalla home e dagli hub.

## Fase 4 – Resto del catalogo 🤖👤

- ⬜ Formazione sicurezza: Dirigenti, Datore di lavoro (RSPP), RSPP/ASPP, RLS.
- ⬜ Formazione attrezzature: PLE, Gru, Macchine movimento terra, Autopompe, Trattori, Manutenzione del verde.
- ⬜ Rischi specifici: Spazi confinati, ATEX.
- ⬜ HACCP: Operatore settore alimentare.
- ⬜ Consulenza: Sicurezza sul lavoro (DVR, DUVRI, POS, PSC, emergenze, perizie), Sicurezza alimentare (manuale HACCP, team HACCP, cartellonistica); più i rami extra se confermati.
- ⬜ CEAS: hub + Dorgali–Cala Gonone + Omodeo–Sedilo.
- ⬜ Hub `/formazione/` con ingressi per bisogno ("sono datore di lavoro", "uso macchine", "lavoro con alimenti").

**Fatto quando**: ogni voce della mappa del sito ha una pagina vera, nessun segnaposto `[...]` residuo.

## Fase 5 – Funzioni e contenuti tecnici 🤖👤

- ⬜ **Modulo contatti** reale: funzione Cloudflare che invia l'email, Cloudflare Turnstile, consenso privacy. 👤 email di destinazione.
- ⬜ Pulsante **WhatsApp** (barra mobile + pagine) con il numero confermato.
- ⬜ **Cloudflare Web Analytics** (senza cookie).
- ⬜ Foto reali ottimizzate (`astro:assets`, max 200 KB), immagine Open Graph per pagina.
- ⬜ **Privacy e Cookie** reali (👤 testi legali; non li invento).
- ⬜ Font Manrope **self-hosted** (più veloce, nessuna chiamata a Google, meglio per GDPR).
- ⬜ Mappa statica + link a Maps nelle pagine sedi.
- ⬜ Pagina 404 con percorsi utili.

**Fatto quando**: un modulo di prova arriva alla casella giusta; Lighthouse ≥ 95 mobile.

## Fase 6 – Pre-lancio: qualità, SEO, locale 🤖👤

- ⬜ **Mappa redirect 301** dai 69 URL vecchi (handoff §8), con test URL per URL. Le pagine eliminate (formazione professionale, area clienti) vanno alla pagina più vicina.
- ⬜ Controlli: link rotti, accessibilità (contrasto sul vetro, tastiera), validazione dati strutturati, meta description su ogni pagina, canonical.
- ⬜ **Cloudflare**: verificare che "Block AI bots"/managed robots.txt NON blocchi i crawler (scelta: consentirli tutti).
- ⬜ **Google Business Profile**: collegare il nuovo sito, correggere categoria, orari, telefono, aggiungere servizi e foto, creare i profili dei due CEAS se mancano. 👤 (accesso proprietario)
- ⬜ **Allineare i dati esterni** (NAP identico): INAPP, Ufficio Camerale/registri dove modificabili, Facebook, Instagram, LinkedIn, Kompass.
- ⬜ Aggiornare `sameAs` nello schema con i link ufficiali.
- ⬜ Test mobile reale (iPhone e Android) e test del modulo.
- ⬜ Revisione finale di Davide su tutte le pagine.

**Fatto quando**: checklist di `CLAUDE.md` superata su ogni pagina e nessun segnaposto residuo.

## Fase 7 – Lancio 👤🤖

Seguire handoff §8, con calma e un backup dei record DNS:
1. ⬜ Esportare TUTTI i record DNS da Aruba (MX, SPF, DKIM, DMARC, autodiscover, PEC).
2. ⬜ Aggiungere il dominio a Cloudflare e **verificare che i record coincidano al 100%** (la posta è la cosa che non deve mai fermarsi).
3. ⬜ Cambiare i nameserver su Aruba; il dominio resta registrato lì.
4. ⬜ Collegare `servizisicurezzalavoro.it` e `www` al Worker; redirect www ↔ apex.
5. ⬜ Impostare **`PUBLIC_INDEXABLE=true`** nelle variabili di build Cloudflare e ridistribuire.
6. ⬜ Testare invio/ricezione email, sito, redirect, modulo.
7. ⬜ Registrare il dominio in **Google Search Console** e **Bing Webmaster**; inviare `sitemap-index.xml`.
8. ⬜ Disattivare l'URL `workers.dev` come sito pubblico.

**Fatto quando**: il dominio serve il sito nuovo, le email funzionano, la sitemap è accettata.

## Fase 8 – Dopo il lancio (30 / 60 / 90 giorni)

- ⬜ Settimana 1: controllare errori 404/indicizzazione in Search Console, modulo, posta.
- ⬜ 30 giorni: primo controllo posizioni e query; prime 20 domande di test su ChatGPT/Perplexity/Google AI.
- ⬜ **Campagna recensioni** (15 oggi, 4,6): link diretto dopo ogni corso; rispondere a tutte.
- ⬜ 60 giorni: aggiungere le prime **guide** (se approvate): scadenze corsi, obblighi per tipo di azienda, "cosa fare se…".
- ⬜ 90 giorni: ottimizzare le pagine che ricevono impressioni ma pochi clic (titoli, descrizioni, FAQ).
- ⬜ **Disdetta/downgrade del piano Aruba** a scadenza del contratto (solo dominio + email).
- ⬜ Revisione normativa programmata: ogni 6 mesi e a ogni nuovo accordo/decreto.

---

## Prossimo passo concreto

1. 👤 Davide risponde alle voci "Bloccanti per i testi" della Fase 1 (bastano risposte brevi).
2. 🤖 Intanto parto dalla **Fase 2** (schema e componenti) e dalla pagina pilota Lavoratori, che non dipende dalle risposte IMQ.
