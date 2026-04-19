import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Lang = "it" | "en";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextType>({ lang: "it", toggle: () => {} });

export function useLang() {
  return useContext(LangContext);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("it");
  const toggle = useCallback(() => setLang((l) => (l === "it" ? "en" : "it")), []);
  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      className="fixed top-20 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-card/60 backdrop-blur-xl border-2 border-primary/60 text-sm font-bold text-foreground drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:bg-card/80 transition-colors"
      aria-label="Toggle language"
    >
      {lang === "it" ? "🇮🇹 IT" : "🇬🇧 EN"}
    </button>
  );
}
