import { useEffect, useRef, useState, type RefObject } from "react";

interface ParallaxState {
  /** Horizontal offset normalized to [-0.5, 0.5]. */
  x: number;
  /** Vertical offset normalized to [-0.5, 0.5]. */
  y: number;
}

interface Options {
  /** If provided, parallax tracks position relative to this element. */
  ref?: RefObject<HTMLElement | null>;
  /** Spring smoothing factor (0..1). Higher = snappier. */
  ease?: number;
}

/**
 * Lightweight mouse-tracking hook. We integrate toward the target value on
 * each animation frame so the result feels spring-like without bringing in
 * a full physics engine.
 */
export function useMouseParallax({ ref, ease = 0.12 }: Options = {}): ParallaxState {
  const [pos, setPos] = useState<ParallaxState>({ x: 0, y: 0 });
  const target = useRef<ParallaxState>({ x: 0, y: 0 });
  const current = useRef<ParallaxState>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        target.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      } else {
        target.current = {
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
        };
      }
    };

    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    const tick = () => {
      const t = target.current;
      const c = current.current;
      const nx = c.x + (t.x - c.x) * ease;
      const ny = c.y + (t.y - c.y) * ease;
      // Skip state updates for sub-pixel changes to avoid render churn.
      if (Math.abs(nx - c.x) > 0.0005 || Math.abs(ny - c.y) > 0.0005) {
        current.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [ref, ease]);

  return pos;
}
