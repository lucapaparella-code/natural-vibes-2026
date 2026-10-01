import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useLang } from "@/components/LangToggle";
import { MOSAIC_PHOTOS_2026, type MosaicPhoto } from "@/data/mosaicPhotos2026";

export default function PhotoLightbox({ index, onChange, onClose, showCaption = true, photos = MOSAIC_PHOTOS_2026 }: { photos?: MosaicPhoto[]; showCaption?: boolean; index: number; onChange: (index: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { lang } = useLang();
  const photo = photos[index];
  useEffect(() => {
    const el = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el?.showModal();
    return () => { el?.close(); document.body.style.overflow = overflow; };
  }, []);
  const move = (step: number) => onChange((index + step + photos.length) % photos.length);
  return createPortal(
    <dialog ref={dialog} className="photo-dialog" aria-label={lang === "it" ? "Gallery Natural Vibes 2026" : "Natural Vibes 2026 gallery"}
      onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "ArrowLeft") move(-1); if (e.key === "ArrowRight") move(1); }}>
      <div className="photo-dialog-top">
        <span className="photo-eyebrow">NATURAL VIBES / 2026</span>
        <button type="button" autoFocus onClick={onClose} className="photo-icon-button" aria-label={lang === "it" ? "Chiudi foto" : "Close photo"}><X /></button>
      </div>
      <figure className="photo-dialog-image">
        <img key={photo.id} src={photo.full} alt={photo.caption[lang]} width={photo.width} height={photo.height} />
      </figure>
      <div className="photo-dialog-bottom">
        <p>{showCaption && photo.caption[lang]} <span className="photo-counter">{String(index + 1).padStart(2, "0")} / {photos.length}</span></p>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} className="photo-icon-button" aria-label={lang === "it" ? "Foto precedente" : "Previous photo"}><ChevronLeft /></button>
          <button type="button" onClick={() => move(1)} className="photo-icon-button" aria-label={lang === "it" ? "Foto successiva" : "Next photo"}><ChevronRight /></button>
        </div>
      </div>
    </dialog>, document.body,
  );
}
