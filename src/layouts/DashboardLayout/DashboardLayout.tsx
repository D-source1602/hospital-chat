import { useMemo } from "react";
import AnimatedBackground from "../../components/ui/AnimatedBackground";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { DEPARTMENTS_BY_ID } from "../../utils/constants";
import "./DashboardLayout.css";

/**
 * Three-pane shell: top navbar, left department sidebar, main chat panel.
 * The chat panel is keyed by department id so switching channels remounts
 * the section, replaying the entry animation — visually reinforcing that
 * each department has its own isolated conversation.
 */
export default function DashboardLayout() {
  const { user } = useAuth();
  const { messagesFor, sendMessage } = useChat();

  const activeId = user?.activeDepartment;
  const messages = useMemo(
    () => (activeId ? messagesFor(activeId) : []),
    [messagesFor, activeId],
  );

  if (!user || !activeId) return null;
  const department = DEPARTMENTS_BY_ID[activeId];

  return (
    <div className="dash">
      <AnimatedBackground />
      <Navbar />
      <div className="dash__body">
        <Sidebar />
        <main className="dash__main">
          <section
            // Keying by id ensures the panel remounts on department switch
            // so the CSS enter animation re-runs.
            key={department.id}
            className="dash__chat glass dash__chat--enter"
          >
            <ChatHeader department={department} />
            <MessageList messages={messages} currentUserId={user.id} />
            <MessageInput
              department={department}
              onSend={(text) => sendMessage(department.id, text)}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
