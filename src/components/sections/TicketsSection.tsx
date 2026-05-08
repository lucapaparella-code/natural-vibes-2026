import { useLang } from "@/components/LangToggle";

const TICKET_URL = "https://xceed.me/it/torino/event/natural-vibes/222107/channel/e-g-lab";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const T = {
  it: {
    title: "Biglietti",
    sub: "",
    tierName: "Regular",
    price: "€55",
    oldPrice: "€45",
    passSub: "3 Days Pass + Free Camping",
    features: ["Accesso 3 giorni", "Free Camping", "Docce", "Punti acqua"],
    cta: "Acquista su Xceed",
    info2: "Apertura porte: 12:00 · Età min. 18+",
  },
  en: {
    title: "Tickets",
    sub: "",
    tierName: "Regular",
    price: "€55",
    oldPrice: "€45",
    passSub: "3 Days Pass + Free Camping",
    features: ["3-day access", "Free Camping", "Showers", "Water points"],
    cta: "Buy on Xceed",
    info2: "Doors open: 12:00 · Min. age 18+",
  },
};

export default function TicketsSection() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section id="tickets" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto mb-16 px-6 py-8 paper-card text-center relative z-10">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground mb-2 ${shadow}`}>{t.title}</h2>
          <p className={`text-foreground font-bold ${shadow}`}>{t.sub}</p>
        </div>

        <div className="flex justify-center max-w-md mx-auto relative z-10">
          <div className="w-full p-5 sm:p-8 paper-card glow-gold relative transition-all">
            <p className={`text-sm uppercase tracking-widest text-primary font-extrabold mb-1 ${shadow}`}>{t.tierName}</p>
            <p className={`flex items-baseline gap-3 mb-2 ${shadow}`}>
              <span className="text-xl sm:text-2xl font-heading font-bold text-foreground/50 line-through decoration-2">
                {t.oldPrice}
              </span>
              <span className="text-4xl sm:text-5xl font-heading font-black text-foreground">
                {t.price}
              </span>
            </p>
            <p className={`text-sm text-foreground font-bold mb-6 ${shadow}`}>{t.passSub}</p>
            <ul className="space-y-3 mb-8">
              {t.features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-base text-foreground font-extrabold ${shadow}`}>
                  <span className={`text-primary mt-0.5 ${shadow}`}>✦</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-lg font-medium text-sm text-center transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t.cta}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
