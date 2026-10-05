// Dati aziendali: UNICA fonte per tutto il sito (footer, contatti, schema.org, barra mobile).
// Devono coincidere con la scheda Google Business Profile e con i registri esterni (NAP identico).
export const azienda = {
  ragioneSociale: 'Servizi Sicurezza Lavoro snc',
  piva: '01313770917',
  // Numero principale (WhatsApp e chiamate): messo in evidenza ovunque.
  cellulare: { visibile: '320 407 0573', tel: '+393204070573', wa: '393204070573' },
  // Numero fisso: secondario.
  fisso: { visibile: '0784 1949743', tel: '+3907841949743' },
  email: 'info@servizisicurezzalavoro.it',
  // Sede operativa (quella su Google Maps).
  sede: { via: 'Zona Industriale, Comparto C, lotto 24A', cap: '08029', citta: 'Siniscola', provincia: 'NU' },
  // Coordinate della scheda Google Maps dell'attivita (per il segnaposto delle mappe incorporate).
  coordinate: '40.555986,9.6773556',
  // Mappa incorporata (la scheda bianca di Google e' tagliata in alto via CSS).
  mappaIncorporata: 'https://maps.google.com/maps?q=40.555986,9.6773556&z=16&output=embed&hl=it',
  mapsLink: 'https://www.google.com/maps/place/SSL+Servizi+Sicurezza+Lavoro/@40.555986,9.6773556,17z/data=!4m6!3m5!1s0x12dec2ee933aefd1:0xe94bd3577da643a7!8m2!3d40.555986!4d9.6773556',
  sedeLegale: 'Loc. Salapattu snc – 08029 Siniscola (NU)',
  // Orari dalla scheda Google Maps (lun–ven 9–13, 14–18; sabato e domenica chiuso).
  orari: { testo: 'Lunedì – Venerdì, 9:00–13:00 / 14:00–18:00', breve: 'Lun – Ven, 9–13 / 14–18' },
  // Referente F-Gas: Michela (WhatsApp dedicato, indicato da Davide il 5 ottobre 2026).
  fgas: { referente: 'Michela', visibile: '320 783 1980', tel: '+393207831980', wa: '393207831980' },
  whatsappFgas: (messaggio = 'Buongiorno, vorrei informazioni sul F-Gas.') =>
    `https://wa.me/393207831980?text=${encodeURIComponent(messaggio)}`,
  whatsappLink: (messaggio = 'Buongiorno, vorrei informazioni sui vostri servizi.') =>
    `https://wa.me/393204070573?text=${encodeURIComponent(messaggio)}`,
} as const;
