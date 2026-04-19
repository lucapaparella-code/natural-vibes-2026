import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { useLang } from "@/components/LangToggle";

// ── Config ──────────────────────────────────────────────
const GRID = 3;
const TILE = 90; // px per tile
const SIZE = GRID * TILE; // 270px total
const EMPTY = GRID * GRID - 1; // 8 = bottom-right in solved state
const IMAGE = "/images/bg-nv2026.png";
export const TICKET_CODE = "NV2026-PUZZLE"; // ← cambia questo con il codice reale
// ────────────────────────────────────────────────────────

function getNeighbors(idx: number): number[] {
  const neighbors: number[] = [];
  const row = Math.floor(idx / GRID);
  const col = idx % GRID;
  if (row > 0) neighbors.push(idx - GRID);
  if (row < GRID - 1) neighbors.push(idx + GRID);
  if (col > 0) neighbors.push(idx - 1);
  if (col < GRID - 1) neighbors.push(idx + 1);
  return neighbors;
}

function createShuffled(): number[] {
  const state = Array.from({ length: GRID * GRID }, (_, i) => i);
  let emptyIdx = EMPTY;
  for (let i = 0; i < 300; i++) {
    const ns = getNeighbors(emptyIdx);
    const next = ns[Math.floor(Math.random() * ns.length)];
    [state[emptyIdx], state[next]] = [state[next], state[emptyIdx]];
    emptyIdx = next;
  }
  return state;
}

function isSolved(state: number[]): boolean {
  return state.every((v, i) => v === i);
}

export default function PuzzleEasterEgg({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const [tiles, setTiles] = useState<number[]>(createShuffled);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  const handleTile = useCallback(
    (clickedIdx: number) => {
      if (solved) return;
      setTiles((prev) => {
        const emptyIdx = prev.indexOf(EMPTY);
        if (!getNeighbors(emptyIdx).includes(clickedIdx)) return prev;
        const next = [...prev];
        [next[emptyIdx], next[clickedIdx]] = [next[clickedIdx], next[emptyIdx]];
        if (isSolved(next)) setSolved(true);
        return next;
      });
      setMoves((m) => m + 1);
    },
    [solved]
  );

  const reset = useCallback(() => {
    setTiles(createShuffled());
    setSolved(false);
    setMoves(0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-raw rounded-3xl p-6 md:p-8 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-[10px] font-heading font-black text-primary tracking-[0.35em] uppercase">
            🎟 Easter Egg
          </p>
          <h2 className="mt-2 text-xl font-heading font-black text-foreground">
            {lang === "it" ? "Ricomponi il festival" : "Reassemble the festival"}
          </h2>
          {!solved && (
            <p className="mt-1 text-sm font-bold text-foreground/50">
              {lang === "it" ? `Mosse: ${moves}` : `Moves: ${moves}`}
            </p>
          )}
        </div>

        {!solved ? (
          <>
            {/* Puzzle grid */}
            <div
              className="mx-auto overflow-hidden rounded-2xl"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID}, ${TILE}px)`,
                width: SIZE,
                height: SIZE,
              }}
            >
              {tiles.map((tileValue, idx) => {
                const isEmpty = tileValue === EMPTY;
                const tileRow = Math.floor(tileValue / GRID);
                const tileCol = tileValue % GRID;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTile(idx)}
                    className={`relative transition-all duration-100 overflow-hidden ${
                      isEmpty
                        ? "bg-background/20 cursor-default"
                        : "cursor-pointer hover:brightness-110 active:scale-95"
                    }`}
                    style={{ width: TILE, height: TILE, padding: 0, border: "none" }}
                    aria-label={isEmpty ? "empty" : `tile ${tileValue}`}
                  >
                    {!isEmpty && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${IMAGE})`,
                          backgroundSize: `${SIZE}px ${SIZE}px`,
                          backgroundPosition: `-${tileCol * TILE}px -${tileRow * TILE}px`,
                          backgroundRepeat: "no-repeat",
                          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 text-xs font-bold text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                {lang === "it" ? "Rimescola" : "Shuffle"}
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4 py-2"
          >
            <div className="text-5xl">🎉</div>
            <p className="text-2xl font-heading font-black text-foreground">
              {lang === "it" ? "Hai vinto!" : "You won!"}
            </p>
            <p className="text-sm font-bold text-foreground/70">
              {lang === "it"
                ? `Completato in ${moves} mosse. Il tuo codice biglietto:`
                : `Done in ${moves} moves. Your ticket code:`}
            </p>
            <div className="glass-raw rounded-xl px-6 py-3 font-heading font-black text-xl text-primary tracking-[0.2em] select-all cursor-text">
              {TICKET_CODE}
            </div>
            <p className="text-xs font-bold text-foreground/50 leading-relaxed">
              {lang === "it"
                ? "Scrivici su Instagram con questo codice per riscuoterlo 🌿"
                : "DM us on Instagram with this code to claim it 🌿"}
            </p>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-bold text-foreground/40 hover:text-foreground/70 underline transition-colors"
            >
              {lang === "it" ? "Gioca ancora" : "Play again"}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
