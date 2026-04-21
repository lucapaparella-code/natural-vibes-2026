import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/LangToggle";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc5IraN5GYpZIdXxdm_bIkkmtiSYSCXiYSj4l2_njynuL7a1w/viewform?usp=send_form";

const T = {
  it: {
    tag: "OPEN CALL",
    title: "🙌 Call Volontari",
    body: "Vuoi far parte del team che rende possibile Natural Vibes? Cerchiamo volontari appassionati pronti a vivere il festival dall'interno, contribuendo con energia e cura.",
    cardTag: "VOLONTARI",
    cardTitle: "Vivi il festival dall'interno",
    cardBody:
      "Accoglienza, allestimento, supporto artisti, comunicazione: tanti ruoli per tante anime. Se senti Natural Vibes come tuo, vogliamo conoscerti.",
    cardFoot: "Posti limitati · selezione in base alla disponibilità e all'affinità con il progetto",
    listTitle: "Cosa offriamo",
    listItems: [
      "accesso gratuito al festival",
      "team accogliente e organizzato",
      "esperienza diretta nel mondo degli eventi",
    ],
    cta: "Candidati come volontario",
  },
  en: {
    tag: "OPEN CALL",
    title: "🙌 Volunteer Call",
    body: "Want to be part of the team that makes Natural Vibes happen? We are looking for passionate volunteers ready to live the festival from the inside.",
    cardTag: "VOLUNTEERS",
    cardTitle: "Live the festival from within",
    cardBody:
      "Welcome, setup, artist support, communication: many roles for many souls. If you feel Natural Vibes is yours, we want to meet you.",
    cardFoot: "Limited spots · selection based on availability and affinity with the project",
    listTitle: "What we offer",
    listItems: [
      "free access to the festival",
      "welcoming and organised team",
      "hands-on experience in event production",
    ],
    cta: "Apply as a volunteer",
  },
};

export default function VolontariCallout() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section id="work" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto mb-12 px-6 py-8 rounded-2xl glass-raw text-center relative z-10">
          <span className="text-xs font-heading font-black text-primary tracking-[0.3em] uppercase">
            {t.tag}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {t.title}
          </h2>
          <p className="mt-4 text-foreground font-bold leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {t.body}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-raw call-frame rounded-[32px] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
            <span className="text-xs font-heading font-black text-primary tracking-[0.3em] uppercase">
              {t.cardTag}
            </span>
            <h3 className="mt-4 text-3xl md:text-4xl font-heading font-black text-foreground drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {t.cardTitle}
            </h3>
            <p className="mt-4 text-foreground font-bold leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {t.cardBody}
            </p>
            <p className="mt-5 text-sm font-bold text-foreground/75">{t.cardFoot}</p>

            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-heading font-black text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="glass-raw call-frame rounded-[32px] p-8 md:p-10">
            <p className="text-sm font-heading font-black uppercase tracking-[0.25em] text-primary">
              {t.listTitle}
            </p>
            <ul className="mt-6 space-y-4">
              {t.listItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-foreground font-bold leading-relaxed"
                >
                  <span className="mt-1 text-primary">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
