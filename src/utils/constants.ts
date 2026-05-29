import type { Department, Role, RoleMeta } from "../types";

/**
 * Master list of departments. Each department has a fixed set of roles that
 * are allowed to read/post in its chat, plus visual metadata for the UI.
 */
export const DEPARTMENTS: Department[] = [
  {
    id: "icu",
    name: "Intensive Care Unit",
    description: "Critical care coordination and bedside escalations.",
    allowedRoles: ["doctor", "nurse", "admin"],
    code: "IC",
    accent: "#f43f5e",
  },
  {
    id: "emergency",
    name: "Emergency Department",
    description: "Triage, trauma, and time-critical communications.",
    allowedRoles: ["doctor", "nurse", "admin", "receptionist"],
    code: "ER",
    accent: "#f97316",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Cardiac consults, ECG reviews, and cath lab updates.",
    allowedRoles: ["doctor", "nurse", "admin"],
    code: "CA",
    accent: "#ef4444",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Pediatric ward rounds, family liaison, and consults.",
    allowedRoles: ["doctor", "nurse", "admin"],
    code: "PD",
    accent: "#22c55e",
  },
  {
    id: "lab",
    name: "Laboratory",
    description: "Specimens, blood panels, and result turnarounds.",
    allowedRoles: ["doctor", "nurse", "lab_tech", "admin"],
    code: "LB",
    accent: "#06b6d4",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Dispensing, drug interactions, and stock alerts.",
    allowedRoles: ["doctor", "nurse", "pharmacist", "admin"],
    code: "PH",
    accent: "#a855f7",
  },
  {
    id: "radiology",
    name: "Radiology",
    description: "Imaging requests, scan readiness, and radiologist reads.",
    allowedRoles: ["doctor", "nurse", "admin"],
    code: "RX",
    accent: "#eab308",
  },
  {
    id: "surgery",
    name: "Surgery / OR",
    description: "Operating room scheduling and intraoperative comms.",
    allowedRoles: ["doctor", "nurse", "admin"],
    code: "OR",
    accent: "#3b82f6",
  },
];

/**
 * Catalog of roles with display metadata and the departments each role can
 * access by default at login. Access can be widened per user in the future.
 */
export const ROLES: RoleMeta[] = [
  {
    id: "doctor",
    label: "Doctor",
    description: "Full clinical access across patient-facing departments.",
    defaultDepartments: [
      "icu",
      "emergency",
      "cardiology",
      "pediatrics",
      "radiology",
      "surgery",
    ],
    accent: "#3b82f6",
    glyph: "Dr",
  },
  {
    id: "nurse",
    label: "Nurse",
    description: "Bedside coordination and patient-care channels.",
    defaultDepartments: [
      "icu",
      "emergency",
      "cardiology",
      "pediatrics",
      "surgery",
    ],
    accent: "#10b981",
    glyph: "Nu",
  },
  {
    id: "lab_tech",
    label: "Lab Technician",
    description: "Restricted to the Laboratory channel.",
    defaultDepartments: ["lab"],
    accent: "#06b6d4",
    glyph: "Lb",
  },
  {
    id: "pharmacist",
    label: "Pharmacist",
    description: "Restricted to the Pharmacy channel.",
    defaultDepartments: ["pharmacy"],
    accent: "#a855f7",
    glyph: "Rx",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    description: "Front desk and Emergency intake coordination.",
    defaultDepartments: ["emergency"],
    accent: "#f59e0b",
    glyph: "Re",
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Cross-department oversight and audit access.",
    defaultDepartments: [
      "icu",
      "emergency",
      "cardiology",
      "pediatrics",
      "lab",
      "pharmacy",
      "radiology",
      "surgery",
    ],
    accent: "#64748b",
    glyph: "Ad",
  },
];

export const DEPARTMENTS_BY_ID: Record<string, Department> = DEPARTMENTS.reduce(
  (acc, d) => {
    acc[d.id] = d;
    return acc;
  },
  {} as Record<string, Department>,
);

export const ROLE_META_BY_ID: Record<Role, RoleMeta> = ROLES.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<Role, RoleMeta>,
);
