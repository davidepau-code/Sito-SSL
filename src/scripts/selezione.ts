// Menu a tendina personalizzato (stile vetro) per i <select data-sel>.
// Il <select> nativo resta la fonte del valore (form, validazione, accessibilità). Su touch/mobile si lascia il selettore nativo.
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

function migliora(select: HTMLSelectElement) {
  if (!fine || select.dataset.selOk) return;
  select.dataset.selOk = '1';
  const scuro = !!select.closest('.modulo');
  const wrap = document.createElement('div');
  wrap.className = 'sel' + (scuro ? ' scuro' : '') + (select.classList.contains('intero') ? ' intero' : '');
  select.parentNode!.insertBefore(wrap, select);
  wrap.appendChild(select);
  select.classList.add('sel-nativo');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const bottone = document.createElement('button');
  bottone.type = 'button';
  bottone.className = 'sel-btn';
  bottone.setAttribute('aria-haspopup', 'listbox');
  bottone.setAttribute('aria-expanded', 'false');
  const label = select.getAttribute('aria-label') || document.querySelector(`label[for="${select.id}"]`)?.textContent;
  if (label) bottone.setAttribute('aria-label', label);
  const testo = document.createElement('span');
  bottone.appendChild(testo);
  bottone.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>');

  const lista = document.createElement('ul');
  lista.className = 'sel-lista';
  lista.setAttribute('role', 'listbox');
  lista.hidden = true;
  const opzioni = Array.from(select.options).map((o, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.textContent = o.textContent;
    li.dataset.i = String(i);
    if (!o.value) li.classList.add('segnaposto');
    li.addEventListener('mousedown', (e) => e.preventDefault());
    li.addEventListener('click', () => scegli(i));
    lista.appendChild(li);
    return li;
  });
  wrap.append(bottone, lista);

  let attivo = select.selectedIndex;
  const aggiorna = () => {
    testo.textContent = select.options[select.selectedIndex]?.textContent ?? '';
    bottone.classList.toggle('vuoto', !select.value);
    opzioni.forEach((li, i) => { li.setAttribute('aria-selected', String(i === select.selectedIndex)); li.classList.toggle('attivo', i === attivo); });
  };
  const apri = () => { lista.hidden = false; bottone.setAttribute('aria-expanded', 'true'); attivo = select.selectedIndex; aggiorna(); opzioni[attivo]?.scrollIntoView({ block: 'nearest' }); };
  const chiudi = () => { lista.hidden = true; bottone.setAttribute('aria-expanded', 'false'); };
  const scegli = (i: number) => {
    select.selectedIndex = i;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    aggiorna(); chiudi(); bottone.focus();
  };
  const muovi = (d: number) => { attivo = Math.min(opzioni.length - 1, Math.max(0, attivo + d)); aggiorna(); opzioni[attivo].scrollIntoView({ block: 'nearest' }); };

  bottone.addEventListener('click', () => (lista.hidden ? apri() : chiudi()));
  bottone.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (lista.hidden) apri(); else muovi(e.key === 'ArrowDown' ? 1 : -1); }
    else if ((e.key === 'Enter' || e.key === ' ') && !lista.hidden) { e.preventDefault(); scegli(attivo); }
    else if (e.key === 'Escape' && !lista.hidden) { e.preventDefault(); chiudi(); }
    else if (e.key === 'Tab') chiudi();
    else if (e.key.length === 1) { // ricerca alla digitazione
      const i = Array.from(select.options).findIndex((o, k) => k > 0 && o.text.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) { attivo = i; if (lista.hidden) scegli(i); else { aggiorna(); opzioni[i].scrollIntoView({ block: 'nearest' }); } }
    }
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target as Node)) chiudi(); });
  select.addEventListener('change', aggiorna);
  aggiorna();
}

document.querySelectorAll<HTMLSelectElement>('select[data-sel]').forEach(migliora);
