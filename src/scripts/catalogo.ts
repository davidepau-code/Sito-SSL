// Filtro del catalogo corsi: ricerca testuale + modalità. Solo hidden/aria, nessun HTML da stringhe.
function inizia() {
  const barra = document.getElementById('cat-barra');
  if (!barra || barra.dataset.ok) return;
  barra.dataset.ok = '1';
  const q = document.getElementById('cat-q') as HTMLInputElement;
  const vuoto = document.getElementById('cat-vuoto')!;
  const bottoni = Array.from(barra.querySelectorAll<HTMLButtonElement>('.cat-filtri button'));
  let modalita = '';

  const applica = () => {
    const t = q.value.trim().toLowerCase();
    let visibili = 0;
    document.querySelectorAll<HTMLElement>('[data-sezione]').forEach((sez) => {
      let nelleSezione = 0;
      sez.querySelectorAll<HTMLElement>('[data-gruppo]').forEach((gr) => {
        let nelGruppo = 0;
        gr.querySelectorAll<HTMLElement>('[data-corso]').forEach((corso) => {
          const corsoMatch = !t || (corso.dataset.testo || '').includes(t);
          let righe = 0;
          corso.querySelectorAll<HTMLElement>('[data-riga]').forEach((r) => {
            const mods = (r.dataset.mod || '').split(' ');
            const okMod = !modalita || mods.includes(modalita);
            const okTesto = corsoMatch || (r.dataset.nome || '').includes(t);
            const mostra = okMod && okTesto;
            r.hidden = !mostra;
            if (mostra) righe++;
          });
          corso.hidden = righe === 0;
          if (righe) nelGruppo++;
        });
        gr.hidden = nelGruppo === 0;
        nelleSezione += nelGruppo;
      });
      sez.hidden = nelleSezione === 0;
      // con una ricerca o un filtro attivi le sezioni coi risultati si aprono da sole; tolti, tornano come le aveva lasciate la persona
      const filtro = !!t || !!modalita;
      const det = sez as HTMLDetailsElement;
      if (filtro && nelleSezione && !det.open) { det.open = true; det.dataset.auto = '1'; }
      else if (!filtro && det.dataset.auto) { det.open = false; delete det.dataset.auto; }
      visibili += nelleSezione;
    });
    vuoto.hidden = visibili > 0;
  };

  q.addEventListener('input', applica);
  bottoni.forEach((b) => b.addEventListener('click', () => {
    modalita = b.dataset.mod || '';
    bottoni.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    applica();
  }));
}
// dal menu delle aree, o da un indirizzo con #corso, si apre la sezione giusta
function apriDa(id: string) {
  const el = id ? document.getElementById(decodeURIComponent(id)) : null;
  const sez = el?.closest<HTMLDetailsElement>('details[data-sezione]');
  if (sez) { sez.open = true; delete sez.dataset.auto; setTimeout(() => el!.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
}
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('.cat-aree a');
  if (a) { e.preventDefault(); history.replaceState(null, '', a.getAttribute('href')); apriDa(a.hash.slice(1)); }
});
inizia();
if (location.hash) apriDa(location.hash.slice(1));
document.addEventListener('astro:page-load', inizia);
