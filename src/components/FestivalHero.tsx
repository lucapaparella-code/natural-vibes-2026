import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import LogoComposer from "@/components/LogoComposer";
import LogoMascot from "@/components/LogoMascot";
import { useLang } from "@/components/LangToggle";
import type { SectionMode } from "@/lib/particles";

export default function FestivalHero({ mode }: { mode: SectionMode }) {
  const { lang } = useLang();
  const photo = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photo, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  return <section id="hero" className="trial-hero test-hybrid-hero">
    <h1 className="sr-only">Natural Vibes 2027</h1>
    <div className="trial-hero-board">
      <div className="hero-brand"><LogoComposer mode={mode} className="absolute inset-0 w-full h-full" /></div>
      <section ref={photo} className="test-festival-photo" aria-labelledby="festival-heading">
        <div className="test-photo-window">
          <picture><source media="(max-width: 700px)" srcSet="/foto%2020266/8D7A8888.webp" /><motion.img src="/foto%2020266/_MG_0414%20(2).webp" alt="Un pomeriggio a Natural Vibes, tra amici, musica e alberi" width={1800} height={1222} loading="eager" style={{ y: reduced ? 0 : photoY }} /></picture>
          <div className="test-photo-shade" />
          <svg className="test-photo-lines" viewBox="0 0 1600 1050" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M20 1170V320C20 100 150 30 365 30H710" stroke="#ad7f47" strokeWidth="110" />
            <path d="M85 1170V325C85 150 170 92 365 92H725" stroke="#d8b85a" strokeWidth="6" />
            <path d="M1015-80H1080L1660 465V510ZM1230-100H1295L1670 420V470Z" fill="#ad7f47" />
          </svg>
        </div>
        <span className="collage-kicker test-photo-kicker">MUSIC · ART · NATURE</span>
        <h2 id="festival-heading" className="test-photo-title">{lang === "it" ? "Il Festival" : "The Festival"}</h2>
        <div className="test-photo-mascot"><LogoMascot /></div>
        <div className="test-photo-description">
        <p>{lang === "it" ? "Natural Vibes è un festival indipendente nato da un gruppo di amici e dalla passione condivisa per la musica." : "Natural Vibes is an independent festival born from a group of friends and their shared passion for music."}</p>
        <p>{lang === "it" ? "Per tre giorni si entra in un mondo a sé, tra installazioni, workshop e DJ set che continuano fino al mattino. Le persone si incontrano e si attraggono come calamite, si conoscono e si ritrovano. Una bolla in cui lasciarsi andare, stare insieme e dimenticare per un po’ tutto quello che c’è fuori." : "For three days, we step into a world of our own, among installations, workshops and DJ sets that carry on until morning. People meet and are drawn together like magnets, getting to know one another and finding each other again. A bubble where we can let go, be together and forget for a while about everything outside."}</p>
          <a href="#info" className="collage-text-link">{lang === "it" ? "Entra nelle vibes" : "Step into the vibes"}<ArrowDownRight size={18} /></a>
        </div>
      </section>
      <section id="visione" className="test-vision" aria-labelledby="vision-heading">
        <div className="test-vision-photo"><img src="/foto%2020266/_MG_0191%20(1).webp" alt="Amici insieme sull’erba all’ombra degli alberi" width={1800} height={1200} loading="lazy" /></div>
        <div className="test-vision-copy">
        <span className="collage-kicker">MUSIC IS THE HEART</span>
        <h2 id="vision-heading">{lang === "it" ? "La nostra visione" : "Our vision"}</h2>
        <p>{lang === "it" ? "Vogliamo che Natural Vibes sia un luogo di libertà, dove la musica elettronica e l’arte mettano in contatto persone con storie, idee e modi di vivere diversi. Un festival in cui poter sperimentare, lasciarsi andare e sentirsi accolti, con rispetto per lo spazio e i limiti di ciascuno." : "We want Natural Vibes to be a place of freedom, where electronic music and art bring together people with different stories, ideas and ways of life. A festival where people can experiment, let go and feel welcome, with respect for everyone’s personal space and boundaries."}</p>
        <p>{lang === "it" ? "Per noi questa libertà richiede cura: nella scelta della musica, nel lavoro di chi costruisce il festival, nell’attenzione alle persone e al luogo che ci ospita. Vogliamo dare spazio ad artisti e realtà indipendenti, sostenere la collaborazione e far crescere una comunità che partecipi alla vita del festival, portando idee, sensibilità ed energie proprie." : "For us, this freedom takes care: in the music we choose, in the work of the people who build the festival, and in our attention to each other and the place that hosts us. We want to make room for independent artists and collectives, support collaboration, and grow a community that helps shape the festival with its own ideas, perspectives and energy."}</p>
        <a href="#gallery" className="collage-text-link">{lang === "it" ? "Rivivi il 2026" : "Relive 2026"}<ArrowUpRight size={18} /></a>
        </div>
      </section>
    </div>
  </section>;
}
