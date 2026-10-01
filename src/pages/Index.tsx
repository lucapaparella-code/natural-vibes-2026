import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import FestivalExperience from "@/components/FestivalExperience";
import GalleryArchiveSection from "@/components/sections/GalleryArchiveSection";
import GallerySection from "@/components/sections/GallerySection";
import Gallery2024Section from "@/components/sections/Gallery2024Section";
import SiteFooter from "@/components/SiteFooter";
import EasterEggManager from "@/components/easter-eggs/EasterEggManager";
import { LangProvider, LangToggle } from "@/components/LangToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { SectionMode } from "@/lib/particles";

export default function Index() {
  const activeSection = useActiveSection();
  const [hoverSection, setHoverSection] = useState<SectionMode | null>(null);
  const mode: SectionMode = hoverSection ?? activeSection;
  const handleHoverSection = useCallback((section: SectionMode | null) => setHoverSection(section), []);
  return (
    <LangProvider>
      <main className="trial-page relative min-h-screen">
        <Navbar activeSection={activeSection} onHoverSection={handleHoverSection} />
        <LangToggle />
        <FestivalExperience mode={mode}>
          <GallerySection />
          <GalleryArchiveSection />
          <Gallery2024Section />
        </FestivalExperience>
        <SiteFooter />
        <EasterEggManager />
      </main>
    </LangProvider>
  );
}
