// Nasconde le edizioni già concluse (il sito è statico: tra una pubblicazione e l'altra il tempo passa).
// Senza JS le edizioni restano visibili: è comunque la versione corretta al momento della build.
function aggiorna() {
  const oggi = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
  document.querySelectorAll<HTMLElement>('[data-fine]').forEach((el) => { if ((el.dataset.fine || '') < oggi) el.hidden = true; });
  document.querySelectorAll<HTMLElement>('[data-edizioni]').forEach((box) => {
    const vive = box.querySelectorAll('[data-fine]:not([hidden])').length;
    const vuoto = box.querySelector<HTMLElement>('[data-edizioni-vuoto]');
    if (vuoto) vuoto.hidden = vive > 0;
  });
  // gruppi (es. mesi del calendario) rimasti senza edizioni
  document.querySelectorAll<HTMLElement>('[data-ed-gruppo]').forEach((g) => { g.hidden = !g.querySelector('[data-fine]:not([hidden])'); });
  // sezioni da mostrare solo se ci sono edizioni (es. home)
  document.querySelectorAll<HTMLElement>('[data-se-edizioni]').forEach((s) => { s.hidden = !s.querySelector('[data-fine]:not([hidden])'); });
}
aggiorna();
document.addEventListener('astro:page-load', aggiorna);
