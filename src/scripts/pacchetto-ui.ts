// Interfaccia di "Scopri cosa ti serve": legge i campi, chiama il motore, disegna l'elenco. Solo textContent (nessun HTML da stringhe).
import { calcola, messaggio, type Voce } from './motore.ts';
import { settori } from '../data/normativa.ts';
import { azienda } from '../data/azienda.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const selS = $<HTMLSelectElement>('pk-settore');
const selD = $<HTMLSelectElement>('pk-dim');
if (selS && selD) {
  let risposte: Record<string, boolean> = {};

  const posseduti = () => Array.from(document.querySelectorAll<HTMLInputElement>('#pk-attestati-box input:checked')).map((i) => i.value);
  const ingresso = () => ({ settore: selS.value, dimensione: selD.value, risposte, posseduti: posseduti() });
  const el = (tag: string, cls?: string, testo?: string) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (testo) e.textContent = testo;
    return e;
  };

  function voce(v: Voce, gia = false) {
    const li = el('li', 'pk-voce');
    const corpo = el('div', 'pk-corpo');
    const testa = el('div', 'pk-testa');
    // Etichetta a SINISTRA del nome.
    testa.appendChild(el('em', 'pk-tipo ' + v.tipo, v.tipo));
    testa.appendChild(el('strong', undefined, v.nome));
    if (v.slug) {
      const a = el('a', 'pk-link', 'scheda') as HTMLAnchorElement;
      a.href = `/formazione/corsi/${v.slug}/`;
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
    return li;
  }

  function disegna() {
    const inp = ingresso();
    const e = calcola(inp);
    const ul = $('pk-lista'); ul.replaceChildren();
    if (!e.voci.length) {
      const li = el('li', 'pk-voce'); li.appendChild(el('div', 'pk-corpo', 'Nel tuo caso conviene parlarne: scrivici e ti diciamo cosa serve davvero.')); ul.appendChild(li);
    }
    e.voci.forEach((v) => ul.appendChild(voce(v)));
    const gUl = $('pk-gia'); gUl.replaceChildren();
    e.gia.forEach((v) => gUl.appendChild(voce(v, true)));
    $('pk-gia-box').hidden = !e.gia.length;
    const av = $('pk-avvisi'); av.replaceChildren();
    e.avvisi.forEach((t) => av.appendChild(el('p', 'pk-avviso', t)));
    ($('pk-wa') as HTMLAnchorElement).href = azienda.whatsappLink(messaggio(inp, e));
  }

  function disegnaDomande() {
    const s = settori.find((x) => x.id === selS.value);
    const c = $('pk-domande'); c.replaceChildren();
    $('pk-domande-box').hidden = !s || !s.domande.length;
    $('pk-attestati-box').hidden = !s;
    if (!s) return;
    s.domande.forEach((d) => {
      const r = el('div', 'pk-dom');
      r.appendChild(el('span', undefined, d.testo));
      const g = el('div', 'pk-sino'); g.setAttribute('role', 'group'); g.setAttribute('aria-label', d.testo);
      ([['Sì', true], ['No', false]] as const).forEach(([lab, val]) => {
        const b = el('button', undefined, lab) as HTMLButtonElement; b.type = 'button';
        b.setAttribute('aria-pressed', String(risposte[d.id] === val));
        b.addEventListener('click', () => {
          risposte[d.id] = val;
          Array.from(g.children).forEach((x, i) => x.setAttribute('aria-pressed', String(i === (val ? 0 : 1))));
          disegna();
        });
        g.appendChild(b);
      });
      r.appendChild(g); c.appendChild(r);
    });
  }

  function mostra() {
    const s = settori.find((x) => x.id === selS.value);
    $('pk-risultato').hidden = !s; $('pk-vuoto').hidden = !!s;
    risposte = {};
    disegnaDomande();
    if (!s) return;
    $('pk-desc').textContent = s.descrizione;
    disegna();
  }

  selS.addEventListener('change', mostra);
  selD.addEventListener('change', () => { if (selS.value) disegna(); });
  document.querySelectorAll('#pk-attestati-box input').forEach((i) => i.addEventListener('change', () => { if (selS.value) disegna(); }));
  $('pk-modulo').addEventListener('click', () => {
    const f = document.getElementById('modulo-contatto') as HTMLFormElement | null;
    if (!f || !selS.value) return;
    (f.elements.namedItem('messaggio') as HTMLTextAreaElement).value = messaggio(ingresso(), calcola(ingresso()));
    const sv = f.elements.namedItem('servizio') as HTMLSelectElement;
    sv.value = 'Formazione'; sv.dispatchEvent(new Event('change', { bubbles: true }));
    const t = $('contatti');
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
    (f.elements.namedItem('nome') as HTMLInputElement).focus({ preventScroll: true });
  });
}
