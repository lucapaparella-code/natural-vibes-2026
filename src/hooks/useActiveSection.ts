import { useEffect, useState } from "react";
import type { SectionMode } from "@/lib/particles";

// TODO: Change SECTION_IDS or THRESHOLD to adjust behaviour
const SECTION_IDS: SectionMode[] = ["hero", "info", "lineup", "tickets", "camping", "gallery", "work"];
const THRESHOLD = 0.45; // TODO: Adjust IntersectionObserver threshold

export function useActiveSection(): SectionMode {
  const [active, setActive] = useState<SectionMode>("hero");

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with largest intersection ratio
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((e) => {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        });
        if (best) {
          setActive(best.target.id as SectionMode);
        }
      },
      { threshold: THRESHOLD }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
