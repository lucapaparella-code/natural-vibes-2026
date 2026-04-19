import { useCallback, useEffect, useRef, useState } from "react";

// Area di tracking centrata sull'occhio del bird (in percentuale rispetto al logo)
const EYE_CENTER_X_PCT = 0.39;
const EYE_CENTER_Y_PCT = 0.475;
const EYE_SIZE_PCT = 0.085;
const MAX_OFFSET = 50;
const TRACKING_RANGE = 350;
const LOGO_SRC = "/images/logo-no-eye-hd.png";
const EYE_SRC = "/images/occhio.png";

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();

    const finish = () => {
      if (typeof img.decode === "function") {
        img.decode().catch(() => undefined).finally(resolve);
        return;
      }

      resolve();
    };

    img.onload = finish;
    img.onerror = resolve;
    img.src = src;

    if (img.complete) {
      finish();
    }
  });
}

const SPIN_ROTATIONS = 3;
const SPIN_MIN = 40;   // distanza minima dall'occhio (px)
const SPIN_MAX = 380;  // distanza massima dall'occhio (px)

export default function LogoMascot() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [assetsReady, setAssetsReady] = useState(false);

  // Spin tracking
  const prevAngleRef = useRef<number | null>(null);
  const totalRotationRef = useRef(0);

  const resetSpin = useCallback(() => {
    prevAngleRef.current = null;
    totalRotationRef.current = 0;
  }, []);

  const handlePointer = useCallback((clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width * EYE_CENTER_X_PCT;
    const eyeCenterY = rect.top + rect.height * EYE_CENTER_Y_PCT;

    const dx = clientX - eyeCenterX;
    const dy = clientY - eyeCenterY;
    const distance = Math.hypot(dx, dy);
    const clamped = Math.min(distance, TRACKING_RANGE);
    const ratio = clamped / TRACKING_RANGE;
    const angle = Math.atan2(dy, dx);

    setOffset({
      x: Math.cos(angle) * ratio * MAX_OFFSET,
      y: Math.sin(angle) * ratio * MAX_OFFSET,
    });

    // ── Spin detection ──────────────────────────────────
    if (distance >= SPIN_MIN && distance <= SPIN_MAX) {
      if (prevAngleRef.current !== null) {
        let delta = angle - prevAngleRef.current;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        totalRotationRef.current += delta;

        if (Math.abs(totalRotationRef.current) >= SPIN_ROTATIONS * 2 * Math.PI) {
          resetSpin();
          window.dispatchEvent(new CustomEvent("nv:puzzle"));
          return;
        }
      }
      prevAngleRef.current = angle;
    } else {
      resetSpin();
    }
  }, [resetSpin]);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([preloadImage(LOGO_SRC), preloadImage(EYE_SRC)]).then(() => {
      if (!cancelled) {
        setAssetsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady) return;

    const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { setOffset({ x: 0, y: 0 }); resetSpin(); };
    
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [assetsReady, handlePointer, resetSpin]);

  return (
    <div
      id="logo-eye-stage"
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          assetsReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {assetsReady && (
          <div id="logo-eye-composer" className="relative h-[85vh] md:h-[165vh] aspect-[3/4]">
            <img
              ref={imgRef}
              src={LOGO_SRC}
              alt="Natural Vibes logo"
              className="absolute inset-0 z-10 h-full w-full object-contain select-none pointer-events-none"
              draggable={false}
              decoding="sync"
              fetchPriority="high"
            />

            {/* Rettangolo bianco dietro l'occhio */}
            <div
              id="eye-area-rect"
              className="absolute bg-white"
              style={{
                left: `${(EYE_CENTER_X_PCT - EYE_SIZE_PCT * 0.65) * 100}%`,
                top: `${(EYE_CENTER_Y_PCT - EYE_SIZE_PCT * 0.65) * 100}%`,
                width: `${EYE_SIZE_PCT * 1.3 * 100}%`,
                height: `${EYE_SIZE_PCT * 1.3 * 100}%`,
                zIndex: 5,
                transform: "rotate(90deg)",
              }}
            />

            {/* Occhio dietro il logo */}
            <div
              id="tracking-eye"
              className="absolute z-[7]"
              style={{
                left: `${(EYE_CENTER_X_PCT - EYE_SIZE_PCT / 2) * 100}%`,
                top: `${(EYE_CENTER_Y_PCT - EYE_SIZE_PCT / 2) * 100}%`,
                width: `${EYE_SIZE_PCT * 100}%`,
                height: `${EYE_SIZE_PCT * 100}%`,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition: "transform 80ms ease-out",
              }}
            >
              <img
                src={EYE_SRC}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
                draggable={false}
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
