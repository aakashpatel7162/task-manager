# TaskFlow — Modern Task Manager Application

A modern, responsive, and robust Task Management application built with **React 18**, **TypeScript**, and **Pure Vanilla CSS** without any External Ui libreary (MUI, or Tailwind) runtime dependencies. All source code files are cleanly structured in a flat source folder (`src/`) with zero nested subdirectories for maximum clarity and maintainability.

---
## 💻 Point 1: Working Application & Source Code

### Features Breakdown

1. **Full Task Lifecycle (CRUD)**
   - Create, edit, inspect, and delete tasks.
   - Configure title, detailed description, priority levels (`low`, `medium`, `high`, `urgent`), category tags, and due dates.
   - Subtask checklist with dynamic completion percentage calculation.

2. **Dual Workspace Views**
   - **Kanban Board View**: Columnar layout separating tasks by status (`To Do`, `In Progress`, `Completed`) with rapid progression buttons.
   - **List / Table View**: Compact, high-density view ideal for triaging large backlogs with visual priority indicators and due date badges.

3. **Real-Time Filtering, Search & Multi-Field Sorting**
   - Full-text search across task title, description, and category.
   - Dynamic filters by Status, Priority, and Category.
   - Configurable sorting by Due Date, Priority Weight, Creation Date, or Title in Ascending or Descending order.

4. **Analytics & Performance Metrics**
   - High-level overview cards displaying Total Tasks, In Progress count, Completed items, and Overdue deliverables.
   - Visual progress bar calculating the overall completion percentage.

5. **Persistence, Export & Import**
   - Automatic `localStorage` persistence with seamless fallback to curated sample data.
   - One-click JSON backup export (`taskflow-backup-YYYY-MM-DD.json`).
   - JSON data import tool with schema validation and error reporting.

6. **Responsive Design & Dark/Light Theme**
   - Custom CSS variables supporting instantaneous switching between light and dark themes.
   - Fully responsive on mobile, tablet, and desktop screens.

---

### Quick Start & Setup Instructions

#### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

#### Installation & Development
```bash
# 1. Navigate to the project directory
cd task-manager

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open `http://localhost:5173` (or `http://localhost:3000`) in your browser to interact with the application.

#### Production Build & Preview
```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview



## 🎥 Point 2: Video Explanation & Key Decisions Made


### The 3 Most Important Architectural Decisions

#### Decision 1: Centralized React Context with LocalStorage & JSON Portability instead of an External Backend
- **Why**: Introducing an external database (e.g., PostgreSQL/MongoDB) and backend server for a frontend-focused task manager introduces network latency, authentication barriers, deployment cold starts, and environment configuration hurdles for evaluators.
- **Impact**: By implementing a robust `TaskContext` combined with a resilient `localStorage` layer and JSON export/import mechanism, the application is **100% self-contained, instant to load, offline-ready**, and guarantees zero setup friction for anyone reviewing the submission.

#### Decision 2: Dual Presentation Paradigm (Kanban Board + List View) with Native Interactions
- **Why**: Different users have distinct productivity workflows. Visual planners prefer a column-based Kanban board to track workflow progression, while power users prefer a dense, tabular list view for rapid triage and sorting.
- **Impact**: Rather than pulling in bulky external drag-and-drop libraries that cause hydration and strict-mode issues in React 18, we engineered native one-click progression actions (`Move to Next Status`, direct status dropdowns) alongside dynamic sorting. This delivers high accessibility, rock-solid mobile usability, and zero bundle bloat.

#### Decision 3: Pure Custom CSS Architecture with Single Flat Directory Structure
- **Why**: Many modern projects accumulate hundreds of nested files and rely heavily on Tailwind or heavy component libraries (like MUI or Ant Design), which obscure component styling logic and inflate CSS bundles.
- **Impact**: We crafted a clean, centralized **Pure Vanilla CSS** design system (`src/index.css`) powered by CSS custom properties (variables) for fluid light/dark theming, glassmorphism cards, and responsive grids. By keeping all components in a **single flat `src/` directory**, any developer or reviewer can understand the full architecture in under two minutes without jumping through nested folders.




## 🚫 Point 3: What We Chose Not to Implement

We consciously made deliberate trade-offs during development to deliver a polished, high-performing application within the project constraints:

### 1. Dedicated Backend Server & Remote Database
- **What was omitted**: A custom backend server (e.g., Express/NestJS/FastAPI) and remote database (e.g., PostgreSQL, MongoDB, or Supabase).
- **Why we chose not to implement it**:
  - Requiring a remote database or server introduces external dependencies, potential API downtime, network latency, and CORS/environment variable setup requirements for whoever runs the project locally.
  - By relying on client-side state, `localStorage`, and JSON backup/restore, the application is **fully autonomous, reliable, and functional out of the box** without running multiple servers.

### 2. Heavy Third-Party UI & Drag-and-Drop Libraries
- **What was omitted**: Pre-packaged component libraries (e.g., Material UI, Ant Design) and complex drag-and-drop engines (e.g., `react-beautiful-dnd`, `dnd-kit`).
- **Why we chose not to implement it**:
  - Third-party drag-and-drop packages frequently suffer from React 18 StrictMode compatibility issues, increase bundle size by tens of kilobytes, and often degrade mobile touch accessibility.
  - Using direct, tactile status controls (`To Do` ➔ `In Progress` ➔ `Completed`) provides a faster, clearer, and screen-reader accessible user experience across all devices.

---

## ⏳ Point 4: Implementation Limitation (1 Additional Day Roadmap)

### Limitation: User Authentication & Multi-Tenant User Isolation
In the current implementation, all task data and preferences are saved to the browser's `localStorage` under a single global namespace. 
- **The Drawback**: If multiple users share the same browser or computer, they cannot have private task workspaces. There is no account registration, login authentication, or session management to separate one user's board from another.

---

### 24-Hour Implementation Action Plan

If granted one additional day, this limitation would be addressed through the following structured milestones:

1. **Authentication State & Context (`AuthContext`)**:
   - Create user authentication state tracking `currentUser`, `isAuthenticated`, `login()`, `signup()`, and `logout()`.
2. **Dedicated Login & Sign-Up Screen**:
   - Provide an onboarding page with email/password authentication, password visibility toggles, and form validation.
3. **Per-User Namespaced Data Storage**:
   - Prefix all task storage keys with the logged-in user identifier (e.g., `taskflow_user_123_tasks`), ensuring that logging in as User A never exposes User B's tasks.
4. **Protected Route Handling**:
   - Guard the workspace dashboard behind authenticated sessions, redirecting unauthenticated visitors directly to the login portal.


