// Test del motore normativo. Esecuzione: node scripts/test-motore.ts
import assert from 'node:assert/strict';
import { calcola } from '../src/scripts/motore.ts';
import { obblighi, settori } from '../src/data/normativa.ts';

const ids = (e: ReturnType<typeof calcola>) => e.voci.map((v) => v.id);
const base = { dimensione: '1–5 persone', risposte: {}, posseduti: [] as string[] };

// Edilizia: rischio alto -> 4 + 12 = 16 ore, POS e patente a crediti presenti
{
  const e = calcola({ ...base, settore: 'edilizia' });
  assert.ok(ids(e).includes('pos') && ids(e).includes('patente') && ids(e).includes('dvr'));
  assert.match(e.voci.find((v) => v.id === 'lavoratori')!.durata!, /4 ore generale \+ 12 ore specifica.*= 16 ore/);
}
// Uffici: rischio basso -> 8 ore; videoterminali solo se risponde sì
{
  assert.match(calcola({ ...base, settore: 'uffici' }).voci.find((v) => v.id === 'lavoratori')!.durata!, /= 8 ore/);
  assert.ok(!ids(calcola({ ...base, settore: 'uffici' })).includes('vdt'));
  assert.ok(ids(calcola({ ...base, settore: 'uffici', risposte: { vdt: true } })).includes('vdt'));
}
// Agricoltura: rischio medio -> 12 ore
assert.match(calcola({ ...base, settore: 'agricoltura' }).voci.find((v) => v.id === 'lavoratori')!.durata!, /= 12 ore/);
// Ristorazione: HACCP addetti e manuale sempre; rischio basso
{
  const e = calcola({ ...base, settore: 'ristorazione' });
  assert.ok(ids(e).includes('haccp_addetti') && ids(e).includes('haccp_manuale'));
}
// Solo io: spariscono le voci per dipendenti, restano quelle non legate ai dipendenti (HACCP, macchine)
{
  const e = calcola({ ...base, dimensione: 'Solo io', settore: 'ristorazione' });
  assert.ok(!ids(e).includes('lavoratori') && !ids(e).includes('dvr') && !ids(e).includes('dl16'));
  assert.ok(ids(e).includes('haccp_manuale'));
  assert.ok(e.avvisi.some((a) => /da solo/.test(a)));
}
// Edilizia solo io + gru: il patentino resta anche senza dipendenti
{
  const e = calcola({ ...base, dimensione: 'Solo io', settore: 'edilizia', risposte: { gru: true } });
  assert.ok(ids(e).includes('gru') && !ids(e).includes('pos'));
}
// Le risposte "sì" aggiungono; i duplicati non si ripetono
{
  const e = calcola({ ...base, settore: 'edilizia', risposte: { ple: true, gru: true, ponteggi: true, quota: true, confinati: true, affidataria: true, preposti: true } });
  for (const x of ['ple', 'gru', 'ponteggi', 'dpi3', 'confinati', 'cantieri6', 'preposti']) assert.ok(ids(e).includes(x), x);
  assert.equal(new Set(ids(e)).size, ids(e).length);
}
// Titolare RSPP in edilizia: moduli integrativi Costruzioni
assert.match(calcola({ ...base, settore: 'edilizia', risposte: { rspp_dl: true } }).voci.find((v) => v.id === 'rspp_dl')!.durata!, /16 ore.*Costruzioni/);
// Attestati già posseduti: spostati in "gia"; formazione generale sola -> resta la specifica
{
  const e = calcola({ ...base, settore: 'edilizia', posseduti: ['lav_gen', 'lav_spec', 'antincendio'] });
  assert.ok(e.gia.map((v) => v.id).includes('lavoratori') && e.gia.map((v) => v.id).includes('antincendio'));
  assert.ok(!ids(e).includes('lavoratori'));
  const p = calcola({ ...base, settore: 'edilizia', posseduti: ['lav_gen'] }).voci.find((v) => v.id === 'lavoratori')!;
  assert.match(p.durata!, /12 ore di formazione specifica/);
}
// Settore sconosciuto
assert.deepEqual(calcola({ ...base, settore: 'xx' }).voci, []);

// Integrità dei dati: ogni id referenziato esiste; ogni voce ha fonte e spiegazione
for (const s of settori) {
  for (const id of s.fisso) assert.ok(obblighi[id], `${s.id}: id mancante ${id}`);
  for (const d of s.domande) for (const id of d.aggiunge) assert.ok(obblighi[id], `${s.id}/${d.id}: id mancante ${id}`);
}
for (const o of Object.values(obblighi)) {
  assert.ok(o.fonte && o.perche && o.nome, `${o.id}: campi mancanti`);
  // Una voce con `daVerificare` non deve mostrare durate che sono proprio il dato da verificare.
}
// Dati non verificati NON mostrati: haccp senza ore, dpi3 senza ore, soccorso senza ore di aggiornamento
assert.equal(obblighi.haccp_addetti.durata, undefined);
assert.equal(obblighi.dpi3.durata, undefined);
assert.doesNotMatch(obblighi.soccorso.aggiornamento!, /\d+ ore/);

console.log('Motore normativo: tutti i test superati');
