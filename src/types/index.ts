// Core domain types for the hospital chat application

export type Role =
  | "doctor"
  | "nurse"
  | "lab_tech"
  | "pharmacist"
  | "admin"
  | "receptionist";

export type DepartmentId =
  | "icu"
  | "emergency"
  | "cardiology"
  | "pediatrics"
  | "lab"
  | "pharmacy"
  | "radiology"
  | "surgery";

export interface Department {
  id: DepartmentId;
  name: string;
  description: string;
  /** Roles allowed to enter this department's chat. */
  allowedRoles: Role[];
  /** A short two-letter code used for the avatar/badge. */
  code: string;
  /** Accent color used in the UI for this department. */
  accent: string;
}

export interface RoleMeta {
  id: Role;
  label: string;
  description: string;
  /** Default departments suggested for this role at login. */
  defaultDepartments: DepartmentId[];
  accent: string;
  /** Single-character icon glyph (kept text-only to avoid emoji deps). */
  glyph: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  /** Departments this user has been granted access to. */
  departments: DepartmentId[];
  /** Department the user is currently focused on. */
  activeDepartment: DepartmentId;
  /** Hospital-issued staff identifier shown in the UI. */
  staffId: string;
  /** Unix epoch ms when the session began. */
  loggedInAt: number;
}

export interface ChatMessage {
  id: string;
  departmentId: DepartmentId;
  authorId: string;
  authorName: string;
  authorRole: Role;
  text: string;
  /** Unix epoch ms. */
  timestamp: number;
  /** True if the local user authored the message. */
  self?: boolean;
}
