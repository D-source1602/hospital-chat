import type { CSSProperties } from "react";
import type { Department } from "../../types";
import { ROLE_META_BY_ID } from "../../utils/constants";
import "./ChatHeader.css";

interface Props {
  department: Department;
}

/**
 * Header for the active department's chat. Surfaces the department identity,
 * the access policy (which roles can read/post here), and a privacy reminder.
 */
export default function ChatHeader({ department }: Props) {
  return (
    <header
      className="chat-header"
      style={{ "--dept-accent": department.accent } as CSSProperties & Record<string, string>}
    >
      <div className="chat-header__avatar">{department.code}</div>

      <div className="chat-header__info">
        <h2 className="chat-header__name">{department.name}</h2>
        <p className="chat-header__desc">{department.description}</p>
      </div>

      <div className="chat-header__roles" aria-label="Allowed roles">
        {department.allowedRoles.map((r) => {
          const meta = ROLE_META_BY_ID[r];
          return (
            <span
              key={r}
              className="chat-header__role"
              style={{ background: meta.accent } as CSSProperties}
              title={meta.label}
            >
              {meta.glyph}
            </span>
          );
        })}
        <span className="chat-header__roles-label">Allowed roles</span>
      </div>
    </header>
  );
}
