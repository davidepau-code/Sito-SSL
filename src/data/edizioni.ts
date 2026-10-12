// EDIZIONI PROGRAMMATE: i corsi con una data fissata, pubblicati sul sito per raccogliere iscrizioni.
// Compaiono nella pagina del corso, nel calendario (/formazione/calendario/), nel catalogo e in home.
// Le edizioni passate spariscono da sole (anche senza ripubblicare il sito).
//
// REGOLA: solo date vere e decise in ufficio. Mai date "di esempio" in produzione.
//
// Come aggiungere un'edizione: copia il modello qui sotto dentro l'elenco `edizioni`, togli i // e cambia i campi.
//   {
//     corso: 'carrelli',                                  // id del corso in src/data/catalogo-corsi.ts
//     variante: 'Carrelli industriali semoventi',          // facoltativo: nome ESATTO di una riga del corso
//     date: ['2026-11-14', '2026-11-21'],                  // i giorni di lezione, formato AAAA-MM-GG
//     orario: '8:30–13:30',                                // facoltativo
//     sede: 'Siniscola, sede SSL',                         // dove si svolge
//     stato: 'aperte',                                     // 'aperte' | 'confermata' | 'ultimi-posti' | 'completa'
//     minimo: 6,                                           // facoltativo: iscritti minimi per partire (solo con 'aperte')
//     nota: 'Portare scarpe antinfortunistiche',           // facoltativo
//   },

export type StatoEdizione = 'aperte' | 'confermata' | 'ultimi-posti' | 'completa';

export interface Edizione {
  corso: string;
  variante?: string;
  date: string[];
  orario?: string;
  sede: string;
  stato: StatoEdizione;
  minimo?: number;
  nota?: string;
}

export const edizioni: Edizione[] = [
  // ← qui le edizioni vere
];

// ---------------------------------------------------------------------------------------------
import { corsoPerId, type Corso } from './catalogo-corsi';

export const STATI: Record<StatoEdizione, { etichetta: string; classe: string }> = {
  aperte: { etichetta: 'Iscrizioni aperte', classe: 'aperte' },
  confermata: { etichetta: 'Confermata', classe: 'confermata' },
  'ultimi-posti': { etichetta: 'Ultimi posti', classe: 'ultimi' },
  completa: { etichetta: 'Completa', classe: 'completa' },
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export interface EdizioneCompleta extends Edizione { c: Corso; inizio: string; fine: string; ore?: string; dett?: string }

// Controllo a ogni build: un errore qui blocca la pubblicazione invece di mostrare dati sbagliati.
const complete: EdizioneCompleta[] = edizioni.map((e, i) => {
  const dove = `edizioni.ts, edizione n. ${i + 1}`;
  const x = corsoPerId(e.corso);
  if (!x) throw new Error(`${dove}: il corso "${e.corso}" non esiste in catalogo-corsi.ts`);
  if (!e.date.length || !e.date.every((d) => ISO.test(d) && !isNaN(Date.parse(d)))) throw new Error(`${dove}: date non valide (formato AAAA-MM-GG)`);
  if (!STATI[e.stato]) throw new Error(`${dove}: stato "${e.stato}" non previsto`);
  if (!e.sede?.trim()) throw new Error(`${dove}: manca la sede`);
  const riga = e.variante ? x.corso.righe.find((r) => r.nome === e.variante) : x.corso.righe.length === 1 ? x.corso.righe[0] : undefined;
  if (e.variante && !riga) throw new Error(`${dove}: la variante "${e.variante}" non esiste nel corso "${x.corso.nome}"`);
  const date = [...e.date].sort();
  return { ...e, date, c: x.corso, inizio: date[0], fine: date[date.length - 1], ore: riga && riga.ore !== 'su richiesta' ? riga.ore : undefined, dett: riga?.dett };
});

// Oggi in Italia, come AAAA-MM-GG (la build gira in UTC).
const oggi = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());

/** Edizioni non ancora concluse, in ordine di data. */
export const prossimeEdizioni = (idCorso?: string) =>
  complete.filter((e) => e.fine >= oggi() && (!idCorso || e.corso === idCorso)).sort((a, b) => a.inizio.localeCompare(b.inizio));

// ---- Date in italiano ----
const d = (iso: string) => new Date(iso + 'T12:00:00Z');
const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('it-IT', { timeZone: 'UTC', ...o });
const giornoBreve = fmt({ weekday: 'short', day: 'numeric' });
const mese = fmt({ month: 'long' });
const anno = fmt({ year: 'numeric' });
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** "Sab 14 e sab 21 novembre 2026" · "Lun 30 novembre – mar 1 dicembre 2026" */
export function testoDate(date: string[]): string {
  const g = date.map((x) => giornoBreve.format(d(x)));
  const stessoMese = date.every((x) => x.slice(0, 7) === date[0].slice(0, 7));
  const fine = date[date.length - 1];
  let t: string;
  if (stessoMese) {
    const elenco = g.length <= 3 ? (g.length === 1 ? g[0] : g.slice(0, -1).join(', ') + ' e ' + g[g.length - 1]) : `${g[0]} – ${g[g.length - 1]}`;
    t = `${elenco} ${mese.format(d(fine))} ${anno.format(d(fine))}`;
  } else {
    t = `${g[0]} ${mese.format(d(date[0]))} – ${g[g.length - 1]} ${mese.format(d(fine))} ${anno.format(d(fine))}`;
  }
  return cap(t);
}
/** "14 nov" per i badge compatti */
export const dataBreve = (iso: string) => fmt({ day: 'numeric', month: 'short' }).format(d(iso));
/** "Novembre 2026" per raggruppare il calendario */
export const meseAnno = (iso: string) => cap(fmt({ month: 'long', year: 'numeric' }).format(d(iso)));
