# Struttura dei contenuti – nuovo sito SSL

Stato: **bozza di lavoro da validare con Davide**. Fonte: lettura integrale delle 69 pagine del sito attuale (sitemap WordPress) + `HANDOFF-sito-ssl.md` + prototipo Claude Design. Data: 2 ottobre 2026.

Legenda stato dato: **OK** = verificato (handoff, ASR 17/04/2025) · **VECCHIO** = preso dal sito attuale, non verificato · **??** = manca, serve da Davide.

---

## 1. Cosa c'è oggi sul sito (inventario)

| Area vecchio sito | Pagine | Destino |
|---|---|---|
| Home (4 aree di servizio, FAQ, "Su di noi", dove siamo) | 1 | Riscritta (già fatta, da completare) |
| Chi siamo (storia, accreditamenti, team, clienti/partner) | 1 | **Ricca di contenuto reale, da riportare** (vedi §3) |
| CEAS (testo generale + 2 sedi) | 1 | Tenuta, ampliata |
| Contatti | 1 | Tenuta |
| Consulenza: indice + Sicurezza lavoro + Sicurezza alimentare + **Sicurezza ambientale** + **Sistemi di gestione** | 5 | Vedi §4: due aree non previste dal handoff |
| Formazione: catalogo sicurezza (10 corsi) | 11 | Tenuta |
| Formazione: catalogo attrezzature (7 corsi) | 8 | Tenuta (c'è anche **Autopompe**, assente nella mappa del handoff) |
| Formazione HACCP (2 corsi: Addetto manipolazione, OSA) | 3 | Tenuta |
| Formazione ambiente / F-Gas | 2 | Diventa sezione F-Gas |
| Formazione professionale: disoccupati (10 qualifiche regionali) + autofinanziamento (3) | 16 | **Eliminata** (decisione presa). Finanziamento regionale oggi sospeso. |
| Area clienti / WooCommerce | 15 | Eliminata |
| Privacy, Cookie, Termini e condizioni, calendario, form Google | 5 | Privacy/Cookie da riscrivere; Termini da decidere |

Nota: il vecchio sito non ha meta description su nessuna pagina e non ha pagine dedicate per i corsi di maggior ricerca con contenuti sostanziali (ogni scheda è un solo paragrafo generico). I testi dei corsi sono prevalentemente generici ("Obiettivi generali…") e vanno riscritti, non copiati.

---

## 2. Cose trovate che cambiano le decisioni

1. **SSL è un Organismo di Valutazione (OdV) accreditato IMQ** per la certificazione F-Gas di imprese e persone (pagina Sicurezza ambientale). Il handoff parla di "esame con IMQ in sede": va chiarita la formula esatta (SSL è l'OdV che esamina? IMQ manda l'esaminatore?). Cambia titolo e promessa della pagina F-Gas. → **domanda 1**.
2. **Il sito attuale offre anche la certificazione F-Gas per le imprese** (documentazione, strumentazione, Piano della Qualità UNI EN ISO 10005). Il prototipo la cita solo come placeholder "Per le imprese": è un servizio vero e va sviluppato.
3. **Accreditamenti reali già dichiarati** (da confermare che siano ancora validi): UNI EN ISO 9001:2015 (DNV-GL, settore EA37) per progettazione ed erogazione di formazione professionale; accreditamento Regione Sardegna macroaree B e C; CEAS Dorgali accreditato SIQUAS e nella rete In.F.E.A.S.; OdV IMQ. Il prototipo ha solo placeholder.
4. **Anno di fondazione: 2008**, impresa familiare poi snc. "Da quasi 20 anni" regge a stento (18 anni nel 2026); la home attuale dice anche "esperienza decennale". → decidere la formula ("dal 2008" è più solido e verificabile).
5. **CEAS**: Dorgali Cala Gonone gestito dal 2021; Omodeo (Sedilo) istituito a giugno 2023. Metodologie dichiarate: critical learning, learning by doing, flipped learning, peer education, EAD. Contenuti utili per riempire le due schede.
6. **Team reale** con ruoli e biografie (Flavio Biselli, Veronica Biselli, Michela Bono, Davide Pau; Tony Ruiu senza testo) e sezione clienti/partner. Il prototipo ha solo "Team: facoltativo".
7. **Aree di servizio non previste dal handoff**: consulenza ambientale (perizie fonometriche e vibrometriche, tecnici competenti in acustica, gestione energetica), sistemi di gestione (ISO 9001/14001/…, audit interni, assistenza alla certificazione), gestione commesse, PSC, perizie di parte, cartellonistica HACCP e team HACCP. → **domanda 2**.
8. **Incoerenze indirizzo**: home vecchio = Z.I. comparto C lotto 24A; pagina contatti = Via Olbia 21 ("sede principale"); Cala Gonone appare con CAP 08020 e 08022. → domanda del handoff §10.2.
9. **Messaggio valoriale** (inclusione sociale per età, genere, etnia; istruzione di qualità; Agenda 2030): è presente sul vecchio sito, assente nel prototipo. → **domanda 3**.

---

## 3. Struttura proposta

```
/                                      Home
/formazione/                           Panoramica + scelta per bisogno ("sono un datore di lavoro / un lavoratore / un operatore di macchine / lavoro con alimenti")
  /formazione/sicurezza-sul-lavoro/    Indice categoria
     lavoratori*  preposti*  dirigenti  datore-di-lavoro-rspp  rspp-aspp  rls  antincendio*  primo-soccorso*
  /formazione/attrezzature/            Indice categoria
     carrelli-elevatori*  ple  gru  macchine-movimento-terra  autopompe  trattori  manutenzione-del-verde
  /formazione/rischi-specifici/        spazi-confinati  atex
  /formazione/haccp/                   addetto-manipolazione-alimenti*  operatore-settore-alimentare*
/f-gas/                                Hub F-Gas
  /f-gas/persone/                      Patentino frigorista (corso + esame)
  /f-gas/imprese/                      Certificazione impresa
  (FAQ e novità Reg. UE 2024/573 nell'hub)
/consulenza/
  /consulenza/sicurezza-sul-lavoro/    DVR*, DUVRI, POS, PSC, piani di emergenza, perizie (sezioni nella pagina)
  /consulenza/sicurezza-alimentare/    Manuale HACCP*, team HACCP, cartellonistica, audit
  /consulenza/ambiente-e-acustica/     [DA DECIDERE] perizie fonometriche/vibrometriche, gestione energetica
  /consulenza/sistemi-di-gestione/     [DA DECIDERE] ISO, audit, gestione commesse
/ceas/                                 Hub + /ceas/dorgali-cala-gonone/ + /ceas/omodeo-sedilo/
/chi-siamo/                            Storia (2008), accreditamenti, team, valori, clienti/partner
/contatti/   /privacy/   /cookie/      (+ /termini/ se serve)
```
`*` = pagina dedicata (alta ricerca Google). Le altre sono sezioni nella pagina di categoria, come da handoff §4. Differenza dal handoff: aggiunto **autopompe**, **F-Gas diviso persone/imprese**, **CEAS con una pagina per sede**, e due rami di consulenza da confermare.

**Percorsi di ingresso** (la home deve far arrivare in 2 click al contenuto giusto): datore di lavoro/titolare → "cosa mi serve per essere in regola" (formazione + DVR); lavoratore/operatore → corso per mansione/macchina; tecnico frigorista → F-Gas; ristorazione/alimentare → HACCP; scuola/ente → CEAS.

---

## 4. Template di pagina

**Scheda corso** (campi della collezione `corsi`): titolo, sottotitolo, destinatari, riferimento normativo, durata, aggiornamento, modalità, attestato, prerequisiti, programma sintetico (moduli), verifica finale, FAQ, corsi collegati, `ultimaVerificaNormativa`. Dal vecchio sito si recupera poco oltre ai dati di durata: obiettivi e programma vanno riscritti.

**Scheda consulenza**: chi è obbligato, quando va aggiornato, cosa facciamo (step), documenti consegnati, tempi, servizi collegati, FAQ, CTA sopralluogo.

**Scheda CEAS (per sede)**: indirizzo e come arrivare, attività per target (scuole per fascia d'età / famiglie / enti), metodologie, calendario o proposte, contatto, foto.

Ogni pagina: breadcrumb, CTA preventivo, meta description unica, JSON-LD adatto (Course, FAQPage, BreadcrumbList, LocalBusiness).

---

## 5. Catalogo corsi e stato dei dati

Tutti i dati "VECCHIO" vanno verificati sull'ASR 17/04/2025 e sulle norme citate prima di pubblicare (regola del `CLAUDE.md`).

| Corso | Dati sito attuale | Stato / problema |
|---|---|---|
| Lavoratori | 4h gen. + spec. 4/6/8h; agg. 5 anni | **Errato**. OK: 4h + 4/8/12h; agg. 6h/5 anni |
| Preposti | min. 8h; agg. 6h/5 anni | **Superato**. OK: 12h; agg. 6h ogni 2 anni; no e-learning |
| Dirigenti | 16h; agg. 6h/5 anni | Handoff: 12h, agg. 6h/5 anni → **discrepanza sulle ore** |
| Datore di lavoro RSPP | 16/32/48h; agg. 6/10/14h | **Da verificare**: ASR 2025 introduce nuovo obbligo formativo per il DL |
| RSPP/ASPP | Mod. A 28h, B 48h, SP1-4, C 24h; agg. ASPP 20h, RSPP 40h/5 anni | Da verificare |
| RLS | 32h; agg. 4h (≤50) / 8h (>50) | Da verificare |
| Antincendio | liv.1: 2h+1h; liv.2: 5h+3h; liv.3: 12h+4h; agg. 5 anni; DM 02/09/2021 | **Sospetto** (liv.1 e liv.2 non tornano con il DM): verificare |
| Primo soccorso | A 16h, B/C 12h; agg. 3 anni; DM 388/03 | Da verificare |
| Spazi confinati | 16–32h generico | Da verificare (DPR 177/2011) |
| ATEX | 8–16h generico | Da verificare |
| Carrelli elevatori | 12h; agg. 4h/5 anni | Da verificare (ASR 2012) |
| PLE | 10h; agg. 4h/5 anni | Da verificare (ASR 2012) |
| MMT | 10h; agg. 4h/5 anni | Da verificare (ASR 2012) |
| Gru | 12h su autocarro, 12–14h a torre, 14h mobili; agg. 4h | Da verificare |
| Autopompe | 16h; agg. 4h | Da verificare |
| Trattori | 8h; agg. 4h | Da verificare |
| Manutenzione del verde | 8h; agg. 4h | Da verificare |
| HACCP – Addetto manipolazione | 4h; agg. "ogni 2–3 anni" | Vago: verificare norma regionale Sardegna |
| HACCP – OSA | durata non indicata | **Manca** |
| F-Gas persone | corso ≥4h; iter: iscrizione registro, richiesta, esame entro 8 mesi, rinnovo 10 anni | Da verificare con Reg. UE 2024/573 e DPR 146/2018 |

Il vecchio sito ripete ovunque "attestato di partecipazione valido ai fini di legge": da distinguere tra *attestato di frequenza*, *abilitazione* e *certificato* (F-Gas) a seconda del corso.

---

## 6. Lacune di contenuto (cosa manca e va chiesto)

- Numeri reali per la home: lavoratori formati, aziende clienti, certificati F-Gas rilasciati (oggi nessuno).
- Programma/moduli dei corsi principali; sedi e modalità reali (aula, videoconferenza, in azienda); prezzi o "su preventivo".
- Prossime sessioni d'esame F-Gas e contatti IMQ.
- Risposte alle FAQ: il vecchio sito ne ha 5 con risposte utilizzabili come base (formazione obbligatoria, RSPP, aggiornamento DVR, autocontrollo alimentare, patentino frigorista), da riverificare.
- Foto reali; logo SVG; elenco clienti/partner con permesso d'uso dei loghi.
- Testi privacy/cookie reali (oggi segnaposto) e decisione sui "Termini e condizioni".

---

## 7. Domande per Davide (in ordine di impatto)

1. **F-Gas / IMQ**: SSL è l'OdV accreditato IMQ (come dice il sito attuale) o l'esame lo gestisce IMQ in sede? Si può usare il logo IMQ? Vale anche la certificazione impresa?
2. **Ambiente/acustica e Sistemi di gestione/commesse**: li teniamo come rami di consulenza (come oggi) o li togliamo dal sito nuovo?
3. **Inclusione sociale e Agenda 2030**: restano come valori in Chi siamo / CEAS?
4. **Accreditamenti** (ISO 9001 DNV-GL, Regione Sardegna, SIQUAS, OdV IMQ): sono ancora validi? Posso citarli con i numeri/loghi?
5. **Formula storica**: "dal 2008" al posto di "quasi 20 anni"?
6. **Team**: in Chi siamo con foto e ruoli? Chi è Tony Ruiu (senza testo)? Si possono pubblicare nomi e titoli?
7. **Sede operativa** e **WhatsApp** (domande già aperte nel handoff).
8. **Priorità**: scrivo prima le 7 pagine dedicate (lavoratori, preposti, antincendio, primo soccorso, carrelli, HACCP, F-Gas) oppure l'intero catalogo?
