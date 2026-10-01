import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin, Music, Heart, Sparkles } from "lucide-react";
import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const CONTENT = {
  it: {
    title: "Il Festival",
    intro:
      "Natural Vibes è un festival indipendente, un'esperienza immersiva tra musica, arti visive, performance, installazioni interattive e workshop.",
    slogan: "This is Natural Vibes",
    expectTitle: "Lo spirito del festival",
    location:
      "Il Passel – Angrogna (TO): uno spazio immerso nella natura.",
    facilities:
      "Il festival unisce 3 dancefloor, area chill, area food, spazio banchetti, area tech, area camping e le bellissime montagne a fare da sfondo.",
    accessibility:
      "Come sempre crediamo nell'accessibilità dei nostri eventi: il campeggio all'interno del festival resta gratuito per i possessori del pass ed è dotato di bagni per tuttə, mentre l'intera area del festival è priva di barriere architettoniche.",
    activities:
      "Uno spazio per rilassarsi nell'area chillout, esplorare installazioni artistiche, partecipare a workshop interattivi e ritrovarsi lontano dalla routine quotidiana.",
    mood: "Musica, arte e un mood aperto, umano e coinvolgente: lo spirito che da sempre caratterizza Natural Vibes.",
    place: "Angrogna, TO",
  },
  en: {
    title: "The Festival",
    intro:
      "Natural Vibes is an independent festival, an immersive experience combining music, visual arts, performances, interactive installations and workshops.",
    slogan: "This is Natural Vibes",
    expectTitle: "The spirit of the festival",
    location:
      "Passel – Angrogna (TO): a space surrounded by nature.",
    facilities:
      "The festival brings together 3 dancefloors, a chill area, food area, market area, tech area, camping area, and the beautiful mountains as a backdrop.",
    accessibility:
      "As always, we believe in making our events accessible: camping inside the festival remains free for pass holders and comes with bathrooms for everyone, and the entire festival area is free of architectural barriers.",
    activities:
      "A space to relax in the chillout area, explore artistic installations, take part in interactive workshops and reconnect with yourself away from the routines of everyday life.",
    mood: "Music, art and an open, human and welcoming atmosphere: the spirit that has always defined Natural Vibes.",
    place: "Angrogna, TO",
  },
};

function RevealBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function InfoSection() {
  const { lang } = useLang();
  const t = CONTENT[lang];

  return (
    <section id="info" className="relative min-h-screen">
      <div className="container mx-auto px-4 py-24 space-y-16">

        {/* ── Asymmetric hero intro ── */}
        <RevealBlock>
          <div className="max-w-3xl mx-auto relative">
            <div className="px-6 pt-10 pb-8 paper-card relative z-10">
              {/* Big asymmetric title */}
              <h2
                className={`font-heading font-black text-foreground leading-none mb-6 ${shadow}`}
                style={{ fontSize: "clamp(2.8rem, 9vw, 5.5rem)" }}
              >
                {t.title}
              </h2>

              {/* Varied paragraph rhythm */}
              <p className={`text-lg sm:text-xl font-bold leading-relaxed mb-4 text-foreground ${shadow}`}>
                {t.intro}
              </p>

              {/* Slogan — huge line */}
              <p
                className={`font-heading font-black text-primary leading-none ${shadow}`}
                style={{ fontSize: "clamp(1.4rem, 4.5vw, 2.8rem)" }}
              >
                🍃 {t.slogan} 🍃
              </p>
            </div>
          </div>
        </RevealBlock>


        {/* ── The spirit of the festival ── */}
        <RevealBlock delay={0.05}>
          <div className="max-w-3xl mx-auto px-6 py-8 paper-card relative z-10">
            <h3
              className={`font-heading font-black text-foreground mb-8 ${shadow}`}
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
            >
              {t.expectTitle}
            </h3>

            <div className="space-y-6">
              {[
                { Icon: MapPin, text: t.location },
                { Icon: Music, text: t.facilities },
                { Icon: Heart, text: t.accessibility },
              ].map(({ Icon, text }, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                >
                  <Icon className={`w-5 h-5 text-primary mt-1 flex-shrink-0 ${shadow}`} />
                  <p className={`text-sm sm:text-base font-body leading-relaxed text-foreground/90 ${shadow}`}>
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealBlock>


        {/* ── Philosophy ── */}
        <RevealBlock delay={0.05}>
          <div className="max-w-3xl mx-auto px-6 py-8 paper-card relative z-10">
            <div className="space-y-5">
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Sparkles className={`w-5 h-5 text-primary mt-1 flex-shrink-0 ${shadow}`} />
                <p className={`text-sm sm:text-base font-body leading-relaxed text-foreground/90 ${shadow}`}>
                  {lang === "it"
                    ? "Natural Vibes nasce con l'intento di distinguersi dai festival tradizionali. Vuole essere molto più di un evento musicale: un'esperienza poliedrica dove la musica è il cuore pulsante, ma non l'unico protagonista."
                    : "Natural Vibes was created with the intention of standing apart from traditional festivals. It aims to be much more than a music event: a multifaceted experience where music is the beating heart, but not the only protagonist."}
                </p>
              </motion.div>

              {[t.activities, t.mood].map((text, i) => (
                <motion.p
                  key={i}
                  className={`text-sm sm:text-base font-body leading-relaxed text-foreground/85 pl-9 ${shadow}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.12 + i * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}

            </div>
          </div>
        </RevealBlock>

      </div>
    </section>
  );
}
