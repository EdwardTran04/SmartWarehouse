# Plan: Restructure Mobile App into `mobile/` folder

## Current State

**Already done** (`src/pages/mobile/`):
- `components/ui.tsx` - Shared UI: Badge, Dot, Btn, Field, Input, Card, SectionTitle, KpiTimer, Row, Stat, Mini
- `components/layout.tsx` - Layout: PhoneFrame, TopBar, BottomNav, OfflineBanner
- `components/BottomActionBar.tsx`
- `components/index.ts`
- `screens/Login.tsx`, `screens/Home.tsx`, `screens/Task.tsx`
- `screens/inbound/` - 9 screens (Receive, Vehicle, Unload, Check, KCS, Reject, TAGR, VOffice, Pack, Putaway)
- `screens/outbound/` - 6 screens (OutConfirm, OutPick, OutKcs, OutPack, OutLoad, OutHandover)

**Still in `src/pages/MobileApp.tsx`** (the monolith 1949-line file):
- ScreenWorker, ScreenNotify, ScreenScan, ScreenProfile, ScreenApprove, ScreenApproveDetail

**Staff app** (`src/pages/staff/`):
- StaffLayout, StaffTasks, StaffTaskDetail, StaffLeave, StaffProfile
- These are separate React Router pages (not SPA like MobileApp.tsx)
- Accessed via `/app/*` routes

---

## Target Structure

```
src/pages/mobile/
├── components/
│   ├── ui.tsx          (already exists)
│   ├── layout.tsx      (already exists)
│   ├── BottomActionBar.tsx
│   ├── index.ts
│   └── icons.tsx       (NEW: shared icon components like MoreHorizontal, Pause, AlertTriangle)
├── screens/
│   ├── Login.tsx       (already exists)
│   ├── Home.tsx       (already exists)
│   ├── Task.tsx       (already exists, but local icons should be removed)
│   ├── Worker.tsx     (NEW - extract from MobileApp.tsx)
│   ├── Notify.tsx     (NEW - extract from MobileApp.tsx)
│   ├── Scan.tsx       (NEW - extract from MobileApp.tsx)
│   ├── Profile.tsx     (NEW - extract from MobileApp.tsx)
│   ├── Approve.tsx     (NEW - extract from MobileApp.tsx)
│   ├── ApproveDetail.tsx (NEW - extract from MobileApp.tsx)
│   ├── inbound/       (already exists - 9 screens)
│   └── outbound/      (already exists - 6 screens)
├── staff/              (NEW - moved from src/pages/staff/)
│   ├── StaffLayout.tsx
│   ├── StaffTasks.tsx
│   ├── StaffTaskDetail.tsx
│   ├── StaffLeave.tsx
│   └── StaffProfile.tsx
└── index.tsx          (NEW - the MobileApp component as router entry point)
```

---

## Steps

### Step 1: Extract remaining screens from MobileApp.tsx into `mobile/screens/`
Create these new files, each exporting one screen component:
- `mobile/screens/Worker.tsx` → `ScreenWorker`
- `mobile/screens/Notify.tsx` → `ScreenNotify`
- `mobile/screens/Scan.tsx` → `ScreenScan`
- `mobile/screens/Profile.tsx` → `ScreenProfile`
- `mobile/screens/Approve.tsx` → `ScreenApprove`
- `mobile/screens/ApproveDetail.tsx` → `ScreenApproveDetail`

Each file imports shared components from `../components/` and has its own local `Screen` type.

### Step 2: Fix `mobile/screens/Task.tsx`
- Remove locally-defined `MoreHorizontal`, `Pause`, `AlertTriangle` icon components
- Import them from `../components/icons.tsx` (Step 3)

### Step 3: Create `mobile/components/icons.tsx`
Extract shared icon components used across screens (currently duplicated locally):
- MoreHorizontal, Pause, AlertTriangle, etc.

### Step 4: Move staff app into `mobile/staff/`
- Move `src/pages/staff/*` → `src/pages/mobile/staff/`
- Update internal imports in staff files (e.g., StaffTasks imports from `./StaffLayout`)

### Step 5: Create `mobile/index.tsx` as the main MobileApp router entry
This replaces the old `MobileApp.tsx`. It uses React Router and renders each screen as a route.
It also re-exports all screen components for use in App.tsx.

### Step 6: Update `App.tsx` imports
- Change `import MobileApp from "./pages/MobileApp"` → point to `mobile/index.tsx`
- Change staff imports from `./pages/staff/*` → `./pages/mobile/staff/*`

### Step 7: Delete old files
- `src/pages/MobileApp.tsx` (replaced by mobile/index.tsx)
- `src/pages/staff/` folder (moved to mobile/staff/)

---

## Verification
- Run `npm run dev` or build to check for import errors
- All mobile screens should be accessible via routes
- Staff app pages should remain accessible via `/app/*` routes