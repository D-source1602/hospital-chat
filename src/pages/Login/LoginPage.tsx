import { useMemo, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../../components/ui/AnimatedBackground";
import Logo from "../../components/ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS, ROLES, ROLE_META_BY_ID } from "../../utils/constants";
import type { DepartmentId, Role } from "../../types";
import "./LoginPage.css";

/**
 * The login screen acts as the role + department gate. A user picks who they
 * are (which determines accessible departments) and which department they
 * want to enter — that becomes their starting chat room.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [department, setDepartment] = useState<DepartmentId>("icu");
  const [error, setError] = useState<string | null>(null);

  // Departments the chosen role can actually access.
  const accessibleDepartments = useMemo(
    () => ROLE_META_BY_ID[role].defaultDepartments,
    [role],
  );

  // Whenever the role changes, snap the selected department into a valid one.
  const ensureValidDepartment = (next: Role) => {
    const allowed = ROLE_META_BY_ID[next].defaultDepartments;
    if (!allowed.includes(department)) setDepartment(allowed[0]);
  };

  const onRoleChange = (next: Role) => {
    setRole(next);
    ensureValidDepartment(next);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!staffId.trim()) return setError("Please enter a staff ID.");
    login({ name, staffId, role, department });
    navigate("/dashboard", { replace: true });
  };

  // 3D tilt: card rotates toward the cursor for a soft holographic feel.
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onCardMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -6, ry: px * 8 });
  };
  const onCardLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div className="login-page">
      <AnimatedBackground />
      <div
        ref={cardRef}
        className="login-card glass login-card--enter"
        onMouseMove={onCardMove}
        onMouseLeave={onCardLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        {/* ─── Aside ────────────────────────────────────────────────── */}
        <aside className="login-aside">
          <Logo size={42} />
          <div>
            <h1 className="login-aside__title">
              The secure pulse of your hospital, in one channel.
            </h1>
            <p className="login-aside__lead">
              MediSync gives every department its own private chat room with
              role-based access, so the right people see the right
              conversations — never more, never less.
            </p>
          </div>
          <ul className="login-aside__bullets">
            <li>Per-department channels — ICU, ER, Lab, Pharmacy and more</li>
            <li>Role-aware sign-in for doctors, nurses, lab and pharmacy</li>
            <li>Glanceable history so handovers stay clean</li>
          </ul>
          <span className="login-aside__floater" />
        </aside>

        {/* ─── Form ─────────────────────────────────────────────────── */}
        <form className="login-form" onSubmit={onSubmit} noValidate>
          <span className="login-form__step">Step 1 — Identify yourself</span>
          <h2>Sign in to your station</h2>

          <div className="field__row">
            <div className="field">
              <label className="field__label" htmlFor="login-name">
                Full name
              </label>
              <input
                id="login-name"
                className="field__input"
                placeholder="e.g. Dr. Aisha Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="login-staff">
                Staff ID
              </label>
              <input
                id="login-staff"
                className="field__input"
                placeholder="e.g. STAFF-2048"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <span className="login-form__step">Step 2 — Choose your role</span>
          <div className="role-grid">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`role-tile ${role === r.id ? "is-selected" : ""}`}
                onClick={() => onRoleChange(r.id)}
                style={{ "--role-tile-accent": r.accent } as CSSProperties & Record<string, string>}
              >
                <span
                  className="role-tile__glyph"
                  style={{ background: r.accent } as CSSProperties}
                >
                  {r.glyph}
                </span>
                <span className="role-tile__name">{r.label}</span>
                <span className="role-tile__hint">{r.description}</span>
              </button>
            ))}
          </div>

          <span className="login-form__step">Step 3 — Pick your department</span>
          <div className="dept-select" role="listbox" aria-label="Departments">
            {DEPARTMENTS.map((d) => {
              const allowed = accessibleDepartments.includes(d.id);
              const selected = department === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={!allowed}
                  className={`dept-row ${selected ? "is-selected" : ""} ${
                    !allowed ? "is-disabled" : ""
                  }`}
                  style={{ "--dept-accent": d.accent } as CSSProperties & Record<string, string>}
                  onClick={() => allowed && setDepartment(d.id)}
                >
                  <span className="dept-row__code">{d.code}</span>
                  <span>
                    <span className="dept-row__name">{d.name}</span>
                    <br />
                    <span className="dept-row__desc">
                      {allowed ? d.description : "Not accessible to this role"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {error && <span className="login-error">{error}</span>}

          <button type="submit" className="login-submit">
            Enter MediSync
          </button>
        </form>
      </div>
    </div>
  );
}
