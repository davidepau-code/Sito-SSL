// PACCHETTI PER SETTORE – il sito DICE al cliente cosa gli serve; non gli fa scegliere.
//
// ⚠ DA VALIDARE PRIMA DEL LANCIO: la composizione di ogni pacchetto e le regole sotto sono una BOZZA. Devono essere riviste da un RSPP del team
// (Flavio o Veronica Biselli) sulla normativa vigente (D.Lgs. 81/08, ASR 17/04/2025). Qui ci sono solo NOMI di corsi e documenti:
// durate, livelli di rischio (dipendono dal codice ATECO) e scadenze vivono nelle schede corso.
//
// - `fisso`: voci sempre incluse per quel settore.
// - `domande`: situazioni che il cliente conosce (sì/no). Una risposta "sì" AGGIUNGE le voci indicate: il cliente non sceglie i corsi, risponde a fatti.
// - `perDipendenti`: voce che ha senso solo se ci sono lavoratori/collaboratori (il titolare da solo ha obblighi diversi).

export type Voce = { nome: string; slug?: string; tipo?: 'corso' | 'documento'; perDipendenti?: boolean };
export type Domanda = { id: string; testo: string; aggiunge: Voce[] };
export type Pacchetto = { id: string; etichetta: string; descrizione: string; fisso: Voce[]; domande: Domanda[] };

const corso = (nome: string, extra: Partial<Voce> = {}): Voce => ({ nome, tipo: 'corso', ...extra });
const doc = (nome: string, extra: Partial<Voce> = {}): Voce => ({ nome, tipo: 'documento', ...extra });

const lavoratori = corso('Formazione lavoratori (generale e specifica)', { slug: 'lavoratori', perDipendenti: true });
const antincendio = corso('Addetti antincendio', { perDipendenti: true });
const soccorso = corso('Addetti primo soccorso', { perDipendenti: true });
const dvr = doc('Documento di valutazione dei rischi (DVR)', { perDipendenti: true });
const preposti = corso('Formazione preposti', { perDipendenti: true });

const qPreposti: Domanda = { id: 'preposti', testo: 'Hai capisquadra o responsabili che coordinano il lavoro degli altri?', aggiunge: [preposti] };
const qRspp: Domanda = { id: 'rspp', testo: 'Vuoi fare tu, titolare, da responsabile della sicurezza (RSPP)?', aggiunge: [corso('Datore di lavoro che svolge il ruolo di RSPP')] };

export const pacchetti: Pacchetto[] = [
  {
    id: 'edilizia', etichetta: 'Edilizia e cantieri', descrizione: 'Imprese edili, impiantisti, artigiani che lavorano in cantiere.',
    fisso: [lavoratori, antincendio, soccorso, dvr, doc('Piano operativo di sicurezza (POS)', { perDipendenti: true })],
    domande: [
      qPreposti,
      { id: 'ple', testo: 'Usate piattaforme di lavoro elevabili (cestelli, ragni)?', aggiunge: [corso('Piattaforme di lavoro elevabili (PLE)')] },
      { id: 'gru', testo: 'Usate gru (su autocarro, a torre, mobili)?', aggiunge: [corso('Gru')] },
      { id: 'mmt', testo: 'Usate escavatori, pale o altre macchine movimento terra?', aggiunge: [corso('Macchine movimento terra')] },
      { id: 'autopompe', testo: 'Usate autopompe per calcestruzzo?', aggiunge: [corso('Autopompe per calcestruzzo')] },
      { id: 'confinati', testo: 'Lavorate in pozzetti, cisterne o altri spazi confinati?', aggiunge: [corso('Spazi confinati')] },
      qRspp,
    ],
  },
  {
    id: 'ristorazione', etichetta: 'Ristorazione e bar', descrizione: 'Ristoranti, bar, pizzerie, laboratori, strutture ricettive.',
    fisso: [lavoratori, corso('HACCP: addetti alla manipolazione degli alimenti'), antincendio, soccorso, dvr, doc('Manuale di autocontrollo HACCP')],
    domande: [
      qPreposti,
      { id: 'osa', testo: 'Sei tu il responsabile dell\'attività alimentare (titolare o responsabile HACCP)?', aggiunge: [corso('Operatore del settore alimentare (OSA)')] },
      qRspp,
    ],
  },
  {
    id: 'uffici', etichetta: 'Uffici e studi professionali', descrizione: 'Uffici, studi, agenzie, attività commerciali di servizio.',
    fisso: [lavoratori, antincendio, soccorso, dvr],
    domande: [
      qPreposti,
      { id: 'rls', testo: 'Avete un rappresentante dei lavoratori per la sicurezza (RLS)?', aggiunge: [corso('Rappresentante dei lavoratori per la sicurezza (RLS)')] },
      qRspp,
    ],
  },
  {
    id: 'altro', etichetta: 'Altra attività / non so', descrizione: 'Ti diciamo noi cosa serve nel tuo caso.',
    fisso: [lavoratori, antincendio, soccorso, dvr],
    domande: [
      qPreposti,
      { id: 'macchine', testo: 'Usate muletti, gru, piattaforme o altre macchine?', aggiunge: [corso('Patentini per macchine e attrezzature')] },
      { id: 'alimenti', testo: 'Lavorate con alimenti?', aggiunge: [corso('HACCP: addetti alla manipolazione degli alimenti'), doc('Manuale di autocontrollo HACCP')] },
      qRspp,
    ],
  },
];

export const dimensioni = ['Solo io', '1–5 dipendenti', '6–15 dipendenti', '16–50 dipendenti', 'Più di 50 dipendenti'];
