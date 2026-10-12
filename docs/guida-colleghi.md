# Guida per i colleghi – come modificare il sito

Il sito si modifica chiedendolo a Claude (l'IA) dentro la cartella del progetto. Non serve saper programmare.

1. Apri il progetto in Claude Code e descrivi la modifica ("aggiungi una data d'esame F-Gas il 12 novembre", "correggi il telefono nel footer").
2. Claude lavora su una **copia di prova** (branch): il sito vero non cambia.
3. Claude ti dà un link di **anteprima**. Controlla testi, numeri e date.
4. Chiedi l'approvazione a Davide. Solo dopo la modifica viene pubblicata.

## Pubblicare un'edizione di un corso (es. carrellisti a novembre)
Chiedi a Claude, per esempio: *"aggiungi un'edizione del corso carrelli elevatori, carrelli industriali semoventi, sabato 14 e 21 novembre 2026, 8:30–13:30, a Siniscola in sede, iscrizioni aperte, si parte con 6 iscritti"*. Claude la inserisce in `src/data/edizioni.ts` e compare in automatico nella pagina del corso, nel calendario, nel catalogo e in home.

Quando cambia la situazione aggiorna lo **stato**: *iscrizioni aperte* → *confermata* → *ultimi posti* → *completa*. Se l'edizione salta, chiedi di toglierla. Le edizioni passate spariscono da sole.

## Regole d'oro
- **Dati di legge** (ore dei corsi, scadenze di aggiornamento): non vanno cambiati a memoria. Servono sempre una fonte ufficiale e la data di verifica.
- Non scrivere numeri, date o certificazioni che non siano reali e confermati.
- Le foto devono essere reali e leggere (Claude le ottimizza).
- Se qualcosa non torna, non pubblicare: chiedi a Davide.
