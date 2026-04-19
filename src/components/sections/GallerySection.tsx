import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
  type UIEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useLang } from "@/components/LangToggle";
import { GALLERY_FILES } from "@/generated/galleryManifest";

const INITIAL_BATCH = 12;
const BATCH_SIZE = 8;

function toTitleCase(value: string) {
  return value
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function makeEntry(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "");
  const numberedMatch = stem.match(/Naturalvibes_2025_©AndreaTerlizzi_(\d+)$/);

  if (numberedMatch) {
    const number = Number(numberedMatch[1]);
    return {
      id: stem,
      src: `/images/gallery/${filename}`,
      alt: `Natural Vibes 2025 — foto ${number}`,
    };
  }

  return {
    id: stem,
    src: `/images/gallery/${filename}`,
    alt: `Natural Vibes 2025 — ${toTitleCase(stem)}`,
  };
}

const GALLERY_2025 = GALLERY_FILES.map((filename) => makeEntry(filename));

function LazyImg({
  src,
  alt,
  className,
  rootRef,
}: {
  src: string;
  alt: string;
  className?: string;
  rootRef?: RefObject<HTMLElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      {
        root: rootRef?.current ?? null,
        rootMargin: rootRef?.current ? "0px 35% 0px 0px" : "500px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);

  return (
    <div ref={wrapRef} className="h-full w-full min-h-[80px] overflow-hidden bg-muted/10">
      {show ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div aria-hidden="true" className="h-full w-full animate-pulse bg-muted/20" />
      )}
    </div>
  );
}

export default function GallerySection() {
  const { lang } = useLang();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const galleryRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const closeGallery = useCallback(() => {
    setGalleryOpen(false);
    setLightbox(null);
  }, []);

  const prev = useCallback(
    () => setLightbox((p) => (p !== null ? (p - 1 + GALLERY_2025.length) % GALLERY_2025.length : null)),
    [],
  );

  const next = useCallback(
    () => setLightbox((p) => (p !== null ? (p + 1) % GALLERY_2025.length : null)),
    [],
  );

  const loadMorePhotos = useCallback(() => {
    setVisibleCount((current) => (
      current >= GALLERY_2025.length ? current : Math.min(current + BATCH_SIZE, GALLERY_2025.length)
    ));
  }, []);

  useEffect(() => {
    if (!galleryOpen) return;

    setVisibleCount(Math.min(INITIAL_BATCH, GALLERY_2025.length));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [galleryOpen]);

  useEffect(() => {
    if (!galleryOpen || visibleCount >= GALLERY_2025.length) return;

    const root = galleryRef.current;
    const target = loadMoreRef.current;
    if (!root || !target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMorePhotos();
      },
      {
        root,
        rootMargin: "0px 0px 35% 0px",
        threshold: 0.15,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [galleryOpen, visibleCount, loadMorePhotos]);

  // Navigazione lightbox con tastiera
  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next, closeLightbox]);

  const handleGalleryScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const remaining = scrollHeight - clientHeight - scrollTop;

    if (remaining <= clientHeight * 1.1) {
      loadMorePhotos();
    }
  }, [loadMorePhotos]);

  const previewPhotos = GALLERY_2025.slice(0, 4);
  const visiblePhotos = GALLERY_2025.slice(0, visibleCount);
  const canLoadMore = visibleCount < GALLERY_2025.length;

  return (
    <section id="gallery" className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto mb-16 px-6 py-8 rounded-2xl glass-raw text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            📸 Gallery
          </h2>
          <p className="text-foreground font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {lang === "it" ? "Rivivi i momenti delle edizioni passate" : "Relive the moments from past editions"}
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="glass-raw relative w-full rounded-2xl overflow-hidden cursor-pointer group text-left"
            onClick={() => setGalleryOpen(true)}
            aria-label={lang === "it" ? "Apri la gallery 2025" : "Open the 2025 gallery"}
          >
            <div className="grid grid-cols-2 gap-0.5">
              {previewPhotos.map((item) => (
                <div key={item.src} className="overflow-hidden aspect-square">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center gap-3 group-hover:bg-background/40 transition-colors">
              <span className="text-3xl sm:text-4xl font-heading font-black text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-tight">
                {lang === "it" ? "Edizione 2025" : "2025 Edition"}
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                📷 Ph. Andrea Terlizzi
              </span>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground font-heading font-black text-sm tracking-widest shadow-lg">
                <Images className="w-4 h-4" />
                {lang === "it" ? `Vedi tutte le ${GALLERY_2025.length} foto` : `View all ${GALLERY_2025.length} photos`}
              </div>
            </div>
          </motion.button>
        </div>


      </div>

      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/97 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "it" ? "Gallery 2025" : "2025 gallery"}
          >
            <div className="flex h-full flex-col">
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border/40">
                <span className="font-heading font-black text-lg text-foreground">
                  {lang === "it" ? "📸 Edizione 2025" : "📸 2025 Edition"}
                </span>
                <button
                  type="button"
                  onClick={closeGallery}
                  className="text-foreground/70 hover:text-foreground p-2 rounded-full hover:bg-muted/40 transition-colors"
                  aria-label={lang === "it" ? "Chiudi la gallery" : "Close gallery"}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 min-h-0 px-4 pb-6 pt-4 md:px-6">
                <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-base font-heading font-black text-foreground">
                        {lang === "it" ? "Scorri verso il basso per esplorare la gallery" : "Scroll down to explore the gallery"}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {lang === "it"
                          ? "Le foto vengono aggiunte poco alla volta mentre continui a scorrere."
                          : "More photos are added progressively as you keep scrolling."}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground/75">
                      {lang === "it"
                        ? `${visibleCount} / ${GALLERY_2025.length} foto caricate`
                        : `${visibleCount} / ${GALLERY_2025.length} photos loaded`}
                    </p>
                  </div>

                  <div className="relative flex-1 min-h-0">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-12 bg-gradient-to-b from-background to-transparent md:block" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-16 bg-gradient-to-t from-background to-transparent md:block" />
                    <div
                      ref={galleryRef}
                      role="region"
                      aria-label={lang === "it" ? "Gallery verticale 2025" : "2025 vertical gallery"}
                      className="h-full min-h-[52vh] overflow-y-auto overflow-x-hidden pb-4 pr-1 [scrollbar-width:thin]"
                      onScroll={handleGalleryScroll}
                    >
                      <div className="grid grid-cols-2 gap-3 pr-3 sm:grid-cols-3 xl:grid-cols-4">
                        {visiblePhotos.map((item, i) => (
                          <button
                            type="button"
                            key={item.id}
                            className="group relative overflow-hidden rounded-[24px] border border-border/40 bg-card/40 text-left shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                            onClick={() => setLightbox(i)}
                            aria-label={lang === "it" ? `Apri ${item.alt}` : `Open ${item.alt}`}
                          >
                            <LazyImg
                              src={item.src}
                              alt={item.alt}
                              rootRef={galleryRef}
                              className="aspect-[0.85] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] group-hover:brightness-110"
                            />
                          </button>
                        ))}

                        {canLoadMore && (
                          <div
                            ref={loadMoreRef}
                            className="col-span-full flex min-h-40 items-center justify-center rounded-[24px] border border-dashed border-border/50 bg-card/30 px-6 py-10 text-center"
                          >
                            <div className="space-y-3">
                              <p className="text-base font-heading font-black text-foreground">
                                {lang === "it" ? "Sto preparando altre foto" : "Loading more photos"}
                              </p>
                              <p className="text-sm text-foreground/70">
                                {lang === "it" ? "Continua a scorrere verso il basso" : "Keep scrolling down"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-background/97 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={lang === "it" ? "Visualizzatore immagini" : "Image viewer"}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-foreground/70 hover:text-foreground z-10 p-2"
              aria-label={lang === "it" ? "Chiudi immagine" : "Close image"}
            >
              <X className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 md:left-8 text-foreground/50 hover:text-foreground z-10 p-3"
              aria-label={lang === "it" ? "Foto precedente" : "Previous photo"}
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 md:right-8 text-foreground/50 hover:text-foreground z-10 p-3"
              aria-label={lang === "it" ? "Foto successiva" : "Next photo"}
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={GALLERY_2025[lightbox].src}
              alt={GALLERY_2025[lightbox].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
