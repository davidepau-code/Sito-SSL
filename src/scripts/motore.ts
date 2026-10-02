// Motore di calcolo: da (settore, dimensione, risposte, attestati posseduti) all'elenco di ciò che serve.
// Funzione pura, senza DOM: testabile con Node (v. scripts/test-motore.mjs) e usata dal browser.
import { obblighi, settori, ORE_SPECIFICA, type Obbligo } from '../data/normativa.ts';

export type Ingresso = {
  settore: string;
  dimensione: string; // una delle `dimensioni` o ''
  risposte: Record<string, boolean>;
  posseduti: string[]; // id da `attestati`
};
export type Voce = Obbligo & { nota?: string };
export type Esito = { voci: Voce[]; gia: Voce[]; avvisi: string[]; rischio?: string; ateco?: string };

export function calcola(inp: Ingresso): Esito {
  const s = settori.find((x) => x.id === inp.settore);
  if (!s) return { voci: [], gia: [], avvisi: [] };
  const solo = inp.dimensione === 'Solo io';

  // 1. Voci del settore + quelle attivate dalle risposte "sì"
  const ids: string[] = [...s.fisso];
  for (const d of s.domande) if (inp.risposte[d.id]) ids.push(...d.aggiunge);
  const visti = new Set<string>();
  let voci: Voce[] = [];
  for (const id of ids) {
    if (visti.has(id)) continue;
    visti.add(id);
    const o = obblighi[id];
    if (!o) continue;
    if (solo && o.perDipendenti) continue; // il titolare da solo ha obblighi diversi (art. 21)
    voci.push({ ...o });
  }

  // 2. Durata della formazione lavoratori in base al rischio del settore
  const lav = voci.find((v) => v.id === 'lavoratori');
  if (lav) {
    if (s.rischio) {
      const sp = ORE_SPECIFICA[s.rischio];
      lav.durata = `4 ore generale + ${sp} ore specifica (rischio ${s.rischio}) = ${4 + sp} ore`;
    } else {
      lav.durata = '4 ore generale + 4, 8 o 12 ore specifica, secondo il rischio del tuo settore';
    }
  }

  // 3. Se il titolare fa da RSPP: moduli integrativi di settore
  const rsppDl = voci.find((v) => v.id === 'rspp_dl');
  if (rsppDl) {
    if (s.id === 'edilizia') rsppDl.durata = '8 ore (modulo comune) + 16 ore (modulo integrativo Costruzioni)';
    if (s.id === 'agricoltura') rsppDl.durata = '8 ore (modulo comune) + 16 ore (modulo integrativo Agricoltura)';
  }

  // 4. Attestati già posseduti: spostati in "già in regola" (con l'aggiornamento da ricordare)
  const ha = new Set(inp.posseduti);
  const gia: Voce[] = [];
  const restano: Voce[] = [];
  for (const v of voci) {
    if (v.id === 'lavoratori') {
      if (ha.has('lav_gen') && ha.has('lav_spec')) { gia.push(v); continue; }
      if (ha.has('lav_gen') && s.rischio) {
        restano.push({ ...v, durata: `${ORE_SPECIFICA[s.rischio]} ore di formazione specifica (rischio ${s.rischio}); la generale è già valida per sempre`, nota: 'La formazione generale ce l\'hai già: manca solo la specifica.' });
        continue;
      }
      restano.push(v); continue;
    }
    const mappa: Record<string, string> = { dl16: 'dl16', rspp_dl: 'rspp_dl', preposti: 'preposti', dirigenti: 'dirigenti', antincendio: 'antincendio', soccorso: 'soccorso', rls: 'rls' };
    if (mappa[v.id] && ha.has(mappa[v.id])) gia.push(v); else restano.push(v);
  }
  voci = restano;

  // 5. Avvisi di contesto
  const avvisi: string[] = [];
  if (solo) avvisi.push('Se lavori da solo, senza dipendenti né collaboratori, gli obblighi sono diversi e spesso minori: restano valide solo le voci che vedi qui. Se hai soci che lavorano con te, scrivici: il quadro cambia.');
  const haLavoratori = voci.some((v) => v.id === 'lavoratori') || gia.some((v) => v.id === 'lavoratori');
  if (!haLavoratori) { /* nessun avviso sul rischio: non ci sono lavoratori da formare */ }
  else if (s.rischio) avvisi.push(`Per la formazione dei lavoratori, il tuo settore (${s.ateco}) è classificato a rischio ${s.rischio}. Se alcune mansioni espongono a un rischio maggiore, la formazione specifica si adegua.`);
  else avvisi.push('Non conosciamo il rischio del tuo settore: ti diciamo noi quale formazione specifica serve in base al codice ATECO.');

  return { voci, gia, avvisi, rischio: s.rischio, ateco: s.ateco };
}

/** Testo per WhatsApp / modulo. */
export function messaggio(inp: Ingresso, esito: Esito): string {
  const s = settori.find((x) => x.id === inp.settore);
  if (!s) return '';
  let m = `Buongiorno, ho un'attività nel settore "${s.etichetta}"${inp.dimensione ? ` (${inp.dimensione.toLowerCase()})` : ''}.`;
  if (esito.voci.length) m += `\nDal vostro sito risulta che mi servono:\n- ${esito.voci.map((v) => v.nome).join('\n- ')}`;
  if (esito.gia.length) m += `\nHo già: ${esito.gia.map((v) => v.nome).join(', ')} (vorrei controllare le scadenze).`;
  m += '\nVorrei un preventivo. Grazie.';
  return m;
}
