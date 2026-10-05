// Servizi di consulenza: una pagina per ognuno (src/pages/consulenza/[slug].astro).
// Elenco ricavato dal "Listino consulenze" su Notion (5 ottobre 2026), SENZA prezzi.
// Testi in bozza: normativa citata da verificare con un RSPP prima del lancio.
export interface Consulenza {
  slug: string;
  nome: string;        // titolo della pagina
  breve: string;       // nome corto per le tessere
  sigla?: string;
  area: 'Sicurezza sul lavoro' | 'Sicurezza alimentare' | 'Qualità' | 'Edilizia e acustica';
  riassunto: string;   // una frase, per l'elenco e la descrizione per Google
  chi: string;         // chi è obbligato / a chi serve
  quando: string;      // quando serve o va aggiornato
  facciamo: string[];  // cosa comprende il servizio
  esclusioni?: string;
  fonte: string;       // riferimento normativo
  icona: string;
  collegati: string[]; // slug di altre consulenze o pagine
  corso?: { testo: string; href: string };
  note?: string;
}

export const consulenze: Consulenza[] = [
  {
    slug: 'dvr',
    nome: 'Documento di Valutazione dei Rischi (DVR)',
    breve: 'DVR',
    sigla: 'DVR',
    area: 'Sicurezza sul lavoro',
    riassunto: 'Il documento che ogni datore di lavoro con dipendenti deve avere: individua i rischi della tua azienda e le misure per prevenirli.',
    chi: 'Ogni datore di lavoro che ha almeno un lavoratore, compresi i collaboratori equiparati. La valutazione dei rischi è un obbligo del datore di lavoro e non si può delegare.',
    quando: 'Alla nascita dell\'attività e ogni volta che qualcosa cambia: nuove attrezzature o lavorazioni, modifiche all\'organizzazione, infortuni significativi, nuove norme.',
    facciamo: [
      'Analisi qualitativa dei rischi presenti',
      'Analisi quantitativa dei rischi individuati',
      'Rischi derivanti dal luogo di lavoro',
      'Rischi derivanti dall\'uso di attrezzature e macchinari',
      'Approfondimento dei rischi specifici, con rilievi per rumore e vibrazioni inclusi',
      'Redazione del documento e delle misure di prevenzione e protezione',
    ],
    esclusioni: 'Restano esclusi gli eventuali accertamenti strumentali ulteriori che risultassero necessari nel corso della valutazione.',
    fonte: 'D.Lgs. 81/2008 (artt. 17, 28 e 29) e successive modifiche.',
    icona: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8',
    collegati: ['aggiornamento-dvr', 'duvri', 'pos'],
    corso: { testo: 'Servono anche i corsi per lavoratori, preposti e dirigenti?', href: '/formazione/?caso=assunto#pacchetto' },
  },
  {
    slug: 'aggiornamento-dvr',
    nome: 'Aggiornamento del DVR',
    breve: 'Aggiornamento DVR',
    area: 'Sicurezza sul lavoro',
    riassunto: 'Revisione e aggiornamento del documento di valutazione dei rischi quando in azienda cambia qualcosa.',
    chi: 'Le aziende che hanno già un DVR ma che nel frattempo sono cambiate, o che hanno un documento vecchio e non più aderente a come si lavora oggi.',
    quando: 'Quando cambiano le lavorazioni, gli ambienti, le attrezzature o l\'organizzazione, dopo un infortunio significativo, e quando la norma lo richiede.',
    facciamo: [
      'Revisione dell\'analisi qualitativa dei rischi presenti',
      'Revisione dell\'analisi quantitativa dei rischi individuati',
      'Rischi derivanti dal luogo di lavoro',
      'Rischi derivanti dall\'uso di attrezzature e macchinari',
      'Approfondimento dei rischi specifici, con rilievi per rumore e vibrazioni inclusi',
      'Riedizione del documento aggiornato',
    ],
    esclusioni: 'Restano esclusi gli eventuali accertamenti strumentali ulteriori che risultassero necessari nel corso della valutazione.',
    fonte: 'D.Lgs. 81/2008 (art. 29) e successive modifiche.',
    icona: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
    collegati: ['dvr', 'duvri'],
  },
  {
    slug: 'duvri',
    nome: 'DUVRI – Rischi da interferenze',
    breve: 'DUVRI',
    sigla: 'DUVRI',
    area: 'Sicurezza sul lavoro',
    riassunto: 'Il documento che valuta i rischi quando più imprese o lavoratori autonomi operano negli stessi luoghi, per appalti, lavori e servizi.',
    chi: 'Il committente che affida lavori, servizi o forniture a un\'impresa appaltatrice o a lavoratori autonomi all\'interno della propria azienda o unità produttiva.',
    quando: 'Prima dell\'affidamento, già in fase di gara quando serve (DUVRI "pre-gara"). Non è richiesto in alcuni casi, come i servizi di natura intellettuale o le semplici forniture di materiali, salvo eccezioni previste dalla norma.',
    facciamo: [
      'Elaborazione del DUVRI pre-gara per individuare i rischi da interferenza',
      'Misure per eliminare o ridurre le interferenze tra le attività',
      'Indicazione dei costi della sicurezza non soggetti a ribasso, ove richiesti',
    ],
    fonte: 'D.Lgs. 81/2008 (art. 26) e successive modifiche.',
    icona: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    collegati: ['dvr', 'pos'],
  },
  {
    slug: 'pos',
    nome: 'Piano Operativo di Sicurezza (POS)',
    breve: 'POS',
    sigla: 'POS',
    area: 'Sicurezza sul lavoro',
    riassunto: 'Il documento di sicurezza che ogni impresa edile redige per il proprio cantiere, prima di iniziare i lavori.',
    chi: 'Le imprese che eseguono lavori in cantieri temporanei o mobili: imprese edili, artigiani, lavoratori che operano nei cantieri.',
    quando: 'Per ogni cantiere, prima dell\'inizio dei lavori, e aggiornato se le condizioni del cantiere o delle lavorazioni cambiano.',
    facciamo: [
      'Analisi qualitativa dei rischi presenti nel cantiere',
      'Analisi quantitativa dei rischi individuati',
      'Approfondimento dei rischi specifici identificati',
      'Redazione del POS secondo i contenuti previsti dalla norma',
    ],
    fonte: 'D.Lgs. 81/2008 (Titolo IV e Allegato XV) e successive modifiche.',
    icona: 'M2 20h20M5 20v-8l7-7 7 7v8M9 20v-5h6v5',
    collegati: ['dvr', 'duvri'],
    corso: { testo: 'Per il cantiere servono anche i corsi di sicurezza: guarda il catalogo.', href: '/formazione/catalogo/' },
  },
  {
    slug: 'haccp',
    nome: 'Manuale di autocontrollo HACCP',
    breve: 'Manuale HACCP',
    sigla: 'HACCP',
    area: 'Sicurezza alimentare',
    riassunto: 'Il manuale di autocontrollo alimentare per bar, ristoranti, laboratori e attività che trattano alimenti.',
    chi: 'Gli operatori del settore alimentare: ristoranti, bar, pizzerie, laboratori, negozi di alimentari, agriturismi e ogni attività che prepara, vende o somministra alimenti.',
    quando: 'All\'apertura dell\'attività e ogni volta che cambiano menù, lavorazioni, locali o attrezzature.',
    facciamo: [
      'Analisi della tua attività e dei suoi processi',
      'Elaborazione del manuale di autocontrollo secondo il metodo HACCP',
      'Procedure e modulistica da usare ogni giorno',
    ],
    fonte: 'Regolamento (CE) 852/2004 (art. 5) e normativa nazionale e regionale collegata.',
    icona: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
    collegati: [],
    corso: { testo: 'Il personale deve anche fare il corso HACCP: vedi i corsi disponibili.', href: '/formazione/?caso=haccp#pacchetto' },
  },
  {
    slug: 'iso-9001',
    nome: 'Sistema di gestione qualità ISO 9001',
    breve: 'ISO 9001',
    sigla: 'ISO 9001',
    area: 'Qualità',
    riassunto: 'Progettiamo e introduciamo in azienda il sistema di gestione della qualità secondo la norma UNI EN ISO 9001:2015.',
    chi: 'Aziende che vogliono organizzare meglio i propri processi o che devono ottenere la certificazione qualità, ad esempio per partecipare a gare o per richiesta dei clienti.',
    quando: 'Quando decidi di strutturare la qualità in azienda, o quando un cliente o una gara richiedono la certificazione.',
    facciamo: [
      'Analisi della situazione esistente del sistema e della struttura operativa',
      'Identificazione dei ruoli aziendali',
      'Analisi di strumenti, modalità operative e processi chiave',
      'Progettazione del sistema sulla base della norma e dei flussi gestionali',
      'Formazione del personale sui principi dei sistemi qualità',
      'Stesura della documentazione: Manuale della Qualità, procedure operative e procedure di qualità',
      'Aiuto nella ricerca e nella scelta dell\'ente di certificazione',
      'Affiancamento nei rapporti con l\'ente certificatore',
      'Programmazione degli audit interni, con cadenza da concordare',
    ],
    fonte: 'UNI EN ISO 9001:2015.',
    icona: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    collegati: [],
    note: 'Tempo di realizzazione indicativo: circa 45 giorni.',
  },
  {
    slug: 'collaudo-acustico',
    nome: 'Collaudo dei requisiti acustici passivi',
    breve: 'Collaudo acustico',
    sigla: 'RAP',
    area: 'Edilizia e acustica',
    riassunto: 'Collaudo acustico degli edifici con rilascio della certificazione utile per l\'agibilità degli immobili.',
    chi: 'Costruttori, imprese edili e proprietari che devono dimostrare il rispetto dei requisiti acustici passivi degli edifici per ottenere l\'agibilità.',
    quando: 'A fine lavori, per l\'asseverazione dei parametri acustici necessaria all\'agibilità degli immobili.',
    facciamo: [
      'Collaudo degli elementi posti in opera secondo il DPCM 5/12/1997 e la normativa tecnica applicabile',
      'Rilascio della certificazione utile all\'asseverazione dei parametri acustici ai fini dell\'agibilità',
      'In alternativa, classificazione acustica degli edifici secondo UNI 11367:2010 o UNI 11444:2012, da fare solo se il collaudo secondo i valori limite del DPCM non risulta positivo (Delibera n. 50/4 del 16/10/2015)',
    ],
    esclusioni: 'Per eseguire tutti i rilievi serve poter accedere a tutte le unità immobiliari confinanti con l\'immobile oggetto di rilievo.',
    fonte: 'DPCM 5 dicembre 1997 e norme UNI 11367 e UNI 11444.',
    icona: 'M11 5 6 9H2v6h4l5 4zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14',
    collegati: [],
  },
];

export const consulenzaPerSlug = (s: string) => consulenze.find((c) => c.slug === s)!;
