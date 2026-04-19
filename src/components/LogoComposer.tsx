import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { SectionMode } from "@/lib/particles";

interface Props {
  mode: SectionMode;
  className?: string;
}

// ── Physics config ──
const REPEL_RADIUS = 100;
const REPEL_FORCE = 60;
const SPRING = { stiffness: 300, damping: 24, mass: 0.6 };

// Letter image map – "NATURAL" uses a2 for second A
const LETTER_IMAGES: Record<string, string> = {
  N: "/images/letters/n.png",
  A: "/images/letters/a.png",
  T: "/images/letters/t.png",
  U: "/images/letters/u.png",
  R: "/images/letters/r.png",
  A2: "/images/letters/a2.png",
  L: "/images/letters/l.png",
  V: "/images/letters/v.png",
  I: "/images/letters/i.png",
  B: "/images/letters/b.png",
  E: "/images/letters/e.png",
  S: "/images/letters/s.png",
};

// Each entry is an array of letter keys (A2 for second A in NATURAL)
const LINES: string[][] = [
  ["N", "A", "T", "U", "R", "A2", "L"],
  ["V", "I", "B", "E", "S"],
];
const YEAR_LINE = "2026";
const SUBTITLE_LINES = ["19-20-21 GIUGNO", "SPAZIO IL PASSEL", "ANGROGNA (TO)"];

// Branches disabled
const MAX_BRANCHES = 0;
const GROWTH_INTERVAL = 120;

interface Leaf {
  x: number;
  y: number;
  angle: number;
  size: number;
  flip: boolean;
  color: string;
  veinColor: string;
}

interface SubBranch {
  d: string;
  strokeWidth: number;
}

interface Branch {
  id: number;
  d: string;
  strokeWidthBase: number;
  strokeWidthTip: number;
  leaves: Leaf[];
  subBranches: SubBranch[];
  side: "left" | "right" | "top" | "bottom";
  delay: number;
  color: string;
}

const LEAF_COLORS = [
  { fill: "hsl(125, 38%, 32%)", vein: "hsl(125, 25%, 22%)" },
  { fill: "hsl(135, 42%, 38%)", vein: "hsl(135, 28%, 25%)" },
  { fill: "hsl(108, 32%, 42%)", vein: "hsl(108, 22%, 30%)" },
  { fill: "hsl(142, 38%, 28%)", vein: "hsl(142, 25%, 18%)" },
  { fill: "hsl(95, 42%, 40%)", vein: "hsl(95, 28%, 28%)" },
  { fill: "hsl(118, 35%, 36%)", vein: "hsl(118, 22%, 24%)" },
];

const BARK_COLORS = [
  "hsl(30, 25%, 22%)",
  "hsl(25, 20%, 20%)",
  "hsl(35, 22%, 18%)",
  "hsl(20, 18%, 24%)",
];

function pointOnCubic(
  t: number,
  sx: number, sy: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  ex: number, ey: number
): [number, number] {
  const u = 1 - t;
  const x = u*u*u*sx + 3*u*u*t*cp1x + 3*u*t*t*cp2x + t*t*t*ex;
  const y = u*u*u*sy + 3*u*u*t*cp1y + 3*u*t*t*cp2y + t*t*t*ey;
  return [x, y];
}

function tangentOnCubic(
  t: number,
  sx: number, sy: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  ex: number, ey: number
): number {
  const u = 1 - t;
  const dx = 3*u*u*(cp1x-sx) + 6*u*t*(cp2x-cp1x) + 3*t*t*(ex-cp2x);
  const dy = 3*u*u*(cp1y-sy) + 6*u*t*(cp2y-cp1y) + 3*t*t*(ey-cp2y);
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

// Realistic leaf SVG path (pointed tip, curved edges)
function leafPath(cx: number, cy: number, size: number, angle: number): string {
  const s = size;
  // leaf shape: pointed tip, rounded base, slight asymmetry
  return `M${cx},${cy - s * 10} 
    C${cx + s * 3.5},${cy - s * 7} ${cx + s * 4.5},${cy - s * 2} ${cx + s * 1},${cy + s * 1}
    C${cx + s * 0.3},${cy + s * 2} ${cx - s * 0.3},${cy + s * 2} ${cx - s * 1},${cy + s * 1}
    C${cx - s * 4.5},${cy - s * 2} ${cx - s * 3.5},${cy - s * 7} ${cx},${cy - s * 10}Z`;
}

function generateBranch(index: number, w: number, h: number): Branch {
  const sides: Branch["side"][] = ["left", "right", "top", "bottom"];
  const side = sides[index % 4];
  const seed = index * 137.508;
  const rng = (n: number) => Math.sin(seed * n + n * 7.13) * 0.5 + 0.5; // deterministic 0-1

  let startX: number, startY: number, endX: number, endY: number;
  const depth = 150 + rng(2) * 200;

  // All branches start from center and radiate outward
  startX = w * 0.5 + (rng(3) - 0.5) * w * 0.3;
  startY = h * 0.5 + (rng(4) - 0.5) * h * 0.3;

  // Radiate in all directions using golden angle distribution
  const angle = (index * 137.508) * (Math.PI / 180);
  endX = startX + Math.cos(angle) * depth;
  endY = startY + Math.sin(angle) * depth;

  // Very curvy main branch with strong wobble
  const wobbleStrength = 35;
  const cpx1 = startX + (endX - startX) * 0.2 + (rng(5) - 0.5) * wobbleStrength * 2;
  const cpy1 = startY + (endY - startY) * 0.2 + (rng(6) - 0.5) * wobbleStrength * 2;
  const cpx2 = startX + (endX - startX) * 0.5 + (rng(7) - 0.5) * wobbleStrength * 2;
  const cpy2 = startY + (endY - startY) * 0.5 + (rng(8) - 0.5) * wobbleStrength * 2;

  const d = `M${startX},${startY} C${cpx1},${cpy1} ${cpx2},${cpy2} ${endX},${endY}`;

  // Many sub-branches with their own curves and sub-sub-branches
  const subBranches: SubBranch[] = [];
  const subCount = 3 + Math.floor(rng(9) * 4); // 3-6 sub-branches
  for (let s = 0; s < subCount; s++) {
    const t = 0.15 + (s / subCount) * 0.75;
    const [px, py] = pointOnCubic(t, startX, startY, cpx1, cpy1, cpx2, cpy2, endX, endY);
    const tang = tangentOnCubic(t, startX, startY, cpx1, cpy1, cpx2, cpy2, endX, endY);
    const forkOffset = 35 + rng(10 + s) * 50;
    const forkAngle = (tang + (s % 2 === 0 ? forkOffset : -forkOffset)) * (Math.PI / 180);
    const forkLen = 35 + rng(20 + s) * 70;
    const fx = px + Math.cos(forkAngle) * forkLen;
    const fy = py + Math.sin(forkAngle) * forkLen;
    // Curved sub-branch (not straight!)
    const curveBias = (rng(30 + s) - 0.5) * 35;
    const perpAngle = forkAngle + Math.PI / 2;
    const mcx = (px + fx) / 2 + Math.cos(perpAngle) * curveBias;
    const mcy = (py + fy) / 2 + Math.sin(perpAngle) * curveBias;
    subBranches.push({
      d: `M${px},${py} Q${mcx},${mcy} ${fx},${fy}`,
      strokeWidth: 2.2 - t * 0.8,
    });

    // Sub-sub-branches (twigs!) from each sub-branch
    if (rng(40 + s) > 0.2) {
      const twigAngle = forkAngle + (rng(50 + s) - 0.5) * 1.4;
      const twigLen = 18 + rng(60 + s) * 35;
      const tx = fx + Math.cos(twigAngle) * twigLen;
      const ty = fy + Math.sin(twigAngle) * twigLen;
      const tcx = (fx + tx) / 2 + (rng(70 + s) - 0.5) * 12;
      const tcy = (fy + ty) / 2 + (rng(80 + s) - 0.5) * 12;
      subBranches.push({
        d: `M${fx},${fy} Q${tcx},${tcy} ${tx},${ty}`,
        strokeWidth: 0.8 + rng(90 + s) * 0.5,
      });
    }
  }

  // Leaves along main branch AND sub-branches
  const leafCount = 6 + Math.floor(rng(11) * 5);
  const leaves: Leaf[] = [];
  for (let i = 0; i < leafCount; i++) {
    const t = 0.15 + (i / (leafCount - 1)) * 0.8;
    const [lx, ly] = pointOnCubic(t, startX, startY, cpx1, cpy1, cpx2, cpy2, endX, endY);
    const angle = tangentOnCubic(t, startX, startY, cpx1, cpy1, cpx2, cpy2, endX, endY);
    const leafColor = LEAF_COLORS[(index + i) % LEAF_COLORS.length];
    leaves.push({
      x: lx, y: ly,
      angle: angle + (i % 2 === 0 ? 35 + rng(12 + i) * 30 : -(35 + rng(13 + i) * 30)),
      size: 0.5 + rng(14 + i) * 0.8,
      flip: i % 2 === 0,
      color: leafColor.fill,
      veinColor: leafColor.vein,
    });
  }

  const barkColor = BARK_COLORS[index % BARK_COLORS.length];

  return {
    id: index, d, leaves, subBranches, side,
    delay: index * 0.05,
    strokeWidthBase: 3.5 + rng(15) * 1.5,
    strokeWidthTip: 0.8,
    color: barkColor,
  };
}

export default function LogoComposer({ mode, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const marblesRef = useRef<Array<() => void>>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [retracting, setRetracting] = useState(false);
  const hoverTimeRef = useRef(0);
  const hoverRafRef = useRef(0);
  const lastTickRef = useRef(0);
  const branchCountRef = useRef(0);


  // Grow branches while mouse is inside
  const growLoop = useCallback(() => {
    if (!mouseRef.current.inside) return;
    const now = performance.now();
    const dt = lastTickRef.current ? now - lastTickRef.current : 0;
    lastTickRef.current = now;
    hoverTimeRef.current += dt;

    const target = Math.min(MAX_BRANCHES, Math.floor(hoverTimeRef.current / GROWTH_INTERVAL));
    if (target > branchCountRef.current) {
      const container = containerRef.current;
      const w = container?.offsetWidth ?? 600;
      const h = container?.offsetHeight ?? 300;
      const newBranches: Branch[] = [];
      for (let i = branchCountRef.current; i < target; i++) {
        newBranches.push(generateBranch(i, w, h));
      }
      branchCountRef.current = target;
      setBranches((prev) => [...prev, ...newBranches]);
    }
    hoverRafRef.current = requestAnimationFrame(growLoop);
  }, []);

  const updateMousePosition = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = clientX - rect.left;
    mouseRef.current.y = clientY - rect.top;
    if (!mouseRef.current.inside) {
      mouseRef.current.inside = true;
      setRetracting(false);
      lastTickRef.current = performance.now();
      hoverRafRef.current = requestAnimationFrame(growLoop);
    }
    marblesRef.current.forEach((fn) => fn());
  }, [growLoop]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    updateMousePosition(e.clientX, e.clientY);
  }, [updateMousePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updateMousePosition]);

  const handleTouchEnd = useCallback(() => {
    handleMouseLeaveInternal();
  }, []);

  const handleMouseLeaveInternal = useCallback(() => {
    mouseRef.current.inside = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    cancelAnimationFrame(hoverRafRef.current);
    setRetracting(true);
    const totalDuration = branches.length * 60 + 700;
    setTimeout(() => {
      hoverTimeRef.current = 0;
      branchCountRef.current = 0;
      setBranches([]);
      setRetracting(false);
    }, totalDuration);
    marblesRef.current.forEach((fn) => fn());
  }, [branches.length]);

  const handleMouseLeave = handleMouseLeaveInternal;

  useEffect(() => {
    return () => cancelAnimationFrame(hoverRafRef.current);
  }, []);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ position: "absolute" }}
    >
      {/* Photo background removed for uniform look */}

      {/* Letter marbles + branches */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center gap-1 select-none"
        style={{ cursor: "default", overflow: "visible", touchAction: "pan-y" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* SVG overlay for branches - BEHIND text */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ overflow: "visible" }}
        >
          <defs>
            {branches.map((b) => (
              <linearGradient key={`sw-${b.id}`} id={`branch-taper-${b.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={b.color} />
                <stop offset="100%" stopColor={b.color} />
              </linearGradient>
            ))}
          </defs>
          {branches.map((b) => {
            const retractDelay = retracting ? (branches.length - b.id) * 0.04 : 0;
            return (
            <motion.g
              key={b.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: retracting ? 0 : 1 }}
              transition={{ duration: retracting ? 0.4 : 0.4, delay: retracting ? retractDelay : b.delay }}
            >
              {/* Main branch - thick base layer */}
              <motion.path
                d={b.d}
                fill="none"
                stroke={b.color}
                strokeWidth={b.strokeWidthBase}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: retracting ? 0 : 1 }}
                transition={{ duration: retracting ? 0.5 : 0.8, delay: retracting ? retractDelay : b.delay, ease: "easeOut" }}
              />
              {/* Main branch - thin highlight overlay for taper effect */}
              <motion.path
                d={b.d}
                fill="none"
                stroke="hsl(30, 18%, 28%)"
                strokeWidth={b.strokeWidthBase * 0.4}
                strokeLinecap="round"
                strokeDasharray="2 6"
                opacity={0.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: retracting ? 0 : 1 }}
                transition={{ duration: retracting ? 0.5 : 0.8, delay: retracting ? retractDelay : b.delay, ease: "easeOut" }}
              />

              {/* Sub-branches */}
              {b.subBranches.map((sb, si) => (
                <motion.path
                  key={`sub-${si}`}
                  d={sb.d}
                  fill="none"
                  stroke={b.color}
                  strokeWidth={sb.strokeWidth}
                  strokeLinecap="round"
                  opacity={0.8}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: retracting ? 0 : 1 }}
                  transition={{
                    duration: retracting ? 0.3 : 0.5,
                    delay: retracting ? retractDelay : b.delay + 0.3 + si * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Realistic leaves */}
              {b.leaves.map((leaf, li) => (
                <motion.g
                  key={li}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: retracting ? 0 : 1, opacity: retracting ? 0 : 0.9 }}
                  transition={{
                    duration: retracting ? 0.25 : 0.4,
                    delay: retracting ? retractDelay : b.delay + 0.25 + li * 0.07,
                    type: "spring",
                    stiffness: 180,
                    damping: 12,
                  }}
                  style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
                >
                  {/* Leaf body - pointed shape */}
                  <path
                    d={leafPath(leaf.x, leaf.y, leaf.size, leaf.angle)}
                    fill={leaf.color}
                    stroke={leaf.veinColor}
                    strokeWidth={0.3}
                    transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
                  />
                  {/* Central vein */}
                  <line
                    x1={leaf.x}
                    y1={leaf.y - leaf.size * 9}
                    x2={leaf.x}
                    y2={leaf.y + leaf.size * 0.8}
                    stroke={leaf.veinColor}
                    strokeWidth={0.6}
                    opacity={0.7}
                    transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
                  />
                  {/* Side veins */}
                  {[0.3, 0.5, 0.7].map((vt, vi) => (
                    <g key={vi} transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}>
                      <line
                        x1={leaf.x}
                        y1={leaf.y - leaf.size * 10 * (1 - vt)}
                        x2={leaf.x + leaf.size * 3 * (vi % 2 === 0 ? 1 : -1)}
                        y2={leaf.y - leaf.size * 10 * (1 - vt) + leaf.size * 2}
                        stroke={leaf.veinColor}
                        strokeWidth={0.35}
                        opacity={0.4}
                      />
                    </g>
                  ))}
                </motion.g>
              ))}
            </motion.g>
            );
          })}
        </svg>

        {LINES.map((line, lineIdx) => (
          <div key={lineIdx} className="flex items-center justify-center overflow-visible relative z-10">
            {line.map((letterKey, i) => (
              <Marble
                key={`${lineIdx}-${i}`}
                char={letterKey}
                imageSrc={LETTER_IMAGES[letterKey]}
                mouseRef={mouseRef}
                containerRef={containerRef}
                registerUpdate={marblesRef}
                isYear={false}
                extraStyle={letterKey === "L" ? { marginLeft: "0.6em" } : undefined}
              />
            ))}
          </div>
        ))}
        {/* Year line as text */}
        <div className="flex items-center justify-center overflow-visible mt-2 px-4 py-2 rounded-lg glass-raw relative z-10">
          {YEAR_LINE.split("").map((char, i) => (
            <Marble
              key={`year-${i}`}
              char={char}
              mouseRef={mouseRef}
              containerRef={containerRef}
              registerUpdate={marblesRef}
              isYear={true}
            />
          ))}
        </div>
        <div className="mt-4 text-sm md:text-base tracking-[0.3em] uppercase text-foreground font-bold px-4 py-2 rounded-lg glass-raw relative z-10 text-center">
          {SUBTITLE_LINES.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Individual letter marble ──
interface MarbleProps {
  char: string;
  imageSrc?: string;
  mouseRef: React.RefObject<{ x: number; y: number; inside: boolean }>;
  containerRef: React.RefObject<HTMLDivElement>;
  registerUpdate: React.RefObject<Array<() => void>>;
  isYear: boolean;
  extraStyle?: React.CSSProperties;
}

function Marble({ char, imageSrc, mouseRef, containerRef, registerUpdate, isYear, extraStyle }: MarbleProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const rotate = useSpring(0, SPRING);

  const update = useCallback(() => {
    const el = spanRef.current;
    const container = containerRef.current;
    const mouse = mouseRef.current;
    if (!el || !container || !mouse) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const currentX = x.get() as number;
    const currentY = y.get() as number;
    const cx = elRect.left - containerRect.left + elRect.width / 2 - currentX;
    const cy = elRect.top - containerRect.top + elRect.height / 2 - currentY;

    if (!mouse.inside) {
      x.set(0);
      y.set(0);
      rotate.set(0);
      return;
    }

    const dx = cx - mouse.x;
    const dy = cy - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < REPEL_RADIUS && dist > 1) {
      const t = 1 - dist / REPEL_RADIUS;
      const force = t * t * REPEL_FORCE;
      const angle = Math.atan2(dy, dx);
      x.set(Math.cos(angle) * force);
      y.set(Math.sin(angle) * force);
      rotate.set(Math.cos(angle) * force * 0.5);
    } else {
      x.set(0);
      y.set(0);
      rotate.set(0);
    }
  }, [x, y, rotate, containerRef, mouseRef]);

  useEffect(() => {
    const arr = registerUpdate.current;
    if (!arr) return;
    arr.push(update);
    return () => {
      const idx = arr.indexOf(update);
      if (idx >= 0) arr.splice(idx, 1);
    };
  }, [update, registerUpdate]);

  return (
    <motion.span
      ref={spanRef}
      style={{ x, y, rotate, display: "inline-block", ...extraStyle }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={char}
          className="h-16 md:h-24 lg:h-32 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          draggable={false}
        />
      ) : (
        <span
          className={`font-heading font-black tracking-tight ${
            isYear
              ? "text-4xl md:text-6xl lg:text-7xl text-primary/80"
              : "text-5xl md:text-7xl lg:text-9xl text-foreground"
          }`}
        >
          {char}
        </span>
      )}
    </motion.span>
  );
}
