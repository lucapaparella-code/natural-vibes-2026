import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/LangToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc3Ic4b1XMTUmaOf3FPU8slh3JoT6SYVOHnddi7prnjVuiLcQ/viewform";
const ICONS = ["🍃", "✦", "🌿", "·", "🍃", "✦", "🌿", "·"];

const T = {
  it: {
    sectionTag: "OPEN CALL",
    sectionTitle: "🤝 Open Call",
    sectionBody:
      "Hai un progetto, un banchetto o una realtà indipendente da portare dentro Natural Vibes? Abbiamo preparato uno spazio dedicato a chi vuole contribuire all'atmosfera del festival.",
    cardTag: "CALL BANCHETTI",
    cardTitle: "Porta il tuo mondo al festival",
    cardBody:
      "Cerchiamo banchetti, autoproduzioni, artigianato, piante, vinili, abiti, illustrazioni e piccole magie in sintonia con lo spirito Natural Vibes.",
    cardFoot: "Spazi limitati · selezione curata in linea con il mood del festival",
    listTitle: "Cosa ci piace trovare",
    listItems: [
      "artigianato e autoproduzioni",
      "vinili, stampe e illustrazioni",
      "piante, abiti e oggetti speciali",
    ],
    trigger: "Call banchetti",
    dialogTitle: "✨ Candida il tuo banchetto",
    dialogBody:
      "Se hai le vibrazioni giuste e vuoi portare qualcosa di bello dentro il festival, raccontaci il tuo progetto. Valutiamo realtà indipendenti, curate e in sintonia con l'esperienza Natural Vibes.",
    dialogNote:
      "Cristalli, vinili, piante, abiti, artigianato o altre piccole magie: se ti rispecchi in questo mondo, sei nel posto giusto.",
    cta: "Compila il form",
  },
  en: {
    sectionTag: "OPEN CALL",
    sectionTitle: "🤝 Open Call",
    sectionBody:
      "Do you have a project, a market stall or an independent reality to bring into Natural Vibes? We have created a dedicated space for people who want to contribute to the atmosphere of the festival.",
    cardTag: "MARKET STALL CALL",
    cardTitle: "Bring your world to the festival",
    cardBody:
      "We are looking for market stalls, self-produced goods, crafts, plants, records, clothes, illustrations and small wonders that resonate with the spirit of Natural Vibes.",
    cardFoot: "Limited spots · curated selection aligned with the mood of the festival",
    listTitle: "What we love to find",
    listItems: [
      "crafts and self-produced goods",
      "records, prints and illustrations",
      "plants, clothes and special objects",
    ],
    trigger: "Market stall call",
    dialogTitle: "✨ Apply with your stall",
    dialogBody:
      "If your vibe fits and you want to bring something beautiful into the festival, tell us about your project. We review independent realities that feel curated and aligned with the Natural Vibes experience.",
    dialogNote:
      "Crystals, records, plants, clothes, handmade goods or other little wonders: if this world feels like yours, you are in the right place.",
    cta: "Fill in the form",
  },
};

export default function BanchettiCallout() {
  const { lang } = useLang();
  const t = T[lang];
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <section id="work" className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto mb-12 px-6 py-8 rounded-2xl glass-raw text-center relative z-10">
            <span className="text-xs font-heading font-black text-primary tracking-[0.3em] uppercase">
              {t.sectionTag}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {t.sectionTitle}
            </h2>
            <p className="mt-4 text-foreground font-bold leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {t.sectionBody}
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
              <p className="mt-5 text-sm font-bold text-foreground/75">
                {t.cardFoot}
              </p>

              <DialogTrigger asChild>
                <button
                  type="button"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-heading font-black text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {t.trigger}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </DialogTrigger>
            </div>

            <div className="glass-raw call-frame rounded-[32px] p-8 md:p-10">
              <p className="text-sm font-heading font-black uppercase tracking-[0.25em] text-primary">
                {t.listTitle}
              </p>
              <ul className="mt-6 space-y-4">
                {t.listItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground font-bold leading-relaxed">
                    <span className="mt-1 text-primary">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <DialogContent className="glass-raw overflow-hidden border-primary/25 bg-[hsl(var(--card)/0.92)] p-0 sm:max-w-xl [&>button]:right-4 [&>button]:top-4">
        <div className="flex items-center justify-center gap-3 border-b border-primary/20 bg-primary/10 px-4 py-3 flex-wrap">
          {ICONS.map((icon, i) => (
            <span key={i} className="text-xl">
              {icon}
            </span>
          ))}
        </div>

        <div className="px-6 py-7 md:px-8 md:py-8">
          <span className="text-xs font-heading font-black text-primary tracking-[0.3em] uppercase">
            {t.cardTag}
          </span>

          <DialogHeader className="mt-4 space-y-4 text-left">
            <DialogTitle className="pr-10 text-2xl md:text-3xl font-heading font-black text-foreground">
              {t.dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground font-bold leading-relaxed">
              {t.dialogBody}
            </DialogDescription>
          </DialogHeader>

          <p className="mt-5 text-sm font-bold leading-relaxed text-foreground/80">
            {t.dialogNote}
          </p>

          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-heading font-black text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
