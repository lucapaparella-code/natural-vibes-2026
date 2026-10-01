import { useState, type RefObject } from "react";
import CollageTile, { TiltSurface } from "@/components/CollageTile";
import PhotoLightbox from "@/components/PhotoLightbox";
import { DAY_MOSAIC_PHOTOS, NIGHT_MOSAIC_PHOTOS, MOSAIC_PHOTOS_2026 } from "@/data/mosaicPhotos2026";
import { useLang } from "@/components/LangToggle";

export default function FestivalMosaic({ nightTarget }: { nightTarget: RefObject<HTMLDivElement> }) {
  const { lang } = useLang();
  const [photo, setPhoto] = useState<number | null>(null);
  return <section id="info" className="festival-mosaic">
    <div className="mosaic-heading"><h2>{lang === "it" ? "Sotto il sole" : "Under the sun"}</h2></div>
    <div className="mosaic-board">
      <CollageTile id="sun-selection-1" className="mosaic-wide" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <TiltSurface className="mosaic-spirit paper-card">
        <span className="collage-kicker">THIS IS NATURAL VIBES</span>
        <h2>{lang === "it" ? "Lo spirito del festival" : "The spirit of the festival"}</h2>
        <p>{lang === "it" ? "Musica, arte e un mood aperto, umano e coinvolgente: lo spirito che da sempre caratterizza Natural Vibes." : "Music, art and an open, human and welcoming atmosphere: the spirit that has always defined Natural Vibes."}</p>
      </TiltSurface>
      <CollageTile id="sun-selection-2" className="mosaic-secondary" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <CollageTile id="sun-selection-3" className="mosaic-tall" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <CollageTile id="sun-selection-4" className="mosaic-pool" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <CollageTile id="sun-selection-5" className="mosaic-friends" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      {DAY_MOSAIC_PHOTOS.slice(5).map((item, index) => <CollageTile key={item.id} id={item.id} className={`mosaic-extra mosaic-extra-${index + 1}`} onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />)}
    </div>
    <div ref={nightTarget} className="mosaic-heading mosaic-night-heading"><span>02 / MUSIC IS THE HEART</span><h2>{lang === "it" ? "Dentro la notte" : "Into the night"}</h2></div>
    <div className="night-board">
      <CollageTile id="night-selection-1" className="mosaic-night" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <TiltSurface className="mosaic-nature paper-card">
        <span className="collage-kicker">THIS IS NATURAL VIBES</span>
        <h3>{lang === "it" ? "Il suono ci tiene insieme" : "Sound brings us together"}</h3>
        <p>{lang === "it" ? "Natural Vibes è musica, arti visive e performance: un'esperienza da condividere, dal primo ballo fino alle ultime luci." : "Natural Vibes brings together music, visual arts and performances: an experience to share, from the first dance to the last lights."}</p>
      </TiltSurface>
      <CollageTile id="night-selection-2" className="night-photo-square" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <CollageTile id="night-selection-3" className="night-photo-middle" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      <CollageTile id="night-selection-4" className="night-photo-wide" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
      {NIGHT_MOSAIC_PHOTOS.slice(4).map((item, index) => <CollageTile key={item.id} id={item.id} className={`mosaic-extra mosaic-extra-${index + 1}`} onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />)}
    </div>
    {photo !== null && <PhotoLightbox index={photo} onChange={setPhoto} onClose={() => setPhoto(null)} showCaption={false} photos={MOSAIC_PHOTOS_2026} />}
  </section>;
}
