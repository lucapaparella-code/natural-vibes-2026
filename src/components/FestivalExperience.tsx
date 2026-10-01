import { useRef, type ReactNode } from "react";
import { useScroll, useTransform } from "framer-motion";
import FestivalHero from "@/components/FestivalHero";
import FestivalMosaic from "@/components/FestivalMosaic";
import VideoBackdrop from "@/components/VideoBackdrop";
import type { SectionMode } from "@/lib/particles";

export default function FestivalExperience({ mode, children }: { mode: SectionMode; children: ReactNode }) {
  const sunTarget = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sunProgress } = useScroll({ target: sunTarget, offset: ["start end", "start start"] });
  const sunOpacity = useTransform(sunProgress, [0, 1], [0, 1]);
  const nightTarget = useRef<HTMLDivElement>(null);
  const galleryTarget = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryProgress } = useScroll({ target: galleryTarget, offset: ["start end", "start start"] });
  const galleryOpacity = useTransform(galleryProgress, [0, 1], [0, 1]);
  const { scrollYProgress } = useScroll({ target: nightTarget, offset: ["start end", "start start"] });
  const nightOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <div className="festival-experience">
    <VideoBackdrop sunOpacity={sunOpacity} nightOpacity={nightOpacity} galleryOpacity={galleryOpacity} />
    <FestivalHero mode={mode} />
    <div ref={sunTarget} className="sun-video-phase"><FestivalMosaic nightTarget={nightTarget} /></div>
    <div ref={galleryTarget} className="gallery-video-phase">{children}</div>
  </div>;
}
