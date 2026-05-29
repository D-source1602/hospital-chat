import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DepartmentId, Role, User } from "../types";
import { ROLE_META_BY_ID } from "../utils/constants";
import { loadJSON, removeKey, saveJSON } from "../utils/storage";

const STORAGE_KEY = "hospitalchat.user";

interface LoginInput {
  name: string;
  staffId: string;
  role: Role;
  /** Department selected at the login screen — becomes the active one. */
  department: DepartmentId;
}

interface AuthContextValue {
  user: User | null;
  login: (input: LoginInput) => User;
  logout: () => void;
  setActiveDepartment: (department: DepartmentId) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() =>
    loadJSON<User | null>(STORAGE_KEY, null),
  );

  // Persist user on any change so reloads keep the session.
  useEffect(() => {
    if (user) saveJSON(STORAGE_KEY, user);
    else removeKey(STORAGE_KEY);
  }, [user]);

  const login = useCallback(({ name, staffId, role, department }: LoginInput) => {
    const meta = ROLE_META_BY_ID[role];
    // Make sure the chosen department is included in this user's allowed list.
    const departments: DepartmentId[] = Array.from(
      new Set<DepartmentId>([...meta.defaultDepartments, department]),
    );
    const next: User = {
      id: `${role}-${staffId}-${Date.now()}`,
      name: name.trim() || meta.label,
      role,
      departments,
      activeDepartment: department,
      staffId: staffId.trim() || `STAFF-${Math.floor(Math.random() * 9000) + 1000}`,
      loggedInAt: Date.now(),
    };
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const setActiveDepartment = useCallback((department: DepartmentId) => {
    setUser((prev) => {
      if (!prev) return prev;
      if (!prev.departments.includes(department)) return prev;
      return { ...prev, activeDepartment: department };
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout, setActiveDepartment }),
    [user, login, logout, setActiveDepartment],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
