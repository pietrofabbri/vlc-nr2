# Claude · regole di questa repo

Sito di Volta la carta edizioni: solo la casa editrice. Legatoria, negozio e altre attività avranno domini propri (decisione 0003). Progetto di voltalacarta; regole generali in `voltalacarta/documentazione`, scelte del titolare nel second brain (`scelte-titolare-2026-11`).

## Spendere pochi token

1. Orientati con `INDICE.md` (una riga per file) o `grep -i "parola" INDICE.md`. Apri solo i file che servono.
2. Non aggiornare a mano indici e tabelle tra i marcatori `<!-- indice:… -->`: lo fa l'Action dopo il push.
3. Clone superficiale: `git clone --depth 1`.

## Regole del sito

- Si dà del **lei**. Le tesi stanno su rilegaretesi.it, che dà del tu.
- **Niente carrello**: i libri si ordinano per email (decisione 0002).
- Telefono ed email mai in chiaro: si usa `rivela(...)` nei template.
- Fuori dall'Unione europea dazi e tasse sono a carico di chi riceve: va detto dove si parla di spedizioni.
- Niente pagine su legatoria, negozio o tesi: vanno sui loro siti.
- Catalogo dei libri in `src/data/libri.csv` (copia dal second brain), collane in `src/data/collane.json`.
- Anteprima: `python3 strumenti/build.py`, poi apri `dist/index.html` con un server locale.

## Regole della repo

- Ciò che si decide in chat → `python3 strumenti/nuova-decisione.py "Titolo" --tag … --sintesi "…"`, poi compila il file.
- Documenti in `docs/`, con frontmatter `titolo`, `stato`, `creato`, `aggiornato`, `tag` (e `sintesi` in una riga).
- Prima del commit: `python3 strumenti/controlla.py`. Messaggi di commit `tipo(ambito): descrizione`.
- Mai segreti o dati sensibili nella repo.
