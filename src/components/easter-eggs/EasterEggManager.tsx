import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import MelodyEasterEgg from "./MelodyEasterEgg";

// ── Future eggs: aggiungere qui nuovi tipi ──
// "puzzle" | "leaves" | "codeword"
export type EggType = "melody" | null;

// Trigger da tastiera: digita "VIBES" (desktop)
const KEYBOARD_SECRET = "VIBES";

export default function EasterEggManager() {
  const [activeEgg, setActiveEgg] = useState<EggType>(null);
  const [keyBuffer, setKeyBuffer] = useState("");

  const openEgg = useCallback((egg: EggType) => setActiveEgg(egg), []);
  const closeEgg = useCallback(() => setActiveEgg(null), []);

  // Trigger keyboard: digita "VIBES" ovunque nel sito
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeEgg) return;
      setKeyBuffer((prev) => {
        const next = (prev + e.key.toUpperCase()).slice(-KEYBOARD_SECRET.length);
        if (next === KEYBOARD_SECRET) openEgg("melody");
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeEgg, openEgg]);

  // Trigger mobile: 3 giri sull'occhio del mascot
  // (evento custom dispatched da LogoMascot)
  useEffect(() => {
    const onUnlock = () => openEgg("melody");
    window.addEventListener("nv:puzzle", onUnlock);
    return () => window.removeEventListener("nv:puzzle", onUnlock);
  }, [openEgg]);

  return (
    <AnimatePresence>
      {activeEgg === "melody" && <MelodyEasterEgg onClose={closeEgg} />}
    </AnimatePresence>
  );
}
