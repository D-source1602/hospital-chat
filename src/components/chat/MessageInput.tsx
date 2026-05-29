import { useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import type { Department } from "../../types";
import "./MessageInput.css";

interface Props {
  department: Department;
  onSend: (text: string) => void;
}

/**
 * Composer pinned to the bottom of the chat panel. Enter sends, Shift+Enter
 * inserts a newline. The Send button gates on non-empty content.
 */
export default function MessageInput({ department, onSend }: Props) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    onSend(draft);
    setDraft("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="composer"
      style={{ "--dept-accent": department.accent } as CSSProperties & Record<string, string>}
      onSubmit={submit}
    >
      <div className="composer__shell">
        <textarea
          className="composer__input"
          placeholder={`Message #${department.name.toLowerCase().replace(/\s+/g, "-")}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          aria-label={`Message ${department.name}`}
        />
        <button
          type="submit"
          className="composer__send"
          disabled={!canSend}
        >
          Send
          <span className="composer__send-arrow" aria-hidden="true">→</span>
        </button>
      </div>
      <div className="composer__hint">
        Encrypted to <strong>{department.name}</strong> · Press{" "}
        <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for newline
      </div>
    </form>
  );
}
