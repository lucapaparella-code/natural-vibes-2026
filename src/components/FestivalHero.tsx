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
        <p>{lang === "it" ? "Natural Vibes è un festival indipendente, un'esperienza immersiva tra musica, arti visive, performance, installazioni interattive e workshop." : "Natural Vibes is an independent festival, an immersive experience combining music, visual arts, performances, interactive installations and workshops."}</p>
        <p>{lang === "it" ? "Per qualche giorno si abita lo stesso piccolo mondo, con la musica che accompagna gli incontri e il passaggio dal giorno alla notte. C’è chi balla, chi gioca, chi si ritrova sull’erba con gli amici e chi resta davanti alle casse per tutto il set. Ci si lascia incuriosire da una performance, si esplora, si torna sui propri passi." : "For a few days, we share the same little world, with music accompanying encounters and the shift from day into night. Some people dance, some play, some gather on the grass with friends, and others stay by the speakers for an entire set. A performance catches our curiosity; we wander, explore and find our way back."}</p>
        <p>{lang === "it" ? "Con il buio cambiano i colori e ci si ritrova sul dancefloor tra facce ormai familiari. La festa prende forma attraverso chi la vive, con le sue stranezze, le idee e la libertà di esprimerle." : "After dark, the colours change and familiar faces meet again on the dancefloor. The party takes shape through the people who live it, with their quirks, ideas and the freedom to express them."}</p>
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
