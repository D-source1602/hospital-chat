import { useMouseParallax } from "../../hooks/useMouseParallax";
import "./AnimatedBackground.css";

/**
 * Full-bleed decorative background. Three CSS blob layers translate by
 * different amounts on mouse move to fake depth, with a faint perspective
 * grid sitting underneath. All animation is pure CSS + a small parallax hook.
 */
export default function AnimatedBackground() {
  const { x, y } = useMouseParallax();

  // Different multipliers per layer → simulated depth.
  const t = (mx: number, my: number) =>
    `translate3d(${mx}px, ${my}px, 0)`;

  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="bg-grid" style={{ transform: `${t(x * -10, y * -10)} perspective(900px) rotateX(58deg)` }} />
      <div className="bg-blob bg-blob--cyan" style={{ transform: t(x * 30, y * 30) }} />
      <div className="bg-blob bg-blob--violet" style={{ transform: t(x * -50, y * -50) }} />
      <div className="bg-blob bg-blob--rose" style={{ transform: t(x * 80, y * 80) }} />
      <div className="bg-noise" />
    </div>
  );
}
