import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import LogoComposer from "@/components/LogoComposer";
import LogoMascot from "@/components/LogoMascot";
import { TiltSurface } from "@/components/CollageTile";
import { useLang } from "@/components/LangToggle";
import type { SectionMode } from "@/lib/particles";

export default function FestivalHero({ mode }: { mode: SectionMode }) {
  const { lang } = useLang();
  return <section id="hero" className="trial-hero">
    <h1 className="sr-only">Natural Vibes 2027</h1>
    <div className="trial-hero-board">
      <div className="hero-brand"><LogoComposer mode={mode} className="absolute inset-0 w-full h-full" /></div>
      <TiltSurface className="hero-festival paper-card">
        <span className="collage-kicker">MUSIC · ART · NATURE</span>
        <h2>{lang === "it" ? "Il Festival" : "The Festival"}</h2>
        <p>{lang === "it" ? "Natural Vibes è un festival indipendente nato da un gruppo di amici e dalla passione condivisa per la musica." : "Natural Vibes is an independent festival born from a group of friends and their shared passion for music."}</p>
        <p>{lang === "it" ? "Per tre giorni si entra in un mondo a sé, tra installazioni, workshop e DJ set che continuano fino al mattino. Le persone si incontrano e si attraggono come calamite, si conoscono e si ritrovano. Una bolla in cui lasciarsi andare, stare insieme e dimenticare per un po’ tutto quello che c’è fuori." : "For three days, we step into a world of our own, among installations, workshops and DJ sets that carry on until morning. People meet and are drawn together like magnets, getting to know one another and finding each other again. A bubble where we can let go, be together and forget for a while about everything outside."}</p>
        <a href="#info" className="collage-text-link">{lang === "it" ? "Entra nelle vibes" : "Step into the vibes"}<ArrowDownRight size={18} /></a>
      </TiltSurface>
      <div className="hero-mascot"><LogoMascot /></div>
      <TiltSurface className="hero-story paper-card">
        <span className="collage-kicker">MUSIC IS THE HEART</span>
        <h2>{lang === "it" ? "La nostra visione" : "Our vision"}</h2>
        <p>{lang === "it" ? "Vogliamo che Natural Vibes sia un luogo di libertà, dove la musica elettronica e l’arte mettano in contatto persone con storie, idee e modi di vivere diversi. Un festival in cui poter sperimentare, lasciarsi andare e sentirsi accolti, con rispetto per lo spazio e i limiti di ciascuno." : "We want Natural Vibes to be a place of freedom, where electronic music and art bring together people with different stories, ideas and ways of life. A festival where people can experiment, let go and feel welcome, with respect for everyone’s personal space and boundaries."}</p>
        <p>{lang === "it" ? "Per noi questa libertà richiede cura: nella scelta della musica, nel lavoro di chi costruisce il festival, nell’attenzione alle persone e al luogo che ci ospita. Vogliamo dare spazio ad artisti e realtà indipendenti, sostenere la collaborazione e far crescere una comunità che partecipi alla vita del festival, portando idee, sensibilità ed energie proprie." : "For us, this freedom takes care: in the music we choose, in the work of the people who build the festival, and in our attention to each other and the place that hosts us. We want to make room for independent artists and collectives, support collaboration, and grow a community that helps shape the festival with its own ideas, perspectives and energy."}</p>
        <a href="#gallery" className="collage-text-link">{lang === "it" ? "Rivivi il 2026" : "Relive 2026"}<ArrowUpRight size={18} /></a>
      </TiltSurface>
    </div>
  </section>;
}
