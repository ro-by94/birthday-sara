
# Sito "Buon Compleanno, Amore Mio!"

Un sito statico elegante (pastello) con cuori fluttuanti e fiori luminosi. Include:
- Messaggio principale romantico
- **Conto alla rovescia** personalizzabile
- **Carosello di foto** (supporta anche caricamento locale non persistente)
- **Timeline** dei momenti più belli

## Struttura del progetto
```
.
├── index.html
├── styles.css
├── main.ts          # Sorgente TypeScript (opzionale per modifiche)
├── main.js          # Versione pronta per il browser (già inclusa in index.html)
├── assets/
│   ├── timeline.json
│   └── photos/
│       ├── photos.json
│       └── README.txt
└── .github/
    └── workflows/
        └── pages.yml   # (Opzionale) Deploy automatico GitHub Pages
```

## Come aggiungere le vostre foto
1. Metti i file immagine in `assets/photos/` (ad es. `assets/photos/viaggio-roma.jpg`).
2. Apri e modifica `assets/photos/photos.json` aggiungendo i percorsi, per esempio:
   ```json
   [
     { "src": "assets/photos/viaggio-roma.jpg", "alt": "Noi al Colosseo" },
     { "src": "assets/photos/picnic.jpg", "alt": "Picnic al parco" }
   ]
   ```
3. (Facoltativo) Puoi anche usare il pulsante "Aggiungi foto" nel sito per caricarle solo nella sessione corrente (non viene salvato nel repository).

## Come personalizzare la timeline
Modifica `assets/timeline.json` mantenendo questo formato:
```json
[
  { "date": "YYYY-MM-DD", "title": "Titolo", "description": "Descrizione" }
]
```

## Come impostare il conto alla rovescia
- Metodo rapido: in `index.html` trova il `div` con id `countdown` e cambia l'attributo `data-target` con la data/ora ISO, per esempio:
  ```html
  <div id="countdown" data-target="2026-06-01T20:30:00">...</div>
  ```
- In alternativa, dal sito apri "Imposta/Personalizza il momento della sorpresa", scegli data/ora e premi **Salva**. Il valore resta memorizzato nel browser (localStorage).

## Pubblicare su GitHub Pages (senza build)
**Metodo A – Impostazione semplice:**
1. Crea un nuovo repository su GitHub (pubblico o privato con Pages attivo).
2. Carica/committa tutti i file di questa cartella nella branch `main`.
3. Vai su **Settings → Pages** e in **Build and deployment** scegli:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` e **/ (root)**
4. Salva. Dopo qualche minuto avrai l'URL del sito (ad es. `https://<utente>.github.io/<repo>`).

**Metodo B – Deploy automatico con GitHub Actions (consigliato):**
1. Lascia il file `.github/workflows/pages.yml` così com'è.
2. Push su `main`. Si avvierà il workflow che pubblica la versione più recente.
3. L'URL finale sarà visibile nei log del job e nella sezione Pages del repo.

> Nota: il sito è completamente statico e non richiede build. `main.ts` è fornito per comodità di modifica; la pagina usa `main.js` già pronto.

## Personalizzazioni estetiche
- Tavolozza nei CSS (variabili `:root`): rosa/lilla/azzurro pastello.
- Effetti: cuori fluttuanti e piccoli fiori luminosi.
- Font: **Playfair Display** (titoli) + **Inter** (testi), caricati da Google Fonts.

## Sviluppo locale
Apri `index.html` nel browser. Per modifiche al comportamento, puoi lavorare su `main.ts` e poi trascriverle su `main.js` (oppure usare un compilatore TypeScript localmente).
