import type { CSSProperties } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { DEPARTMENTS } from "../../utils/constants";
import { formatClock } from "../../utils/time";
import "./Sidebar.css";

/**
 * Department directory. Only the user's accessible departments are clickable;
 * the rest render in a locked state so users can see the org structure but
 * cannot enter channels they aren't authorized for.
 */
export default function Sidebar() {
  const { user, setActiveDepartment } = useAuth();
  const { messages } = useChat();
  if (!user) return null;

  const accessible = new Set(user.departments);

  return (
    <aside className="sidebar glass">
      <div className="sidebar__title">
        <h3>Departments</h3>
        <span className="sidebar__count">
          {accessible.size}/{DEPARTMENTS.length}
        </span>
      </div>

      <div className="sidebar__list">
        {DEPARTMENTS.map((d, i) => {
          const isAccessible = accessible.has(d.id);
          const isActive = user.activeDepartment === d.id;
          const list = messages[d.id] ?? [];
          const last = list[list.length - 1];

          return (
            <button
              key={d.id}
              type="button"
              className={`dept-card ${isActive ? "is-active" : ""} ${
                !isAccessible ? "is-locked" : ""
              }`}
              style={
                {
                  "--dept-accent": d.accent,
                  animationDelay: `${i * 50}ms`,
                } as CSSProperties & Record<string, string>
              }
              onClick={() => isAccessible && setActiveDepartment(d.id)}
              disabled={!isAccessible}
            >
              <span className="dept-card__avatar" aria-hidden="true">
                {d.code}
              </span>
              <span className="dept-card__main">
                <span className="dept-card__name">{d.name}</span>
                <span className="dept-card__last">
                  {last
                    ? `${last.authorName}: ${last.text}`
                    : isAccessible
                      ? "No messages yet"
                      : "Restricted to other roles"}
                </span>
              </span>
              <span className="dept-card__meta">
                {last && (
                  <span className="dept-card__time">
                    {formatClock(last.timestamp)}
                  </span>
                )}
                {list.length > 0 && (
                  <span className="dept-card__badge">{list.length}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sidebar__footer">
        <span className="sidebar__footer-dot" />
        Each channel is isolated — messages never cross departments.
      </div>
    </aside>
  );
}
