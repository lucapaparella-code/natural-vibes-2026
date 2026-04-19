

## Logo interattivo basato sui frame del video

### Concetto
Sostituire l'SVG attuale con un sistema che usa il video `logo-reveal.mp4` direttamente. Il logo sara identico all'originale perche viene renderizzato dal video stesso.

### Come funziona

1. **Caricamento**: Un elemento `<video>` nascosto carica `logo-reveal.mp4`. Al mount, il video viene portato all'ultimo frame (il logo completo/composto).

2. **Stato normale (idle)**: Il canvas mostra l'ultimo frame del video -- il logo finito, identico all'originale.

3. **Hover / Touch (rewind)**: Quando l'utente passa sopra il logo, il `currentTime` del video viene decrementato frame-by-frame tramite `requestAnimationFrame`, simulando un rewind. Il logo si "scompone" esattamente come nel video originale ma al contrario.

4. **Mouse leave (forward)**: Quando l'utente esce, il `currentTime` viene incrementato (forward) fino a tornare all'ultimo frame. Il logo si ricompone.

5. **Cambio sezione**: Quando la sezione attiva cambia, si fa un breve "jitter" (rewind parziale + forward) per dare feedback visivo.

### Dettagli tecnici

**File modificati:**

- **`src/components/LogoComposer.tsx`** -- Riscrittura completa:
  - Elemento `<video>` nascosto con `src="/videos/logo-reveal.mp4"`, `muted`, `playsInline`, `preload="auto"`
  - `<canvas>` sovrapposto che riceve i frame dal video via `drawImage()`
  - Ciclo `requestAnimationFrame` che:
    - Legge lo stato corrente (`idle`, `rewinding`, `forwarding`)
    - Modifica `video.currentTime` incrementalmente (seeking manuale, dato che `playbackRate` negativo non e supportato dai browser)
    - Disegna il frame corrente sul canvas
  - Velocita di rewind/forward configurabili (`REWIND_SPEED`, `FORWARD_SPEED`)
  - Eventi `onMouseEnter`/`onMouseLeave` e `onTouchStart`/`onTouchEnd` per il trigger
  - Page Visibility API per sospendere quando il tab non e visibile
  - `prefers-reduced-motion`: mostra direttamente l'ultimo frame statico senza animazione

- **`src/components/sections/HeroSection.tsx`** -- Aggiornamento minimo del layout per centrare il canvas del video

- **`src/lib/particles.ts`** -- Resta invariato (solo export del tipo `SectionMode`)

**Nessuna dipendenza aggiuntiva** -- usa solo Canvas 2D API native e il video gia presente nel progetto.

### Flusso dell'animazione

```text
[Pagina carica]
    |
    v
video.currentTime = durata (ultimo frame)
canvas disegna logo completo
    |
    |--- hover/touch ---> stato = "rewinding"
    |                      currentTime -= REWIND_SPEED ogni frame
    |                      canvas aggiornato in tempo reale
    |                      si ferma a currentTime = 0 (logo scomposto)
    |
    |--- mouse leave ----> stato = "forwarding"  
    |                      currentTime += FORWARD_SPEED ogni frame
    |                      canvas aggiornato in tempo reale
    |                      si ferma a currentTime = durata (logo composto)
    |
    |--- cambio sezione -> rewind parziale (30%) poi forward
```

### Parametri configurabili
- `REWIND_SPEED`: quanto veloce si scompone (default: ~2x la velocita naturale)
- `FORWARD_SPEED`: quanto veloce si ricompone (default: ~1.5x)
- `JITTER_DEPTH`: quanto rewind fare al cambio sezione (0-1, default: 0.3)

