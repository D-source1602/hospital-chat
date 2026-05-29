import type { ChatMessage, DepartmentId } from "../types";

/**
 * Deterministic seed messages so each department feels alive on first load.
 * In a real deployment these would come from the backend.
 */
const NOW = Date.now();
const m = (mins: number) => NOW - mins * 60 * 1000;

export const SEED_MESSAGES: Record<DepartmentId, ChatMessage[]> = {
  icu: [
    {
      id: "icu-1",
      departmentId: "icu",
      authorId: "seed-dr-okafor",
      authorName: "Dr. Okafor",
      authorRole: "doctor",
      text: "Bed 4 stabilizing. Continue norepinephrine at current rate.",
      timestamp: m(42),
    },
    {
      id: "icu-2",
      departmentId: "icu",
      authorId: "seed-nurse-alvarez",
      authorName: "Nurse Alvarez",
      authorRole: "nurse",
      text: "Copy. MAP holding above 65. Will recheck ABG in an hour.",
      timestamp: m(38),
    },
  ],
  emergency: [
    {
      id: "er-1",
      departmentId: "emergency",
      authorId: "seed-recep-kim",
      authorName: "Reception (Kim)",
      authorRole: "receptionist",
      text: "Two ambulances 6 minutes out. One chest pain, one MVA.",
      timestamp: m(12),
    },
    {
      id: "er-2",
      departmentId: "emergency",
      authorId: "seed-dr-patel",
      authorName: "Dr. Patel",
      authorRole: "doctor",
      text: "Trauma bay 1 prepped. Paging cardiology for the chest pain.",
      timestamp: m(10),
    },
  ],
  cardiology: [
    {
      id: "cardio-1",
      departmentId: "cardiology",
      authorId: "seed-dr-mendez",
      authorName: "Dr. Mendez",
      authorRole: "doctor",
      text: "ECG on patient 221 shows ST elevation in II, III, aVF.",
      timestamp: m(75),
    },
  ],
  pediatrics: [
    {
      id: "ped-1",
      departmentId: "pediatrics",
      authorId: "seed-nurse-tan",
      authorName: "Nurse Tan",
      authorRole: "nurse",
      text: "Room 12 spiked to 39.4C. Started cooling and pushing fluids.",
      timestamp: m(28),
    },
  ],
  lab: [
    {
      id: "lab-1",
      departmentId: "lab",
      authorId: "seed-lab-chen",
      authorName: "Tech Chen",
      authorRole: "lab_tech",
      text: "Troponin for patient 0451 back: 0.18 ng/mL. Elevated.",
      timestamp: m(8),
    },
    {
      id: "lab-2",
      departmentId: "lab",
      authorId: "seed-dr-mendez",
      authorName: "Dr. Mendez",
      authorRole: "doctor",
      text: "Thanks. Repeat in 3 hours please.",
      timestamp: m(7),
    },
  ],
  pharmacy: [
    {
      id: "pharm-1",
      departmentId: "pharmacy",
      authorId: "seed-pharm-osei",
      authorName: "Pharm. Osei",
      authorRole: "pharmacist",
      text: "Vancomycin levels reviewed. Recommend dose adjust on bed 7.",
      timestamp: m(55),
    },
  ],
  radiology: [
    {
      id: "rad-1",
      departmentId: "radiology",
      authorId: "seed-dr-iyer",
      authorName: "Dr. Iyer",
      authorRole: "doctor",
      text: "CT head for ER patient 0822 ready for read.",
      timestamp: m(20),
    },
  ],
  surgery: [
    {
      id: "or-1",
      departmentId: "surgery",
      authorId: "seed-nurse-blake",
      authorName: "Nurse Blake",
      authorRole: "nurse",
      text: "OR 3 turnover complete. Next case can proceed.",
      timestamp: m(15),
    },
  ],
};
