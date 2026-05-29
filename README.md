# MediSync — Hospital Chat

A real-time hospital department communication dashboard. Each department —
ICU, Emergency, Cardiology, Pediatrics, Lab, Pharmacy, Radiology, Surgery —
gets its own private chat channel. Staff log in with a role (Doctor, Nurse,
Lab Technician, Pharmacist, Receptionist, Administrator) which determines
which channels they can read and post in.

The frontend is built in **TypeScript + React 19 (Vite)** with a 3D-leaning
glassmorphic UI, parallax background, animated brand mark, role/department
selection card, and animated message list.

---

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Roles and Departments](#roles-and-departments)
- [Architecture Notes](#architecture-notes)

---

## Highlights

- **Role-based login** — six roles, each with its own visual identity and a
  default set of accessible departments.
- **Department-isolated chat** — messages are stored and rendered per
  department; switching channels remounts the panel and replays the entry
  animation.
- **Persistent session** — the logged-in user and chat history are persisted
  to `localStorage` so reloads keep state.
- **3D / glassmorphism design** — animated parallax background, perspective
  grid, mouse-tilt login card, floating brand mark, and depth-shadowed
  bubbles. All animation is pure CSS + a tiny mouse-parallax hook (no heavy
  3D engines required).
- **Strict TypeScript** — `tsconfig.app.json` enables `strict`,
  `noUnusedLocals`, `noFallthroughCasesInSwitch`. Domain types live in
  `src/types`.
- **Accessible by default** — semantic landmarks, keyboard-friendly tiles,
  visible focus rings, ARIA `listbox`/`option` for the department picker,
  Enter/Shift+Enter handling in the composer.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Static typing across the app |
| [Vite](https://vite.dev) | Build tool & dev server (esbuild transpiles `.tsx`) |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Axios](https://axios-http.com) | HTTP client (ready for backend wire-up) |
| [Socket.IO Client](https://socket.io/docs/v4/client-api/) | Real-time transport (ready for backend wire-up) |
| Plain CSS (per-component) | Styling, glassmorphism, 3D transforms |

---

## Project Structure

```
src/
  main.tsx                       # Entry — mounts <AuthProvider><App/></AuthProvider>
  App.tsx                        # Wraps routes in <ChatProvider>
  index.css                      # Tokens, resets, .glass primitive

  types/
    index.ts                     # Role, DepartmentId, User, ChatMessage, ...

  context/
    AuthContext.tsx              # User session + per-role department access
    ChatContext.tsx              # Per-department messages, sendMessage()

  routes/
    AppRoutes.tsx                # ProtectedRoute + PublicOnlyRoute

  pages/
    Login/LoginPage.{tsx,css}    # Role + department gate, 3D tilt card
    Dashboard/DashboardPage.{tsx,css}

  layouts/
    DashboardLayout/             # Three-pane shell (Navbar + Sidebar + Chat)

  components/
    ui/
      AnimatedBackground.{tsx,css}   # Parallax blobs + perspective grid
      Logo.{tsx,css}                 # Animated 3D brand mark
    Navbar/                          # Top bar with user identity + sign out
    Sidebar/                         # Department list (locks inaccessible ones)
    chat/
      ChatHeader.{tsx,css}           # Department header + allowed roles
      MessageList.{tsx,css}          # Day groups, self vs other, animated entry
      MessageInput.{tsx,css}         # Composer (Enter to send, Shift+Enter newline)

  hooks/
    useMouseParallax.ts          # Spring-smoothed mouse tracking

  services/
    api.ts                       # Axios instance (VITE_API_BASE_URL)

  utils/
    constants.ts                 # ROLES + DEPARTMENTS catalogs
    seed.ts                      # Deterministic demo messages per department
    storage.ts                   # Tiny typed localStorage wrapper
    time.ts                      # formatClock / formatDayHeader helpers
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
git clone https://github.com/<owner>/hospital-chat.git
cd hospital-chat
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

### Production build

```bash
npm run build
npm run preview
```

> Vite uses esbuild to transpile `.ts`/`.tsx` directly — no separate
> `tsc` step is required for the build to succeed. Optional editor-side
> typechecking can be enabled by adding `typescript` and running
> `tsc -b --noEmit`.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Bundle the app for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the JS config files |

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> All client-side env variables must be prefixed with `VITE_` to be
> exposed by Vite.

---

## Roles and Departments

Roles are defined in `src/utils/constants.ts`:

| Role | Default departments |
| --- | --- |
| Doctor | ICU, Emergency, Cardiology, Pediatrics, Radiology, Surgery |
| Nurse | ICU, Emergency, Cardiology, Pediatrics, Surgery |
| Lab Technician | Laboratory only |
| Pharmacist | Pharmacy only |
| Receptionist | Emergency only |
| Administrator | All departments |

Each department also declares which roles can read/post in it
(`Department.allowedRoles`). The Login page disables departments not
allowed for the chosen role; the Sidebar locks them out for logged-in
users; the chat panel only renders messages for the active channel.

---

## Architecture Notes

### Auth and routing

`AuthProvider` (mounted in `main.tsx`) holds the current user, persists
to `localStorage`, and exposes `login`, `logout`, and
`setActiveDepartment`. Routes use `ProtectedRoute` /
`PublicOnlyRoute` wrappers in `routes/AppRoutes.tsx`.

To wire up real authentication, replace the body of `login()` with an
API call to your backend and pass the returned user shape to `setUser`.

### Department-isolated chat

`ChatProvider` keeps a `Record<DepartmentId, ChatMessage[]>` so each
department has its own conversation slice. `sendMessage(departmentId,
text)` only mutates the slice for that department — no broadcasting
across channels. The dashboard panel is keyed by `department.id`, which
remounts it on every channel switch and replays the entry animation.

To wire up real-time messaging, replace the local mutation in
`ChatContext.sendMessage` with a Socket.IO emit, and listen for
incoming events (e.g. `messageCreated`) to append to the matching
department slice.

### Adding a new department

1. Add an entry to `DEPARTMENTS` in `src/utils/constants.ts` with a new
   `DepartmentId` literal added to `src/types/index.ts`.
2. Add a `SEED_MESSAGES` slice in `src/utils/seed.ts` (use `[]` if you
   want it empty).
3. Update each role's `defaultDepartments` list as appropriate.

### Adding a new role

1. Extend the `Role` union in `src/types/index.ts`.
2. Add a `RoleMeta` entry to `ROLES` in `src/utils/constants.ts`,
   including a default department list and accent color.
3. Add the role to `Department.allowedRoles` for any department it
   should be able to access.

---

> **Backend repository:** _add link here_
