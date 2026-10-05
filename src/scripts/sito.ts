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
  try { localStorage.setItem('tema', nuovo); } catch {}
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
document.addEventListener('submit', (e) => {
  const f = e.target as HTMLFormElement;
  if (f.id !== 'modulo-contatto') return;
  e.preventDefault(); e.stopImmediatePropagation(); // prima del router, che altrimenti la tratterebbe come navigazione
  const esito = $('esito-modulo')!;
  esito.hidden = false;
  if (!f.reportValidity()) { esito.textContent = 'Controlla i campi obbligatori.'; return; }
  esito.textContent = 'Il modulo online non è ancora attivo: scrivici su WhatsApp o chiama il 320 407 0573, oppure scrivi a info@servizisicurezzalavoro.it.';
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
