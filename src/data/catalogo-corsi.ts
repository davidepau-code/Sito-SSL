// Catalogo corsi (senza prezzi). Fonte: database "Elenco Corsi" di Notion (2 ottobre 2026).
// Ore, ripartizione teoria/pratica, modalità e cadenza degli aggiornamenti sono quelle dei corsi che eroghiamo.
// Le voci senza dato in Notion mostrano "su richiesta": non si inventano ore.
// Un corso = una scheda; le "possibilità" (varianti) stanno dentro la scheda, non in pagine separate.

export type Mod = 'E' | 'V' | 'P'; // E-learning, Videoconferenza, In presenza
export const MODALITA: Record<Mod, string> = { E: 'E-learning', V: 'Videoconferenza', P: 'In presenza' };

export interface Riga {
  nome: string;
  ore: string; // "16" oppure "su richiesta"
  dett?: string; // es. "10 teoria · 6 pratica"
  mod: Mod[] | 'concordare';
  agg?: string; // aggiornamento: "6 ore ogni 5 anni" | "su richiesta"
}
export interface Corso {
  id: string;
  nome: string;
  breve: string; // nome corto per le tile
  per: string; // a chi serve / che cosa è, in una frase
  righe: Riga[];
}
export interface Gruppo { titolo?: string; corsi: Corso[] }
export interface Sezione { id: string; titolo: string; intro: string; gruppi: Gruppo[] }

const EVP: Mod[] = ['E', 'V', 'P'];
const VP: Mod[] = ['V', 'P'];
const P: Mod[] = ['P'];
const SR = 'su richiesta';

export const sezioni: Sezione[] = [
  {
    id: 'sicurezza',
    titolo: 'Sicurezza sul lavoro',
    intro: 'Gli obblighi di legge per chi ha lavoratori in azienda: la formazione che la legge richiede al datore di lavoro, ai lavoratori e a chi ricopre un ruolo nella sicurezza.',
    gruppi: [
      {
        titolo: 'Datore di lavoro e RSPP',
        corsi: [
          {
            id: 'datore-di-lavoro',
            breve: 'Datore di lavoro',
            nome: 'Datore di lavoro',
            per: 'Il corso base per ogni datore di lavoro: ruoli, obblighi e responsabilità in materia di sicurezza. Per le imprese che operano in cantiere c\'è il modulo aggiuntivo.',
            righe: [
              { nome: 'Formazione iniziale', ore: '16', mod: EVP, agg: '6 ore ogni 5 anni' },
              { nome: 'Modulo aggiuntivo cantieri', ore: '6', mod: EVP },
              { nome: 'Formazione iniziale + modulo cantieri', ore: '22', mod: EVP },
            ],
          },
          {
            id: 'datore-rspp',
            breve: 'Datore di lavoro e RSPP',
            nome: 'Datore di lavoro che svolge il ruolo di RSPP',
            per: 'Per chi vuole ricoprire direttamente il ruolo di Responsabile del Servizio di Prevenzione e Protezione nella propria azienda, nei limiti previsti dalla legge.',
            righe: [{ nome: 'Corso completo', ore: '24', mod: VP, agg: '8 ore ogni 5 anni' }],
          },
          {
            id: 'rspp',
            breve: 'RSPP',
            nome: 'RSPP – Responsabile del Servizio di Prevenzione e Protezione',
            per: 'Per chi fa dell\'RSPP il proprio incarico, in azienda o come professionista esterno. Si parte dal modulo comune e si aggiunge il modulo specialistico del settore di attività (ATECO).',
            righe: [
              { nome: 'Modulo comune', ore: '76', dett: '28 modulo A + 48 modulo B comune', mod: VP, agg: SR },
              { nome: 'Specialistico agricoltura e silvicoltura', ore: '16', mod: VP },
              { nome: 'Specialistico pesca e acquacoltura', ore: '12', mod: VP },
              { nome: 'Specialistico manifatturiero e chimico-petrolchimico', ore: '16', mod: VP },
              { nome: 'Integrativo costruzioni', ore: '16', mod: VP },
              { nome: 'RSPP esterno (moduli A + B + C)', ore: '112–116', dett: 'secondo il settore di attività', mod: VP },
            ],
          },
        ],
      },
      {
        titolo: 'Lavoratori, primo soccorso, antincendio e RLS',
        corsi: [
          {
            id: 'lavoratori',
            breve: 'Lavoratori (generale e specifica)',
            nome: 'Formazione dei lavoratori',
            per: 'Obbligatoria per chi lavora alle dipendenze, a ogni assunzione. Una parte generale uguale per tutti e una parte specifica che dipende dal livello di rischio dell\'attività.',
            righe: [
              { nome: 'Formazione generale', ore: '4', mod: EVP, agg: 'non scade' },
              { nome: 'Formazione specifica – rischio basso', ore: '4', mod: EVP, agg: '6 ore ogni 5 anni' },
              { nome: 'Formazione specifica – rischio medio', ore: '8', mod: VP, agg: '6 ore ogni 5 anni' },
              { nome: 'Formazione specifica – rischio alto', ore: '12', mod: VP, agg: '6 ore ogni 5 anni' },
              { nome: 'Generale + specifica – rischio basso', ore: '8', mod: EVP },
              { nome: 'Generale + specifica – rischio medio', ore: '12', mod: VP },
              { nome: 'Generale + specifica – rischio alto', ore: '16', mod: VP },
            ],
          },
          {
            id: 'primo-soccorso',
            breve: 'Primo soccorso',
            nome: 'Primo soccorso',
            per: 'Per gli addetti al primo soccorso aziendale. Il gruppo (A, B o C) dipende dal tipo di attività e dal numero di lavoratori.',
            righe: [
              { nome: 'Gruppo A', ore: '16', dett: '10 teoria · 6 pratica', mod: P, agg: '6 ore ogni 3 anni' },
              { nome: 'Gruppi B e C', ore: '12', dett: '8 teoria · 4 pratica', mod: P, agg: '4 ore ogni 3 anni' },
            ],
          },
          {
            id: 'antincendio',
            breve: 'Antincendio',
            nome: 'Antincendio',
            per: 'Per gli addetti alla gestione delle emergenze e alla prevenzione incendi. Il livello (1, 2 o 3) dipende dal rischio incendio dell\'azienda.',
            righe: [
              { nome: 'Livello 1', ore: '4', dett: '2 teoria · 2 pratica', mod: VP, agg: '2 ore ogni 5 anni' },
              { nome: 'Livello 2', ore: '8', dett: '5 teoria · 3 pratica', mod: VP, agg: '5 ore ogni 5 anni' },
              { nome: 'Livello 3', ore: '16', dett: '12 teoria · 4 pratica', mod: VP, agg: '8 ore ogni 5 anni' },
            ],
          },
          {
            id: 'rls',
            breve: 'RLS',
            nome: 'RLS – Rappresentante dei lavoratori per la sicurezza',
            per: 'Per il lavoratore eletto o designato a rappresentare i colleghi sui temi della sicurezza. L\'aggiornamento è annuale.',
            righe: [
              { nome: 'Corso base', ore: '32', mod: ['V'], agg: 'ogni anno' },
              { nome: 'Aggiornamento – aziende fino a 50 lavoratori', ore: '4', mod: ['V'] },
              { nome: 'Aggiornamento – aziende oltre 50 lavoratori', ore: '8', mod: ['V'] },
            ],
          },
        ],
      },
      {
        titolo: 'Preposti, coordinatori e altre figure',
        corsi: [
          {
            id: 'preposto',
            breve: 'Preposto',
            nome: 'Preposto',
            per: 'Per chi coordina e sorveglia il lavoro degli altri (capisquadra, capi reparto, responsabili di turno). Un ruolo con obblighi e responsabilità precisi.',
            righe: [{ nome: 'Formazione specifica', ore: '12', mod: VP, agg: '6 ore ogni 2 anni' }],
          },
          {
            id: 'coordinatori',
            breve: 'Coordinatore per la sicurezza (CSP / CSE)',
            nome: 'Coordinatore per la sicurezza nei cantieri (CSP / CSE)',
            per: 'Per i professionisti che coordinano la sicurezza in fase di progettazione (CSP) e di esecuzione dei lavori (CSE) nei cantieri temporanei o mobili.',
            righe: [{ nome: 'Corso di formazione', ore: '120', mod: VP, agg: '40 ore ogni 5 anni' }],
          },
          {
            id: 'movieri',
            breve: 'Movieri',
            nome: 'Movieri – segnaletica stradale in presenza di traffico',
            per: 'Per chi pianifica, controlla e apposita la segnaletica nei cantieri stradali, con traffico veicolare.',
            righe: [
              { nome: 'Lavoratori', ore: '8', dett: '4 teoria · 4 pratica', mod: 'concordare', agg: '6 ore ogni 5 anni' },
              { nome: 'Preposti', ore: '12', dett: '8 teoria · 4 pratica', mod: 'concordare', agg: '6 ore ogni 5 anni' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'attrezzature',
    titolo: 'Macchine e attrezzature',
    intro: 'Abilitazione alla conduzione di macchine e attrezzature che la legge riserva a operatori formati. Ogni scheda comprende tutte le possibilità del tipo di macchina: dicci la tua e ti diciamo quale serve. Il corso è sempre in presenza, perché comprende la prova pratica.',
    gruppi: [
      {
        corsi: [
          {
            id: 'carrelli',
            breve: 'Carrelli elevatori',
            nome: 'Carrelli elevatori',
            per: 'Per chi guida carrelli in magazzino, in produzione o in cantiere.',
            righe: [
              { nome: 'Carrelli industriali semoventi', ore: '12', dett: '8 teoria · 4 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Carrelli semoventi a braccio telescopico', ore: '12', dett: '8 teoria · 4 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Sollevatori / elevatori semoventi telescopici rotativi', ore: '12', dett: '8 teoria · 4 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Combinato: industriali + telescopici + rotativi', ore: '16', dett: '8 teoria · 8 pratica', mod: P, agg: SR },
            ],
          },
          {
            id: 'ple',
            breve: 'Piattaforme elevabili (PLE)',
            nome: 'Piattaforme di lavoro elevabili (PLE)',
            per: 'Per chi lavora in quota con cestelli e piattaforme elevabili.',
            righe: [
              { nome: 'PLE con stabilizzatori', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'PLE senza stabilizzatori', ore: '8', dett: '4 teoria · 4 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'PLE con e senza stabilizzatori', ore: '14', dett: '6 teoria · 8 pratica', mod: P, agg: SR },
            ],
          },
          {
            id: 'mmt',
            breve: 'Macchine movimento terra',
            nome: 'Macchine movimento terra',
            per: 'Per chi conduce macchine da scavo e movimentazione in cantiere e cava.',
            righe: [
              { nome: 'Escavatori idraulici', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '8 ore ogni 5 anni' },
              { nome: 'Pale caricatrici frontali', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '8 ore ogni 5 anni' },
              { nome: 'Terne', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '8 ore ogni 5 anni' },
              { nome: 'Autoribaltabili a cingoli', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '8 ore ogni 5 anni' },
              { nome: 'Escavatori a fune', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '8 ore ogni 5 anni' },
              { nome: 'Combinato: escavatori idraulici + pale frontali + terne', ore: '16', dett: '4 teoria · 12 pratica', mod: P, agg: SR },
            ],
          },
          {
            id: 'gru-torre',
            breve: 'Gru a torre',
            nome: 'Gru a torre',
            per: 'Per gli operatori delle gru a torre dei cantieri edili.',
            righe: [
              { nome: 'Rotazione in basso', ore: '12', dett: '8 teoria · 4 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Rotazione in alto', ore: '12', dett: '8 teoria · 4 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Rotazione in basso e in alto', ore: '14', dett: '8 teoria · 6 pratica', mod: P, agg: SR },
            ],
          },
          {
            id: 'autogru',
            breve: 'Autogru',
            nome: 'Autogru',
            per: 'Per chi conduce autogru, con falcone fisso o telescopico.',
            righe: [
              { nome: 'Autogru con falcone fisso', ore: '14', dett: '7 teoria · 7 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Autogru con falcone telescopico', ore: '22', dett: '11 teoria · 11 pratica', mod: P, agg: '4 ore ogni 5 anni' },
            ],
          },
          {
            id: 'camion-gru',
            breve: 'Camion gru',
            nome: 'Gru per autocarro (camion gru)',
            per: 'Per chi opera con la gru montata sull\'autocarro.',
            righe: [{ nome: 'Camion gru', ore: '12', dett: '4 teoria · 8 pratica', mod: P, agg: '8 ore ogni 5 anni' }],
          },
          {
            id: 'carriponte',
            breve: 'Carriponte e gru a cavalletto',
            nome: 'Carriponte e gru a cavalletto',
            per: 'Per chi lavora con carriponte in stabilimento e magazzino. La scelta dipende da come si comanda la macchina.',
            righe: [
              { nome: 'Comando in cabina', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Comando pensile', ore: '10', dett: '4 teoria · 6 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Comando in cabina e pensile', ore: '11', dett: '4 teoria · 7 pratica', mod: P, agg: '4 ore ogni 5 anni' },
            ],
          },
          {
            id: 'trattori',
            breve: 'Trattori agricoli e forestali',
            nome: 'Trattori agricoli e forestali',
            per: 'Per chi conduce trattori in agricoltura e nelle attività forestali.',
            righe: [
              { nome: 'Trattori a ruote', ore: '8', dett: '3 teoria · 5 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Trattori a cingoli', ore: '8', dett: '3 teoria · 5 pratica', mod: P, agg: '4 ore ogni 5 anni' },
              { nome: 'Trattori a ruote e a cingoli', ore: SR, mod: P },
            ],
          },
          {
            id: 'pompe-cls',
            breve: 'Pompe per calcestruzzo',
            nome: 'Pompe per calcestruzzo',
            per: 'Per gli operatori di pompe e autopompe per il calcestruzzo.',
            righe: [{ nome: 'Pompe per calcestruzzo', ore: SR, mod: P }],
          },
        ],
      },
    ],
  },
  {
    id: 'rischi',
    titolo: 'Rischi specifici',
    intro: 'Per ambienti e lavorazioni particolari: spazi confinati, lavori in quota, impianti elettrici, merci pericolose.',
    gruppi: [
      {
        titolo: 'Spazi confinati',
        corsi: [
          {
            id: 'confinati',
            breve: 'Spazi confinati',
            nome: 'Lavori in ambienti sospetti di inquinamento o confinati',
            per: 'Per chi lavora in ambienti con accesso difficile e aria che può essere pericolosa: cisterne, pozzi, vasche, fosse e simili. Per lavoratori, datori di lavoro e lavoratori autonomi; comprende teoria e addestramento pratico.',
            righe: [{ nome: 'Formazione e addestramento', ore: '12', dett: '4 teoria · 8 pratica', mod: P, agg: '4 ore ogni 5 anni' }],
          },
        ],
      },
      {
        titolo: 'Lavori in quota e ponteggi',
        corsi: [
          {
            id: 'lavori-in-quota',
            breve: 'Lavori in quota',
            nome: 'Lavori in quota',
            per: 'Per chi lavora a più di due metri di altezza con dispositivi anticaduta e sistemi di protezione.',
            righe: [{ nome: 'Operatori lavori in quota', ore: '8', dett: '4 teoria · 4 pratica', mod: VP, agg: '4 ore ogni 5 anni' }],
          },
          {
            id: 'ponteggi',
            breve: 'Ponteggi',
            nome: 'Ponteggi',
            per: 'Per gli addetti al montaggio, allo smontaggio e alla trasformazione dei ponteggi.',
            righe: [{ nome: 'Montaggio, smontaggio e trasformazione', ore: '28', dett: '14 teoria · 14 pratica', mod: VP, agg: '4 ore ogni 4 anni' }],
          },
        ],
      },
      {
        titolo: 'Impianti elettrici e rinnovabili',
        corsi: [
          {
            id: 'pes-pav-pei',
            breve: 'Lavori elettrici (PES, PAV, PEI)',
            nome: 'Lavori elettrici (PES, PAV, PEI)',
            per: 'Per chi esegue lavori su impianti elettrici o in prossimità di parti in tensione, secondo la norma CEI 11-27.',
            righe: [{ nome: 'Formazione per lavori elettrici', ore: '16', dett: '14 teoria · 2 pratica', mod: VP, agg: '8 ore ogni 5 anni' }],
          },
          {
            id: 'fer',
            breve: 'Impianti rinnovabili (FER)',
            nome: 'Impianti da fonti rinnovabili (FER)',
            per: 'Per chi installa e manutiene impianti energetici alimentati da fonti rinnovabili, come il fotovoltaico.',
            righe: [{ nome: 'Installatore e manutentore straordinario', ore: '80', dett: '20 modulo comune · 60 moduli specifici', mod: VP, agg: '16 ore ogni 3 anni' }],
          },
        ],
      },
      {
        titolo: 'Merci pericolose',
        corsi: [
          {
            id: 'adr',
            breve: 'ADR – merci pericolose',
            nome: 'ADR – trasporto di merci pericolose',
            per: 'Per chi gestisce e movimenta sostanze pericolose in azienda.',
            righe: [{ nome: 'Gestione e movimentazione di sostanze pericolose', ore: '4', mod: 'concordare', agg: 'ogni 5 anni' }],
          },
        ],
      },
    ],
  },
  {
    id: 'alimentare',
    titolo: 'Alimentare e HACCP',
    intro: 'Per bar, ristoranti, laboratori e chiunque lavori con gli alimenti.',
    gruppi: [
      {
        corsi: [
          {
            id: 'haccp',
            breve: 'HACCP (addetti e responsabili)',
            nome: 'HACCP',
            per: 'Per chi lavora con gli alimenti: un corso per gli addetti e uno per chi è responsabile del piano di autocontrollo.',
            righe: [
              { nome: 'Addetto', ore: '4', mod: ['E'], agg: 'ti indichiamo noi la cadenza adatta' },
              { nome: 'Responsabile', ore: '8', mod: ['E'], agg: 'ti indichiamo noi la cadenza adatta' },
            ],
          },
        ],
      },
    ],
  },
];
