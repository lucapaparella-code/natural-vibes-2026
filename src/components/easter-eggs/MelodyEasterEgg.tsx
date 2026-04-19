import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLang } from "@/components/LangToggle";

// ── Config ────────────────────────────────────────────
export const TICKET_CODE = "NV2026-MELODY";
const ROUNDS_TO_WIN   = 5;
const NOTE_ON_MS      = 180;   // durata visiva del flash (ms) — croma
const BEATS_PER_NOTE  = 0.5;   // 1/8 — ogni nota su una croma

const BPM  = 128;
const BEAT = 60 / BPM;         // 0.469s
const S16  = BEAT / 4;         // 16th note ≈ 0.117s
const BAR  = S16 * 16;         // 1 bar ≈ 1.875s

// Note: diminuito — A2 C3 Eb3 Gb3 (tritoni sovrapposti, evil/horror)
const PADS = [
  { id: 0, freq: 110.00, bg: "hsl(142,65%,32%)", glow: "hsl(142,65%,52%)" }, // A2
  { id: 1, freq: 130.81, bg: "hsl(0,65%,45%)",   glow: "hsl(0,65%,62%)"   }, // C3
  { id: 2, freq: 155.56, bg: "hsl(210,75%,45%)", glow: "hsl(210,75%,62%)" }, // Eb3
  { id: 3, freq: 185.00, bg: "hsl(45,85%,45%)",  glow: "hsl(45,85%,62%)"  }, // Gb3
];

// ── Audio context ─────────────────────────────────────
let _ctx: AudioContext | null = null;
let _noiseBuffer: AudioBuffer | null = null;

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === "closed") _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!_noiseBuffer) {
    const len = ctx.sampleRate;
    _noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = _noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return _noiseBuffer;
}

// ── Drum synthesis ────────────────────────────────────
function playKick(ctx: AudioContext, t: number) {
  // Body: sine con pitch drop
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.08);
  g.gain.setValueAtTime(1.0, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.5);
  // Click transient
  const click = ctx.createOscillator();
  const cg    = ctx.createGain();
  click.type = "square";
  click.frequency.setValueAtTime(900, t);
  cg.gain.setValueAtTime(0.35, t);
  cg.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
  click.connect(cg); cg.connect(ctx.destination);
  click.start(t); click.stop(t + 0.02);
}

function playSnare(ctx: AudioContext, t: number) {
  // Noise layer
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const nhp = ctx.createBiquadFilter();
  nhp.type = "highpass";
  nhp.frequency.setValueAtTime(1400, t);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.65, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
  noise.connect(nhp); nhp.connect(ng); ng.connect(ctx.destination);
  noise.start(t); noise.stop(t + 0.2);
  // Tone layer
  const tone = ctx.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(200, t);
  const tg = ctx.createGain();
  tg.gain.setValueAtTime(0.35, t);
  tg.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  tone.connect(tg); tg.connect(ctx.destination);
  tone.start(t); tone.stop(t + 0.12);
}

function playHihat(ctx: AudioContext, t: number, open = false) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(9000, t);
  const dur = open ? 0.22 : 0.035;
  const g   = ctx.createGain();
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  noise.connect(filter); filter.connect(g); g.connect(ctx.destination);
  noise.start(t); noise.stop(t + dur + 0.01);
}

// ── Drum pattern (electro 128 BPM) ───────────────────
function scheduleBar(ctx: AudioContext, t: number) {
  // Kick: beat 1, "e" of 2, beat 3, "a" of 4
  [0, 6, 8, 14].forEach(n => playKick(ctx, t + n * S16));
  // Snare: beat 2, beat 4
  [4, 12].forEach(n => playSnare(ctx, t + n * S16));
  // Closed hi-hat: ogni 8a nota
  [0, 2, 4, 6, 8, 10, 12, 14].forEach(n => playHihat(ctx, t + n * S16));
  // Open hi-hat: & di beat 3
  playHihat(ctx, t + 10 * S16, true);
}

// ── Note synth (electro filter sweep) ────────────────
function makeDistortionCurve(amount: number): Float32Array {
  const n = 256; const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    c[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return c;
}

// scheduledTime: AudioContext time — se omesso usa currentTime (input utente)
function playNote(freq: number, scheduledTime?: number) {
  const dur = 0.18; // croma a 128 BPM ≈ 234ms, leggermente staccato
  try {
    const ctx = getCtx();
    const t = scheduledTime ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq * 1.04, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.04);
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(freq / 2, t);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass"; filter.Q.setValueAtTime(10, t);
    filter.frequency.setValueAtTime(freq * 6, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.9, t + dur * 0.7);
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(60); shaper.oversample = "4x";
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.10, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.12, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.1);
    osc.connect(shaper); shaper.connect(filter); filter.connect(gain);
    sub.connect(sg);
    gain.connect(ctx.destination); sg.connect(ctx.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
    sub.start(t); sub.stop(t + dur * 1.1 + 0.05);
  } catch { /* audio not available */ }
}

// ── Vocoder "lucky guy" (formant synthesis) ───────────
// Carrier sawtooth @ vocal fundamental → bandpass filters per ogni fonema
function playVocoderLuckyGuy(startTime: number) {
  try {
    const ctx = getCtx();

    function formant(freq: number, q: number, vol: number, t0: number, dur: number) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(88, t0); // pitch vocoder carrier

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(freq, t0);
      bp.Q.setValueAtTime(q, t0);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + 0.018);
      g.gain.setValueAtTime(vol, t0 + dur - 0.025);
      g.gain.linearRampToValueAtTime(0, t0 + dur);

      osc.connect(bp); bp.connect(g); g.connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + dur + 0.02);
    }

    const t = startTime;
    // "YOU"  /juː/ — F1=300 F2=700
    formant( 300, 7, 0.50, t,        0.18);
    formant( 700, 6, 0.40, t,        0.18);
    // "WIN"  /wɪn/ — F1=400 F2=1900
    formant( 400, 7, 0.50, t+0.22,   0.20);
    formant(1900, 6, 0.38, t+0.22,   0.20);
    // "FLAW" /flɔː/ — F1=600 F2=900
    formant( 600, 6, 0.50, t+0.55,   0.20);
    formant( 900, 6, 0.40, t+0.55,   0.20);
    // "LESS" /lɛs/ — F1=600 F2=1800
    formant( 600, 6, 0.48, t+0.78,   0.18);
    formant(1800, 6, 0.36, t+0.78,   0.18);
    // "VIC"  /vɪk/ — F1=400 F2=1900
    formant( 400, 7, 0.48, t+1.05,   0.16);
    formant(1900, 6, 0.36, t+1.05,   0.16);
    // "TO"   /tuː/ — F1=300 F2=700
    formant( 300, 7, 0.50, t+1.24,   0.16);
    formant( 700, 6, 0.40, t+1.24,   0.16);
    // "RY"   /rɪ/  — F1=400 F2=1400
    formant( 400, 7, 0.48, t+1.42,   0.18);
    formant(1400, 6, 0.36, t+1.42,   0.18);
  } catch { /* audio not available */ }
}

// ── Types ─────────────────────────────────────────────
type Phase = "idle" | "showing" | "input" | "wrong" | "won";
function randomSeq(len: number): number[] {
  // Genera permutazioni di [0,1,2,3] in loop → tutti e 4 i pad sempre presenti
  const result: number[] = [];
  while (result.length < len) {
    const perm = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    result.push(...perm);
  }
  return result.slice(0, len);
}

// ── Component ─────────────────────────────────────────
export default function MelodyEasterEgg({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const [phase, setPhase]         = useState<Phase>("idle");
  const [sequence, setSequence]   = useState<number[]>([]);
  const [round, setRound]         = useState(1);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [active, setActive]       = useState<number | null>(null);
  const [flash, setFlash]         = useState<"wrong" | "ok" | null>(null);
  const timerRefs     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const drumLoopRef   = useRef<ReturnType<typeof setTimeout>>();
  const winLoopRef    = useRef<ReturnType<typeof setTimeout>>();
  const nextBarRef    = useRef(0);
  const audioStartRef = useRef(0);
  const sequenceRef   = useRef<number[]>([]); // copia stabile per il win loop

  const clear = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const push = useCallback((fn: () => void, ms: number) => {
    timerRefs.current.push(setTimeout(fn, ms));
  }, []);

  const stopDrums = useCallback(() => {
    clearTimeout(drumLoopRef.current);
  }, []);

  const stopWinLoop = useCallback(() => {
    clearTimeout(winLoopRef.current);
  }, []);

  const startWinLoop = useCallback(() => {
    stopWinLoop();
    const ctx = getCtx();
    const now = ctx.currentTime;
    const elapsed = now - audioStartRef.current;
    const nextBar = Math.ceil((elapsed + 0.1) / BAR) * BAR;
    const t0      = audioStartRef.current + nextBar; // primo beat allineato alla griglia

    function fire(startT: number) {
      // Bar 1: melodia (note schedulate sull'AudioContext clock)
      sequenceRef.current.forEach((id, i) => {
        playNote(PADS[id].freq, startT + i * BEAT * BEATS_PER_NOTE);
      });
      // Bar 2: vocoder
      playVocoderLuckyGuy(startT + BAR);
    }

    // Schedula sempre sul tempo assoluto — nessun drift
    function scheduleNext(nextT: number) {
      const ms = Math.max(0, (nextT - getCtx().currentTime - 0.1) * 1000);
      winLoopRef.current = setTimeout(() => {
        fire(nextT);
        scheduleNext(nextT + BAR * 2);
      }, ms);
    }

    fire(t0);
    scheduleNext(t0 + BAR * 2);
  }, [stopWinLoop]);

  const startDrums = useCallback(() => {
    stopDrums();
    const ctx = getCtx();
    const t0 = ctx.currentTime + 0.05;
    audioStartRef.current = t0;  // salva il beat 0 del grid
    nextBarRef.current = t0;
    function tick() {
      const c = getCtx();
      scheduleBar(c, nextBarRef.current);
      nextBarRef.current += BAR;
      const ms = (nextBarRef.current - c.currentTime - 0.1) * 1000;
      drumLoopRef.current = setTimeout(tick, Math.max(0, ms));
    }
    tick();
  }, [stopDrums]);

  const showSeq = useCallback((seq: number[], upTo: number) => {
    setPhase("showing");
    setUserInput([]);
    setActive(null);

    const ctx = getCtx();
    const now = ctx.currentTime;
    // Aspetta il beat 1 della prossima battuta (almeno 0.1s nel futuro)
    const elapsed    = now - audioStartRef.current;
    const nextBar    = Math.ceil((elapsed + 0.1) / BAR) * BAR;
    const firstNote  = audioStartRef.current + nextBar + BAR; // 1 giro di intro
    const interval   = BEAT * BEATS_PER_NOTE;

    seq.slice(0, upTo).forEach((id, i) => {
      const audioTime = firstNote + i * interval;
      const msDelay   = (audioTime - now) * 1000;
      // nota schedulata sull'AudioContext clock → perfettamente a tempo
      push(() => { setActive(id); playNote(PADS[id].freq, audioTime); }, msDelay);
      push(() => setActive(null), msDelay + NOTE_ON_MS);
    });

    // Input phase parte dopo l'ultima nota + 1 beat
    const lastNoteMs = (firstNote + (upTo - 1) * interval - now) * 1000;
    push(() => setPhase("input"), lastNoteMs + NOTE_ON_MS + BEAT * 1000);
  }, [push]);

  const start = useCallback(() => {
    getCtx();
    clear();
    startDrums();
    const seq = randomSeq(ROUNDS_TO_WIN);
    sequenceRef.current = seq;
    setSequence(seq);
    setRound(1);
    showSeq(seq, 1);
  }, [clear, startDrums, showSeq]);

  const handlePad = useCallback((id: number) => {
    if (phase !== "input") return;
    playNote(PADS[id].freq);
    setActive(id);
    push(() => setActive(null), 200);
    setUserInput(prev => {
      const next = [...prev, id];
      const pos  = next.length - 1;
      if (next[pos] !== sequence[pos]) {
        clear();
        setFlash("wrong");
        push(() => setFlash(null), 600);
        push(() => { setUserInput([]); showSeq(sequence, round); }, 1200);
        return [];
      }
      if (next.length === round) {
        clear();
        if (round >= ROUNDS_TO_WIN) {
          setFlash("ok");
          // drums continuano, parte il loop vocoder "lucky guy"
          push(() => { setFlash(null); setPhase("won"); startWinLoop(); }, 600);
        } else {
          setFlash("ok");
          push(() => {
            setFlash(null);
            const nr = round + 1;
            setRound(nr);
            showSeq(sequence, nr);
          }, 700);
        }
        return [];
      }
      return next;
    });
  }, [phase, sequence, round, clear, push, showSeq, startWinLoop]);

  const closeAll = useCallback(() => {
    clear(); stopDrums(); stopWinLoop(); onClose();
  }, [clear, stopDrums, stopWinLoop, onClose]);

  useEffect(() => () => { clear(); stopDrums(); stopWinLoop(); }, [clear, stopDrums, stopWinLoop]);

  const it = lang === "it";
  const statusText = {
    idle:    it ? "Premi START per iniziare" : "Press START to begin",
    showing: it ? "Osserva la sequenza…"     : "Watch the sequence…",
    input:   it ? "Tocca i pad nell'ordine"  : "Tap the pads in order",
    wrong:   it ? "Sbagliato! Riprovo…"      : "Wrong! Replaying…",
    won:     "",
  }[phase];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background/92 backdrop-blur-md flex items-center justify-center p-4"
      onClick={closeAll}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-raw rounded-3xl p-6 md:p-8 w-full max-w-sm relative overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          boxShadow: flash === "wrong"
            ? "0 0 40px 8px hsl(0,70%,40%)"
            : flash === "ok"
            ? "0 0 40px 8px hsl(142,70%,40%)"
            : undefined,
          transition: "box-shadow 0.15s ease",
        }}
      >
        <button type="button"
          onClick={closeAll}
          className="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <p className="text-[10px] font-heading font-black text-primary tracking-[0.35em] uppercase">
            🎵 Easter Egg
          </p>
          <h2 className="mt-2 text-xl font-heading font-black text-foreground">
            {it ? "Ripeti la base" : "Repeat the beat"}
          </h2>
          {phase !== "idle" && phase !== "won" && (
            <p className="mt-1 text-xs font-bold text-foreground/50">
              Round {round} / {ROUNDS_TO_WIN}
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {phase !== "won" ? (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-3 w-full">
                {PADS.map(pad => {
                  const isActive = active === pad.id;
                  return (
                    <motion.button
                      key={pad.id}
                      type="button"
                      onPointerDown={() => handlePad(pad.id)}
                      animate={{ scale: isActive ? 1.07 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="rounded-2xl select-none"
                      style={{
                        height: 120,
                        background: isActive ? pad.glow : pad.bg,
                        boxShadow: isActive
                          ? `0 0 28px 6px ${pad.glow}, inset 0 0 12px rgba(255,255,255,0.15)`
                          : `0 4px 18px rgba(0,0,0,0.4), inset 0 0 8px rgba(255,255,255,0.05)`,
                        cursor: phase === "input" ? "pointer" : "default",
                        opacity: phase === "showing" && active !== pad.id ? 0.5 : 1,
                        transition: "background 0.1s, opacity 0.15s",
                      }}
                    />
                  );
                })}
              </div>

              <div className="mt-5 text-center min-h-[48px] flex flex-col items-center justify-center gap-2">
                {phase === "idle" ? (
                  <button type="button" onClick={start}
                    className="px-8 py-3 rounded-xl bg-primary font-heading font-black text-primary-foreground tracking-widest text-sm hover:opacity-90 transition-opacity">
                    START
                  </button>
                ) : (
                  <p className="text-sm font-bold text-foreground/60">{statusText}</p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="won"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4 py-2"
            >
              <div className="text-5xl">🎉</div>
              <p className="text-2xl font-heading font-black text-foreground">
                {it ? "Hai vinto!" : "You won!"}
              </p>
              <p className="text-sm font-bold text-foreground/70">
                {it ? "Il tuo codice biglietto:" : "Your ticket code:"}
              </p>
              <div className="glass-raw rounded-xl px-6 py-3 font-heading font-black text-xl text-primary tracking-[0.2em] select-all cursor-text">
                {TICKET_CODE}
              </div>
              <p className="text-xs font-bold text-foreground/50 leading-relaxed">
                {it
                  ? "Scrivici su Instagram con questo codice 🌿"
                  : "DM us on Instagram with this code 🌿"}
              </p>
              <button type="button" onClick={start}
                className="text-xs font-bold text-foreground/40 hover:text-foreground/70 underline transition-colors">
                {it ? "Gioca ancora" : "Play again"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
