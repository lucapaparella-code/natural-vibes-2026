import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const XCEED = "https://xceed.me/en/torino/event/natural-vibes-passes-friday-ticket/222107/channel/e-g-lab";

const TICKETS = [
  {
    name: "Friday Ticket",
    sub: { it: "Biglietto singola giornata · Ingresso dalle 14:00 alle 05:00", en: "Friday Single-Day Ticket · Entry from 14:00 to 05:00" },
    price: "€25",
    url: XCEED,
    soldOut: false,
    highlight: false,
  },
  {
    name: "Last Call",
    sub: { it: "3 Days Pass + Camping", en: "3 Days Pass + Camping" },
    price: "€65",
    url: XCEED,
    soldOut: false,
    highlight: true,
  },
  {
    name: "Party Pack 5 Ticket",
    sub: { it: "3 Days Pass + Camping p.p. · Acquista 5 biglietti insieme (300€ totali)", en: "3 Days Pass + Camping p.p. · Buy 5 tickets together (€300 total)" },
    price: "€60 p.p.",
    url: XCEED,
    soldOut: false,
    highlight: false,
  },
  {
    name: "Saturday Sunday Ticket",
    sub: { it: "Sab + Dom 2 Days Pass + Camping · dalle 10:00 Sab alle 12:00 Lun", en: "Sat + Sun 2 Days Pass + Camping · Sat 10:00 to Mon 12:00" },
    price: "€60",
    url: XCEED,
    soldOut: false,
    highlight: false,
  },
  {
    name: "Sat/Sun Party Pack 2 Persone",
    sub: { it: "Sab + Dom 2 Days Ticket + Camping · 2 biglietti a 100€ (50€ a persona)", en: "Sat + Sun 2 Days Ticket + Camping · 2 tickets for €100 (€50 each)" },
    price: "€50 p.p.",
    url: XCEED,
    soldOut: false,
    highlight: false,
  },
  {
    name: "Early Bird",
    sub: { it: "3 Days Pass + Camping", en: "3 Days Pass + Camping" },
    price: "€45",
    url: null,
    soldOut: true,
    highlight: false,
  },
];

const T = {
  it: { title: "Biglietti", cta: "Acquista", soldOut: "Esaurito" },
  en: { title: "Tickets", cta: "Buy", soldOut: "Sold Out" },
};

export default function TicketsSection() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section id="tickets" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">

        <div className="max-w-2xl mx-auto mb-12 px-6 py-8 paper-card text-center relative z-10">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground ${shadow}`}>
            {t.title}
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          {TICKETS.map((ticket) => (
            <div
              key={ticket.name}
              className={`paper-card px-5 py-4 flex items-center justify-between gap-4 transition-colors duration-200 ${
                ticket.highlight ? "border-primary/60 glow-gold" : ""
              } ${ticket.soldOut ? "opacity-50" : "hover:border-primary/50"}`}
            >
              <div className="min-w-0">
                <p className={`font-heading font-extrabold text-foreground uppercase text-sm sm:text-base ${shadow}`}>
                  {ticket.name}
                  {ticket.soldOut && (
                    <span className="ml-2 text-xs font-bold text-destructive uppercase tracking-widest">
                      — {t.soldOut}
                    </span>
                  )}
                </p>
                <p className={`text-xs text-foreground/60 font-bold mt-0.5 ${shadow}`}>
                  {ticket.sub[lang]}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`font-heading font-black text-lg sm:text-xl text-foreground ${shadow}`}>
                  {ticket.price}
                </span>
                {!ticket.soldOut && ticket.url && (
                  <a
                    href={ticket.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    {t.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
