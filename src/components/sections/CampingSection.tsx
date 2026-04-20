import { Tent, Droplets, Sofa } from "lucide-react";
import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const T = {
  it: {
    title: "🏕️ Camping",
    sub: "Dormi sotto le stelle 🌟 — il campeggio è gratuito per tutti i 3 giorni, ma solo per i possessori del pass.",
    accessTitle: "🎫 Accesso camping",
    accessBody:
      "Il campeggio sarà attivo da venerdì 19 giugno alle ore 12:00 a lunedì 22 giugno alle ore 12:00.",
    features: [
      {
        icon: Tent,
        title: "⛺ Area Tende",
        desc: "Ampio spazio per la tua tenda con accesso diretto al festival.",
      },
      {
        icon: Droplets,
        title: "🚿 Docce & Bagni",
        desc: "Servizi igienici puliti con docce disponibili.",
      },
      {
        icon: Sofa,
        title: "🌿 Area Chill",
        desc: "Uno spazio tranquillo per rilassarsi, staccare dalla musica e ricaricarsi prima del prossimo set.",
      },
    ],
  },
  en: {
    title: "🏕️ Camping",
    sub: "Sleep under the stars 🌟 — camping is free for all 3 days, but only for pass holders.",
    accessTitle: "🎫 Camping access",
    accessBody:
      "Camping will be available from Friday June 19 at 12:00 to Monday June 22 at 12:00.",
    features: [
      {
        icon: Tent,
        title: "⛺ Tent Area",
        desc: "Plenty of space for your tent with direct access to the festival.",
      },
      {
        icon: Droplets,
        title: "🚿 Showers & Toilets",
        desc: "Clean facilities with hot showers available.",
      },
      {
        icon: Sofa,
        title: "🌿 Chill Area",
        desc: "A quiet space to relax, take a break from the music and recharge before the next set.",
      },
    ],
  },
};

export default function CampingSection() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section id="camping" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-24 relative z-10">
        <div className="max-w-2xl mx-auto mb-16 px-6 py-8 paper-card text-center relative">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground mb-2 ${shadow}`}>{t.title}</h2>
          <p className={`text-foreground font-bold max-w-xl mx-auto leading-relaxed ${shadow}`}>{t.sub}</p>
        </div>

        {/* Camping photo */}
        <div className="max-w-4xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/images/nv/camping-meadow.jpg"
              alt="Area camping Natural Vibes"
              className="w-full h-52 object-cover object-center"
            />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/images/nv/camping-forest.jpg"
              alt="Tende nel bosco"
              className="w-full h-52 object-cover object-center"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-10 paper-card px-6 py-5 text-center">
          <p className={`text-base md:text-lg font-heading font-black text-primary mb-2 ${shadow}`}>{t.accessTitle}</p>
          <p className={`text-foreground font-bold leading-relaxed ${shadow}`}>{t.accessBody}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {t.features.map((feat) => (
            <div
              key={feat.title}
              className="p-6 paper-card relative hover:border-primary/70 transition-colors group"
            >
              <feat.icon className={`w-7 h-7 text-primary mb-3 group-hover:scale-110 transition-transform ${shadow}`} />
              <h3 className={`font-heading font-extrabold text-foreground mb-2 ${shadow}`}>{feat.title}</h3>
              <p className={`text-sm text-foreground font-bold leading-relaxed ${shadow}`}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
