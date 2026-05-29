import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import type { ChatMessage } from "../../types";
import { ROLE_META_BY_ID } from "../../utils/constants";
import { formatClock, formatDayHeader } from "../../utils/time";
import "./MessageList.css";

interface Props {
  messages: ChatMessage[];
  currentUserId: string;
}

interface Group {
  type: "day" | "msg";
  key: string;
  message?: ChatMessage;
  label?: string;
}

/**
 * Render the message stream for the active department. Messages are grouped
 * with day separators and tagged as "self" vs "other" so the user can scan
 * fast. New messages animate in from the bottom for a tactile feel.
 */
export default function MessageList({ messages, currentUserId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message whenever the list grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const groups: Group[] = useMemo(() => {
    const result: Group[] = [];
    let lastDay = "";
    for (const m of messages) {
      const day = formatDayHeader(m.timestamp);
      if (day !== lastDay) {
        result.push({ type: "day", key: `day-${day}-${m.id}`, label: day });
        lastDay = day;
      }
      result.push({ type: "msg", key: m.id, message: m });
    }
    return result;
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="messages messages--empty" ref={scrollRef}>
        <div className="messages__empty">
          <div className="messages__empty-orb" aria-hidden="true" />
          <h3>No messages here yet</h3>
          <p>Be the first to post — your message will reach this department only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages" ref={scrollRef}>
      {groups.map((g) => {
        if (g.type === "day") {
          return (
            <div className="messages__day" key={g.key}>
              <span>{g.label}</span>
            </div>
          );
        }
        const m = g.message!;
        const isSelf = m.authorId === currentUserId || m.self === true;
        const role = ROLE_META_BY_ID[m.authorRole];
        return (
          <div
            key={g.key}
            className={`msg ${isSelf ? "msg--self" : "msg--other"}`}
          >
            {!isSelf && (
              <div
                className="msg__avatar"
                style={{ background: role.accent } as CSSProperties}
                aria-hidden="true"
              >
                {role.glyph}
              </div>
            )}
            <div className="msg__bubble-wrap">
              {!isSelf && (
                <div className="msg__meta">
                  <span className="msg__author">{m.authorName}</span>
                  <span
                    className="msg__role"
                    style={{ "--role-accent": role.accent } as CSSProperties & Record<string, string>}
                  >
                    {role.label}
                  </span>
                </div>
              )}
              <div className="msg__bubble">{m.text}</div>
              <span className="msg__time">{formatClock(m.timestamp)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
