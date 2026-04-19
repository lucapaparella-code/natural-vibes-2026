import { Calendar, MapPin, Music, Sparkles, Heart } from "lucide-react";
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
    slogan: "🍃 This is Natural Vibes 🍃",
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
  },
  en: {
    title: "The Festival",
    intro:
      "Natural Vibes is an independent festival, an immersive experience combining music, visual arts, performances, interactive installations and workshops.",
    edition:
      "For the third edition we have moved to a new home and created a completely new setup: more space, more comfort and even more nature.",
    escape:
      "Three days to escape the city, more than 50 hours of music to massage your synapses, feed your curiosity and let your ego wander.",
    slogan: "🍃 This is Natural Vibes 🍃",
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
  },
};

export default function InfoSection() {
  const { lang } = useLang();
  const t = CONTENT[lang];

  return (
    <section id="info" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">
        {/* Title + intro */}
        <div className="max-w-3xl mx-auto mb-10 px-6 py-8 rounded-2xl glass-raw text-center relative z-10">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground mb-4 ${shadow}`}>{t.title}</h2>
          <p className={`text-foreground font-bold leading-relaxed mb-4 ${shadow}`}>{t.intro}</p>
          <p className={`text-foreground font-bold leading-relaxed mb-4 ${shadow}`}>{t.edition}</p>
          <p className={`text-foreground font-bold leading-relaxed mb-6 ${shadow}`}>{t.escape}</p>
          <p className={`text-xl font-heading font-black text-primary ${shadow}`}>{t.slogan}</p>
        </div>

        {/* Photo strip 1 — atmosfera festival */}
        <div className="max-w-3xl mx-auto mb-10 grid grid-cols-3 gap-3">
          <div className="rounded-2xl overflow-hidden">
            <img src="/images/nv/disco-ball.jpg" alt="Disco ball" className="w-full h-40 sm:h-52 object-cover object-center" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/images/nv/dancing-day.jpg" alt="Persone che ballano" className="w-full h-40 sm:h-52 object-cover object-center" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/images/nv/light-beams.jpg" alt="Raggi di luce" className="w-full h-40 sm:h-52 object-cover object-center" />
          </div>
        </div>

        {/* What to expect */}
        <div className="max-w-3xl mx-auto mb-10 px-6 py-8 rounded-2xl glass-raw relative z-10">
          <h3 className={`text-xl sm:text-2xl md:text-3xl font-heading font-black text-foreground mb-4 text-center ${shadow}`}>
            {t.expectTitle}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className={`w-5 h-5 text-primary mt-1 flex-shrink-0 ${shadow}`} />
              <p className={`text-foreground font-bold leading-relaxed ${shadow}`}>{t.location}</p>
            </div>
            <div className="flex items-start gap-3">
              <Music className={`w-5 h-5 text-primary mt-1 flex-shrink-0 ${shadow}`} />
              <p className={`text-foreground font-bold leading-relaxed ${shadow}`}>{t.facilities}</p>
            </div>
            <div className="flex items-start gap-3">
              <Heart className={`w-5 h-5 text-primary mt-1 flex-shrink-0 ${shadow}`} />
              <p className={`text-foreground font-bold leading-relaxed ${shadow}`}>{t.accessibility}</p>
            </div>
          </div>
        </div>

        {/* Photo strip 2 — location + notte */}
        <div className="max-w-3xl mx-auto mb-10 grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden">
            <img src="/images/nv/passel.jpg" alt="Il Passel — Angrogna" className="w-full h-48 sm:h-60 object-cover object-center" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/images/nv/stage-led.jpg" alt="Palco LED di notte" className="w-full h-48 sm:h-60 object-cover object-center" />
          </div>
        </div>

        {/* Philosophy */}
        <div className="max-w-3xl mx-auto px-6 py-8 rounded-2xl glass-raw relative z-10">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className={`w-5 h-5 text-primary mt-1 flex-shrink-0 ${shadow}`} />
              <p className={`text-foreground font-bold leading-relaxed ${shadow}`}>
                {lang === "it"
                  ? "Natural Vibes nasce con l'intento di distinguersi dai festival tradizionali. Vuole essere molto più di un evento musicale: un'esperienza poliedrica dove la musica è il cuore pulsante, ma non l'unico protagonista."
                  : "Natural Vibes was created with the intention of standing apart from traditional festivals. It aims to be much more than a music event: a multifaceted experience where music is the beating heart, but not the only protagonist."}
              </p>
            </div>
            <p className={`text-foreground font-bold leading-relaxed pl-8 ${shadow}`}>{t.activities}</p>
            <p className={`text-foreground font-bold leading-relaxed pl-8 ${shadow}`}>{t.mood}</p>
            <p className={`text-primary font-extrabold leading-relaxed pl-8 ${shadow}`}>{t.growth}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
