import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { ROLE_META_BY_ID } from "../../utils/constants";
import "./Navbar.css";

/**
 * Top bar showing the brand, the live presence pill, and the current user.
 * Logout returns to the login screen and clears persisted auth.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const role = ROLE_META_BY_ID[user.role];

  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || role.glyph;

  return (
    <header className="navbar glass">
      <div className="navbar__left">
        <Logo size={36} />
      </div>

      <div className="navbar__center">
        <span className="navbar__live">
          <span className="navbar__live-dot" />
          Secure channel · End-to-end encrypted
        </span>
      </div>

      <div className="navbar__right">
        <div className="navbar__user">
          <div
            className="navbar__avatar"
            style={{ background: role.accent }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="navbar__user-meta">
            <span className="navbar__user-name">{user.name}</span>
            <span className="navbar__user-sub">
              {role.label} · {user.staffId}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="navbar__logout"
          onClick={logout}
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
