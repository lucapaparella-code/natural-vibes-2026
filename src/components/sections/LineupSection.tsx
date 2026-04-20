import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const T = {
  it: { title: "Lineup", release: "1st Release", more: "...more TBA", location: "IL PASSEL _ ANGROGNA (TO)" },
  en: { title: "Lineup", release: "1st Release", more: "...more TBA", location: "IL PASSEL _ ANGROGNA (TO)" },
};

const HEADLINERS = ["C.RU.Z", "TAMBURI NERI", "ROSA CALIX"];

const OTHERS = [
  "BEN-UR", "CHALANGA (live)", "CLUSTER B", "FEELDAMUSIC",
  "HARTMANN", "HOT LINES", "NEEKA", "PEDROINE",
  "POLIZEI", "RASHA", "SEVEN SINS", "SICK SEEK", "VALLE",
];

/* Character-by-character reveal for headliner names */
function SplitReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  if (reduce) {
    return <span>{text}</span>;
  }

  return (
    <span ref={ref} aria-label={text} style={{ display: "inline-flex", flexWrap: "wrap" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 18, skewX: 6 }}
          animate={inView ? { opacity: 1, y: 0, skewX: 0 } : {}}
          transition={{
            duration: 0.38,
            delay: delay + i * 0.032,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* Staggered grid reveal for "others" list */
function OthersGrid({ items }: { items: string[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className="flex flex-wrap justify-center gap-x-5 gap-y-2 py-5 px-4"
      aria-label={items.join(", ")}
    >
      {items.map((name, i) => (
        <motion.span
          key={name}
          className={`text-base sm:text-lg md:text-xl font-heading font-bold text-foreground uppercase leading-tight ${shadow}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          {name}
        </motion.span>
      ))}
    </div>
  );
}

export default function LineupSection() {
  const { lang } = useLang();
  const t = T[lang];
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <section id="lineup" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">

        {/* Poster panel — slight tilt like a real flyer */}
        <motion.div
          ref={sectionRef}
          className="max-w-3xl mx-auto paper-card text-center relative z-10"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <h2
              className={`font-heading font-black text-foreground uppercase tracking-wide ${shadow}`}
              style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
            >
              {t.title}
            </h2>
            <div className="flex items-center gap-3 mt-3 mb-0 justify-center">
              <div className="h-px flex-1 bg-primary/50" />
              <span className={`text-xs sm:text-sm font-heading font-bold text-primary uppercase tracking-[0.2em] ${shadow}`}>
                {t.release}
              </span>
              <div className="h-px flex-1 bg-primary/50" />
            </div>
          </div>

          {/* Lineup block */}
          <div className="px-6 pb-2 pt-2 bg-[hsl(var(--background)/0.85)]">

            {/* Headliners — character reveal */}
            <div className={`flex flex-wrap justify-center gap-x-6 gap-y-1 py-4 ${shadow}`}>
              {HEADLINERS.map((name, i) => (
                <span
                  key={name}
                  className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-primary uppercase leading-tight"
                >
                  <SplitReveal text={name} delay={0.2 + i * 0.18} />
                </span>
              ))}
            </div>

            <div className="h-px bg-foreground/10 mx-4" />

            {/* Others — staggered grid, all visible */}
            <OthersGrid items={OTHERS} />

            <div className="h-px bg-foreground/10 mx-4" />

            {/* More TBA */}
            <motion.div
              className={`py-3 ${shadow}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <span className="text-sm sm:text-base font-heading font-bold text-muted-foreground italic">
                {t.more}
              </span>
            </motion.div>
          </div>

          {/* Location footer */}
          <div className="px-8 py-4">
            <p className={`text-xs sm:text-sm font-heading font-bold text-foreground/70 uppercase tracking-[0.15em] ${shadow}`}>
              {t.location}
            </p>
          </div>
        </motion.div>

        {/* Stage photos */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          <motion.div
            className="rounded-2xl overflow-hidden md:col-span-2"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={reduce ? {} : { scale: 1.015 }}
          >
            <img
              src="/images/nv/stage-panoramic.jpg"
              alt="Palco Natural Vibes di notte"
              className="w-full h-48 sm:h-64 md:h-96 object-cover object-center"
            />
          </motion.div>
          {[
            { src: "/images/nv/crowd-lasers.jpg", alt: "Folla con laser" },
            { src: "/images/nv/stage-smoke.jpg", alt: "Palco di notte" },
          ].map(({ src, alt }, i) => (
            <motion.div
              key={src}
              className="rounded-2xl overflow-hidden"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              whileHover={reduce ? {} : { scale: 1.03 }}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-40 sm:h-56 object-cover object-center"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
