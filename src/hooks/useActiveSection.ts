import { useEffect, useState } from "react";
import type { SectionMode } from "@/lib/particles";

const SECTION_IDS: SectionMode[] = ["hero", "info", "gallery"];

export function useActiveSection(): SectionMode {
  const [active, setActive] = useState<SectionMode>("hero");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: SectionMode = "hero";
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * .3) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}
