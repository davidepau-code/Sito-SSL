// Catalogo formazione per AREA. Solo nomi e struttura: durate, aggiornamenti e norme stanno nelle schede (collezione `corsi`) e vanno verificati.
// `slug` presente = esiste una pagina dedicata in /formazione/corsi/<slug>/.
export type Corso = { nome: string; slug?: string };
export type Area = { id: string; nome: string; per: string; icona: string; corsi: Corso[] };

export const aree: Area[] = [
  {
    id: 'sicurezza', nome: 'Sicurezza sul lavoro', per: 'Gli obblighi di legge per chi ha lavoratori in azienda.',
    icona: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    corsi: [
      { nome: 'Lavoratori (generale e specifica)', slug: 'lavoratori' }, { nome: 'Preposti' }, { nome: 'Dirigenti' },
      { nome: 'Datore di lavoro (RSPP)' }, { nome: 'RSPP e ASPP' }, { nome: 'Rappresentante dei lavoratori (RLS)' },
      { nome: 'Addetti antincendio' }, { nome: 'Addetti primo soccorso' },
    ],
  },
  {
    id: 'attrezzature', nome: 'Macchine e attrezzature', per: 'I patentini per chi guida o aziona mezzi e macchine.',
    icona: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1',
    corsi: [
      { nome: 'Carrelli elevatori (muletto)' }, { nome: 'Piattaforme di lavoro elevabili (PLE)' }, { nome: 'Gru' },
      { nome: 'Macchine movimento terra' }, { nome: 'Autopompe per calcestruzzo' }, { nome: 'Trattori agricoli e forestali' },
      { nome: 'Attrezzature per la manutenzione del verde' },
    ],
  },
  {
    id: 'rischi', nome: 'Rischi specifici', per: 'Per ambienti e lavorazioni particolari.',
    icona: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
    corsi: [{ nome: 'Spazi confinati' }, { nome: 'Atmosfere esplosive (ATEX)' }],
  },
  {
    id: 'alimentare', nome: 'Alimentare e HACCP', per: 'Per bar, ristoranti, laboratori e chi lavora con gli alimenti.',
    icona: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
    corsi: [{ nome: 'Addetto alla manipolazione degli alimenti' }, { nome: 'Operatore del settore alimentare (OSA)' }],
  },
];

// PACCHETTI PER SETTORE. Solo NOMI dei corsi: durate, livelli di rischio e aggiornamenti NON sono qui (li definisce la scheda corso / l'RSPP
// in base al codice ATECO). La composizione di ogni pacchetto va VALIDATA da un RSPP del team prima del lancio.
// base = corsi che quasi sempre servono a quel settore · extra = da aggiungere se ricorre il caso.
export type Voce = { nome: string; slug?: string; nota?: string };
export type Pacchetto = { id: string; etichetta: string; descrizione: string; base: Voce[]; extra: Voce[] };

const lavoratori: Voce = { nome: 'Formazione lavoratori (generale e specifica)', slug: 'lavoratori' };
const dvr: Voce = { nome: 'Documento di valutazione dei rischi (DVR)', nota: 'documento' };
const antincendio: Voce = { nome: 'Addetti antincendio' };
const soccorso: Voce = { nome: 'Addetti primo soccorso' };

export const pacchetti: Pacchetto[] = [
  { id: 'edilizia', etichetta: 'Edilizia e cantieri', descrizione: 'Imprese edili, impiantisti, artigiani che lavorano in cantiere.',
    base: [lavoratori, { nome: 'Formazione preposti' }, antincendio, soccorso, dvr, { nome: 'Piano operativo di sicurezza (POS)', nota: 'documento' }],
    extra: [{ nome: 'Piattaforme di lavoro elevabili (PLE)' }, { nome: 'Gru' }, { nome: 'Macchine movimento terra' }, { nome: 'Autopompe per calcestruzzo' }, { nome: 'Spazi confinati' }, { nome: 'Datore di lavoro che fa da RSPP' }] },
  { id: 'ristorazione', etichetta: 'Ristorazione e bar', descrizione: 'Ristoranti, bar, pizzerie, laboratori, strutture ricettive.',
    base: [lavoratori, { nome: 'HACCP: addetti alla manipolazione degli alimenti' }, antincendio, soccorso, dvr, { nome: 'Manuale di autocontrollo HACCP', nota: 'documento' }],
    extra: [{ nome: 'Operatore del settore alimentare (OSA)' }, { nome: 'Formazione preposti' }, { nome: 'Datore di lavoro che fa da RSPP' }] },
  { id: 'uffici', etichetta: 'Uffici e studi professionali', descrizione: 'Uffici, studi, agenzie, attività commerciali di servizio.',
    base: [lavoratori, antincendio, soccorso, dvr],
    extra: [{ nome: 'Rappresentante dei lavoratori (RLS)' }, { nome: 'Formazione preposti' }, { nome: 'Datore di lavoro che fa da RSPP' }] },
  { id: 'altro', etichetta: 'Altra attività / non so', descrizione: 'Ti diciamo noi cosa serve nel tuo caso.',
    base: [lavoratori, dvr],
    extra: [antincendio, soccorso, { nome: 'Formazione preposti' }, { nome: 'Patentini per macchine e attrezzature' }] },
];

export const dimensioni = ['Solo io', '1–5 dipendenti', '6–15 dipendenti', '16–50 dipendenti', 'Più di 50 dipendenti'];

// (Obsoleto, sostituito dai pacchetti: non più usato dal sito.)
export const percorsi = [
  { id: 'datore', etichetta: 'Sono il titolare / datore di lavoro', risultati: [
    { nome: 'Formazione dei tuoi lavoratori', href: '/formazione/corsi/lavoratori/' },
    { nome: 'Preposti, dirigenti e datore di lavoro', href: '/formazione/#sicurezza' },
    { nome: 'Documento di valutazione dei rischi (DVR)', href: '/consulenza/sicurezza-sul-lavoro/' },
  ] },
  { id: 'lavoratore', etichetta: 'Sono un lavoratore (o sto per iniziare)', risultati: [
    { nome: 'Formazione lavoratori (generale e specifica)', href: '/formazione/corsi/lavoratori/' },
    { nome: 'Antincendio e primo soccorso, se designato', href: '/formazione/#sicurezza' },
  ] },
  { id: 'preposto', etichetta: 'Coordino una squadra (preposto)', risultati: [
    { nome: 'Formazione per preposti', href: '/formazione/#sicurezza' },
    { nome: 'Formazione lavoratori', href: '/formazione/corsi/lavoratori/' },
  ] },
  { id: 'macchine', etichetta: 'Guido muletti, gru, piattaforme o altri mezzi', risultati: [
    { nome: 'Patentini per macchine e attrezzature', href: '/formazione/#attrezzature' },
  ] },
  { id: 'alimenti', etichetta: 'Lavoro con gli alimenti (bar, ristorante, laboratorio)', risultati: [
    { nome: 'Corsi HACCP e formazione alimentaristi', href: '/formazione/#alimentare' },
    { nome: 'Manuale di autocontrollo HACCP', href: '/consulenza/' },
  ] },
  { id: 'frigorista', etichetta: 'Sono frigorista, termoidraulico o installatore', risultati: [
    { nome: 'Certificazione F-Gas', href: '/f-gas/' },
  ] },
  { id: 'ente', etichetta: 'Rappresento una scuola o un ente', risultati: [
    { nome: 'Educazione ambientale nei CEAS', href: '/ceas/' },
  ] },
] as const;
