// Dati condivisi delle pagine F-Gas: /f-gas/ (ingresso), /f-gas/patentino-frigoristi/, /f-gas/certificazione-impresa/.
// Testi esami e FAQ della persona: prescrizioni IMQ PR PART PRS/FGAS-2015/2067 Rev. 5 del 26/02/2026 (da far confermare a Michela).
// Testi impresa: D.P.R. 146/2018 e Reg. (UE) 2015/2067; bozza del 14/10/2026 da far verificare a Michela.
import { azienda } from './azienda';

export const wa = (m: string) => azienda.whatsappFgas(m); // sempre al WhatsApp di Michela, referente F-Gas

// Sessioni d'esame e date del corso: per ora l'ultimo sabato di ogni mese, TUTTE da confermare.
// Calcolate alla pubblicazione (le prossime 6); uno script nasconde quelle gia passate.
export function sessioniFgas() {
  const ultimoSabato = (anno: number, mese: number) => {
    const d = new Date(Date.UTC(anno, mese + 1, 0)); // ultimo giorno del mese
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7)); // indietro fino al sabato
    return d;
  };
  const oggi = new Date();
  const sessioni: { iso: string; testo: string; nota: string }[] = [];
  for (let i = 0; sessioni.length < 6 && i < 14; i++) {
    const d = ultimoSabato(oggi.getUTCFullYear(), oggi.getUTCMonth() + i);
    if (d.getTime() < Date.UTC(oggi.getUTCFullYear(), oggi.getUTCMonth(), oggi.getUTCDate())) continue;
    const t = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    // Dicembre: niente giorno (cade a ridosso delle festivita), la data e da definire
    const dic = d.getUTCMonth() === 11;
    const testo = dic ? 'Dicembre ' + d.getUTCFullYear() : t.charAt(0).toUpperCase() + t.slice(1);
    sessioni.push({ iso: d.toISOString().slice(0, 10), testo, nota: dic ? '(Data da definire)' : '(Da confermare)' });
  }
  return sessioni;
}

export const formazione = [
  'Preparazione teorica alla prova d\'esame',
  'Normativa F-Gas',
  'Principi tecnici su impianti e refrigeranti',
  'Obblighi dell\'operatore',
  'Aggiornamenti normativi e tecnici',
  'Informazioni su come si accede all\'esame',
];

// Esame (prescrizioni IMQ Rev. 5 del 26/02/2026): stessi dati di prima, divisi in parti brevi per la lettura.
export const categorie = [
  { n: 'I', testo: 'Tutte le attività.' },
  { n: 'II', testo: 'Controllo delle perdite (senza intervenire sui circuiti), recupero, installazione, manutenzione e smantellamento su apparecchiature con meno di 3 kg di gas (6 kg se sigillate ermeticamente).' },
  { n: 'III', testo: 'Solo recupero, sulle stesse apparecchiature della categoria II.' },
  { n: 'IV', testo: 'Solo controllo delle perdite, senza intervenire sui circuiti.' },
];
export const prove = [
  {
    t: 'Prova teorica',
    intro: 'Domande a risposta multipla, con tre alternative e una sola corretta.',
    dati: [
      ['Domande', '30 per le categorie I e II · 12 per la III · 15 per la IV'],
      ['Durata massima', '90 minuti per le categorie I e II · 30 minuti per la III e la IV'],
      ['Per superarla', 'almeno il 60%'],
    ],
  },
  {
    t: 'Prova pratica',
    intro: 'Compiti con il materiale e gli strumenti messi a disposizione, indossando i DPI. Riguarda tutti i temi obbligatori e almeno uno dei gruppi sui componenti, che non si conosce prima.',
    dati: [
      ['Durata massima', '90 minuti per le categorie I e II · 45 minuti per la III e la IV'],
      ['Si accede', 'solo dopo aver superato la teoria'],
      ['Per superarla', 'almeno il 60%'],
    ],
  },
];
export const esito = [
  'Almeno il 60% in ciascuna prova',
  'Almeno il 70% complessivo, con la pratica che pesa di più: 30% teoria, 70% pratica',
  'Chi supera la teoria ma non la pratica può ripetere solo la pratica, entro i termini previsti dalla norma',
];
export const requisitiEsame = [
  'Essere già iscritti al Registro Telematico Nazionale F-Gas',
  'Ottenere il certificato entro 8 mesi dall’iscrizione',
  'Inviare la domanda di ammissione almeno 5 giorni lavorativi prima della data scelta',
  'Le prove si svolgono in italiano',
];
export const documentiEsame = [
  'Domanda di ammissione compilata e firmata',
  'Attestato di iscrizione al Registro Telematico Nazionale',
  'Documento d’identità in corso di validità',
  'Fotografia formato tessera',
  'Prova dell’avvenuto pagamento',
];

// Chi fa cosa per la persona: tre ruoli distinti.
export const passiPersona = [
  { titolo: 'Ti prepari con noi', testo: 'SSL tiene la formazione teorica di preparazione all\'esame.' },
  { titolo: 'Sostieni l\'esame', testo: 'Le sessioni, teoria e pratica, si svolgono nella nostra sede a Siniscola, organizzate da SSL in qualità di Organismo di Valutazione di IMQ.' },
  { titolo: 'IMQ certifica', testo: 'IMQ, Organismo di Certificazione, rilascia la certificazione al termine dell\'iter previsto.' },
];

// Cosa facciamo per l'impresa (elenco gia pubblicato; dettagli da confermare con Michela).
export const impresa = [
  'Analisi preliminare della situazione aziendale',
  'Verifica dei requisiti necessari',
  'Verifica del personale certificato',
  'Verifica delle attrezzature disponibili',
  'Supporto nella predisposizione della documentazione',
  'Predisposizione o revisione delle procedure',
  'Verifica della conformità organizzativa',
  'Preparazione dell\'impresa all\'iter di certificazione',
  'Supporto nella gestione di eventuali carenze',
  'Assistenza durante tutto il percorso',
];

// Requisiti dell'impresa: D.P.R. 146/2018 e Reg. (UE) 2015/2067.
export const requisitiImpresa = [
  { t: 'Iscrizione al Registro F-Gas', d: 'L’impresa si iscrive al Registro Telematico Nazionale delle persone e delle imprese certificate, tenuto dalle Camere di Commercio. Dopo l’iscrizione ha 8 mesi per ottenere il certificato.' },
  { t: 'Personale certificato', d: 'L’impresa deve impiegare tecnici in possesso della certificazione F-Gas della persona, nella categoria giusta e in numero sufficiente per il volume di lavoro che svolge.' },
  { t: 'Strumenti adeguati', d: 'Servono gli strumenti necessari per le attività che si fanno: per esempio per il recupero del gas, il controllo delle perdite e le lavorazioni sui circuiti.' },
  { t: 'Procedure scritte', d: 'L’impresa deve avere procedure e istruzioni che dimostrano come lavora nel rispetto delle regole F-Gas: chi fa cosa, con quali strumenti, come si registrano e si comunicano gli interventi.' },
  { t: 'Verifica dell’organismo', d: 'L’organismo di certificazione, nel nostro caso IMQ, valuta documenti, personale, strumenti e procedure. Se tutto è in regola rilascia il certificato all’impresa.' },
];

export const passiImpresa = [
  { titolo: 'Verifica preliminare', testo: 'Guardiamo insieme la tua situazione: personale, strumenti, documenti. Ti diciamo cosa c’è e cosa manca.' },
  { titolo: 'Prepariamo l’impresa', testo: 'Ti aiutiamo a sistemare documentazione e procedure e a colmare le eventuali carenze.' },
  { titolo: 'IMQ certifica', testo: 'IMQ, Organismo di Certificazione, fa la sua verifica e rilascia il certificato all’impresa.' },
];

export const adempimenti = [
  'Consulenza normativa F-Gas e verifica degli obblighi applicabili',
  'Iscrizioni e abilitazioni',
  'Supporto al Registro F-Gas e alla Banca Dati F-Gas',
  'Gestione e verifica delle abilitazioni necessarie',
  'Assistenza nella comunicazione degli interventi',
  'Verifica della corretta gestione documentale',
  'Assistenza per problemi operativi con la Banca Dati',
];

const faqDifferenza = {
  domanda: "Che differenza c’è tra certificazione della persona e dell’impresa?",
  risposta: 'La certificazione della persona riguarda il singolo tecnico: si ottiene superando l’esame teorico e pratico e la rilascia un organismo di certificazione, nel nostro caso IMQ. La certificazione dell’impresa riguarda l’azienda che svolge le attività e richiede, tra l’altro, personale certificato, attrezzature adeguate e procedure. Per ottenere quest’ultima possiamo accompagnarti noi.',
};
const faqSenzaPatentino = {
  domanda: 'Posso installare un climatizzatore senza patentino?',
  risposta: 'In generale no: installare, mantenere o riparare apparecchiature che contengono gas fluorurati richiede la certificazione della persona, nella categoria giusta, e l’iscrizione al Registro. Se non sei sicuro che il tuo caso rientri, scrivi a Michela e lo vediamo insieme.',
};

export const faqIngresso = [faqDifferenza, faqSenzaPatentino];

export const faqPersona = [
  {
    domanda: 'Quanto dura la certificazione?',
    risposta: 'La certificazione della persona dura 10 anni dalla data di emissione. Ogni anno c’è una verifica di sorveglianza fatta sui documenti: una dichiarazione sui reclami e sull’attività svolta, l’estratto della Banca Dati F-Gas con gli interventi, il documento d’identità e la prova del pagamento. Per rinnovarla si rifà l’esame, e la domanda va presentata entro 60 giorni prima della scadenza.',
  },
  faqSenzaPatentino,
  {
    domanda: 'Cosa succede se la mia certificazione scade?',
    risposta: 'Se non invii i documenti della verifica annuale, la certificazione viene sospesa. Se i documenti non arrivano nemmeno entro 180 giorni dopo la scadenza, viene revocata e, prima di fare un nuovo intervento, bisogna rifare tutto l’iter con esame teorico e pratico. Alla scadenza dei 10 anni la certificazione si rinnova rifacendo l’esame.',
  },
  faqDifferenza,
];

export const faqImpresa = [
  {
    domanda: 'La mia impresa deve essere certificata?',
    risposta: 'Sì, se installa, ripara, fa manutenzione o assistenza, o smantella per conto di altri apparecchiature fisse di refrigerazione, condizionamento d’aria e pompe di calore che contengono gas fluorurati. Se hai dubbi sul tuo caso, scrivi a Michela e lo vediamo insieme.',
  },
  {
    domanda: 'Basta che i miei tecnici abbiano il patentino?',
    risposta: 'No. Il patentino è la certificazione della persona e serve a ogni tecnico che interviene sugli impianti. L’impresa ha bisogno anche di un proprio certificato, che verifica personale, strumenti e procedure dell’azienda.',
  },
  faqDifferenza,
];
