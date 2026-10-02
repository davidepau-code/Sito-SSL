# Brief per Claude Design – Nuovo sito Servizi Sicurezza Lavoro

> Documento da caricare in Claude Design. Contiene: (1) il prompt di stile, (2) la struttura del sito, (3) i contenuti placeholder delle pagine principali.
> I testi tra [parentesi quadre] sono da completare/verificare prima della pubblicazione.

---

## 1. PROMPT PER CLAUDE DESIGN

Copia e incolla questo blocco come prima richiesta:

```
Progetta una prima bozza di stile per il nuovo sito di Servizi Sicurezza Lavoro (SSL),
agenzia di formazione e consulenza per la sicurezza sul lavoro con sede a Siniscola (NU),
Sardegna. Attiva da quasi 20 anni.

CHI SIAMO E A CHI PARLIAMO
- Pubblico principale: titolari e responsabili di piccole e medie imprese sarde
  (edilizia, ristorazione, turismo, agricoltura, industria) che devono mettersi in regola
  con il D.Lgs. 81/08, l'HACCP e gli adempimenti ambientali.
- Pubblico tecnico: frigoristi, termoidraulici, installatori di clima e pompe di calore
  che devono ottenere la certificazione F-Gas (corso + esame con IMQ in sede).
- Pubblico secondario: scuole, enti e visitatori dei due CEAS
  (Centri di Educazione all'Ambiente e alla Sostenibilità) che gestiamo, aperti tutto l'anno.

OBIETTIVO DEL SITO
Spiegare in modo chiaro cosa facciamo (Formazione, F-Gas, Consulenza, CEAS) e portare
l'utente a contattarci: "Richiedi preventivo", telefono, WhatsApp.

STILE – "Liquid glass" professionale
- Direzione: un'interpretazione del linguaggio "liquid glass" / glassmorphism
  contemporaneo, ispirata ad Apple ma NON una copia: superfici di vetro traslucido,
  profondità, morbidezza e fluidità, applicate a un brand serio di sicurezza sul lavoro.
  Moderno e fresco, mai giocattoloso, mai "vecchio".
- Niente illustrazioni cartoon, icone 3D colorate, gradienti arcobaleno, mongolfiere
  o stock generiche.
- Sensazione: affidabile, competente, concreto, contemporaneo.

- Vetro (materiale principale):
  · Header/navbar fluttuante in vetro (sfondo semitrasparente + backdrop-filter blur
    ~20-30px + leggera saturazione), staccato dai bordi con margine, a forma di pillola.
  · Card di servizi, box "In sintesi", FAQ e modulo contatto come pannelli di vetro:
    riempimento bianco/antracite al 55-75% di opacità, bordo sottile 1px chiaro
    semitrasparente, riflesso/highlight morbido sul bordo superiore, ombra ampia e diffusa.
  · Il vetro deve stare sopra qualcosa che dia profondità: sfondi con grandi forme
    sfumate (blob/mesh gradient lenti) nei colori SSL, oppure foto reali sfocate.
  · Il testo sopra al vetro deve restare perfettamente leggibile: aumentare l'opacità
    del pannello dove serve, mai testo sottile su vetro molto trasparente.

- Palette (colori SSL):
  · Arancio SSL come colore protagonista dell'accento (CTA, evidenze, gradienti di
    sfondo) – riprende il brand attuale, declinato anche in tonalità più calde/ambra
    per i blob di sfondo.
  · Antracite / grigio scuro SSL per testi, sezioni scure e versioni "vetro scuro".
  · Bianco e grigi caldi come base.
  · Verde naturale come accento secondario SOLO nella sezione CEAS.

- Border radius generosi e coerenti:
  · Pulsanti e navbar: a pillola (radius pieno).
  · Card e pannelli: 24-32px.
  · Immagini: 20-28px. Input del modulo: 14-16px.
  · Usa una scala unica di raggi in tutto il sito.

- Tipografia: sans-serif moderno e molto leggibile (es. Inter, Manrope, SF-like),
  titoli grandi e decisi con interlinea stretta, testo corrente 17-18px.

- Animazioni fluide (parte essenziale del look):
  · Transizioni morbide con easing tipo spring / ease-out, 250-500ms.
  · Hover sulle card: leggero sollevamento, highlight del vetro che segue il cursore,
    ombra che si espande.
  · Pulsanti con micro-interazioni (pressione, cambio di luminosità del vetro).
  · Navbar che si compatta e aumenta il blur allo scroll.
  · Blob di sfondo che si muovono lentissimi.
  · Comparsa delle sezioni allo scroll delicata (fade + leggero slide), MA il contenuto
    deve essere visibile anche se l'animazione non parte: mai sezioni vuote/bianche.
  · Accordion FAQ con apertura fluida dell'altezza.
  · Rispettare prefers-reduced-motion (animazioni ridotte/spente).

- Layout: griglia pulita, molto respiro, sezioni ben separate.
- Immagini: fotografie reali (aula, cantiere, attrezzature, cucina professionale,
  impianti di refrigerazione, natura della Sardegna per i CEAS), con angoli arrotondati.
  Usa placeholder fotografici neutri con didascalia di cosa andrà nella foto.
- Icone: lineari, tratto uniforme e arrotondato, monocromatiche.
- Accessibilità e prestazioni: contrasto WCAG AA anche sopra il vetro, pulsanti grandi,
  fallback senza blur per i browser che non supportano backdrop-filter, blur usato con
  moderazione su mobile per non rallentare.
- Mobile first: molti utenti arrivano da smartphone (cantiere, cucina, furgone).
  Barra fissa in basso su mobile con "Chiama" e "WhatsApp".

PAGINE DA PROGETTARE PER PRIME
1. Home
2. Scheda corso (esempio: Formazione Lavoratori) – sarà il template per tutti i corsi
3. Pagina F-Gas
Poi, se possibile: Consulenza (esempio DVR) e CEAS.

COMPONENTI RICORRENTI
- Header con logo, menu (Formazione, F-Gas, Consulenza, CEAS, Chi siamo, Contatti)
  e pulsante "Richiedi preventivo" sempre visibile.
- Box "In sintesi" nelle schede corso: durata, aggiornamento, modalità, attestato.
- Blocco "Come funziona" in 3 step numerati.
- FAQ ad accordion.
- Fascia CTA finale: "Hai dubbi su cosa serve alla tua azienda? Te lo diciamo noi."
- Modulo contatto breve (nome, azienda, telefono, email, corso/servizio, messaggio).
- Footer con sede, contatti, P.IVA, link privacy/cookie.

Usa i contenuti del documento allegato come testi placeholder.
```

---

## 2. STRUTTURA DEL SITO

```
Home
├── Formazione
│   ├── Sicurezza sul lavoro (Lavoratori, Preposti, Dirigenti, Datore di lavoro, RLS,
│   │                         Antincendio, Primo soccorso)
│   ├── Attrezzature (Carrelli elevatori, PLE, Gru, MMT, Trattori, Manutenzione del verde)
│   ├── Rischi specifici (Spazi confinati, ATEX)
│   └── Alimentare (HACCP / OSA)
├── F-Gas
│   ├── Corso ed esame IMQ (persone)
│   ├── Supporto alle imprese
│   └── FAQ F-Gas
├── Consulenza
│   ├── Sicurezza sul lavoro (DVR, DUVRI, POS, valutazioni rischi, piani di emergenza)
│   └── Sicurezza alimentare (Manuale HACCP, autocontrollo, audit)
├── CEAS – Educazione ambientale
│   ├── CEAS Dorgali – Cala Gonone
│   └── CEAS Omodeo – Sedilo
├── Chi siamo
└── Contatti / Richiedi preventivo
```

---

## 3. CONTENUTI PLACEHOLDER

### 3.1 HOME

**Hero**
- Titolo: **Sicurezza sul lavoro, senza complicazioni.**
- Sottotitolo: Formazione, consulenza e certificazione F-Gas per le aziende della Sardegna. Ti diciamo cosa serve, lo facciamo noi, ti mettiamo in regola.
- CTA primaria: **Richiedi un preventivo**
- CTA secondaria: **Chiama 0784 1949743**
- Riga di fiducia: Da quasi 20 anni al fianco delle imprese · Sede a Siniscola (NU) · [Accreditamenti / riconoscimenti]

**Cosa facciamo** (4 card)
1. **Formazione** – Corsi obbligatori D.Lgs. 81/08 per lavoratori, preposti, dirigenti e datori di lavoro. Attrezzature, antincendio, primo soccorso, HACCP. → Vedi i corsi
2. **Certificazione F-Gas** – Corso di preparazione ed esame con IMQ nella nostra sede. Un solo interlocutore, dal corso al certificato. → Scopri come funziona
3. **Consulenza** – DVR, DUVRI, POS, manuale HACCP. Redigiamo i documenti e li teniamo aggiornati. → Scopri i servizi
4. **CEAS** – Gestiamo due Centri di Educazione Ambientale, aperti tutto l'anno a scuole, enti e visitatori. → Visita i CEAS

**Perché sceglierci**
- **Chiarezza** – Ti spieghiamo cosa prevede la legge per la tua attività, senza giri di parole.
- **Tutto in un posto** – Formazione, documenti e scadenze gestiti da un unico referente.
- **Sempre aggiornati** – Corsi conformi all'Accordo Stato-Regioni del 17 aprile 2025.
- **Vicini a te** – Aule a Siniscola, corsi in azienda e in videoconferenza dove previsto.

**Numeri** (placeholder – usare solo dati reali)
- [XX] anni di attività · [X.XXX] lavoratori formati · [XXX] aziende clienti · [XX] certificati F-Gas rilasciati

**Fascia CEAS**
- Titolo: **Non solo sicurezza.**
- Testo: Gestiamo il CEAS Dorgali – Cala Gonone e il CEAS Omodeo a Sedilo: due centri di educazione ambientale aperti tutto l'anno, dove scuole, famiglie e visitatori scoprono il territorio della Sardegna.
- CTA: Scopri i CEAS

**FAQ** (anteprima, 4 domande)
- La formazione dei lavoratori è sempre obbligatoria?
- Ogni quanto va aggiornato il corso per preposti?
- Quando devo aggiornare il DVR?
- Sono un termoidraulico: mi serve il patentino F-Gas per installare un climatizzatore?

**CTA finale**
- **Non sai da dove iniziare? Te lo diciamo noi.** Raccontaci la tua attività: in 24 ore ti diciamo quali corsi e documenti ti servono. → Richiedi una consulenza gratuita

---

### 3.2 SCHEDA CORSO – Formazione Lavoratori (template)

- Breadcrumb: Formazione › Sicurezza sul lavoro › Lavoratori
- Titolo (H1): **Corso di formazione per lavoratori (generale + specifica)**
- Sottotitolo: Obbligatorio per ogni lavoratore, in qualsiasi azienda. Conforme al D.Lgs. 81/08 e all'Accordo Stato-Regioni 2025.

**Box "In sintesi"**
| | |
|---|---|
| Durata | 4 h generale + 4 / 8 / 12 h specifica (rischio basso / medio / alto) |
| Aggiornamento | 6 h ogni 5 anni |
| Modalità | Generale: aula, videoconferenza o e-learning · Specifica: [aula / videoconferenza] |
| Attestato | Rilasciato dopo verifica finale, valido su tutto il territorio nazionale |
| Sede | Siniscola (NU) o presso la tua azienda |

**A chi è rivolto** – A tutti i lavoratori, inclusi tirocinanti e stagionali. La formazione va completata [entro 60 giorni dall'assunzione – verificare].

**Cosa si impara** – Concetti di rischio, danno e prevenzione; diritti e doveri; organizzazione della prevenzione in azienda; rischi specifici del settore.

**Come funziona** (3 step)
1. Ci dici quanti lavoratori e in che settore operi
2. Concordiamo date e sede (anche in azienda)
3. Ricevi gli attestati e il promemoria per l'aggiornamento

**FAQ** – Il corso fatto in un'altra azienda è valido? · Si può fare online? · Cosa succede se non aggiorno?

**CTA** – Iscrivi i tuoi lavoratori · Richiedi info

---

### 3.3 F-GAS

- Titolo (H1): **Certificazione F-Gas: corso ed esame IMQ in un'unica sede**
- Sottotitolo: Per frigoristi, termoidraulici e installatori di climatizzatori e pompe di calore. Ti prepariamo, sostieni l'esame con IMQ da noi, ricevi il certificato.

**Chi deve certificarsi** – Chi installa, manutiene, ripara o smantella apparecchiature di refrigerazione, condizionamento e pompe di calore contenenti gas fluorurati. [Indicare categorie]

**Come funziona**
1. **Corso di preparazione** – [durata] ore di teoria e pratica su impianti reali
2. **Esame IMQ** – Prova teorica e pratica nella nostra sede, con esaminatore IMQ
3. **Certificato** – Rilasciato da IMQ, organismo di certificazione accreditato

**Prossime sessioni d'esame** – [data] · [data] · [data] → Prenota il posto

**Novità Regolamento UE 2024/573** – [Box sintetico: cosa cambia per i tecnici e le imprese]

**Per le imprese** – [Supporto certificazione impresa, Banca Dati F-Gas, registro apparecchiature – da confermare]

**FAQ F-Gas** – Quanto dura il certificato? · Che differenza c'è tra certificato persona e impresa? · Posso installare un climatizzatore senza patentino? · Cosa succede se il mio certificato scade?

**CTA** – Prenota corso ed esame · Chiama · WhatsApp

> Nota: uso di nome e logo IMQ da verificare con l'accordo in essere.

---

### 3.4 CONSULENZA – DVR (template)

- Titolo (H1): **Documento di Valutazione dei Rischi (DVR)**
- Sottotitolo: Obbligatorio per ogni azienda con almeno un lavoratore. Lo redigiamo con te, sopralluogo compreso, e lo teniamo aggiornato.

**Chi è obbligato** – Ogni datore di lavoro con almeno un dipendente o collaboratore equiparato.

**Cosa facciamo** – Sopralluogo in azienda · Valutazione di tutti i rischi · Redazione del documento · Programma delle misure · Aggiornamento quando cambia qualcosa

**Quando va aggiornato** – Modifiche all'organizzazione, nuove attrezzature, infortuni significativi, nuove normative.

**Servizi collegati** – DUVRI · POS · Piano di emergenza · Valutazione rumore e vibrazioni · Valutazione stress lavoro-correlato

**CTA** – Richiedi un sopralluogo

---

### 3.5 CEAS – Educazione ambientale

- Titolo (H1): **CEAS – Centri di Educazione all'Ambiente e alla Sostenibilità**
- Sottotitolo: Due centri aperti tutto l'anno per scoprire, capire e proteggere il territorio della Sardegna.

**CEAS Dorgali – Cala Gonone**
Viale Bue Marino 1 – 08022 Cala Gonone (NU)
[Breve descrizione: attività, laboratori, escursioni, punti di interesse]

**CEAS Omodeo – Sedilo**
Museo del Territorio – SP26 – 09076 Sedilo (OR)
[Breve descrizione: attività, laboratori, museo, lago Omodeo]

**Per chi**
- **Scuole** – Laboratori e uscite didattiche [per fascia d'età]
- **Enti e comuni** – Progetti di educazione ambientale [da definire]
- **Visitatori e famiglie** – [Visite, eventi, attività]

**CTA** – Prenota una visita · Contatta il CEAS

---

### 3.6 CHI SIAMO

- Titolo (H1): **Da quasi 20 anni al fianco delle imprese sarde**
- Testo: Servizi Sicurezza Lavoro nasce a Siniscola nel [anno] con un obiettivo semplice: rendere la sicurezza sul lavoro chiara e gestibile per le aziende del territorio. Oggi ci occupiamo di formazione, consulenza, certificazione F-Gas e gestiamo due Centri di Educazione Ambientale.
- Valori: Qualità · Affidabilità · Rispetto · Attenzione al territorio
- Team: [foto e ruoli – facoltativo]
- Accreditamenti e partner: [IMQ – previa autorizzazione] · [Accreditamento Regione Sardegna, se presente] · [altri]

---

### 3.7 CONTATTI

- Titolo (H1): **Contattaci**
- Sottotitolo: Rispondiamo entro [24 ore lavorative].
- Sede: [Indirizzo definitivo – da confermare tra Z.I. comparto C lotto 24A e Via Olbia 21] – 08029 Siniscola (NU)
- Telefono: +39 0784 1949743
- WhatsApp: [numero]
- Email: info@servizisicurezzalavoro.it
- Orari: Lunedì – Venerdì, 9:00–13:00 / 15:00–19:00
- Modulo: Nome · Azienda · Telefono · Email · Servizio di interesse (Formazione / F-Gas / Consulenza / CEAS / Altro) · Messaggio · Consenso privacy
- Footer legale: Servizi Sicurezza Lavoro snc · Sede legale: Loc. Salapattu snc – 08029 Siniscola (NU) · P.IVA 01313770917
