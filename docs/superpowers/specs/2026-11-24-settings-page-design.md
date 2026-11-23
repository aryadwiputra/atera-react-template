# Settings Area Redesign — Design Spec

Date: 2026-11-24
Status: Approved (design), pending spec review

## Goal

Replace the four standalone settings pages with a single Settings hub: a tab bar
(General / Team) driven by the `?tab=` URL parameter, plus a grid of settings
menu cards. Each card has an icon on the left, and title + description + arrow
button on the right. Add a new Departments CRUD page under the Team tab.

## Constraints

- Frontend-only; no network calls, no new dependencies.
- Reuse existing shadcn/Radix primitives (`Card`, `Button`, `Dialog`, `Table`).
- Design tokens only (no hardcoded colors).
- i18n: en/de/fr, reuse existing keys where they already exist.
- Bun; verification via `bun run lint` and `bun run build` (no test framework).

## Routing

`/settings` becomes a layout route that renders the hub.

| Path | Element |
|---|---|
| `/settings` | `SettingsLayout` (hub: header + tabs + `Outlet`) |
| `/settings?tab=general` | General tab (default; `tab` param omitted) |
| `/settings?tab=team` | Team tab |
| `/settings/profile` | existing page (General) |
| `/settings/appearance` | existing page (General) |
| `/settings/notifications` | existing page (General) |
| `/settings/billing` | existing page (General) |
| `/settings/departments` | NEW Departments page (Team) |
| `/users` | existing page (Team) |

- Remove `<Navigate to="/settings/appearance" replace />`; `/settings` now renders
  the hub directly.
- Tab state: read `tab` from `useSearchParams()`; valid values `general` (default)
  and `team`; switch with `setSearchParams(..., { replace: true })` and delete the
  param for the default tab.
- The tab bar is shown by the layout on the hub and on every nested settings page.
  Active tab = pathname: `departments` → team; everything else → general. The hub
  additionally honours the `tab` param for which card group it renders.
- `src/lib/navigation.ts`: Settings nav href `/settings/appearance` → `/settings`.
- `explicitPaths` in `src/App.tsx`: add `/settings/departments`; keep all existing
  entries.

Nested routes live under the `/settings` layout route in `App.tsx`:

```tsx
{ path: '/settings', element: <SettingsLayout />, children: [
  { index: true, element: <SettingsHome /> },
  { path: 'profile', element: <SettingsProfilePage /> },
  { path: 'appearance', element: <SettingsAppearancePage /> },
  { path: 'notifications', element: <SettingsNotificationsPage /> },
  { path: 'billing', element: <SettingsBillingPage /> },
  { path: 'departments', element: <SettingsDepartmentsPage /> },
]}
```

`/users` stays a standalone app page (outside this shell); the Users card simply
navigates there. All other app routes remain unchanged.

## Hub UI

`SettingsLayout` (`src/pages/settings/layout.tsx`):

- `PageTransition` → `main` `flex min-h-full flex-col gap-6 p-4 md:p-6`.
- Page header: `h1` "Settings" + a short description (new i18n key), inside the
  standard `PageHeader` component (no breadcrumbs).
- Tab bar: two triggers "General" and "Team" using the existing `Tabs` primitive
  (line variant) as navigation — each trigger renders a `Link`-like button that
  updates the `tab` param; active styling from `data-state="active"`.
- Below: `sm:grid-cols-2 xl:grid-cols-3` grid of `SettingCard`.

`SettingCard` (module-scope in the layout file):

```tsx
type SettingCardProps = { href: string; icon: LucideIcon; title: string; description: string }
```

- `Link to={href}` wrapping a `Card` (`group flex items-center gap-4 p-4 transition-colors hover:bg-accent/50`).
- Left: icon inside `flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted`.
- Middle: title (`font-medium`) + description (`text-muted-foreground text-sm`).
- Right: arrow button (`ArrowRight`, size-7 ghost icon) that moves right and takes
  the primary color on group hover (`transition-transform group-hover:translate-x-0.5`).
- The whole card is the click target (no nested interactive elements other than the
  decorative arrow).

Cards:

| Tab | Card | href | icon |
|---|---|---|---|
| General | Profile | `/settings/profile` | UserRound |
| General | Appearance | `/settings/appearance` | Palette |
| General | Notifications | `/settings/notifications` | Bell |
| General | Billing | `/settings/billing` | CreditCard |
| Team | Users | `/users` | Users |
| Team | Departments | `/settings/departments` | Building2 |

## Existing pages

Remove `PageHeader` (and its import) from `profile.tsx`, `appearance.tsx`,
`notifications.tsx`, `billing.tsx`. Keep each page's `PageTransition` and `main`
padding; replace the header with a compact in-content heading (`h2` + description).
Card contents and behaviour are unchanged. `appearance.tsx` keeps its reset action,
moved next to the compact heading.

## Departments (new)

Types (`src/lib/data/types.ts`):

```ts
export type Department = {
  id: string
  name: string
  description: string
  head: string
  memberCount: number
  createdAt: string
}
export type DepartmentInput = { name: string; description: string; head: string; memberCount: number }
```

`src/lib/data/departments.ts`: module-level mutable array seeded with 8
departments (Engineering, Design, Sales, Analytics, People, Operations, Finance,
Customer Success), `listDepartments()`, `createDepartment(input)` (`DEP-` id
prefix, createdAt from today's date), `updateDepartment(id, input)`,
`removeDepartment(id)`.

`src/services/department-service.ts`: `departmentService` with
`list/create/update/remove`, typed via an interface.

Page `src/pages/settings/departments.tsx` (same pattern as `src/pages/users.tsx`):

- Compact heading + "Add department" button.
- Table columns: Name (bold) + description below, Head, Members, Actions (edit /
  delete icon buttons).
- Add/Edit `Dialog` with fields Name, Head, Members (number), Description
  (Textarea); validation: name required, members a non-negative integer.
- Delete confirmation `Dialog`.
- Success toasts for create/update/delete; list re-renders via a `useReducer`
  force pattern already used in this repo.

## i18n

Add (en / de / fr): `general`, `team`, `settingsDescription`, `departments`,
`departmentsDescription`, `addDepartment`, `editDepartment`, `departmentName`,
`departmentHead`, `departmentMembers`, `departmentDescription`,
`departmentCreated`, `departmentUpdated`, `departmentDeleted`,
`departmentDeleteConfirm`, `noDepartments`.

Reuse existing: `settings`, `users`, `profile`, `appearance`, `notifications`,
`billing`, `description`, `name`, `save`, `cancel`, `delete`, `edit`, `search`,
`actions`, `reset`.

## Out of scope

- New permissions/roles logic, departments ↔ users relational linkage.
- Moving `/users` under `/settings` (it stays at `/users`).
- Server persistence.

## Verification

1. `bun run lint` — no new warnings.
2. `bun run build` — success.
3. Browser: `/settings` shows General tab with 4 cards, every card navigates and
   reliably resolves; Team tab shows Users + Departments; `?tab=team` survives
   reload and back/forward; departments create/edit/delete work with toasts and
   counts update; nav Settings highlights on all child routes.
