import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/LangToggle";
import { ChevronDown } from "lucide-react";

const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]";

const T = {
  it: {
    title: "F.A.Q",
    general: "INFORMAZIONI GENERALI",
    camping: "CAMPEGGIO",
    tickets: "BIGLIETTI",
    reach: "COME ARRIVARE",
    food: "FOOD & BEVERAGE",
    other: "ALTRO",
    faqs: [
      {
        category: "INFORMAZIONI GENERALI",
        items: [
          {
            q: "Quando si svolge Natural Vibes?",
            a: "Natural Vibes 2026 si svolge dal 19 al 21 GIUGNO. Il campeggio apre dalle 12:00 di sabato 19/06 e chiude alle 12:00 di lunedì 21/06. L'area festival apre alle 15:00 di sabato e chiude a mezzanotte di domenica.",
          },
          {
            q: "Dove si svolge?",
            a: "L'evento si svolge a IL PASSEL, ANGRONA (TO). Campeggio e area festival sono vicine ma separate.",
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
            q: "Come prenotare il posto tenda?",
            a: "Una volta acquistato il biglietto è possibile prenotare il proprio posto tenda.",
          },
          {
            q: "Posso portare tenda o furgone?",
            a: "Sì, è prevista un'area dove potrai montare la tua tenda o parcheggiare il tuo furgone. Se decidi di portare un furgone, segnalalo a naturalvibesopenair.info@gmail.com.",
          },
          {
            q: "Servono i biglietti anche per il camping?",
            a: "Sì, non è possibile accedere all'area camping senza il biglietto del festival.",
          },
          {
            q: "Avete tende a noleggio?",
            a: "No, non abbiamo tende disponibili a noleggio.",
          },
          {
            q: "Quali servizi ci sono nel camping?",
            a: "Nel camping troverai: un distributore di acqua potabile gratuita, bagni chimici (uno accessibile per le carrozzine). Non ci sono docce. Ti consigliamo di portarti: powerbank, spray anti-zanzare, felpa e pantaloni lunghi. Ricordati di fissare bene la tenda (il vento può essere forte) e una torcia frontale. È vietato accendere fuochi liberi.",
          },
        ],
      },
      {
        category: "BIGLIETTI",
        items: [
          {
            q: "Quali tipi di biglietto sono disponibili?",
            a: "Ci sono 2 tipi di biglietto: uno valido per sabato e domenica, e uno valido per domenica a partire dalle 12:00.",
          },
        ],
      },
      {
        category: "FOOD & BEVERAGE",
        items: [
          {
            q: "Ci sono opzioni per mangiare?",
            a: "Sì, un'area food sarà presente all'interno del festival (Cantina Social) che servirà colazione, pranzo e cena con opzioni veg-friendly per tutta la durata dell'evento. Puoi anche portarti il cibo da casa, ma ricorda che acquistando in loco stai supportando delle piccole realtà.",
          },
          {
            q: "Posso portare bottiglie di vetro?",
            a: "No, è assolutamente vietato introdurre vetro all'interno dell'area festival. Puoi portare borracce a patto che non siano di vetro.",
          },
        ],
      },
      {
        category: "COME ARRIVARE",
        items: [
          {
            q: "In auto: come si arriva?",
            a: "IL PASSEL è situato ad ANGRONA (TO). Disponiamo di parcheggio gratuito. Consulta le mappe per le indicazioni precise: https://maps.google.com/?q=45.113079,7.261786",
          },
          {
            q: "In treno: come si arriva?",
            a: "Puoi arrivare con il treno partendo da Torino e scendendo alle stazioni della zona. Sul nostro canale Telegram (link in bio) è attivo un servizio per cercare/offrire passaggi in auto.",
          },
        ],
      },
      {
        category: "ALTRO",
        items: [
          {
            q: "Ho altre domande, come contattarvi?",
            a: "Contattaci tramite i nostri social media o via email a naturalvibesopenair.info@gmail.com. Troverai anche un canale Telegram nel link in bio per cercare/offrire passaggi in auto.",
          },
        ],
      },
    ],
  },
  en: {
    title: "F.A.Q",
    general: "GENERAL INFO",
    camping: "CAMPING",
    tickets: "TICKETS",
    reach: "HOW TO GET HERE",
    food: "FOOD & BEVERAGE",
    other: "OTHER",
    faqs: [
      {
        category: "GENERAL INFO",
        items: [
          {
            q: "When is Natural Vibes?",
            a: "Natural Vibes 2026 takes place from June 19 to 21. Camping opens at 12:00 on Saturday 19/06 and closes at 12:00 on Monday 21/06. The festival area opens at 15:00 on Saturday and closes at midnight on Sunday.",
          },
          {
            q: "Where is it?",
            a: "The event takes place at IL PASSEL, ANGRONA (TO). Camping and festival area are close but separate.",
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
            q: "How do I book a tent spot?",
            a: "Once you purchase a ticket you can book your own tent spot.",
          },
          {
            q: "Can I bring a tent or campervan?",
            a: "Yes, there is an area where you can set up your tent or park your campervan. If you're bringing a campervan, please report it to naturalvibesopenair.info@gmail.com.",
          },
          {
            q: "Do I need a ticket for camping?",
            a: "Yes, you cannot access the camping area without a festival ticket.",
          },
          {
            q: "Do you have tents for rent?",
            a: "No, we don't have tents available for rent.",
          },
          {
            q: "What facilities are in the camping?",
            a: "In the camping you'll find: free drinking water dispenser, chemical toilets (one accessible for wheelchairs). There are no showers. We recommend bringing: powerbank, anti-mosquito spray, fleece and long pants. Remember to secure your tent well (wind can be strong) and bring a headlamp. Open fires are strictly prohibited.",
          },
        ],
      },
      {
        category: "TICKETS",
        items: [
          {
            q: "What types of tickets are available?",
            a: "There are 2 types of tickets: one valid for Saturday and Sunday, and one valid for Sunday from 12:00 onwards.",
          },
        ],
      },
      {
        category: "FOOD & BEVERAGE",
        items: [
          {
            q: "Is there food available?",
            a: "Yes, a food area (Cantina Social) will be present inside the festival serving breakfast, lunch and dinner with veg-friendly options for the entire duration of the event. You can also bring your own food from home, but remember that buying locally supports small businesses.",
          },
          {
            q: "Can I bring glass bottles?",
            a: "No, glass is strictly prohibited inside the festival area. You can bring water bottles as long as they are not made of glass.",
          },
        ],
      },
      {
        category: "HOW TO GET HERE",
        items: [
          {
            q: "How do I get there by car?",
            a: "IL PASSEL is located in ANGRONA (TO). We have free parking. Check the map for precise directions: https://maps.google.com/?q=45.113079,7.261786",
          },
          {
            q: "How do I get there by train?",
            a: "You can take a train from Turin. On our Telegram channel (link in bio) there's an active service to find/offer car rides.",
          },
        ],
      },
      {
        category: "OTHER",
        items: [
          {
            q: "I have other questions, how do I contact you?",
            a: "Contact us through our social media or email at naturalvibesopenair.info@gmail.com. You'll also find a Telegram channel in the bio link to find/offer car rides.",
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
          {/* Title */}
          <h2
            className={`font-heading font-black text-foreground uppercase tracking-wide text-center mb-12 ${shadow}`}
            style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
          >
            {t.title}
          </h2>

          {/* FAQ Categories */}
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
                {/* Category Header */}
                <div className="px-6 py-4 bg-primary/10 border-b border-primary/20">
                  <h3 className={`font-heading font-bold text-primary uppercase tracking-wider ${shadow}`}>
                    {category.category}
                  </h3>
                </div>

                {/* FAQ Items */}
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

          {/* Contact CTA */}
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
