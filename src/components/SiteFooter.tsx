import { useLang } from "@/components/LangToggle";

export default function SiteFooter() {
  const { lang } = useLang();
  return (
    <footer className="text-center border-t border-border/30 py-10 px-4 relative z-10">
      <p className="text-sm text-foreground font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        {lang === "it"
          ? "© 2026 Natural Vibes Festival · Tutti i diritti riservati"
          : "© 2026 Natural Vibes Festival · All rights reserved"}
      </p>
    </footer>
  );
}
