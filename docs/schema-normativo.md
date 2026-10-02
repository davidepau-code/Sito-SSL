# Schema normativo – "Scopri cosa ti serve"

Stato: **bozza tecnica completa, da far validare a un RSPP del team (Flavio o Veronica Biselli) prima del lancio.**
Ricerca eseguita il 2 ottobre 2026 sulle fonti ufficiali; le tre ricerche integrali (con URL e livello di certezza per ogni dato) sono in `docs/ricerca/`.

## Come funziona
- **Dati**: `src/data/normativa.ts` – catalogo degli obblighi (norma, articolo, ore, aggiornamento, spiegazione breve) + settori con rischio ATECO + domande sì/no.
- **Motore**: `src/scripts/motore.ts` – funzione pura `calcola(settore, dimensione, risposte, attestati)`. Test: `node scripts/test-motore.ts`.
- **Interfaccia**: `src/scripts/pacchetto-ui.ts` + `src/components/Pacchetto.astro`.
- Il cliente non sceglie i corsi: sceglie settore e dimensione, risponde a fatti (sì/no) e dichiara gli attestati che ha già.

## Fonti principali
- D.Lgs. 81/2008 (Normattiva, testo aggiornato al 23/03/2026): artt. 2, 17, 18, 19, 21, 27, 28, 29, 31, 34, 37, 45–47, 66, 71, 73, 77, 96–97, 136, 173–177.
- **Accordo Stato-Regioni 17/04/2025, Rep. 59/CSR** (GU n. 119 del 24/05/2025): sostituisce gli accordi 2011, 2012 e 2016 (**abroga anche quello sulle attrezzature del 2012**). Allegato IV = classificazione ATECO.
- D.M. 2/9/2021 (antincendio), D.M. 388/2003 (primo soccorso), DPR 177/2011 (spazi confinati), Reg. CE 852/2004 (HACCP).

## Novità 2025 che cambiano i contenuti del sito vecchio
| Tema | Prima | Ora (ASR 2025) |
|---|---|---|
| Datore di lavoro | corso solo se faceva da RSPP | **corso base da 16 ore obbligatorio per ogni datore di lavoro** (entro circa maggio 2027), aggiornamento 6 h/5 anni |
| DL che fa da RSPP | 16/32/48 ore per rischio | 16 h + **modulo comune 8 h**, + integrativo 16 h (costruzioni, agricoltura, chimico) o 12 h (pesca); aggiornamento 8 h/5 anni |
| Lavoratori | specifica 4/6/8 h (sito vecchio, errato) | specifica **4 / 8 / 12 h** (rischio basso/medio/alto); totale 8/12/16 h; aggiornamento 6 h/5 anni |
| Preposti | 8 h / 5 anni | **12 h, aggiornamento 6 h ogni 2 anni**; solo presenza o videoconferenza |
| Dirigenti | 16 h | **12 h**; aggiornamento 6 h/5 anni |
| Neoassunti | 60 giorni | il termine di 60 giorni **non vale più** (FAQ ministero 27/03/2026); si forma "in occasione dell'assunzione" |
| Attrezzature | ASR 2012 | stesse tipologie dentro l'ASR 2025; **nuove**: carri raccogli-frutta, caricatori di materiali, carriponte |
| Antincendio | livelli basso/medio/alto | livelli **1/2/3** = 4/8/16 h, aggiornamenti 2/5/8 h ogni 5 anni |

## Rischio per settore (Allegato IV ASR 2025, ATECO 2007)
Basso (8 h totali): commercio G, alloggio e ristorazione I, J, K, L, M, N. Medio (12 h): agricoltura A, trasporti H, PA, istruzione. Alto (16 h): costruzioni F, manifattura C (incluse industrie alimentari), estrazione, energia, rifiuti, sanità.

## Cose da far validare (prima del lancio)
1. **Assegnazione delle voci per settore** (quali obblighi in `fisso` e quali nelle domande). Es.: RLS sempre elencato; antincendio sempre elencato (il livello 1/2/3 non è determinabile a distanza: lo stabilisce il rischio incendio e le attività DPR 151/2011).
2. **"Solo io"**: si tolgono le voci per lavoratori (art. 21 – autonomi: formazione facoltativa). Conclusione basata sul testo + fonti secondarie; **soci di snc** possono generare obblighi (art. 2): da confermare con un interpello.
3. **RSPP**: limiti di dimensione per farlo da sé (Allegato II: fino a 30 lavoratori per aziende artigiane/industriali e agricole, 20 per la pesca, 200 per le altre). Oggi la UI dice "solo entro certi limiti" senza numeri.
4. **Date**: scadenza del corso datore di lavoro 24/05/2027 (testo) vs 19/05/2027 (FAQ ministero) → in UI "circa maggio 2027".
5. **Aggiornamento primo soccorso**: periodicità triennale certa, ore (4 h?) non verificate → non mostrate.
6. **RLS**: aggiornamento per aziende < 15 lavoratori modificato nel 2026, non verificato → mostrato solo 15–50 e oltre 50.
7. **HACCP in Sardegna**: nessun atto regionale su ore e validità (fonti commerciali discordanti e a volte riferite ad altre regioni) → ore/validità NON mostrate. Chiedere conferma scritta al SIAN dell'ASL.
8. **Allegato IV**: il PDF ministeriale ha refusi (manca la divisione 30; sanità 86–87 troncata). Per i settori proposti non incide, ma non usare la tabella a ruota libera.
9. **Deroga 30 giorni per turismo/ristorazione** (DL 159/2025): da fonti secondarie, non verificata sul testo → non comunicata.
10. **Verifiche periodiche attrezzature** (Allegato VII, PLE triennale dal 2026 L. 34/2026): fonti discordanti → non inserite.
11. **Badge digitale di cantiere**: non ancora operativo (manca il decreto attuativo) → non inserito; la **patente a crediti** (art. 27) sì.
12. **ATECO 2025**: l'Allegato IV è su ATECO 2007; esiste una tabella di conversione (FAQ Regioni) non verificata.

## Aggiornare lo schema
Quando cambia una norma: modificare `src/data/normativa.ts`, aggiornare `DATA_VERIFICA`, eseguire `node scripts/test-motore.ts`, far rivedere a un RSPP. Nessun numero senza fonte.
