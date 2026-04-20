import { motion } from "framer-motion";
import { useLang } from "@/components/LangToggle";

const shadow = "drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]";

export default function SiteFooter() {
  const { lang } = useLang();

  return (
    <footer className="relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-3xl mx-auto paper-card px-8 py-10 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className={`font-heading font-black text-primary leading-none tracking-tight ${shadow}`}
            style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
          >
            {lang === "it" ? "19—21 GIU" : "19—21 JUN"}
          </p>

          <p
            className={`font-heading font-bold text-foreground uppercase tracking-[0.3em] mt-4 text-sm ${shadow}`}
          >
            Passel · Angrogna, TO · 2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
