import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const TICKETS = [
  {
    name: "Regular",
    sub: { it: "3 Days Pass + Camping", en: "3 Days Pass + Camping" },
    price: "€55",
    url: "https://xceed.me/it/torino/checkout/ticket/natural-vibes/222107/198ad14f-a527-408e-9dd1-1c02bf7d0e3c?channel=e-g-lab",
    soldOut: false,
    highlight: true,
  },
  {
    name: "Last Call",
    sub: { it: "3 Days Pass + Camping", en: "3 Days Pass + Camping" },
    price: "€65",
    url: "https://xceed.me/it/torino/checkout/ticket/natural-vibes/222107/06661569-2a89-4fda-8f91-3e28c23d2fe1?channel=e-g-lab",
    soldOut: false,
    highlight: false,
  },
  {
    name: "Saturday Sunday Ticket",
    sub: { it: "Sab + Dom 2 Days Pass + Camping", en: "Sat + Sun 2 Days Pass + Camping" },
    price: "€60",
    url: "https://xceed.me/it/torino/checkout/ticket/natural-vibes/222107/a19910aa-a694-4e76-a702-c5a5941c635c?channel=e-g-lab",
    soldOut: false,
    highlight: false,
  },
  {
    name: "Sunday Ticket",
    sub: { it: "Biglietto singola giornata", en: "Sunday Single-Day Ticket" },
    price: "€30",
    url: "https://xceed.me/it/torino/checkout/ticket/natural-vibes/222107/7a292582-1850-4d4f-8663-5304a315558d?channel=e-g-lab",
    soldOut: false,
    highlight: false,
  },
  {
    name: "Friday Ticket",
    sub: { it: "Biglietto singola giornata · Ingresso dalle 14:00", en: "Friday Single-Day Ticket · Entry from 14:00" },
    price: "€25",
    url: "https://xceed.me/it/torino/checkout/ticket/natural-vibes/222107/8b7788ae-e3b7-48dd-b56d-48b422f64bd0?channel=e-g-lab",
    soldOut: false,
    highlight: false,
  },
  {
    name: "Party Pack 5 Ticket",
    sub: { it: "3 Days Pass + Camping p.p. · Acquista 5 biglietti insieme", en: "3 Days Pass + Camping p.p. · Buy 5 tickets together" },
    price: "€60 p.p.",
    url: "https://xceed.me/it/torino/checkout/ticket/natural-vibes/222107/60f3c564-841e-45d9-82ef-52bcde113274?channel=e-g-lab",
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
