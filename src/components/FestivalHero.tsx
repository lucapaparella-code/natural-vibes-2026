import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import LogoComposer from "@/components/LogoComposer";
import LogoMascot from "@/components/LogoMascot";
import { TiltSurface } from "@/components/CollageTile";
import { useLang } from "@/components/LangToggle";
import type { SectionMode } from "@/lib/particles";

export default function FestivalHero({ mode }: { mode: SectionMode }) {
  const { lang } = useLang();
  return <section id="hero" className="trial-hero">
    <h1 className="sr-only">Natural Vibes 2027 · Spazio il Passel, Angrogna (TO)</h1>
    <div className="trial-hero-board">
      <div className="hero-brand"><LogoComposer mode={mode} className="absolute inset-0 w-full h-full" /></div>
      <TiltSurface className="hero-festival paper-card">
        <span className="collage-kicker">MUSIC · ART · NATURE</span>
        <h2>{lang === "it" ? "Il Festival" : "The Festival"}</h2>
        <p>{lang === "it" ? "Natural Vibes è un festival indipendente, un'esperienza immersiva tra musica, arti visive, performance, installazioni interattive e workshop." : "Natural Vibes is an independent festival, an immersive experience combining music, visual arts, performances, interactive installations and workshops."}</p>
        <a href="#info" className="collage-text-link">{lang === "it" ? "Entra nelle vibes" : "Step into the vibes"}<ArrowDownRight size={18} /></a>
      </TiltSurface>
      <div className="hero-mascot"><LogoMascot /></div>
      <TiltSurface className="hero-story paper-card">
        <span className="collage-kicker">MUSIC IS THE HEART</span>
        <h2>{lang === "it" ? "Molto più di un evento musicale" : "More than a music event"}</h2>
        <p>{lang === "it" ? "Natural Vibes nasce con l'intento di distinguersi dai festival tradizionali. Vuole essere molto più di un evento musicale: un'esperienza poliedrica dove la musica è il cuore pulsante, ma non l'unico protagonista." : "Natural Vibes was created with the intention of standing apart from traditional festivals. It aims to be much more than a music event: a multifaceted experience where music is the beating heart, but not the only protagonist."}</p>
        <a href="#gallery" className="collage-text-link">{lang === "it" ? "Rivivi il 2026" : "Relive 2026"}<ArrowUpRight size={18} /></a>
      </TiltSurface>
    </div>
    <div className="trial-hero-foot"><span>SPAZIO IL PASSEL / ANGROGNA (TO)</span></div>
  </section>;
}
