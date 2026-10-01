import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { createPortal } from "react-dom";
import { Pause, Play } from "lucide-react";
import { useLang } from "@/components/LangToggle";

export default function VideoBackdrop({ sunOpacity, nightOpacity, galleryOpacity }: { sunOpacity: MotionValue<number>; nightOpacity: MotionValue<number>; galleryOpacity: MotionValue<number> }) {
  const day = useRef<HTMLVideoElement>(null);
  const sun = useRef<HTMLVideoElement>(null);
  const night = useRef<HTMLVideoElement>(null);
  const gallery = useRef<HTMLVideoElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const [inView, setInView] = useState(false);
  const [mobilePortrait, setMobilePortrait] = useState(() => window.matchMedia("(max-width: 700px) and (orientation: portrait)").matches);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px) and (orientation: portrait)");
    const update = () => setMobilePortrait(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const videoSrc = (name: string) => `/videos/${name}${mobilePortrait ? "-mobile" : ""}.mp4`;
  const [paused, setPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const reduced = useReducedMotion();
  const { lang } = useLang();
  const stopped = paused || (reduced && !manualPlay);

  useEffect(() => {
    const pending = new WeakSet<HTMLVideoElement>();
    const videos = [day.current, sun.current, night.current, gallery.current].filter((video): video is HTMLVideoElement => video !== null);
    const sync = () => {
      const amount = nightOpacity.get();
      const sunAmount = sunOpacity.get();
      const galleryAmount = galleryOpacity.get();
      for (const [video, needed] of [[day.current, sunAmount < .99 && amount < .99 && galleryAmount < .99], [sun.current, sunAmount > .01 && amount < .99 && galleryAmount < .99], [night.current, amount > .01 && galleryAmount < .99], [gallery.current, galleryAmount > .01]] as const) {
        if (!video) continue;
        if (visible.current && !stopped && needed && document.visibilityState === "visible") {
          // Set the DOM properties before play, including on Safari.
          video.muted = true;
          video.defaultMuted = true;
          if (video.paused && !pending.has(video)) {
            pending.add(video);
            video.play().catch(() => undefined).finally(() => pending.delete(video));
          }
        } else video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; setInView(entry.isIntersecting); sync(); }, { threshold: .05 });
    if (viewport.current) observer.observe(viewport.current);
    const unsubscribeSun = sunOpacity.on("change", sync);
    const unsubscribe = nightOpacity.on("change", sync);
    const unsubscribeGallery = galleryOpacity.on("change", sync);
    videos.forEach(video => video.addEventListener("canplay", sync));
    window.addEventListener("pageshow", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer.disconnect(); videos.forEach(video => video.removeEventListener("canplay", sync)); window.removeEventListener("pageshow", sync); unsubscribeSun(); unsubscribe(); unsubscribeGallery(); document.removeEventListener("visibilitychange", sync); videos.forEach(video => video.pause()); };
  }, [sunOpacity, nightOpacity, galleryOpacity, stopped, mobilePortrait]);

  return <div ref={viewport} className="experience-backdrop">
    <div className="experience-day" aria-hidden="true">
      <video ref={day} src={videoSrc("festival-day")} muted loop playsInline preload="metadata" poster="/videos/festival-day-poster.webp" />
    </div>
    <motion.div className="experience-sun" style={{ opacity: sunOpacity }} aria-hidden="true">
      <video ref={sun} src={videoSrc("festival-sun-0412")} muted loop playsInline preload="metadata" poster="/videos/festival-sun-0412-poster.webp" />
    </motion.div>
    <motion.div className="experience-night" style={{ opacity: nightOpacity }} aria-hidden="true">
      <video ref={night} src={videoSrc("festival-night")} muted loop playsInline preload="none" poster="/videos/festival-night-poster.webp" />
    </motion.div>
    <motion.div className="experience-gallery" style={{ opacity: galleryOpacity }} aria-hidden="true">
      <video ref={gallery} src={videoSrc("festival-gallery")} muted loop playsInline preload="none" poster="/videos/festival-gallery-poster.webp" />
    </motion.div>
    <div className="experience-shade" aria-hidden="true" />
    {inView && createPortal(<button type="button" className="trial-video-control experience-video-control" onClick={() => {setManualPlay(true); setPaused(!stopped);}}
      aria-label={lang === "it" ? (stopped ? "Riproduci i video" : "Metti in pausa i video") : (stopped ? "Play videos" : "Pause videos")}>
      {stopped ? <Play size={18} /> : <Pause size={18} />}
    </button>, document.querySelector("main.trial-page") ?? document.body)}
  </div>;
}
