import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ChatMessage, DepartmentId, User } from "../types";
import { SEED_MESSAGES } from "../utils/seed";
import { loadJSON, saveJSON } from "../utils/storage";

const STORAGE_KEY = "hospitalchat.messages";

type MessagesByDept = Record<DepartmentId, ChatMessage[]>;

interface ChatContextValue {
  /** Messages indexed by department so each department is fully isolated. */
  messages: MessagesByDept;
  /** Convenience accessor for the currently active department. */
  messagesFor: (departmentId: DepartmentId) => ChatMessage[];
  sendMessage: (departmentId: DepartmentId, text: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function initialState(): MessagesByDept {
  const persisted = loadJSON<MessagesByDept | null>(STORAGE_KEY, null);
  if (persisted) {
    // Make sure every known department has a slot, even if storage is older.
    return { ...SEED_MESSAGES, ...persisted };
  }
  return SEED_MESSAGES;
}

interface ChatProviderProps {
  user: User | null;
  children: ReactNode;
}

export function ChatProvider({ user, children }: ChatProviderProps) {
  const [messages, setMessages] = useState<MessagesByDept>(() => initialState());

  useEffect(() => {
    saveJSON(STORAGE_KEY, messages);
  }, [messages]);

  const sendMessage = useCallback(
    (departmentId: DepartmentId, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !user) return;
      const msg: ChatMessage = {
        id: `${departmentId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        departmentId,
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        text: trimmed,
        timestamp: Date.now(),
        self: true,
      };
      setMessages((prev) => ({
        ...prev,
        [departmentId]: [...(prev[departmentId] ?? []), msg],
      }));
    },
    [user],
  );

  const messagesFor = useCallback(
    (departmentId: DepartmentId) => messages[departmentId] ?? [],
    [messages],
  );

  const value = useMemo<ChatContextValue>(
    () => ({ messages, messagesFor, sendMessage }),
    [messages, messagesFor, sendMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}
