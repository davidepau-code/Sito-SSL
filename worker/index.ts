// Worker del sito: serve i file statici e gestisce solo POST /api/contatto (invio email via Resend).
interface Env {
  ASSETS: { fetch: (r: Request) => Promise<Response> };
  RESEND_API_KEY?: string; // segreto, impostato su Cloudflare
  EMAIL_A: string;         // destinatario delle richieste
  EMAIL_CC?: string;       // copia conoscenza (facoltativa)
  EMAIL_DA: string;        // mittente (dominio verificato su Resend)
}

const json = (corpo: object, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

const esc = (t: string) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const pulisci = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '');

async function contatto(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, errore: 'origine' }, 403);
  let d: Record<string, unknown>;
  try { d = await request.json(); } catch { return json({ ok: false, errore: 'dati' }, 400); }

  // Trappola per i robot: il campo "sito" è nascosto, chi lo compila non è una persona. Si risponde "ok" senza inviare nulla.
  if (pulisci(d.sito, 200)) return json({ ok: true });
  // Un modulo compilato in meno di 3 secondi è quasi sempre un robot.
  const t = Number(d.t);
  if (Number.isFinite(t) && t < 3000) return json({ ok: true });

  const nome = pulisci(d.nome, 120);
  const azienda = pulisci(d.azienda, 160);
  const telefono = pulisci(d.telefono, 40);
  const email = pulisci(d.email, 160);
  const servizio = pulisci(d.servizio, 60);
  const messaggio = typeof d.messaggio === 'string' ? d.messaggio.trim().slice(0, 4000) : '';
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || d.privacy !== true) return json({ ok: false, errore: 'campi' }, 400);
  if (!env.RESEND_API_KEY) return json({ ok: false, errore: 'config' }, 503);

  const righe: [string, string][] = [['Nome', nome], ['Azienda', azienda], ['Telefono', telefono], ['Email', email], ['Servizio', servizio]];
  const html = `<h2>Nuova richiesta dal sito</h2><table cellpadding="6">${righe.filter(([, v]) => v).map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>`
    + (messaggio ? `<p><b>Messaggio</b></p><p style="white-space:pre-wrap">${esc(messaggio)}</p>` : '')
    + '<p style="color:#888">Il cliente ha accettato l\'informativa privacy. Rispondi a questa email per scrivergli.</p>';
  const testo = righe.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n') + (messaggio ? `\n\n${messaggio}` : '');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_DA, to: [env.EMAIL_A], ...(env.EMAIL_CC ? { cc: [env.EMAIL_CC] } : {}), reply_to: email, subject: `Richiesta dal sito: ${nome}${servizio ? ' (' + servizio + ')' : ''}`, html, text: testo }),
  });
  if (!r.ok) return json({ ok: false, errore: 'invio' }, 502);
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contatto') {
      if (request.method !== 'POST') return json({ ok: false }, 405);
      return contatto(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
