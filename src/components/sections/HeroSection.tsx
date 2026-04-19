import LogoComposer from "@/components/LogoComposer";
import type { SectionMode } from "@/lib/particles";
import { ChevronDown } from "lucide-react";

interface Props {
  mode: SectionMode;
}

export default function HeroSection({ mode }: Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Particle logo canvas */}
      <LogoComposer mode={mode} className="absolute inset-0 w-full h-full" />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animate-float"
        style={{ animationDelay: "4.2s" }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
}
