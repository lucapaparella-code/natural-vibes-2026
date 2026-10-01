import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/LangToggle";
import { MOSAIC_PHOTOS_2026, type MosaicPhoto } from "@/data/mosaicPhotos2026";

export function TiltSurface({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 220, damping: 28 });
  const rotateY = useSpring(y, { stiffness: 220, damping: 28 });
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - .5) * 5);
    y.set(((event.clientX - rect.left) / rect.width - .5) * 5);
  };
  return <motion.div className={`collage-surface ${className}`} onPointerMove={move} onPointerLeave={() => {x.set(0); y.set(0);}}
    style={{ ...style, rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformPerspective: 1000 }}>
    {children}
  </motion.div>;
}

export default function CollageTile({ id, className, onOpen, eager = false, photos = MOSAIC_PHOTOS_2026 }: { id: string; className: string; onOpen: (index: number) => void; eager?: boolean; photos?: MosaicPhoto[] }) {
  const { lang } = useLang();
  const index = photos.findIndex(photo => photo.id === id);
  const photo = photos[index];
  return <TiltSurface className={className}>
    <button type="button" className="collage-photo" onClick={() => onOpen(index)} aria-label={`${lang === "it" ? "Apri foto" : "Open photo"}: ${photo.caption[lang]}`}>
      <img src={photo.src} srcSet={`${photo.small} 640w, ${photo.src} 1200w, ${photo.full} ${Math.min(2000, photo.width)}w`}
        sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 50vw, 45vw" width={photo.width} height={photo.height}
        alt={photo.caption[lang]} loading={eager ? "eager" : "lazy"} decoding="async" />
      <span className="collage-open" aria-hidden="true"><ArrowUpRight size={20} /></span>
    </button>
  </TiltSurface>;
}
