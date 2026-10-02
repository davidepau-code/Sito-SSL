// SCHEMA NORMATIVO – "cosa serve a un'azienda per essere in regola".
//
// Fonti (ricerca del 2 ottobre 2026, v. docs/schema-normativo.md): D.Lgs. 81/2008 (Normattiva), Accordo Stato-Regioni 17/04/2025 Rep. 59/CSR
// (GU n. 119 del 24/05/2025), D.M. 2/9/2021 (antincendio), D.M. 388/2003 (primo soccorso), DPR 177/2011 (spazi confinati), Reg. CE 852/2004 (HACCP).
//
// REGOLE DEL FILE
// 1. Nessun numero senza fonte. Dove un dato non è verificato su fonte primaria, il campo `daVerificare` lo dice e la UI NON mostra quel numero.
// 2. Le regole di assegnazione (quali voci per quale settore/dimensione) sono interpretazione operativa: vanno riviste da un RSPP del team
//    prima del lancio (vedi docs/schema-normativo.md, "Cose da far validare").
// 3. L'Accordo 2025 ha abrogato gli accordi 2011/2012/2016: si cita SEMPRE l'ASR 17/04/2025 (anche per le attrezzature).

export type Tipo = 'corso' | 'documento' | 'adempimento';
export type Rischio = 'basso' | 'medio' | 'alto';

export type Obbligo = {
  id: string;
  nome: string;
  tipo: Tipo;
  /** Spiegazione breve per il cliente: perché serve. */
  perche: string;
  durata?: string;
  aggiornamento?: string;
  /** Norma di riferimento (testo breve). */
  fonte: string;
  url?: string;
  catalogo?: string; // id della scheda nel catalogo corsi (/formazione/catalogo/#id)
  /** Ha senso solo se ci sono lavoratori/equiparati (il titolare da solo ha obblighi diversi: art. 21). */
  perDipendenti?: boolean;
  /** Punti non verificati su fonte primaria (uso interno, mai mostrato). */
  daVerificare?: string;
};

const N = 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2008-04-09;81~art';
const ASR = 'https://www.lavoro.gov.it/temi-e-priorita-salute-e-sicurezza/focus/accordo-stato-regioni-17042025-allegato';

export const obblighi: Record<string, Obbligo> = {
  // ---------- Base per ogni azienda con lavoratori ----------
  dvr: {
    id: 'dvr', tipo: 'documento', perDipendenti: true,
    nome: 'Documento di valutazione dei rischi (DVR)',
    perche: 'Ogni azienda con lavoratori deve valutare i rischi e metterli per iscritto: non ha soglie e non si può delegare. Va rifatto quando cambiano organizzazione o macchine e dopo infortuni significativi.',
    aggiornamento: 'A ogni modifica significativa, entro 30 giorni',
    fonte: 'D.Lgs. 81/08 artt. 17, 28, 29', url: N + '29',
  },
  rspp: {
    id: 'rspp', tipo: 'adempimento', perDipendenti: true,
    nome: 'Nomina del Responsabile della sicurezza (RSPP)',
    perche: 'Il datore di lavoro deve designarlo e non può delegare questo obbligo. Puoi svolgere tu il ruolo, con un corso dedicato, oppure affidarlo a un RSPP esterno.',
    fonte: 'D.Lgs. 81/08 artt. 17, 31, 34 e Allegato II', url: N + '34',
  },
  dl16: {
    id: 'dl16', catalogo: 'datore-di-lavoro', tipo: 'corso', perDipendenti: true,
    nome: 'Corso per il datore di lavoro',
    perche: 'L\'Accordo Stato-Regioni del 2025 ha introdotto un corso obbligatorio per ogni datore di lavoro, da completare entro circa maggio 2027.',
    durata: '16 ore', aggiornamento: '6 ore ogni 5 anni',
    fonte: 'ASR 17/04/2025, Parte II punto 3 e Parte III 1.4', url: ASR,
    daVerificare: 'Scadenza 24/05/2027 (testo) vs 19/05/2027 (FAQ ministero): in UI si dice "circa maggio 2027".',
  },
  lavoratori: {
    id: 'lavoratori', catalogo: 'lavoratori', tipo: 'corso', perDipendenti: true,
    nome: 'Formazione dei lavoratori (generale e specifica)',
    perche: 'Ogni lavoratore (anche soci che lavorano, tirocinanti, collaboratori) va formato sui rischi del proprio lavoro. La parte generale vale per sempre; quella specifica dipende dal rischio del settore.',
    // durata calcolata dal motore in base al rischio
    aggiornamento: '6 ore ogni 5 anni',
    fonte: 'D.Lgs. 81/08 art. 37; ASR 17/04/2025 Parte II 2.1 e Allegato IV', url: ASR,
  },
  antincendio: {
    id: 'antincendio', catalogo: 'antincendio', tipo: 'corso', perDipendenti: true,
    nome: 'Addetti antincendio',
    perche: 'Vanno designati lavoratori formati per prevenire gli incendi e gestire l\'evacuazione. Il livello (1, 2 o 3) dipende dai rischi dell\'attività: lo stabiliamo insieme a te.',
    durata: 'Livello 1: 4 ore · livello 2: 8 ore · livello 3: 16 ore',
    aggiornamento: 'Livello 1: 2 ore · livello 2: 5 ore · livello 3: 8 ore, almeno ogni 5 anni',
    fonte: 'D.M. 2/9/2021; D.Lgs. 81/08 artt. 18, 43, 46',
  },
  soccorso: {
    id: 'soccorso', catalogo: 'primo-soccorso', tipo: 'corso', perDipendenti: true,
    nome: 'Addetti al primo soccorso',
    perche: 'Vanno designati lavoratori formati. Con 3 o più lavoratori l\'azienda è nel gruppo B, con meno di 3 nel gruppo C: la durata del corso è la stessa.',
    durata: '12 ore (gruppi B e C)',
    aggiornamento: 'Ogni 3 anni',
    fonte: 'D.M. 388/2003; D.Lgs. 81/08 art. 45',
    daVerificare: 'Ore dell\'aggiornamento triennale (4 h gruppi B/C?) non trovate su fonte primaria: non mostrate.',
  },
  rls: {
    id: 'rls', catalogo: 'rls', tipo: 'corso', perDipendenti: true,
    nome: 'Rappresentante dei lavoratori per la sicurezza (RLS)',
    perche: 'In ogni azienda va eletto o designato un RLS. Nelle piccole aziende può essere un RLS territoriale; se invece è un vostro lavoratore, deve fare il corso.',
    durata: '32 ore', aggiornamento: 'Ogni anno: 4 ore (15–50 lavoratori) o 8 ore (oltre 50)',
    fonte: 'D.Lgs. 81/08 artt. 47 e 37 c.10-11', url: N + '47',
    daVerificare: 'Aggiornamento per aziende sotto i 15 lavoratori: modifica 2026 non verificata; non mostrata.',
  },

  // ---------- Dipendono dal ruolo ----------
  preposti: {
    id: 'preposti', catalogo: 'preposto', tipo: 'corso', perDipendenti: true,
    nome: 'Formazione preposti',
    perche: 'Chi coordina e controlla il lavoro degli altri è un preposto, anche di fatto. Deve essere formato e aggiornato ogni 2 anni, solo in presenza o in videoconferenza, non con corsi online registrati.',
    durata: '12 ore', aggiornamento: '6 ore ogni 2 anni',
    fonte: 'D.Lgs. 81/08 artt. 19 e 37 c.7-ter; ASR 17/04/2025', url: ASR,
  },
  dirigenti: {
    id: 'dirigenti', tipo: 'corso', perDipendenti: true,
    nome: 'Formazione dirigenti',
    perche: 'Chi organizza e dirige l\'attività con poteri propri (anche per delega) è un dirigente per la sicurezza e deve essere formato.',
    durata: '12 ore', aggiornamento: '6 ore ogni 5 anni',
    fonte: 'D.Lgs. 81/08 art. 37; ASR 17/04/2025 Parte II 2.3', url: ASR,
  },
  rspp_dl: {
    id: 'rspp_dl', catalogo: 'datore-rspp', tipo: 'corso', perDipendenti: true,
    nome: 'Corso per il datore di lavoro che fa da RSPP',
    perche: 'Per svolgere tu stesso il ruolo di responsabile della sicurezza serve il modulo dedicato, dopo il corso base da 16 ore. È ammesso solo entro certi limiti di dimensione dell\'azienda.',
    durata: '8 ore (modulo comune)', aggiornamento: '8 ore ogni 5 anni',
    fonte: 'D.Lgs. 81/08 art. 34 e Allegato II; ASR 17/04/2025 Parte II punto 4', url: ASR,
  },
  vdt: {
    id: 'vdt', tipo: 'adempimento', perDipendenti: true,
    nome: 'Visita medica per chi usa il computer',
    perche: 'Chi usa il videoterminale in modo sistematico per almeno 20 ore a settimana ha diritto alla sorveglianza sanitaria del medico competente.',
    aggiornamento: 'Visita ogni 2 anni (oltre i 50 anni o con prescrizioni) o ogni 5 anni',
    fonte: 'D.Lgs. 81/08 artt. 173 e 176', url: N + '176',
  },

  // ---------- Edilizia e cantieri ----------
  pos: {
    id: 'pos', tipo: 'documento', perDipendenti: true,
    nome: 'Piano operativo di sicurezza (POS)',
    perche: 'Ogni impresa che lavora in un cantiere deve redigerlo prima di iniziare. Non serve per le semplici forniture di materiali.',
    fonte: 'D.Lgs. 81/08 art. 96 c.1 lett. g e Allegato XV', url: N + '96',
  },
  patente: {
    id: 'patente', tipo: 'adempimento',
    nome: 'Patente a crediti per i cantieri',
    perche: 'Dal 1° ottobre 2024 imprese e lavoratori autonomi che operano nei cantieri temporanei o mobili devono averla. Tra i requisiti ci sono formazione, DVR e nomina dell\'RSPP.',
    fonte: 'D.Lgs. 81/08 art. 27', url: N + '27',
  },
  cantieri6: {
    id: 'cantieri6', catalogo: 'datore-di-lavoro', tipo: 'corso', perDipendenti: true,
    nome: 'Modulo "Cantieri" per l\'impresa affidataria',
    perche: 'Se la tua impresa affida lavori in subappalto, datore di lavoro, dirigenti e preposti devono avere una formazione aggiuntiva dedicata ai cantieri.',
    durata: '6 ore (in aggiunta)',
    fonte: 'D.Lgs. 81/08 art. 97 c.3-ter; ASR 17/04/2025 Parte II', url: N + '97',
  },
  ponteggi: {
    id: 'ponteggi', catalogo: 'ponteggi', tipo: 'corso', perDipendenti: true,
    nome: 'Montaggio e smontaggio ponteggi',
    perche: 'Chi monta, smonta o trasforma ponteggi deve avere una formazione teorico-pratica specifica e lavorare sotto un preposto, con il piano di montaggio (PiMUS).',
    durata: '28 ore (4 + 10 + 14 pratiche)', aggiornamento: '4 ore ogni 4 anni',
    fonte: 'D.Lgs. 81/08 art. 136 e Allegato XXI',
    daVerificare: 'Allegato XXI letto su sito non istituzionale; l\'ASR 2025 non lo modifica.',
  },
  dpi3: {
    id: 'dpi3', catalogo: 'lavori-in-quota', tipo: 'corso', perDipendenti: true,
    nome: 'Addestramento per imbracature e DPI anticaduta',
    perche: 'Per i dispositivi di protezione di terza categoria, come le imbracature anticaduta, l\'addestramento è sempre obbligatorio.',
    fonte: 'D.Lgs. 81/08 art. 77 c.5', url: N + '77',
    daVerificare: 'Le ore non sono fissate dalla norma: nessuna durata mostrata.',
  },
  confinati: {
    id: 'confinati', catalogo: 'confinati', tipo: 'corso', perDipendenti: true,
    nome: 'Lavori in spazi confinati',
    perche: 'Per lavorare in pozzetti, cisterne, fognature e ambienti simili, tutto il personale deve avere formazione e addestramento specifici.',
    durata: '12 ore (4 + 8 pratiche)', aggiornamento: '4 ore di pratica ogni 5 anni',
    fonte: 'DPR 177/2011; ASR 17/04/2025 Parte II punto 7', url: ASR,
  },

  // ---------- Macchine e attrezzature (ASR 17/04/2025, Parte II p.8): aggiornamento 4 ore di pratica ogni 5 anni ----------
  carrelli: { id: 'carrelli', catalogo: 'carrelli', tipo: 'corso', perDipendenti: false, nome: 'Carrelli elevatori (muletto)',
    perche: 'Chi guida carrelli elevatori deve avere l\'abilitazione: un modulo teorico e uno pratico per il tipo di carrello.',
    durata: '8 ore di teoria + 4–8 ore di pratica, secondo il tipo', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'D.Lgs. 81/08 art. 73 c.5; ASR 17/04/2025 Parte II 8.3.4', url: ASR },
  ple: { id: 'ple', catalogo: 'ple', tipo: 'corso', perDipendenti: false, nome: 'Piattaforme di lavoro elevabili (PLE)',
    perche: 'Chi usa cestelli e piattaforme elevabili deve essere abilitato, con modulo teorico e pratico.',
    durata: '4 ore di teoria + 4–6 ore di pratica, secondo il tipo', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'D.Lgs. 81/08 art. 73 c.5; ASR 17/04/2025 Parte II 8.3.1', url: ASR },
  gru: { id: 'gru', catalogo: 'attrezzature', tipo: 'corso', perDipendenti: false, nome: 'Gru (su autocarro, a torre, mobili)',
    perche: 'Per ogni tipo di gru serve l\'abilitazione dell\'operatore, con modulo teorico e pratico.',
    durata: 'Da 12 a 14 ore in totale, secondo il tipo di gru', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'D.Lgs. 81/08 art. 73 c.5; ASR 17/04/2025 Parte II 8.3.2, 8.3.3, 8.3.5', url: ASR },
  mmt: { id: 'mmt', catalogo: 'mmt', tipo: 'corso', perDipendenti: false, nome: 'Macchine movimento terra (escavatori, pale, terne)',
    perche: 'Chi usa escavatori, pale caricatrici, terne e autoribaltabili a cingoli deve essere abilitato.',
    durata: '4 ore di teoria + 6–12 ore di pratica, secondo le macchine', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'D.Lgs. 81/08 art. 73 c.5; ASR 17/04/2025 Parte II 8.3.7', url: ASR },
  pompe: { id: 'pompe', catalogo: 'pompe-cls', tipo: 'corso', perDipendenti: false, nome: 'Pompe per calcestruzzo',
    perche: 'Chi conduce autopompe per calcestruzzo deve essere abilitato.',
    durata: '7 ore di teoria + 7 ore di pratica', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'D.Lgs. 81/08 art. 73 c.5; ASR 17/04/2025 Parte II 8.3.8', url: ASR },
  trattori: { id: 'trattori', catalogo: 'trattori', tipo: 'corso', perDipendenti: false, nome: 'Trattori agricoli o forestali',
    perche: 'Chi usa trattori a ruote o a cingoli per lavoro deve essere abilitato.',
    durata: '3 ore di teoria + 5 ore di pratica', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'D.Lgs. 81/08 art. 73 c.5; ASR 17/04/2025 Parte II 8.3.6', url: ASR },
  carriponte: { id: 'carriponte', catalogo: 'carriponte', tipo: 'corso', perDipendenti: false, nome: 'Carroponte e gru a ponte',
    perche: 'Con l\'Accordo 2025 anche chi usa carriponte, gru a ponte e a cavalletto deve essere abilitato.',
    durata: '4 ore di teoria + 6–7 ore di pratica, secondo il comando', aggiornamento: '4 ore di pratica ogni 5 anni', fonte: 'ASR 17/04/2025 Parte II 8.3.11', url: ASR },

  // ---------- Alimentare ----------
  haccp_addetti: {
    id: 'haccp_addetti', catalogo: 'haccp-addetto', tipo: 'corso', perDipendenti: false,
    nome: 'Formazione HACCP per chi manipola alimenti',
    perche: 'Chi lavora con gli alimenti deve essere formato in modo adeguato all\'attività. In Sardegna non c\'è un atto regionale che fissi ore e rinnovo: ti indichiamo noi il percorso corretto.',
    fonte: 'Reg. CE 852/2004, Allegato II cap. XII',
    daVerificare: 'Nessuna norma regionale sarda trovata su ore e validità (fonti commerciali discordanti): durata/rinnovo NON mostrati; chiedere conferma scritta al SIAN dell\'ASL.',
  },
  haccp_manuale: {
    id: 'haccp_manuale', tipo: 'documento', perDipendenti: false,
    nome: 'Manuale di autocontrollo HACCP',
    perche: 'Ogni operatore del settore alimentare, anche piccolo, deve applicare procedure basate sui principi HACCP, proporzionate alle dimensioni dell\'attività.',
    fonte: 'Reg. CE 852/2004 art. 5',
    daVerificare: 'Art. 5 letto solo da fonti secondarie (EUR-Lex non raggiungibile).',
  },
  haccp_resp: {
    id: 'haccp_resp', catalogo: 'haccp-responsabile', tipo: 'corso', perDipendenti: false,
    nome: 'Formazione per il responsabile HACCP (OSA)',
    perche: 'Chi è responsabile delle procedure HACCP dell\'attività deve avere una formazione adeguata ai principi del sistema.',
    fonte: 'Reg. CE 852/2004, Allegato II cap. XII',
    daVerificare: 'Nessuna durata regionale trovata: non mostrata.',
  },
};

// ---------- Settori: rischio ATECO (Allegato IV ASR 2025, ATECO 2007) ----------
export type Settore = {
  id: string; etichetta: string; descrizione: string;
  ateco?: string; rischio?: Rischio;
  fisso: string[];
  vuoto?: string; // messaggio quando non c'è ancora nessuna voce
  domande: { id: string; testo: string; aggiunge: string[] }[];
};

export const ORE_SPECIFICA: Record<Rischio, number> = { basso: 4, medio: 8, alto: 12 };

const BASE = ['dvr', 'rspp', 'dl16', 'lavoratori', 'antincendio', 'soccorso', 'rls'];
const qPreposti = { id: 'preposti', testo: 'Hai capisquadra o responsabili che coordinano il lavoro degli altri?', aggiunge: ['preposti'] };
const qDirigenti = { id: 'dirigenti', testo: 'Hai dirigenti, cioè chi organizza e dirige l\'attività con poteri propri?', aggiunge: ['dirigenti'] };
const qRspp = { id: 'rspp_dl', testo: 'Vuoi fare tu, titolare, da responsabile della sicurezza (RSPP)?', aggiunge: ['rspp_dl'] };
const qCarrelli = { id: 'carrelli', testo: 'Usate carrelli elevatori (muletti)?', aggiunge: ['carrelli'] };

export const settori: Settore[] = [
  {
    id: 'edilizia', etichetta: 'Edilizia e cantieri', descrizione: 'Imprese edili, impiantisti, artigiani che lavorano in cantiere.',
    ateco: 'F – Costruzioni', rischio: 'alto',
    fisso: [...BASE, 'pos', 'patente'],
    domande: [
      qPreposti, qDirigenti,
      { id: 'affidataria', testo: 'Date lavori in subappalto ad altre imprese (siete impresa affidataria)?', aggiunge: ['cantieri6'] },
      { id: 'ponteggi', testo: 'Montate o smontate ponteggi?', aggiunge: ['ponteggi'] },
      { id: 'quota', testo: 'Lavorate in quota con imbracature anticaduta?', aggiunge: ['dpi3'] },
      { id: 'confinati', testo: 'Lavorate in pozzetti, cisterne o altri spazi confinati?', aggiunge: ['confinati'] },
      { id: 'ple', testo: 'Usate piattaforme elevabili (cestelli, ragni)?', aggiunge: ['ple'] },
      { id: 'gru', testo: 'Usate gru (su autocarro, a torre, mobili)?', aggiunge: ['gru'] },
      { id: 'mmt', testo: 'Usate escavatori, pale o altre macchine movimento terra?', aggiunge: ['mmt'] },
      { id: 'pompe', testo: 'Usate autopompe per calcestruzzo?', aggiunge: ['pompe'] },
      qCarrelli, qRspp,
    ],
  },
  {
    id: 'ristorazione', etichetta: 'Ristorazione, bar e alloggio', descrizione: 'Ristoranti, bar, pizzerie, laboratori di cucina, strutture ricettive.',
    ateco: 'I – Alloggio e ristorazione', rischio: 'basso',
    fisso: [...BASE, 'haccp_addetti', 'haccp_manuale'],
    domande: [
      qPreposti, qDirigenti,
      { id: 'haccp_resp', testo: 'Sei tu il responsabile delle procedure HACCP (titolare o responsabile)?', aggiunge: ['haccp_resp'] },
      qRspp,
    ],
  },
  {
    id: 'uffici', etichetta: 'Uffici, studi e servizi', descrizione: 'Studi professionali, uffici, agenzie, servizi alle imprese.',
    ateco: 'J, K, L, M, N – Servizi', rischio: 'basso',
    fisso: BASE,
    domande: [
      { id: 'vdt', testo: 'Qualcuno usa il computer per 20 ore a settimana o più?', aggiunge: ['vdt'] },
      qPreposti, qDirigenti, qRspp,
    ],
  },
  {
    id: 'commercio', etichetta: 'Commercio e negozi', descrizione: 'Negozi, ingrosso, riparazioni auto e moto.',
    ateco: 'G – Commercio', rischio: 'basso',
    fisso: BASE,
    domande: [
      qCarrelli,
      { id: 'alimenti', testo: 'Vendete o lavorate alimenti?', aggiunge: ['haccp_addetti', 'haccp_manuale'] },
      { id: 'vdt', testo: 'Qualcuno usa il computer per 20 ore a settimana o più?', aggiunge: ['vdt'] },
      qPreposti, qDirigenti, qRspp,
    ],
  },
  {
    id: 'artigianato', etichetta: 'Artigianato e industria', descrizione: 'Officine, falegnamerie, laboratori, produzione, panifici e simili.',
    ateco: 'C – Attività manifatturiere', rischio: 'alto',
    fisso: BASE,
    domande: [
      qPreposti, qDirigenti, qCarrelli,
      { id: 'carriponte', testo: 'Usate carriponte o gru a ponte?', aggiunge: ['carriponte'] },
      { id: 'ple', testo: 'Usate piattaforme elevabili?', aggiunge: ['ple'] },
      { id: 'confinati', testo: 'Lavorate in spazi confinati (serbatoi, cisterne)?', aggiunge: ['confinati'] },
      { id: 'alimenti', testo: 'Producete alimenti?', aggiunge: ['haccp_addetti', 'haccp_manuale'] },
      qRspp,
    ],
  },
  {
    id: 'agricoltura', etichetta: 'Agricoltura e allevamento', descrizione: 'Aziende agricole, zootecniche, forestali.',
    ateco: 'A – Agricoltura, silvicoltura, pesca', rischio: 'medio',
    fisso: BASE,
    domande: [
      { id: 'trattori', testo: 'Usate trattori agricoli o forestali?', aggiunge: ['trattori'] },
      { id: 'ple', testo: 'Usate piattaforme elevabili o macchine raccogli-frutta?', aggiunge: ['ple'] },
      { id: 'alimenti', testo: 'Trasformate o vendete alimenti?', aggiunge: ['haccp_addetti', 'haccp_manuale'] },
      qPreposti, qDirigenti, qRspp,
    ],
  },
  {
    id: 'trasporti', etichetta: 'Trasporti e magazzino', descrizione: 'Autotrasporto, logistica, magazzini, corrieri.',
    ateco: 'H – Trasporto e magazzinaggio', rischio: 'medio',
    fisso: BASE,
    domande: [qCarrelli, { id: 'gru', testo: 'Usate gru su autocarro?', aggiunge: ['gru'] }, qPreposti, qDirigenti, qRspp],
  },
  {
    id: 'macchine', etichetta: "Solo patentini per macchine e attrezzature", descrizione: "Muletti, gru, piattaforme elevabili, escavatori, trattori e altri mezzi.",
    fisso: [],
    vuoto: "Rispondi sì ai mezzi che usate: ti mostriamo i patentini e gli aggiornamenti che servono.",
    domande: [
      qCarrelli,
      { id: 'ple', testo: "Usate piattaforme di lavoro elevabili (cestelli, ragni)?", aggiunge: ['ple'] },
      { id: 'gru', testo: "Usate gru (su autocarro, a torre, mobili)?", aggiunge: ['gru'] },
      { id: 'mmt', testo: "Usate escavatori, pale, terne o altre macchine movimento terra?", aggiunge: ['mmt'] },
      { id: 'pompe', testo: "Usate autopompe per calcestruzzo?", aggiunge: ['pompe'] },
      { id: 'trattori', testo: "Usate trattori agricoli o forestali?", aggiunge: ['trattori'] },
      { id: 'carriponte', testo: "Usate carriponte o gru a ponte?", aggiunge: ['carriponte'] },
    ],
  },
  {
    id: 'altro', etichetta: 'Altra attività / non so', descrizione: 'Ti diciamo noi cosa serve nel tuo caso.',
    fisso: BASE,
    domande: [
      qPreposti, qDirigenti,
      { id: 'macchine', testo: 'Usate muletti, gru, piattaforme o altre macchine?', aggiunge: ['carrelli'] },
      { id: 'alimenti', testo: 'Lavorate con alimenti?', aggiunge: ['haccp_addetti', 'haccp_manuale'] },
      qRspp,
    ],
  },
];

export const dimensioni = ['Solo io', '1–5 persone', '6–15 persone', '16–50 persone', 'Più di 50 persone'];

/** Attestati che il cliente può dichiarare di avere già. */
export const attestati: { id: string; etichetta: string }[] = [
  { id: 'lav_gen', etichetta: 'Formazione generale lavoratori (4 ore)' },
  { id: 'lav_spec', etichetta: 'Formazione specifica lavoratori (del mio settore)' },
  { id: 'dl16', etichetta: 'Corso per il datore di lavoro (16 ore)' },
  { id: 'rspp_dl', etichetta: 'Corso datore di lavoro RSPP' },
  { id: 'preposti', etichetta: 'Formazione preposti' },
  { id: 'dirigenti', etichetta: 'Formazione dirigenti' },
  { id: 'antincendio', etichetta: 'Addetti antincendio' },
  { id: 'soccorso', etichetta: 'Addetti primo soccorso' },
  { id: 'rls', etichetta: 'Rappresentante dei lavoratori (RLS)' },
];

export const DATA_VERIFICA = '2 ottobre 2026';
