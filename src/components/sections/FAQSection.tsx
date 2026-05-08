import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/LangToggle";
import { ChevronDown } from "lucide-react";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const T = {
  it: {
    title: "F.A.Q",
    faqs: [
      {
        category: "INFORMAZIONI GENERALI",
        items: [
          {
            q: "Quando si svolge Natural Vibes?",
            a: "Natural Vibes 2026 si svolge dal 19 al 22 GIUGNO. Il campeggio apre venerdì 19/06 alle 12:00 e chiude lunedì 22/06 alle 12:00.",
          },
          {
            q: "Dove si svolge?",
            a: "L'evento si svolge a IL PASSEL, ANGROGNA (TO).",
          },
          {
            q: "Sono ammessi animali?",
            a: "No, purtroppo gli animali non sono ammessi nell'area del festival e del camping.",
          },
        ],
      },
      {
        category: "CAMPEGGIO",
        items: [
          {
            q: "Posso venire in furgone o camper?",
            a: "Sì, è prevista un'area dove potrai parcheggiare il tuo furgone o camper. Segnalalo preventivamente a naturalvibesopenair.info@gmail.com.",
          },
          {
            q: "Posso accedere al camping?",
            a: "Il camping è accessibile solo con i biglietti multi-giorno (2 Days Pass o 3 Days Pass). I biglietti singola giornata non includono l'accesso al camping.",
          },
        ],
      },
      {
        category: "BIGLIETTI",
        items: [
          {
            q: "Quali tipi di biglietto sono disponibili?",
            a: "Venerdì (Friday Ticket): €25 · Domenica (Sunday Ticket): €30 · Sabato + Domenica (2 Days Pass + Camping): €60 · 3 giorni Early Bird: €45 (esaurito) · 3 giorni Regular (+ Camping): €55 · 3 giorni Last Call (+ Camping): €65 · Party Pack 5 persone (3 Days + Camping): €60 a persona (€300 totali).",
          },
        ],
      },
      {
        category: "FOOD & BEVERAGE",
        items: [
          {
            q: "Ci sono opzioni per mangiare?",
            a: "Sì, è possibile mangiare al Passel all'interno del festival. Puoi anche portarti il cibo da casa, ma ricorda che acquistando in loco stai supportando delle piccole realtà.",
          },
          {
            q: "Posso portare bottiglie di vetro?",
            a: "No, è assolutamente vietato introdurre vetro all'interno dell'area festival. Puoi portare borracce a patto che non siano di vetro.",
          },
        ],
      },
    ],
  },
  en: {
    title: "F.A.Q",
    faqs: [
      {
        category: "GENERAL INFO",
        items: [
          {
            q: "When is Natural Vibes?",
            a: "Natural Vibes 2026 takes place from June 19 to 22. Camping opens on Friday 19/06 at 12:00 and closes on Monday 22/06 at 12:00.",
          },
          {
            q: "Where is it?",
            a: "The event takes place at IL PASSEL, ANGROGNA (TO).",
          },
          {
            q: "Are pets allowed?",
            a: "No, unfortunately pets are not allowed in the festival and camping areas.",
          },
        ],
      },
      {
        category: "CAMPING",
        items: [
          {
            q: "Can I come with a van or campervan?",
            a: "Yes, there is an area where you can park your van or campervan. Please report it in advance to naturalvibesopenair.info@gmail.com.",
          },
          {
            q: "Can I access the camping?",
            a: "Camping is only accessible with multi-day tickets (2 Days Pass or 3 Days Pass). Single-day tickets do not include camping access.",
          },
        ],
      },
      {
        category: "TICKETS",
        items: [
          {
            q: "What types of tickets are available?",
            a: "Friday Ticket: €25 · Sunday Ticket: €30 · Saturday + Sunday (2 Days Pass + Camping): €60 · 3 Days Early Bird: €45 (sold out) · 3 Days Regular (+ Camping): €55 · 3 Days Last Call (+ Camping): €65 · Party Pack 5 people (3 Days + Camping): €60 p.p. (€300 total).",
          },
        ],
      },
      {
        category: "FOOD & BEVERAGE",
        items: [
          {
            q: "Is there food available?",
            a: "Yes, food is available at Il Passel inside the festival. You can also bring your own food from home, but remember that buying locally supports small businesses.",
          },
          {
            q: "Can I bring glass bottles?",
            a: "No, glass is strictly prohibited inside the festival area. You can bring water bottles as long as they are not made of glass.",
          },
        ],
      },
    ],
  },
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-foreground/10 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-4 flex items-center justify-between hover:bg-foreground/5 transition-colors"
      >
        <span className={`font-heading font-bold text-sm sm:text-base text-foreground ${shadow}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </button>

      <motion.div
        ref={contentRef}
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 text-sm sm:text-base text-foreground/80">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  const { lang } = useLang();
  const t = T[lang];
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative min-h-screen flex items-center py-24">
      <div className="container mx-auto px-4">
        <motion.div
          ref={sectionRef}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2
            className={`font-heading font-black text-foreground uppercase tracking-wide text-center mb-12 ${shadow}`}
            style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
          >
            {t.title}
          </h2>

          <div className="space-y-12">
            {t.faqs.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="paper-card overflow-hidden"
              >
                <div className="px-6 py-4 bg-primary/10 border-b border-primary/20">
                  <h3 className={`font-heading font-bold text-primary uppercase tracking-wider ${shadow}`}>
                    {category.category}
                  </h3>
                </div>
                <div>
                  {category.items.map((item, itemIdx) => (
                    <FAQItem
                      key={item.q}
                      question={item.q}
                      answer={item.a}
                      index={itemIdx}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center paper-card p-6"
          >
            <p className={`text-sm sm:text-base text-foreground/80 ${shadow}`}>
              {lang === "it"
                ? "Hai altre domande? Contattaci via email o sui social!"
                : "Have other questions? Contact us via email or on social!"}
            </p>
            <p className={`mt-3 font-heading font-bold text-primary ${shadow}`}>
              naturalvibesopenair.info@gmail.com
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
