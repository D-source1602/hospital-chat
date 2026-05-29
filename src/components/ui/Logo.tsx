import type { CSSProperties } from "react";
import "./Logo.css";

/**
 * Stylized brand mark. The cross floats above the wordmark with a perpetual
 * subtle 3D rotation driven by pure CSS keyframes.
 */
export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <div
      className="logo-row"
      style={{ "--logo-size": `${size}px` } as CSSProperties & Record<string, string>}
    >
      <div className="logo-mark">
        <span className="logo-cross logo-cross--v" />
        <span className="logo-cross logo-cross--h" />
        <span className="logo-mark__sheen" />
      </div>
      <div className="logo-text">
        <span className="logo-text__title">MediSync</span>
        <span className="logo-text__sub">Secure Care Channel</span>
      </div>
    </div>
  );
}
