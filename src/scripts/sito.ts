// Comportamento comune del sito. Gira una sola volta: l'header è "persistente" (ClientRouter),
// quindi i suoi listener restano; le parti legate alla singola pagina si rifanno a ogni "astro:page-load".
import { iniziaSelezioni } from './selezione.ts';

const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id: string) => document.getElementById(id);

// ---- Header (una volta sola) ----
const nav = $('navbar')!;
const onScroll = () => nav.classList.toggle('scroll', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });

$('tema')!.addEventListener('click', () => {
  const r = document.documentElement;
  const scuroOra = r.dataset.tema ? r.dataset.tema === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const nuovo = scuroOra ? 'light' : 'dark';
  if (!ridotto) { r.classList.add('tema-anim'); setTimeout(() => r.classList.remove('tema-anim'), 600); }
  r.dataset.tema = nuovo;
  // La scelta col pulsante vale solo per questa visita (sessionStorage): alla prossima il sito torna a seguire il tema del dispositivo.
  try { sessionStorage.setItem('tema', nuovo); } catch {}
});

const burger = $('hamburger')!, drop = $('tendina')!, icona = $('hamburger-icona')!;
const IC_APRI = 'M4 7h16M4 12h16M4 17h16', IC_CHIUDI = 'M6 6l12 12M18 6 6 18';
const chiudiTendina = () => { drop.classList.remove('aperta'); burger.setAttribute('aria-expanded', 'false'); icona.setAttribute('d', IC_APRI); };
drop.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) chiudiTendina(); });
burger.addEventListener('click', () => {
  const aperto = drop.classList.toggle('aperta');
  burger.setAttribute('aria-expanded', String(aperto));
  icona.setAttribute('d', aperto ? IC_CHIUDI : IC_APRI);
});

// Pillola del menu: sta nell'header persistente, quindi scorre davvero da una voce all'altra.
const menu = document.querySelector<HTMLElement>('.menu')!;
const pillola = menu.querySelector<HTMLElement>('.menu-ind')!;
let pos: { l: number; w: number } | null = null;
const attiva = (href: string, path: string) => (href === '/' ? path === '/' : href.startsWith('/') && path.startsWith(href));

function aggiornaMenu(anima: boolean) {
  const path = location.pathname;
  document.querySelectorAll<HTMLAnchorElement>('.menu a, .tendina a:not(.btn)').forEach((a) => {
    if (attiva(a.getAttribute('href') || '', path)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const cur = menu.querySelector<HTMLElement>('a[aria-current="page"]');
  if (!menu.offsetWidth) { pos = null; return; } // menu compatto (tendina): nessuna pillola
  if (!cur) { pillola.style.opacity = '0'; return; }
  const nuova = { l: cur.offsetLeft, w: cur.offsetWidth };
  const prima = pos;
  // solo transform (compositor): niente ricalcolo del layout a ogni fotogramma
  pillola.style.width = nuova.w + 'px';
  pillola.style.transform = `translateX(${nuova.l}px)`;
  pillola.style.opacity = '1';
  if (anima && prima && !ridotto && (prima.l !== nuova.l || prima.w !== nuova.w)) {
    pillola.animate(
      [{ transform: `translateX(${prima.l}px) scaleX(${prima.w / nuova.w})` }, { transform: `translateX(${nuova.l}px) scaleX(1)` }],
      { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }
  pos = nuova;
}
aggiornaMenu(false);
document.fonts?.ready.then(() => aggiornaMenu(false));
addEventListener('resize', () => aggiornaMenu(false));
document.addEventListener('astro:after-swap', () => { chiudiTendina(); aggiornaMenu(true); });

// ---- Delegati globali (una volta sola) ----
document.addEventListener('mousemove', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('.glow');
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
});
// "Richiedi preventivo": scorre al modulo, con offset per la navbar
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('[data-contatti]');
  const t = $('contatti');
  if (!a || !t) return;
  e.preventDefault();
  scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: ridotto ? 'auto' : 'smooth' });
});

// Modulo di contatto (per ora non attivo: rimanda a WhatsApp, telefono, email)
// ---- Consenso ai cookie (serve solo per la mappa di Google) ----
const CHIAVE = 'consenso-cookie';
const SCADENZA = 365 * 24 * 3600 * 1000; // la scelta si richiede di nuovo dopo 12 mesi (le linee guida del Garante vietano di farlo prima di 6)
const leggiConsenso = (): string | null => {
  try {
    const v = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
    return v && (v.s === 'si' || v.s === 'no') && Date.now() - v.t < SCADENZA ? v.s : null;
  } catch { return null; }
};
const salvaConsenso = (s: string) => { try { localStorage.setItem(CHIAVE, JSON.stringify({ s, t: Date.now() })); } catch {} };
function applicaConsenso() {
  const c = leggiConsenso();
  document.querySelectorAll<HTMLIFrameElement>('iframe[data-src]').forEach((f) => {
    const vuota = f.parentElement?.querySelector<HTMLElement>('[data-mappa-vuota]');
    if (c === 'si') { if (!f.src) f.src = f.dataset.src!; f.hidden = false; if (vuota) vuota.hidden = true; }
    else { f.hidden = true; if (vuota) vuota.hidden = false; }
  });
  const b = document.getElementById('cookie-banner');
  if (b) b.hidden = c !== null;
}
document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const scelta = t.closest<HTMLElement>('[data-consenso]');
  if (scelta) {
    salvaConsenso(scelta.dataset.consenso!);
    applicaConsenso();
  } else if (t.closest('[data-cookie-preferenze]')) {
    try { localStorage.removeItem(CHIAVE); } catch {}
    applicaConsenso();
  }
});

const apertura = Date.now();
document.addEventListener('submit', async (e) => {
  const f = e.target as HTMLFormElement;
  if (f.id !== 'modulo-contatto') return;
  e.preventDefault(); e.stopImmediatePropagation(); // prima del router, che altrimenti la tratterebbe come navigazione
  const esito = $('esito-modulo')!;
  const btn = f.querySelector<HTMLButtonElement>('button[type=submit]')!;
  esito.hidden = false;
  if (!f.reportValidity()) { esito.textContent = 'Controlla i campi obbligatori.'; return; }
  const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.value ?? '';
  btn.disabled = true;
  esito.textContent = 'Invio in corso…';
  try {
    const r = await fetch('/api/contatto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: v('nome'), azienda: v('azienda'), telefono: v('telefono'), email: v('email'), servizio: v('servizio'), messaggio: v('messaggio'), privacy: true, sito: v('sito'), t: Date.now() - apertura }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error('invio');
    f.reset();
    esito.textContent = 'Grazie, abbiamo ricevuto la tua richiesta. Ti ricontattiamo il prima possibile.';
  } catch {
    esito.textContent = 'Non siamo riusciti a inviare il modulo. Scrivici su WhatsApp o chiama il 320 407 0573, oppure scrivi a info@servizisicurezzalavoro.it.';
  } finally {
    btn.disabled = false;
  }
}, true);

// Il tema scelto deve sopravvivere al cambio pagina (Astro sostituisce gli attributi di <html>)
document.addEventListener('astro:before-swap', (e: any) => {
  const t = document.documentElement.dataset.tema;
  if (t) e.newDocument.documentElement.dataset.tema = t; else delete e.newDocument.documentElement.dataset.tema;
});

// ---- Parti per pagina ----
let io: IntersectionObserver | null = null;
function paginaPronta() {
  onScroll();
  applicaConsenso();
  // Elenchi di date generati alla pubblicazione: via quelle già passate
  const oggi = new Date().toISOString().slice(0, 10);
  document.querySelectorAll<HTMLElement>('[data-sessione]').forEach((el) => { if ((el.dataset.sessione || '') < oggi) el.remove(); });
  // Si vede una sola data per volta: la prossima
  new Set(Array.from(document.querySelectorAll<HTMLElement>('[data-sessione]'), (el) => el.parentElement)).forEach((gr) => {
    gr?.querySelectorAll<HTMLElement>('[data-sessione]').forEach((el, i) => { el.hidden = i > 0; });
  });
  iniziaSelezioni();
  io?.disconnect();
  if (!ridotto && 'IntersectionObserver' in window) {
    io = new IntersectionObserver((voci) => {
      voci.forEach((v) => { if (v.isIntersecting) { v.target.classList.add('rivela-in'); io!.unobserve(v.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) io!.observe(el); });
  }
}
document.addEventListener('astro:page-load', paginaPronta);
