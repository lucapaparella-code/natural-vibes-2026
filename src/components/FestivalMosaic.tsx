import { useState, type RefObject } from "react";
import CollageTile from "@/components/CollageTile";
import PhotoLightbox from "@/components/PhotoLightbox";
import { DAY_MOSAIC_PHOTOS, NIGHT_MOSAIC_PHOTOS, MOSAIC_PHOTOS_2026 } from "@/data/mosaicPhotos2026";
import { useLang } from "@/components/LangToggle";

export default function FestivalMosaic({ nightTarget }: { nightTarget: RefObject<HTMLDivElement> }) {
  const { lang } = useLang();
  const [photo, setPhoto] = useState<number | null>(null);
  const chapters = [
    { key: "sun", photos: DAY_MOSAIC_PHOTOS,
      title: lang === "it" ? "Sotto il sole" : "Under the sun",
      heading: lang === "it" ? "Lo spirito del festival" : "The spirit of the festival",
      text: lang === "it" ? "Musica, arte e un mood aperto, umano e coinvolgente: lo spirito che da sempre caratterizza Natural Vibes." : "Music, art and an open, human and welcoming atmosphere: the spirit that has always defined Natural Vibes." },
    { key: "night", photos: NIGHT_MOSAIC_PHOTOS,
      title: lang === "it" ? "Dentro la notte" : "Into the night",
      heading: lang === "it" ? "Il suono ci tiene insieme" : "Sound brings us together",
      text: lang === "it" ? "Natural Vibes è musica, arti visive e performance: un'esperienza da condividere, dal primo ballo fino alle ultime luci." : "Natural Vibes brings together music, visual arts and performances: an experience to share, from the first dance to the last lights." },
  ];
  return <section id="info" className="festival-mosaic editorial-chapters">
    {chapters.map(chapter => <div key={chapter.key} className={`editorial-chapter chapter-${chapter.key}`}>
      {chapter.key === "night" && <div ref={nightTarget} className="chapter-video-cue" aria-hidden="true" />}
      <div className="chapter-intro">
        <CollageTile id={chapter.photos[0].id} className="chapter-lead" onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />
        <div className="chapter-copy test-vision-copy">
          <h2 className="chapter-title">{chapter.title}</h2>
          <span className="collage-kicker">{chapter.key === "sun" ? "THIS IS NATURAL VIBES" : "MUSIC IS THE HEART"}</span>
          <h3>{chapter.heading}</h3>
          <p>{chapter.text}</p>
        </div>
      </div>
      <div className="chapter-photos">
        {chapter.photos.slice(1).map(item => <CollageTile key={item.id} id={item.id} className={`chapter-photo ${item.height > item.width ? "chapter-portrait" : "chapter-landscape"}`} onOpen={setPhoto} photos={MOSAIC_PHOTOS_2026} />)}
      </div>
    </div>)}
    {photo !== null && <PhotoLightbox index={photo} onChange={setPhoto} onClose={() => setPhoto(null)} showCaption={false} photos={MOSAIC_PHOTOS_2026} />}
  </section>;
}
