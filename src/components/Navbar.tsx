import { useState, useRef, useCallback } from "react";
import { useLang } from "@/components/LangToggle";
import type { SectionMode } from "@/lib/particles";

interface Props {
  activeSection: SectionMode;
  onHoverSection: (section: SectionMode | null) => void;
}

const NAV_ITEMS: { id: SectionMode; label: { it: string; en: string } }[] = [
  { id: "hero", label: { it: "Home", en: "Home" } },
  { id: "info", label: { it: "Info", en: "Info" } },
  { id: "lineup", label: { it: "Lineup", en: "Lineup" } },
  { id: "tickets", label: { it: "Tickets", en: "Tickets" } },
  { id: "camping", label: { it: "Camping", en: "Camping" } },
  { id: "faq", label: { it: "F.A.Q", en: "F.A.Q" } },
  { id: "gallery", label: { it: "Gallery", en: "Gallery" } },
  { id: "work", label: { it: "Open Call", en: "Open Call" } },
];

export default function Navbar({ activeSection, onHoverSection }: Props) {
  const { lang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleHoverIn = useCallback(
    (id: SectionMode) => {
      clearTimeout(hoverTimerRef.current);
      onHoverSection(id);
    },
    [onHoverSection]
  );

  const handleHoverOut = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => onHoverSection(null), 800);
  }, [onHoverSection]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2"
          aria-label="Natural Vibes - torna in cima"
        >
          <span className="font-heading font-black text-lg text-primary leading-none">
            NV '26
          </span>
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => handleHoverIn(item.id)}
                onMouseLeave={handleHoverOut}
                className={`px-4 py-2 rounded-md text-sm font-heading font-bold tracking-wide transition-colors duration-200 ${
                  activeSection === item.id
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label[lang]}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50">
          <ul className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-heading font-bold tracking-wide transition-colors ${
                    activeSection === item.id
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label[lang]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
