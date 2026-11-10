# Atera Atera Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Atera into a functional mock-data React admin SPA with Atera Dashboard page coverage, responsive interactions, complete auth flows, and full EN/DE/FR localization.

**Architecture:** Keep Vite, React, TypeScript, and React Router. Add an authenticated dashboard route shell and standalone auth shell, centralize navigation and mock repositories, and compose focused route pages from shared primitives, charts, tables, forms, and feedback components.

**Tech Stack:** React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Radix/shadcn primitives, Recharts, TanStack Table, React Hook Form, Zod, Framer Motion, date-fns, Bun.

**Spec:** `docs/superpowers/specs/2026-11-07-zenith-parity-design.md`

## Global Constraints

- Preserve Vite + React + TypeScript; do not introduce Next.js or a backend.
- Use `@/*` imports, `cn` from `src/lib/utils.ts`, and existing primitives in `src/components/ui/`.
- Keep route screens in `src/pages/`, layout code in `src/layouts/`, shared app pieces in `src/components/`, hooks in `src/hooks/`, and repositories in `src/lib/data/`.
- All user-facing UI text must have EN, DE, and FR translations.
- Mock auth is functional but not production security; no real credentials, API keys, or secrets.
- Do not add comments unless explicitly requested.
- Every task ends with `bun run lint` and `bun run build`; there is no test command yet.
- Do not commit `dist/` or `node_modules/`.

---

### Task 1: Install approved dependencies and create shared UI primitives

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`
- Create/modify: `src/components/ui/table.tsx`, `tabs.tsx`, `alert.tsx`, `checkbox.tsx`, `label.tsx`, `progress.tsx`, `scroll-area.tsx`, `switch.tsx`, `textarea.tsx`, `radio-group.tsx`, `calendar.tsx`, `separator.tsx` as needed
- Create: `src/components/ui/toast.tsx`, `src/components/ui/use-toast.ts`
- Modify: `src/app.css`

**Interfaces:**
- Produces installed `recharts`, `@tanstack/react-table`, `react-hook-form`, `zod`, `@hookform/resolvers`, `framer-motion`, and `date-fns`.
- Produces accessible primitives matching the existing `Button`, `Card`, `Input`, `Select`, and `Dialog` conventions.

- [ ] Run `bun add recharts @tanstack/react-table react-hook-form zod @hookform/resolvers framer-motion date-fns`.
- [ ] Add only primitives required by later tasks, using existing Radix packages where available and CSS variables from `app.css`.
- [ ] Add toast provider/hook with success and error variants; mount it once in `src/main.tsx` or the root app shell.
- [ ] Run `bun run lint` and `bun run build`; expect exit 0.

### Task 2: Add navigation metadata, typed mock repositories, and auth session helpers

**Files:**
- Create: `src/lib/navigation.ts`
- Create: `src/lib/data/types.ts`, `src/lib/data/orders.ts`, `products.ts`, `customers.ts`, `invoices.ts`, `users.ts`, `files.ts`, `notifications.ts`
- Create: `src/lib/auth.ts`
- Create: `src/hooks/use-auth.ts`
- Modify: `src/types.ts`

**Interfaces:**
- `navigationItems: NavigationItem[]` includes `title`, `href`, `icon`, `group`, `keywords`, optional `badge`, and `translationKey`.
- Repositories export typed arrays plus `list`, `getById`, `create`, `update`, and `remove` functions where applicable.
- `auth.ts` exports `getSession(): AuthSession | null`, `signIn(email, password): AuthResult`, `signUp(input): AuthResult`, `signOut(): void`, and `isAuthenticated(): boolean`.

- [ ] Define stable domain types for Order, Product, Customer, Invoice, User, FileItem, Notification, and AuthSession.
- [ ] Move all navigation groups from `app-sidebar.tsx` into `navigation.ts`; include every approved route and no disabled placeholder item.
- [ ] Seed deterministic mock data with IDs, statuses, amounts, dates, and relationships used by dashboards and CRUD pages.
- [ ] Implement the demo account `demo@example.com` / `AteraDemo2026!`, localStorage-backed session, mock account registration, and deterministic auth errors.
- [ ] Run lint/build.

### Task 3: Rework shell, routing, navigation, transitions, and localization foundation

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`, `src/components/app-sidebar.tsx`, `src/components/app-header.tsx`, `src/components/nav-main.tsx`
- Create: `src/layouts/auth-layout.tsx`, `src/layouts/protected-layout.tsx`, `src/components/shared/page-transition.tsx`, `src/components/shared/page-header.tsx`
- Modify: `src/i18n/index.ts`
- Modify: `src/components/app-shell.tsx`

**Interfaces:**
- `ProtectedLayout` redirects unauthenticated users to `/login` and renders an `<Outlet />` inside `AppLayout`.
- `AuthLayout` renders auth pages without dashboard chrome.
- `PageTransition({ children }: { children: React.ReactNode })` animates route content with reduced-motion support.
- `PageHeader` accepts translated title, description, and optional actions.

- [ ] Replace placeholder route handling with the full route tree from the spec, keeping `/login` as a compatibility alias to `/sign-in`.
- [ ] Add fallback `*` route to `/404`; add explicit protected route boundary.
- [ ] Make sidebar, mobile sheet navigation, and command palette consume `navigationItems`.
- [ ] Add translations for all navigation labels and shared page/form/table/status keys in EN/DE/FR.
- [ ] Mount route transition around protected page content and respect `prefers-reduced-motion`.
- [ ] Run lint/build and manually verify `/login`, `/sign-in`, `/dashboard`, and unauthenticated redirect.

### Task 4: Build dashboard variations and chart showcase

**Files:**
- Modify: `src/pages/dashboard.tsx`, `src/components/dashboard/overview-chart.tsx`, `src/components/dashboard/types.ts`
- Create: `src/pages/analytics.tsx`, `ecommerce.tsx`, `crm.tsx`, `saas.tsx`, `charts.tsx`
- Create: `src/components/charts/chart-config.ts`, `chart-area.tsx`, `chart-bar.tsx`, `chart-line.tsx`, `chart-pie.tsx`, `chart-radar.tsx`, `chart-radial-bar.tsx`, `chart-treemap.tsx`, `chart-scatter.tsx`, `chart-composed.tsx`
- Create: `src/components/shared/stat-card.tsx`
- Modify: `src/lib/data/types.ts`, `src/i18n/index.ts`

**Interfaces:**
- Each chart component accepts typed `data`, `dataKeys`, optional `height`, and uses responsive Recharts containers.
- Dashboard pages use `PageHeader`, `StatCard`, chart wrappers, and shared Card primitives.

- [ ] Replace hand-drawn overview bars with a responsive Recharts area/composed chart while keeping the existing metric and activity widgets.
- [ ] Build analytics, eCommerce, CRM, and SaaS dashboards with distinct mock datasets and chart compositions.
- [ ] Build `/charts` as a showcase for area, bar, line, pie, radar, radial bar, treemap, scatter, and composed charts.
- [ ] Add translated labels/descriptions for every dashboard card and chart.
- [ ] Manually verify each dashboard in light/dark themes and mobile width; run lint/build.

### Task 5: Build shared data table, validated form, and confirmation patterns

**Files:**
- Create: `src/components/shared/data-table/data-table.tsx`, `data-table-toolbar.tsx`, `data-table-pagination.tsx`, `data-table-column-header.tsx`, `data-table-view-options.tsx`, `data-table-mobile-cards.tsx`, `csv-export.ts`
- Create: `src/components/shared/validated-field.tsx`, `confirm-dialog.tsx`, `empty-state.tsx`, `loading-state.tsx`
- Modify: `src/i18n/index.ts`

**Interfaces:**
- `DataTable<TData, TValue>` accepts `columns: ColumnDef<TData, TValue>[]`, `data: TData[]`, optional filter/selection/export options.
- `DataTableMobileCards` accepts row data and a render function for compact cards.
- `ValidatedField` integrates React Hook Form `FieldPath` and Zod-derived errors.
- `ConfirmDialog` accepts title, description, confirm label, and async `onConfirm`.

- [ ] Implement TanStack sorting, filtering, pagination, visibility, row selection, and CSV export.
- [ ] Add responsive mobile-card rendering below the desktop table breakpoint.
- [ ] Add reusable RHF field/error wiring and async confirmation feedback.
- [ ] Run lint/build and manually verify sorting, filtering, pagination, export, and keyboard interaction with a temporary consumer if needed.

### Task 6: Build commerce pages and CRUD flows

**Files:**
- Create: `src/pages/orders.tsx`, `orders-new.tsx`, `orders-detail.tsx`, `orders-edit.tsx`
- Create: `src/pages/products.tsx`, `products-new.tsx`, `products-detail.tsx`, `products-edit.tsx`
- Create: `src/pages/customers.tsx`, `invoices.tsx`, `billing.tsx`, `pricing.tsx`
- Create: `src/components/commerce/order-columns.tsx`, `product-columns.tsx`, `order-form.tsx`, `product-form.tsx`, `status-badge.tsx`
- Modify: `src/App.tsx`, `src/i18n/index.ts`

**Interfaces:**
- List pages consume repository arrays through `DataTable` and navigate using React Router links.
- `OrderForm` and `ProductForm` accept optional initial values and `onSubmit` callbacks with Zod schemas.

- [ ] Add all commerce routes, including `:id` and `:id/edit` variants.
- [ ] Implement order/product search, status filter, sort, pagination, CSV export, detail views, create, edit, delete, and success/error toasts.
- [ ] Build customer, invoice, billing, and pricing pages using the shared page/table/card patterns.
- [ ] Ensure amount/date/status formatting is translated or locale-aware without changing stable fixture IDs.
- [ ] Manually verify a complete create → list → detail → edit → delete flow for orders and products; run lint/build.

### Task 7: Build app pages: mail, chat, files, Kanban, calendar, wizard

**Files:**
- Create: `src/pages/mail.tsx`, `chat.tsx`, `files.tsx`, `kanban.tsx`, `calendar.tsx`, `wizard.tsx`
- Create: `src/components/apps/mail-*`, `chat-*`, `file-*`, `kanban-*`, `calendar-*`, `wizard-*` focused components
- Modify: `src/lib/data/files.ts`, `src/i18n/index.ts`, `src/App.tsx`

**Interfaces:**
- App pages own view selection state but use shared data types and UI primitives.
- Kanban columns contain typed tasks and expose `moveTask(taskId, columnId)` via local state.
- Wizard tracks step index, validates each step with Zod, and displays a final success state.

- [ ] Build mail inbox/read/compose simulation with mock messages and compose validation.
- [ ] Build chat thread selection and send-message simulation.
- [ ] Build files grid/list toggle, search, folder navigation, and mock upload feedback without real storage.
- [ ] Build Kanban columns with Framer Motion draggable cards and drop/move state.
- [ ] Build date-fns calendar with event list and selected-day detail.
- [ ] Build multi-step wizard with per-step validation, back/next controls, and completion feedback.
- [ ] Manually verify mobile behavior and reduced-motion mode; run lint/build.

### Task 8: Build account, settings, users, notifications, support, and system pages

**Files:**
- Create: `src/pages/profile.tsx`, `settings-profile.tsx`, `settings-appearance.tsx`, `settings-notifications.tsx`, `settings-billing.tsx`, `users.tsx`, `notifications.tsx`, `support.tsx`
- Create: `src/components/account/profile-form.tsx`, `user-columns.tsx`, `permissions-grid.tsx`, `notification-list.tsx`, `support-form.tsx`
- Modify: `src/App.tsx`, `src/i18n/index.ts`

**Interfaces:**
- Account forms use RHF/Zod and update local mock/session state.
- Users page uses `DataTable` and supports role/status changes, create/edit/delete, and permission display.
- Settings appearance delegates to `useAppearance` and `useCustomizePreferences`.

- [ ] Build profile and settings tabs for profile, appearance, notifications, and billing.
- [ ] Build users CRUD with Admin/Editor/Viewer/Moderator roles and permissions grid.
- [ ] Build notification list with read/unread state and bulk mark-read simulation.
- [ ] Build support form with category, description, validation, and success state.
- [ ] Add translated copy and route metadata; manually verify settings persistence and users CRUD; run lint/build.

### Task 9: Build complete mock auth flows

**Files:**
- Modify: `src/pages/login.tsx`
- Create: `src/pages/sign-in.tsx`, `sign-up.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `two-factor.tsx`, `verify-email.tsx`, `lock-screen.tsx`
- Create: `src/components/auth/auth-card.tsx`, `auth-form.tsx`, `password-field.tsx`
- Modify: `src/App.tsx`, `src/lib/auth.ts`, `src/i18n/index.ts`

**Interfaces:**
- Auth pages use `AuthLayout`, RHF/Zod, and `auth.ts` functions.
- All forms expose loading, validation error, and deterministic success/error states.

- [ ] Implement sign-in with demo credentials and registered mock account support, then redirect to `/dashboard`.
- [ ] Implement sign-up with matching-password validation and local mock account creation.
- [ ] Implement forgot/reset flow using a local reset token state and success confirmation.
- [ ] Implement two-factor code acceptance (`123456`), verify-email resend simulation, and lock-screen unlock.
- [ ] Keep `/login` rendering or redirecting to the sign-in flow for compatibility.
- [ ] Manually verify successful and failed auth paths plus protected-route redirect; run lint/build.

### Task 10: Build error/status pages and final polish

**Files:**
- Create: `src/pages/errors/not-found.tsx`, `forbidden.tsx`, `server-error.tsx`, `coming-soon.tsx`, `maintenance.tsx`
- Modify: `src/App.tsx`, `src/components/app-header.tsx`, `src/components/app-sidebar.tsx`, `src/components/app-content.tsx`, `src/app.css`, `src/i18n/index.ts`

**Interfaces:**
- Error pages accept optional `onRetry`, `backHref`, or `homeHref` props where useful and render through the appropriate standalone/dashboard shell.

- [ ] Wire `*` to 404 and add explicit 403/500/coming-soon/maintenance routes.
- [ ] Complete command palette search from `navigationItems`, including keyboard navigation and route selection.
- [ ] Audit every page for responsive overflow, focus states, semantic heading order, dark/light/system appearance, and density/container preferences.
- [ ] Confirm all introduced UI strings exist in EN/DE/FR and replace page-level hardcoded labels.
- [ ] Run final `bun run lint` and `bun run build`; manually audit every route in the route inventory with authenticated and unauthenticated sessions.

## Verification Checklist

- [ ] `bun run lint` exits 0 after every task.
- [ ] `bun run build` exits 0 after every task.
- [ ] Demo sign-in, sign-out, registration, reset, two-factor, verification, and lock flows work.
- [ ] Protected routes redirect unauthenticated users.
- [ ] Orders/products CRUD and table interactions work.
- [ ] All dashboard/chart variants render without console errors.
- [ ] Mail/chat/files/Kanban/calendar/wizard interactions work.
- [ ] Settings/preferences persist and affect the complete app.
- [ ] EN/DE/FR translations are complete.
- [ ] Mobile, dark mode, reduced motion, keyboard focus, and fallback routes are manually checked.
