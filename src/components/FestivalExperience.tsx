import { useEffect, useRef, type ReactNode } from "react";
import { useMotionValue } from "framer-motion";
import FestivalHero from "@/components/FestivalHero";
import FestivalMosaic from "@/components/FestivalMosaic";
import VideoBackdrop from "@/components/VideoBackdrop";
import type { SectionMode } from "@/lib/particles";

export default function FestivalExperience({ mode, children }: { mode: SectionMode; children: ReactNode }) {
  const sunTarget = useRef<HTMLDivElement>(null);
  const nightTarget = useRef<HTMLDivElement>(null);
  const galleryTarget = useRef<HTMLDivElement>(null);
  const sunOpacity = useMotionValue(0);
  const nightOpacity = useMotionValue(0);
  const galleryOpacity = useMotionValue(0);

  useEffect(() => {
    let frame = 0;
    // Measure actual viewport positions: nested and absolutely positioned cues
    // must not inherit a different scroll coordinate system from the photo grid.
    const progress = (element: HTMLElement | null) => element
      ? Math.max(0, Math.min(1, 1 - element.getBoundingClientRect().top / window.innerHeight))
      : 0;
    const update = () => {
      frame = 0;
      sunOpacity.set(progress(sunTarget.current));
      nightOpacity.set(progress(nightTarget.current));
      galleryOpacity.set(progress(galleryTarget.current));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    const experience = sunTarget.current?.parentElement;
    if (experience) observer.observe(experience);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sunOpacity, nightOpacity, galleryOpacity]);

  return <div className="festival-experience">
    <VideoBackdrop sunOpacity={sunOpacity} nightOpacity={nightOpacity} galleryOpacity={galleryOpacity} />
    <FestivalHero mode={mode} />
    <div ref={sunTarget} className="sun-video-phase"><FestivalMosaic nightTarget={nightTarget} /></div>
    <div ref={galleryTarget} className="gallery-video-phase">{children}</div>
  </div>;
}
