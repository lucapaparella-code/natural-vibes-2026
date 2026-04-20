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
    edition:
      "Per la terza edizione abbiamo cambiato casa e preparato un allestimento completamente nuovo: più spazio, più comfort e più natural.",
    escape:
      "Tre giorni per scappare dalla città, più di 50 ore di musica per massaggiare le tue sinapsi, nutrire la curiosità e mandare a spasso il tuo ego.",
    slogan: "This is Natural Vibes",
    expectTitle: "Cosa aspettarsi?",
    location:
      "Il festival si terrà dal 19 al 21 giugno presso il Passel – Angrogna (TO), una nuova location immersa nella natura.",
    facilities:
      "All'interno del festival troverete 3 dancefloor, area chill, area food, spazio banchetti, area tech, area camping e le bellissime montagne a fare da sfondo.",
    accessibility:
      "Come sempre crediamo nell'accessibilità dei nostri eventi: il campeggio all'interno del festival resta gratuito per i possessori del pass ed è dotato di bagni per tuttə, mentre l'intera area del festival è priva di barriere architettoniche.",
    activities:
      "Potrai rilassarti nell'area chillout, esplorare installazioni artistiche, partecipare a workshop interattivi e ritrovare te stessə lontanə dalla routine quotidiana.",
    mood: "Non vogliamo solo stupirvi con i contenuti musicali e artistici, ma anche con il mood aperto, umano e coinvolgente che da sempre caratterizza Natural Vibes.",
    growth:
      "Per questa nuova edizione il festival cresce: 3 giorni, 3 dancefloor e spazi più ampi, pensati per muoversi liberamente tra musica, natura e momenti di pausa, rispettando i ritmi di ciascunə.",
    dates: "19 — 21 GIU",
    place: "Angrogna, TO",
  },
  en: {
    title: "The Festival",
    intro:
      "Natural Vibes is an independent festival, an immersive experience combining music, visual arts, performances, interactive installations and workshops.",
    edition:
      "For the third edition we have moved to a new home and created a completely new setup: more space, more comfort and even more nature.",
    escape:
      "Three days to escape the city, more than 50 hours of music to massage your synapses, feed your curiosity and let your ego wander.",
    slogan: "This is Natural Vibes",
    expectTitle: "What to expect",
    location:
      "The festival will take place from June 19 to June 21 at Passel – Angrogna (TO), a new location surrounded by nature.",
    facilities:
      "Inside the festival you will find 3 dancefloors, a chill area, food area, market area, tech area, camping area, and the beautiful mountains as a backdrop.",
    accessibility:
      "As always, we believe in making our events accessible: camping inside the festival remains free for pass holders and comes with bathrooms for everyone, and the entire festival area is free of architectural barriers.",
    activities:
      "You will be able to relax in the chillout area, explore artistic installations, take part in interactive workshops and reconnect with yourself away from the routines of everyday life.",
    mood: "We don't just want to amaze you with music and artistic content, but also with the open, human and welcoming atmosphere that has always defined Natural Vibes.",
    growth:
      "For this new edition the festival grows: 3 days, 3 dancefloors and larger spaces, designed to move freely between music, nature and moments of rest, respecting everyone's rhythm.",
    dates: "19 — 21 JUN",
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

function PhotoHover({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden cursor-default ${className}`}
      whileHover={reduce ? {} : { scale: 1.04 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover object-center" />
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
              <p className={`text-sm font-body text-foreground/80 leading-relaxed mb-4 ${shadow}`}>
                {t.edition}
              </p>
              <p className={`text-sm font-body text-foreground/80 leading-relaxed mb-8 ${shadow}`}>
                {t.escape}
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

        {/* ── Photo strip 1 ── */}
        <RevealBlock delay={0.1}>
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3" style={{ height: "clamp(9rem, 22vw, 14rem)" }}>
            <PhotoHover src="/images/nv/disco-ball.jpg" alt="Disco ball" className="h-full" />
            <PhotoHover src="/images/nv/dancing-day.jpg" alt="Persone che ballano" className="h-full" />
            <PhotoHover src="/images/nv/light-beams.jpg" alt="Raggi di luce" className="h-full" />
          </div>
        </RevealBlock>

        {/* ── What to expect ── */}
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

        {/* ── Photo strip 2 ── */}
        <RevealBlock delay={0.1}>
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3" style={{ height: "clamp(12rem, 28vw, 18rem)" }}>
            <PhotoHover src="/images/nv/passel.jpg" alt="Il Passel — Angrogna" className="h-full" />
            <PhotoHover src="/images/nv/stage-led.jpg" alt="Palco LED di notte" className="h-full" />
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

              <motion.p
                className={`font-heading font-extrabold text-primary pl-9 leading-snug ${shadow}`}
                style={{ fontSize: "clamp(1rem, 2.6vw, 1.35rem)" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.32 }}
              >
                {t.growth}
              </motion.p>
            </div>
          </div>
        </RevealBlock>

      </div>
    </section>
  );
}
