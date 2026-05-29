import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

/**
 * Root component. Auth is provided one level up in main.tsx so router guards
 * can read it; chat state is scoped under the authenticated user so messages
 * stay tied to the active session.
 */
export default function App() {
  const { user } = useAuth();
  return (
    <ChatProvider user={user}>
      <AppRoutes />
    </ChatProvider>
  );
}
