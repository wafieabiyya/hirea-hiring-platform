# HireA - Hiring Platform

A lightweight **Next.js** app for managing job postings and candidate applications — all **client-side** using **IndexedDB (Dexie)**. It includes an admin view to create/manage jobs, and an applicant view to browse and apply. Form fields on the applicant side are dynamic (mandatory/optional/off) based on admin configuration. Basic **state management** via **Zustand** and **toast** notifications via **react-hot-toast**.

---

## Project Overview

- **Admin**:
  - **Create jobs** (title, company, type, status, location, description, salary range).
  - **Configure Application Form** field levels per job: `mandatory` | `optional` | `off`.
- **Applicant**:
  - Browse `active jobs`, `filter by category`, `mobile-friendly master/detail layout`.
  - **Apply through a dynamic form** driven by **admin config** (shows required asterisks, hides “off” fields).
  - **Optional photo capture** (webcam modal) saved as Base64 to IndexedDB.
- **State**: Global store with **Zustand** for jobs list, **create job**, **submit application**.
- **Data/Database**: Persisted locally in **IndexedDB** with **Dexie**
- **UX**: Persisted locally in **IndexedDB** with **Dexie**
  - **react-hot-toast** for success/error messages.
  - **Tailwind** + small UI components (`cards`, `table`, `modal`, `inputs`).
  - **Lucide icons**.

---

## Tech Stack

- **Core**: Next.js 14+, React 18, TypeScript
- **State**: Zustand
- **Persistence**: Dexie (IndexedDB)
- **Styling**: Tailwind CSS
- **UI helpers**: lucide-react
- **Toasts**: react-hot-toast
- **Media (optional)**: MediaDevices API (webcam), MediaPipe Hands (optional/experimental)

---

## Key Flow

### Admin

1. **Create Job** → persisted to `jobs` (+ `job_fields` for levels)
2. **List Jobs** → filter/search; status pill; salary formatting; candidate count
3. **View Candidates** → reads `applications` + `application_answers`, normalizes into table columns

### Applicant

1. **See Active Jobs Only** (`status = active`), filter by `type`
2. **View Detail** → `description`, `location`, `salary`
3. **Apply** → dynamic form (required asterisks, hide “off” fields)
4. **Photo Capture** → base64 stored under photo_profile
5. **Submit** → writes `applications` + `application_answers`, redirects to `/job/success`

## Run Instruction

**Prereqs**:

- Node.js 18+ (recommend ver20+)
- pnpm / npm / yarn

### 1. Install

```bash
npm install
# or: pnpm install
# or: yarn
```

### 2. Run (Dev)

```bash
npm run dev
# or: pnpm dev
# or: yarn dev
```

Then open [http://localhost:3000](http://localhost:3000)

### 3. Build & Start

```bash
npm run build && npm start
# or: pnpm build && pnpm start
# or: yarn build && yarn start
```

## Routes (Quick Start)

- Landing:`/` → Explains there’s no auth; try Admin or Jobs.

- **Admin**: `/admin/jobs` **(list)** • `/admin/jobs/new` **(create)**

- **Applicants**: `/jobs` (list & detail, apply)

- **Success**: `/job/success`
