import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import InfoSection from "@/components/sections/InfoSection";
import LineupSection from "@/components/sections/LineupSection";
import TicketsSection from "@/components/sections/TicketsSection";
import CampingSection from "@/components/sections/CampingSection";
import GallerySection from "@/components/sections/GallerySection";
import LogoMascot from "@/components/LogoMascot";
import SiteFooter from "@/components/SiteFooter";
import EasterEggManager from "@/components/easter-eggs/EasterEggManager";
import { LangProvider, LangToggle } from "@/components/LangToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { SectionMode } from "@/lib/particles";

export default function Index() {
  const activeSection = useActiveSection();
  const [hoverSection, setHoverSection] = useState<SectionMode | null>(null);
  const mode: SectionMode = hoverSection ?? activeSection;

  const handleHoverSection = useCallback(
    (section: SectionMode | null) => setHoverSection(section),
    []
  );

  return (
    <LangProvider>
      <main className="relative min-h-screen">
        {/* Fixed teal background */}
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: -20 }}>
          <img src="/images/bg-nv2026.png" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>

        <Navbar activeSection={activeSection} onHoverSection={handleHoverSection} />
        <LangToggle />
        <HeroSection mode={mode} />
        <LogoMascot />
        <InfoSection />
        <LineupSection />
        <TicketsSection />
        <CampingSection />
        <GallerySection />
        <SiteFooter />
        <EasterEggManager />
      </main>
    </LangProvider>
  );
}
