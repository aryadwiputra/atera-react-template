# Settings Area Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `superpowers:executing-plans` (or subagent-driven execution: one fresh subagent per task, review between tasks). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild `/settings` as a tabbed hub (General/Team, URL-driven) with settings menu cards, and add a Departments CRUD page.

**Architecture:** `/settings` becomes a layout route rendering a shared header + tab bar + `<Outlet/>`. The index route is the hub with a card grid. Existing settings pages lose their own `PageHeader`/`main` wrapper and render content only. Departments follow the existing users.tsx pattern (mock module + service + table/dialogs).

**Tech Stack:** React 19, TypeScript, react-router, Tailwind v4 tokens, shadcn primitives, Bun. No test framework — verify with `bun run lint` + `bun run build`.

**Spec:** `docs/superpowers/specs/2026-11-24-settings-page-design.md`

## Global Constraints

- No new dependencies; no hardcoded colors (tokens only); `@/*` imports.
- i18n en/de/fr in `src/i18n/index.ts`; `general` and `team` keys already exist (do not re-add).
- Never commit unless explicitly asked.
- Do not touch `/users`, mail, contact-center features.

---

### Task 1: Department types, data module, service

**Files:**
- Modify: `src/lib/data/types.ts` (append at end of file)
- Create: `src/lib/data/departments.ts`
- Create: `src/services/department-service.ts`

**Interfaces (produced):**
```ts
export type Department = { id: string; name: string; description: string; head: string; memberCount: number; createdAt: string }
export type DepartmentInput = { name: string; description: string; head: string; memberCount: number }
// departments.ts
listDepartments(): Department[]
createDepartment(input: DepartmentInput): Department
updateDepartment(id: string, input: DepartmentInput): void
removeDepartment(id: string): void
// department-service.ts
export const departmentService: { list(): Department[]; create(i: DepartmentInput): Department; update(id: string, i: DepartmentInput): void; remove(id: string): void }
```

- [ ] Append the two types to `src/lib/data/types.ts`.
- [ ] Create `src/lib/data/departments.ts`:

```ts
import type { Department, DepartmentInput } from './types'

const seed: Department[] = [
  { id: 'DEP-001', name: 'Engineering', description: 'Product engineering and platform', head: 'Rizky Ananda', memberCount: 42, createdAt: 'Jan 12, 2024' },
  { id: 'DEP-002', name: 'Design', description: 'Product and brand design', head: 'Amelia Hart', memberCount: 12, createdAt: 'Jan 12, 2024' },
  { id: 'DEP-003', name: 'Sales', description: 'Revenue and account management', head: 'Dana Wijaya', memberCount: 28, createdAt: 'Feb 03, 2024' },
  { id: 'DEP-004', name: 'Analytics', description: 'Data, reporting and insights', head: 'Noah Patel', memberCount: 9, createdAt: 'Feb 20, 2024' },
  { id: 'DEP-005', name: 'People', description: 'People operations and recruiting', head: 'Ayu Pratama', memberCount: 7, createdAt: 'Mar 01, 2024' },
  { id: 'DEP-006', name: 'Operations', description: 'Business and logistics operations', head: 'Omar Haddad', memberCount: 15, createdAt: 'Mar 18, 2024' },
  { id: 'DEP-007', name: 'Finance', description: 'Accounting and financial planning', head: 'Sofia Reyes', memberCount: 8, createdAt: 'Apr 02, 2024' },
  { id: 'DEP-008', name: 'Customer Success', description: 'Onboarding and customer support', head: 'Isabella Moreau', memberCount: 21, createdAt: 'Apr 22, 2024' },
]

let departments: Department[] = [...seed]
let counter = 8

export function listDepartments(): Department[] {
  return departments
}

export function createDepartment(input: DepartmentInput): Department {
  counter += 1
  const department: Department = {
    ...input,
    id: `DEP-${String(counter).padStart(3, '0')}`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
  }
  departments = [department, ...departments]
  return department
}

export function updateDepartment(id: string, input: DepartmentInput): void {
  departments = departments.map((department) => (department.id === id ? { ...department, ...input } : department))
}

export function removeDepartment(id: string): void {
  departments = departments.filter((department) => department.id !== id)
}
```

- [ ] Create `src/services/department-service.ts` as a thin interface wrapper (mirror `email-service.ts` style).
- [ ] Verify: `bun run lint` and `bun run build`.

---

### Task 2: i18n keys

**Files:** Modify `src/i18n/index.ts`

- [ ] Add to each locale block (append near the settings keys of that locale, keeping the three blocks aligned):
  `settingsDescription`, `departments`, `departmentsDescription`, `addDepartment`, `editDepartment`, `members`, `head`, `departmentCreated`, `departmentUpdated`, `departmentDeleted`, `departmentDeleteConfirm`, `noDepartments`.

Values:
| key | en | de | fr |
|---|---|---|---|
| settingsDescription | Manage your workspace, team and preferences. | Verwalte deinen Workspace, dein Team und deine Einstellungen. | Gérez votre espace de travail, votre équipe et vos préférences. |
| departments | Departments | Abteilungen | Départements |
| departmentsDescription | Organize your team into departments. | Organisiere dein Team in Abteilungen. | Organisez votre équipe en départements. |
| addDepartment | Add department | Abteilung hinzufügen | Ajouter un département |
| editDepartment | Edit department | Abteilung bearbeiten | Modifier le département |
| members | Members | Mitglieder | Membres |
| head | Head | Leitung | Responsable |
| departmentCreated | Department created. | Abteilung erstellt. | Département créé. |
| departmentUpdated | Department updated. | Abteilung aktualisiert. | Département mis à jour. |
| departmentDeleted | Department deleted. | Abteilung gelöscht. | Département supprimé. |
| departmentDeleteConfirm | This department will be permanently removed. | Diese Abteilung wird dauerhaft entfernt. | Ce département sera définitivement supprimé. |
| noDepartments | No departments yet. | Noch keine Abteilungen. | Aucun département pour l’instant. |

- [ ] Confirm each new key appears exactly 3 times: `rg -c "^        <key>:" src/i18n/index.ts`.
- [ ] Verify lint + build.

---

### Task 3: Settings layout, hub and routes

**Files:**
- Create: `src/pages/settings/layout.tsx`
- Create: `src/pages/settings/home.tsx`
- Modify: `src/App.tsx`
- Modify: `src/lib/navigation.ts`

**Interfaces (produced):** `SettingsLayout` default export; `SettingsHome` default export.

- [ ] `layout.tsx`:

```tsx
import { Building2, Bell, CreditCard, Palette, UserRound, Users, type LucideIcon, ArrowRight } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import type { TranslationKey } from '@/i18n'
```

`SettingsCard({ href, icon: Icon, title, description })` module-scope:

```tsx
<Link to={href} className="group">
  <Card className="flex flex-row items-center gap-4 p-4 transition-colors group-hover:bg-accent/50">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="size-5" /></span>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </div>
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"><ArrowRight className="size-4" /></span>
  </Card>
</Link>
```

Layout component:

```tsx
export default function SettingsLayout() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const activeTab = pathname.startsWith('/settings/departments') ? 'team' : pathname === '/settings' ? (params.get('tab') === 'team' ? 'team' : 'general') : 'general'

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('settings')} description={t('settingsDescription')} />
        <Tabs value={activeTab} onValueChange={(value) => navigate(value === 'team' ? '/settings?tab=team' : '/settings')}>
          <TabsList variant="line">
            <TabsTrigger value="general">{t('general')}</TabsTrigger>
            <TabsTrigger value="team">{t('team')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Outlet />
      </main>
    </PageTransition>
  )
}
```

(Cards data lives in `home.tsx`; layout exports nothing else. `TranslationKey`/`cn` imports only if used.)

- [ ] `home.tsx` (hub):

```tsx
import { Bell, Building2, CreditCard, Palette, UserRound, Users } from 'lucide-react'
import { useSearchParams } from 'react-router'
... use SettingsCard? 
```

Export the card local component inside `home.tsx` instead of layout (avoid cross-file coupling): move `SettingsCard` here and have `layout.tsx` not export it.

```tsx
const generalCards = [
  { href: '/settings/profile', icon: UserRound, titleKey: 'profile', descriptionKey: 'profileSettingsDescription' },
  { href: '/settings/appearance', icon: Palette, titleKey: 'appearance', descriptionKey: 'appearanceDescription' },
  { href: '/settings/notifications', icon: Bell, titleKey: 'notifications', descriptionKey: 'notificationsSettingsDescription' },
  { href: '/settings/billing', icon: CreditCard, titleKey: 'billing', descriptionKey: 'billingSettingsDescription' },
] as const
const teamCards = [
  { href: '/users', icon: Users, titleKey: 'users', descriptionKey: 'usersDescription' },
  { href: '/settings/departments', icon: Building2, titleKey: 'departments', descriptionKey: 'departmentsDescription' },
] as const

export default function SettingsHome() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [params] = useSearchParams()
  const cards = params.get('tab') === 'team' ? teamCards : generalCards
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((c) => <SettingsCard key={c.href} {...} />)}</div>
}
```

- [ ] `App.tsx`: import `SettingsLayout`, `SettingsHome`, `SettingsDepartmentsPage`; replace the five settings routes with:

```tsx
{
  path: '/settings',
  element: <SettingsLayout />,
  children: [
    { index: true, element: <SettingsHome /> },
    { path: 'profile', element: <SettingsProfilePage /> },
    { path: 'appearance', element: <SettingsAppearancePage /> },
    { path: 'notifications', element: <SettingsNotificationsPage /> },
    { path: 'billing', element: <SettingsBillingPage /> },
    { path: 'departments', element: <SettingsDepartmentsPage /> },
  ],
},
```

Add `/settings` (already present) and `/settings/departments` to `explicitPaths`.
- [ ] `navigation.ts`: Settings href → `/settings`.
- [ ] Verify lint + build.

---

### Task 4: Departments page

**Files:** Create `src/pages/settings/departments.tsx`

Follow `src/pages/users.tsx` structure but return a fragment-level wrapper (no `PageTransition`/`main`, since layout provides them):

```tsx
<div className="flex flex-col gap-4">
  <div className="flex flex-wrap items-center justify-between gap-2">
    <div>
      <h2 className="text-lg font-semibold">{t('departments')}</h2>
      <p className="text-sm text-muted-foreground">{t('departmentsDescription')}</p>
    </div>
    <Button size="sm" onClick={openCreate}><Plus className="size-4" />{t('addDepartment')}</Button>
  </div>
  <Card className="overflow-hidden py-0">
    <Table>...</Table>
  </Card>
</div>
```

- Table columns: Name (font-medium) + description below (`text-xs text-muted-foreground`), Head, Members (`{memberCount}`), Actions (edit pencil + delete trash icon buttons, `aria-label`).
- Empty state row with `t('noDepartments')` when list is empty.
- Single Dialog reused for create/edit: fields Name (Input), Head (Input), Members (Input type number min 0), Description (Textarea rows 3); validation: name required, members integer ≥ 0; submit calls `departmentService.create/update` + toast + refresh.
- `ConfirmDialog` for delete with `t('delete')`, `t('cancel')`, description `t('departmentDeleteConfirm')`, toast `t('departmentDeleted')`.
- Local state: `items` via `useState(departmentService.list())`, `refresh()`, `createOpen`, `editTarget`, `confirmDelete`, `form`, `errors`.
- Verify lint + build.

---

### Task 5: Strip PageHeader from existing settings pages

**Files:** `src/pages/settings/profile.tsx`, `appearance.tsx`, `notifications.tsx`, `billing.tsx`

- [ ] Remove `PageHeader` import and usage; remove `PageTransition` import/wrapper and `<main>` wrapper. Return a single `<div className="flex flex-col gap-6">` containing the compact heading and existing cards:

```tsx
<div className="flex flex-col gap-6">
  <div className="flex flex-wrap items-start justify-between gap-2">
    <div>
      <h2 className="text-lg font-semibold">{t('appearance')}</h2>
      <p className="text-sm text-muted-foreground">{t('appearanceDescription')}</p>
    </div>
    <Button variant="outline" onClick={preferences.resetPreferences}><RotateCcw className="size-4" />{t('reset')}</Button>
  </div>
  <div className="grid gap-4 lg:grid-cols-2"> ...existing cards... </div>
</div>
```

Apply the same pattern to profile (`h2 t('profile')` + description, card unchanged), notifications, billing (keep the Upgrade link).
- [ ] Fix imports (`PageHeader`, `PageTransition` removal); `noUnusedLocals` will fail on leftovers.
- [ ] Verify lint + build.

---

### Task 6: Browser verification

- [ ] `bun run dev -- --host 0.0.0.0 --port 5173`, log in with `demo@example.com` / `AteraDemo2026!`.
- [ ] `/settings`: General tab active, 4 cards; Team tab → `?tab=team` with 2 cards; reload keeps the tab; back/forward works.
- [ ] Every card navigates; child pages show the Settings header + tab bar, no duplicate title.
- [ ] `/settings/departments`: 8 rows; create (new row + toast), edit (row updated), delete (row gone + toast), validation blocks empty name.
- [ ] Settings nav item is active on `/settings`, `/settings/*`.
- [ ] Shut down the dev server.

## Self-Review Notes

- `general`/`team` i18n keys already exist — Task 2 must not re-add them.
- `Profile` card description reuses `profileSettingsDescription`; all other descriptions reuse existing `*SettingsDescription`/`*Description` keys.
- Task 3 `home.tsx` owns `SettingsCard`; `layout.tsx` must not import it.
- Children must not render `PageTransition`/`main` (nested main/duplicate padding).
- No commits in any task (repo rule: commit only when asked).
