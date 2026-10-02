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
inizia();
document.addEventListener('astro:page-load', inizia);
