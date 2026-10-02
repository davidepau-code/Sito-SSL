// Interfaccia di "Scopri cosa ti serve": legge i campi, chiama il motore, aggiorna l'elenco con animazioni.
// Le voci sono riconciliate per id (non si ricostruisce tutta la lista a ogni risposta): quelle nuove entrano, quelle tolte escono.
// Solo textContent (nessun HTML da stringhe).
import { calcola, messaggio, type Voce } from './motore.ts';
import { settori } from '../data/normativa.ts';
import { azienda } from '../data/azienda.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const el = (tag: string, cls?: string, testo?: string) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (testo) e.textContent = testo;
  return e;
};

/** Entrata: l'elemento cresce in altezza e sfuma in ingresso. */
function entra(n: HTMLElement) {
  if (ridotto) return;
  const h = n.offsetHeight;
  const cs = getComputedStyle(n);
  n.style.overflow = 'hidden';
  const a = n.animate(
    [
      { height: '0px', opacity: 0, transform: 'translateY(10px)', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-6px' },
      { height: h + 'px', opacity: 1, transform: 'none', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginBottom: '0px' },
    ],
    { duration: 520, easing: EASE },
  );
  a.onfinish = a.oncancel = () => { n.style.overflow = ''; };
}
/** Uscita: l'elemento si richiude e sfuma, poi viene rimosso. */
function esce(n: HTMLElement) {
  if (ridotto) { n.remove(); return; }
  const h = n.offsetHeight;
  n.style.overflow = 'hidden';
  n.style.pointerEvents = 'none';
  const a = n.animate(
    [
      { height: h + 'px', opacity: 1, transform: 'none', marginBottom: '0px' },
      { height: '0px', opacity: 0, transform: 'translateY(-6px) scale(0.98)', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-6px' },
    ],
    { duration: 380, easing: EASE, fill: 'forwards' },
  );
  a.onfinish = () => n.remove();
}

function riempiVoce(li: HTMLElement, v: Voce, gia: boolean) {
  li.replaceChildren();
  const corpo = el('div', 'pk-corpo');
  const testa = el('div', 'pk-testa');
  testa.appendChild(el('em', 'pk-tipo ' + v.tipo, v.tipo)); // etichetta a sinistra del nome
  testa.appendChild(el('strong', undefined, v.nome));
  if (v.catalogo) {
    const a = el('a', 'pk-link', 'nel catalogo') as HTMLAnchorElement;
    a.href = `/formazione/catalogo/#${v.catalogo}`;
    testa.appendChild(a);
  }
  corpo.appendChild(testa);
  if (!gia) corpo.appendChild(el('p', 'pk-perche', v.perche));
  if (v.nota) corpo.appendChild(el('p', 'pk-perche', v.nota));
  const meta = el('div', 'pk-meta');
  if (v.durata && !gia) meta.appendChild(el('span', undefined, 'Durata: ' + v.durata));
  if (v.aggiornamento) meta.appendChild(el('span', undefined, 'Aggiornamento: ' + v.aggiornamento));
  if (meta.childElementCount) corpo.appendChild(meta);
  const fonte = el('p', 'pk-fonte');
  fonte.appendChild(document.createTextNode('Fonte: '));
  if (v.url) {
    const a = el('a', undefined, v.fonte) as HTMLAnchorElement;
    a.href = v.url; a.target = '_blank'; a.rel = 'noopener';
    fonte.appendChild(a);
  } else fonte.appendChild(document.createTextNode(v.fonte));
  corpo.appendChild(fonte);
  li.appendChild(corpo);
}

/** Riconcilia una lista <ul> con le voci: aggiorna, aggiunge (animando) e rimuove (animando). */
function sincronizza(ul: HTMLElement, voci: Voce[], gia: boolean, vuoto?: string) {
  const attuali = new Map<string, HTMLElement>();
  ul.querySelectorAll<HTMLElement>(':scope > li[data-id]').forEach((li) => { if (!li.dataset.uscita) attuali.set(li.dataset.id!, li); });
  const nuovi = new Set(voci.map((v) => v.id));

  attuali.forEach((li, id) => { if (!nuovi.has(id)) { li.dataset.uscita = '1'; esce(li); } });

  let precedente: Element | null = null;
  const aggiunti: HTMLElement[] = [];
  voci.forEach((v) => {
    let li = attuali.get(v.id);
    const firma = JSON.stringify([v.nome, v.durata, v.aggiornamento, v.nota, gia]);
    if (!li) {
      li = el('li', 'pk-voce') as HTMLElement;
      li.dataset.id = v.id;
      li.dataset.firma = firma;
      riempiVoce(li, v, gia);
      aggiunti.push(li);
    } else if (li.dataset.firma !== firma) {
      li.dataset.firma = firma;
      riempiVoce(li, v, gia);
    }
    // ordine corretto nel DOM
    const atteso = precedente ? precedente.nextElementSibling : ul.firstElementChild;
    if (li !== atteso) ul.insertBefore(li, atteso);
    precedente = li;
  });
  aggiunti.forEach(entra);

  // messaggio "nessuna voce"
  const segn = ul.querySelector<HTMLElement>(':scope > li.pk-vuoto-li');
  if (!voci.length && vuoto) {
    if (!segn) { const li = el('li', 'pk-voce pk-vuoto-li'); li.appendChild(el('div', 'pk-corpo', vuoto)); ul.appendChild(li); }
  } else if (segn) segn.remove();
}

/** Mostra/nasconde un blocco con dissolvenza. */
function mostraBlocco(n: HTMLElement, mostra: boolean) {
  if (mostra && n.hidden) {
    n.hidden = false;
    if (!ridotto) n.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: EASE });
  } else if (!mostra && !n.hidden) {
    if (ridotto) { n.hidden = true; return; }
    const a = n.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 220, easing: EASE });
    a.onfinish = () => { n.hidden = true; };
  }
}

function inizia() {
  const selS = $<HTMLSelectElement>('pk-settore');
  const selD = $<HTMLSelectElement>('pk-dim');
  if (!selS || !selD || selS.dataset.pkOk) return;
  selS.dataset.pkOk = '1';
  let risposte: Record<string, boolean> = {};
  let avvisiChiave = '';

  const posseduti = () => Array.from(document.querySelectorAll<HTMLInputElement>('#pk-attestati-box input:checked')).map((i) => i.value);
  const ingresso = () => ({ settore: selS.value, dimensione: selD.value, risposte, posseduti: posseduti() });

  function disegna() {
    const inp = ingresso();
    const e = calcola(inp);
    sincronizza($('pk-lista'), e.voci, false, settori.find((x) => x.id === inp.settore)?.vuoto ?? 'Nel tuo caso conviene parlarne: scrivici e ti diciamo cosa serve davvero.');
    sincronizza($('pk-gia'), e.gia, true);
    mostraBlocco($('pk-gia-box'), e.gia.length > 0);
    const chiave = e.avvisi.join('|');
    if (chiave !== avvisiChiave) {
      avvisiChiave = chiave;
      const av = $('pk-avvisi'); av.replaceChildren();
      e.avvisi.forEach((t) => av.appendChild(el('p', 'pk-avviso', t)));
    }
    ($('pk-wa') as HTMLAnchorElement).href = azienda.whatsappLink(messaggio(inp, e));
  }

  function disegnaDomande() {
    const s = settori.find((x) => x.id === selS.value);
    const c = $('pk-domande'); c.replaceChildren();
    mostraBlocco($('pk-domande-box'), !!s && s.domande.length > 0);
    mostraBlocco($('pk-attestati-box'), !!s);
    if (!s) return;
    s.domande.forEach((d, i) => {
      const r = el('div', 'pk-dom'); r.style.setProperty('--n', String(i));
      r.appendChild(el('span', undefined, d.testo));
      const g = el('div', 'pk-sino'); g.setAttribute('role', 'group'); g.setAttribute('aria-label', d.testo);
      ([['Sì', true], ['No', false]] as const).forEach(([lab, val]) => {
        const b = el('button', undefined, lab) as HTMLButtonElement; b.type = 'button';
        b.setAttribute('aria-pressed', String(risposte[d.id] === val));
        b.addEventListener('click', () => {
          risposte[d.id] = val;
          Array.from(g.children).forEach((x, k) => x.setAttribute('aria-pressed', String(k === (val ? 0 : 1))));
          disegna();
        });
        g.appendChild(b);
      });
      r.appendChild(g); c.appendChild(r);
    });
  }

  function mostra() {
    const s = settori.find((x) => x.id === selS.value);
    const vuoto = $('pk-vuoto');
    mostraBlocco($('pk-risultato'), !!s);
    vuoto.hidden = !!s;
    risposte = {}; avvisiChiave = '';
    // nuovo settore: si riparte da zero (le voci vecchie escono, le nuove entrano)
    disegnaDomande();
    if (!s) return;
    $('pk-desc').textContent = s.descrizione;
    disegna();
  }

  selS.addEventListener('change', mostra);

  // Preset da link (?caso=...): la scheda arriva già compilata e porta il cliente al punto giusto.
  const PRESET: Record<string, { settore?: string; prossimo: 'settore' | 'dim' | 'domande' }> = {
    haccp: { settore: 'ristorazione', prossimo: 'dim' },
    macchine: { settore: 'macchine', prossimo: 'domande' },
    assunto: { prossimo: 'settore' },
  };
  const caso = new URLSearchParams(location.search).get('caso');
  const preset = caso ? PRESET[caso] : undefined;
  if (preset) {
    if (preset.settore) { selS.value = preset.settore; selS.dispatchEvent(new Event('change', { bubbles: true })); }
    const box = $('pacchetto');
    setTimeout(() => {
      scrollTo({ top: box.getBoundingClientRect().top + scrollY - 100, behavior: ridotto ? 'auto' : 'smooth' });
      const sel = preset.prossimo === 'settore' ? selS : selD;
      const btn = sel.closest('.sel')?.querySelector<HTMLButtonElement>('.sel-btn');
      if (preset.prossimo === 'domande') return;
      setTimeout(() => (btn ?? sel).focus({ preventScroll: true }), 500);
      if (preset.prossimo === 'settore' && btn) setTimeout(() => btn.click(), 700);
    }, 350);
  }
  selD.addEventListener('change', () => { if (selS.value) disegna(); });
  document.querySelectorAll('#pk-attestati-box input').forEach((i) => i.addEventListener('change', () => { if (selS.value) disegna(); }));
  $('pk-modulo').addEventListener('click', () => {
    const f = document.getElementById('modulo-contatto') as HTMLFormElement | null;
    if (!f || !selS.value) return;
    (f.elements.namedItem('messaggio') as HTMLTextAreaElement).value = messaggio(ingresso(), calcola(ingresso()));
    const sv = f.elements.namedItem('servizio') as HTMLSelectElement;
    sv.value = 'Formazione'; sv.dispatchEvent(new Event('change', { bubbles: true }));
    const t = $('contatti');
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: ridotto ? 'auto' : 'smooth' });
    (f.elements.namedItem('nome') as HTMLInputElement).focus({ preventScroll: true });
  });
}

inizia();
document.addEventListener('astro:page-load', inizia);
