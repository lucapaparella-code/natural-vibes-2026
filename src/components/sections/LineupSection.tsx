import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const T = {
  it: { title: "Lineup", release: "1st Release", more: "...more TBA", location: "IL PASSEL _ ANGROGNA (TO)" },
  en: { title: "Lineup", release: "1st Release", more: "...more TBA", location: "IL PASSEL _ ANGROGNA (TO)" },
};

export default function LineupSection() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section id="lineup" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">

        {/* Poster panel */}
        <div className="max-w-3xl mx-auto rounded-2xl glass-raw text-center relative z-10 overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground uppercase tracking-wide ${shadow}`}>
              {t.title}
            </h2>
            {/* Divider con release label */}
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

            {/* Headliners — oro, grandi */}
            <div className={`flex flex-wrap justify-center gap-x-6 gap-y-1 py-3 ${shadow}`}>
              {["C.RU.Z  ", "TAMBURI NERI  ", "ROSA CALIX"].map((name) => (
                <span
                  key={name}
                  className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-primary uppercase leading-tight"
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="h-px bg-foreground/10 mx-4" />

            {/* Altri artisti — stessa dimensione, ordine alfabetico */}
            <div className={`flex flex-wrap justify-center gap-x-5 gap-y-1 py-4 ${shadow}`}>
              {[
                "BEN-UR", "CHALANGA (live)", "CLUSTER B", "FEELDAMUSIC",
                "HARTMANN", "HOT LINES", "NEEKA", "PEDROINE",
                "POLIZEI", "RASHA", "SEVEN SINS", "SICK SEEK", "VALLE",
              ].map((name) => (
                <span
                  key={name}
                  className="text-base sm:text-lg md:text-xl font-heading font-bold text-foreground uppercase leading-tight"
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="h-px bg-foreground/10 mx-4" />

            {/* More TBA */}
            <div className={`py-3 ${shadow}`}>
              <span className="text-sm sm:text-base font-heading font-bold text-muted-foreground italic">
                {t.more}
              </span>
            </div>
          </div>

          {/* Location footer */}
          <div className="px-8 py-4">
            <p className={`text-xs sm:text-sm font-heading font-bold text-foreground/70 uppercase tracking-[0.15em] ${shadow}`}>
              {t.location}
            </p>
          </div>
        </div>

        {/* Stage photos */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          <div className="rounded-2xl overflow-hidden md:col-span-2">
            <img
              src="/images/nv/stage-panoramic.jpg"
              alt="Palco Natural Vibes di notte"
              className="w-full h-48 sm:h-64 md:h-96 object-cover object-center"
            />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/images/nv/crowd-lasers.jpg"
              alt="Folla con laser"
              className="w-full h-40 sm:h-56 object-cover object-center"
            />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/images/nv/stage-smoke.jpg"
              alt="Palco di notte"
              className="w-full h-40 sm:h-56 object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
