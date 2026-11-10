# Mini Widgets, Empty States & Search Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three reusable pieces to the Atera dashboard: mini widget components (sparkline card, progress-ring card, KPI delta card), a reusable empty-state component wired into `DataTable`, and a global search results page at `/search`.

**Architecture:** All components follow existing repo patterns: in-memory mock data from `src/lib/data/*`, shadcn-style primitives from `src/components/ui/`, `PageHeader` + `PageTransition` page shells, i18n keys in the hand-rolled `src/i18n/index.ts` translations object (en/de/fr), theming via design tokens in `src/app.css` (including the existing `--color-status-*` and `--color-chart-*` tokens). No new dependencies — sparkline uses recharts (already used), progress ring uses plain SVG.

**Tech Stack:** React 19, TypeScript (strict, `noUnusedLocals`), Tailwind CSS v4, recharts, lucide-react, react-router v8, Bun.

**Spec:** docs/superpowers/plans/2026-11-10-mini-widgets-empty-states-search.md (this plan was produced from the in-chat design; error pages were dropped — they already exist in `src/pages/errors/` with routes wired).

## Global Constraints

- Package manager is **Bun**: run `bun run lint` and `bun run build` for verification (no test framework exists — do NOT invent one).
- Imports use `@/*` alias for `src/`.
- No comments in code. Strict TS must pass (`tsc -b` runs inside `bun run build`).
- Colors: use design tokens only (`text-muted-foreground`, `bg-status-success/10`, `text-chart-2`, etc.). No raw Tailwind palette classes like `emerald-500`.
- i18n: every user-facing string needs a key in **all three** languages (en/de/fr) inside `src/i18n/index.ts`, added to the `translations` object near related keys. TypeScript infers keys from the `en` block.
- Pages: default export, wrapped in `<PageTransition>` + `<PageHeader>` with `breadcrumbs` prop.
- Commits only when a task says so; never commit unrelated working-tree changes (there are many unrelated modified/untracked files — always `git add` explicit paths).

---

### Task 1: Mini widgets — SparklineCard, ProgressRingCard, KpiDeltaCard

**Files:**
- Create: `src/components/widgets/mini-widgets.tsx`
- Modify: `src/pages/widgets.tsx` (add a "Mini widgets" section)

**Interfaces:**
- Consumes: `getChartColor` from `@/components/charts/chart-config` (returns `var(--chart-N)`), `Card`/`CardContent`/`CardHeader`/`CardDescription` from `@/components/ui/card`, `cn` from `@/lib/utils`, `type LucideIcon` from `lucide-react`.
- Produces (used by Task 4's demo page and reusable later):
  - `export type SparklineCardProps = { title: string; value: string; data: { value: number }[]; colorIndex?: number; className?: string }` and `export function SparklineCard(props: SparklineCardProps)`
  - `export type ProgressRingCardProps = { title: string; value: number; label: string; colorIndex?: number; className?: string }` and `export function ProgressRingCard(props: ProgressRingCardProps)`
  - `export type KpiDeltaCardProps = { title: string; value: string; delta: number; suffix?: string; className?: string }` and `export function KpiDeltaCard(props: KpiDeltaCardProps)`

- [ ] **Step 1: Create `src/components/widgets/mini-widgets.tsx`**

```tsx
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { getChartColor } from '@/components/charts/chart-config'
import { cn } from '@/lib/utils'

export type SparklineCardProps = {
  title: string
  value: string
  data: { value: number }[]
  colorIndex?: number
  className?: string
}

export function SparklineCard({ title, value, data, colorIndex = 0, className }: SparklineCardProps) {
  const color = getChartColor(colorIndex)
  return (
    <Card className={cn('gap-3 overflow-hidden py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <div className="-mx-5 -mb-5">
          <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <Area dataKey="value" type="monotone" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export type ProgressRingCardProps = {
  title: string
  value: number
  label: string
  colorIndex?: number
  className?: string
}

export function ProgressRingCard({ title, value, label, colorIndex = 0, className }: ProgressRingCardProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const circumference = 2 * Math.PI * 42
  const color = getChartColor(colorIndex)
  return (
    <Card className={cn('gap-3 py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative size-28">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - clamped / 100)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tracking-tight">{clamped}%</span>
        </div>
      </CardContent>
    </Card>
  )
}

export type KpiDeltaCardProps = {
  title: string
  value: string
  delta: number
  suffix?: string
  className?: string
}

export function KpiDeltaCard({ title, value, delta, suffix, className }: KpiDeltaCardProps) {
  const positive = delta >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <Card className={cn('gap-3 py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            positive ? 'bg-status-success/10 text-status-success' : 'bg-destructive/10 text-destructive'
          )}
        >
          <Icon className="size-3" />
          {positive ? '+' : ''}{delta}%{suffix ? ` ${suffix}` : ''}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Add "Mini widgets" section to `src/pages/widgets.tsx`**

Import the three components and insert a new section between the "statCards" section and the "progressBars" section:

```tsx
import { ProgressRingCard, SparklineCard, KpiDeltaCard } from '@/components/widgets/mini-widgets'
```

```tsx
const sparkData = [
  { value: 12 }, { value: 18 }, { value: 15 }, { value: 24 },
  { value: 21 }, { value: 32 }, { value: 29 }, { value: 38 },
]
```

```tsx
<section className="space-y-3">
  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('miniWidgets')}</h2>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <SparklineCard title={t('weeklyVisitors')} value="12,847" data={sparkData} />
    <SparklineCard title={t('newSignups')} value="1,204" data={[...sparkData].reverse()} colorIndex={1} />
    <ProgressRingCard title={t('storageUsed')} value={72} label="840 GB / 1 TB" colorIndex={2} />
    <KpiDeltaCard title={t('conversionRate')} value="4.6%" delta={12.5} />
  </div>
</section>
```

- [ ] **Step 3: Add i18n keys to `src/i18n/index.ts`**

In the `en` block (near the widgets keys, e.g. after `statCards`), the `de` block (line ~684 area), and the `fr` block (line ~1360 area), add:

| key | en | de | fr |
|---|---|---|---|
| `miniWidgets` | `Mini widgets` | `Mini-Widgets` | `Mini widgets` |
| `weeklyVisitors` | `Weekly visitors` | `Wöchentliche Besucher` | `Visiteurs hebdomadaires` |
| `newSignups` | `New signups` | `Neue Registrierungen` | `Nouvelles inscriptions` |
| `conversionRate` | `Conversion rate` | `Konversionsrate` | `Taux de conversion` |

(`storageUsed` already exists.)

- [ ] **Step 4: Verify**

Run: `bun run lint && bun run build`
Expected: lint passes (pre-existing warnings ok), build exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/widgets/mini-widgets.tsx src/pages/widgets.tsx src/i18n/index.ts
git commit -m "feat: add sparkline, progress ring, and KPI delta mini widgets"
```

---

### Task 2: Reusable EmptyState component + presets

**Files:**
- Create: `src/components/shared/empty-state.tsx`
- Modify: `src/components/shared/data-table.tsx` (replace the two `t('noMatches')` fallbacks)

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`, `type LucideIcon` from `lucide-react`, `Button` from `@/components/ui/button`.
- Produces (used by Task 2's own integration and Task 3):
  - `export type EmptyStateProps = { icon?: LucideIcon; title: string; description?: string; action?: React.ReactNode; className?: string }` and `export function EmptyState(props: EmptyStateProps)`
  - `export function EmptyTableState({ onClear }: { onClear?: () => void })` — preset: `ListX` icon, i18n `noMatches` title, "Clear filter" action button when `onClear` given.
  - `export function NoSearchResultsState({ query }: { query?: string })` — preset: `SearchX` icon, i18n `noSearchResults` title, description includes `query` when given, i18n `noSearchResultsDescription`.

- [ ] **Step 1: Create `src/components/shared/empty-state.tsx`**

```tsx
import { ListX, SearchX, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

export type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyTableState({ onClear }: { onClear?: () => void }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <EmptyState
      icon={ListX}
      title={t('noMatches')}
      action={onClear ? <Button variant="outline" size="sm" onClick={onClear}>{t('clear')}</Button> : undefined}
    />
  )
}

export function NoSearchResultsState({ query }: { query?: string }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <EmptyState
      icon={SearchX}
      title={t('noSearchResults')}
      description={query ? t('noSearchResultsFor', query) : t('noSearchResultsDescription')}
    />
  )
}
```

- [ ] **Step 2: Wire `EmptyTableState` into `src/components/shared/data-table.tsx`**

Add import: `import { EmptyTableState } from '@/components/shared/empty-state'`.

Replace the desktop empty row fallback `{t('noMatches')}` cell content with `<EmptyTableState onClear={filter ? () => { setFilter(''); setPage(1) } : undefined} />`.

Replace the mobile empty fallback `<p className="py-8 text-center text-sm text-muted-foreground">{t('noMatches')}</p>` with `<EmptyTableState onClear={filter ? () => { setFilter(''); setPage(1) } : undefined} />`.

- [ ] **Step 3: Add i18n keys to `src/i18n/index.ts`** (en/de/fr, near the existing `noMatches` key)

| key | en | de | fr |
|---|---|---|---|
| `noSearchResults` | `No results found` | `Keine Ergebnisse gefunden` | `Aucun résultat trouvé` |
| `noSearchResultsFor` | (function-style) `No results for "{query}"` | `Keine Ergebnisse für "{query}"` | `Aucun résultat pour « {query} »` |
| `noSearchResultsDescription` | `Try a different keyword or check the spelling.` | `Versuchen Sie ein anderes Stichwort oder prüfen Sie die Schreibweise.` | `Essayez un autre mot-clé ou vérifiez l'orthographe.` |

verified: `useTranslations` is `(key: TranslationKey) => string` — **no parameter support**. Use template concatenation for dynamic strings (e.g. `` `${t('noSearchResultsFor')} "${query}"` ``); no interpolation machinery exists.

- [ ] **Step 4: Verify**

Run: `bun run lint && bun run build`
Expected: lint passes, build exit 0. Manually spot-check a table page (e.g. `/orders`) with a nonsense filter string shows the new empty state with a working Clear button.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/empty-state.tsx src/components/shared/data-table.tsx src/i18n/index.ts
git commit -m "feat: add reusable EmptyState component and wire into DataTable"
```

---

### Task 3: Global search results page at `/search`

**Files:**
- Create: `src/pages/search.tsx`
- Modify: `src/App.tsx` (route), `src/components/app-sidebar-header.tsx` (command dialog → include data results linking to `/search?q=`)

**Interfaces:**
- Consumes: `listOrders` from `@/lib/data/orders`, `listProducts` from `@/lib/data/products`, `listCustomers` from `@/lib/data/customers`, `listInvoices` from `@/lib/data/invoices`, `listUsers` from `@/lib/data/users` (verify exact export names in each file before use — pattern is `listX`); types `Order`, `Product`, `Customer`, `Invoice`, `User` from `@/lib/data/types`; `NoSearchResultsState` from Task 2; `PageHeader`, `PageTransition`; `Badge` from `@/components/ui/badge`; `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
- Produces: route `/search?q=<query>`. The `searchNavigationItems` helper `buildSearchSections(query: string): SearchSection[]` exported from `src/pages/search.tsx` is used only internally but kept exported for reuse.

- [ ] **Step 1: Create `src/pages/search.tsx`**

Read the actual type fields from `src/lib/data/types.ts` before writing (Order: id/customer/product/amount/status/date; Product: id/name/category/price/status; Customer: id/name/email/company; Invoice: id/customer/amount/dueDate; User: id/name/email/role — verify). The page:

```tsx
import { useSearchParams } from 'react-router'
import { Link } from 'react-router'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { NoSearchResultsState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listOrders } from '@/lib/data/orders'
import { listProducts } from '@/lib/data/products'
import { listCustomers } from '@/lib/data/customers'
import { listInvoices } from '@/lib/data/invoices'
import { listUsers } from '@/lib/data/users'

const MAX_PER_SECTION = 5

const matches = (query: string, fields: (string | number | undefined)[]) => {
  const q = query.toLowerCase()
  return fields.some((field) => field !== undefined && String(field).toLowerCase().includes(q))
}

export type SearchSection = {
  key: string
  label: string
  href: string
  items: { id: string; title: string; subtitle: string; href: string }[]
}

export function buildSearchSections(query: string): SearchSection[] {
  const q = query.trim()
  if (!q) return []
  const sections: SearchSection[] = [
    {
      key: 'orders', label: 'Orders', href: '/orders',
      items: listOrders().filter((o) => matches(q, [o.id, o.customer, o.product, o.status])).slice(0, MAX_PER_SECTION)
        .map((o) => ({ id: o.id, title: `${o.id} — ${o.customer}`, subtitle: `${o.product} · $${o.amount}`, href: `/orders/${o.id}` })),
    },
    {
      key: 'products', label: 'Products', href: '/products',
      items: listProducts().filter((p) => matches(q, [p.name, p.category, p.status])).slice(0, MAX_PER_SECTION)
        .map((p) => ({ id: p.id, title: p.name, subtitle: p.category, href: `/products/${p.id}` })),
    },
    {
      key: 'customers', label: 'Customers', href: '/customers',
      items: listCustomers().filter((c) => matches(q, [c.name, c.email, c.company])).slice(0, MAX_PER_SECTION)
        .map((c) => ({ id: c.id, title: c.name, subtitle: c.company, href: `/customers/${c.id}` })),
    },
    {
      key: 'invoices', label: 'Invoices', href: '/invoices',
      items: listInvoices().filter((i) => matches(q, [i.id, i.customer])).slice(0, MAX_PER_SECTION)
        .map((i) => ({ id: i.id, title: i.id, subtitle: `${i.customer} · $${i.amount}`, href: '/invoices' })),
    },
    {
      key: 'users', label: 'Users', href: '/users',
      items: listUsers().filter((u) => matches(q, [u.name, u.email])).slice(0, MAX_PER_SECTION)
        .map((u) => ({ id: u.id, title: u.name, subtitle: u.email, href: '/users' })),
    },
  ]
  return sections.filter((section) => section.items.length > 0)
}

export default function SearchPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const sections = buildSearchSections(query)
  const total = sections.reduce((sum, section) => sum + section.items.length, 0)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('searchResults')} description={query ? t('searchResultsFor', query) : t('searchResultsDescription')} breadcrumbs={[{ label: t('searchResults') }]} />
        {query && total === 0 && <NoSearchResultsState query={query} />}
        {(!query || total > 0) && (
          <div className="mx-auto w-full max-w-3xl space-y-4">
            {!query && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted"><Search className="size-6 text-muted-foreground" /></div>
                <p className="text-sm text-muted-foreground">{t('searchPrompt')}</p>
              </div>
            )}
            {sections.map((section) => (
              <Card key={section.key} className="shadow-none">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-sm">{section.label}</CardTitle>
                  <Badge variant="secondary">{section.items.length}</Badge>
                </CardHeader>
                <CardContent className="divide-y">
                  {section.items.map((item) => (
                    <Link key={item.id} to={item.href} className="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-foreground">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </PageTransition>
  )
}
```

Adjust field names to the real types in `src/lib/data/types.ts` (verified exports: `listOrders`, `listProducts`, `listCustomers`, `listInvoices`, `listUsers`). Verified `PageHeader`'s breadcrumbs prop: `breadcrumbs?: BreadcrumbItem[]` from `@/types` where `BreadcrumbItem = { title: string; href: string }` (both required — use `{ title: t('searchResults'), href: '/search' }`). `useTranslations` takes NO second argument (verified) — use concatenation for the `searchResultsFor` line: `description={query ? `${t('searchResultsFor')} "${query}"` : t('searchResultsDescription')}`.

- [ ] **Step 2: Register the route in `src/App.tsx`**

Add import: `import SearchPage from '@/pages/search'`. Add route inside the ProtectedLayout children array, before the placeholderRoutes spread: `{ path: '/search', element: <SearchPage /> },`. Add `'/search'` to the `explicitPaths` set so the placeholder generator skips it.

- [ ] **Step 3: Link the command dialog to `/search`**

In `src/components/app-sidebar-header.tsx`, after the `navigationItems.map(...)` list inside the `<CommandList>`, append data results. Simplest robust approach: reuse `buildSearchSections` from the new page:

```tsx
import { buildSearchSections } from '@/pages/search'
```

Inside `CommandList`, after the navigationItems block, render:

```tsx
{searchValue.trim() && buildSearchSections(searchValue).map((section) => (
    <CommandItem key={section.key} value={`data-${section.key}-${section.items[0]?.title ?? ''}`} onSelect={() => { setSearchOpen(false); navigate(`/search?q=${encodeURIComponent(searchValue)}`) }}>
        <SearchIcon className="size-4" />
        {t('searchResultsForLabel')}: “{searchValue}” · {section.label}
    </CommandItem>
))}
```

Track the input value: the `CommandInput` is uncontrolled — add `const [searchValue, setSearchValue] = useState('')` and `<CommandInput value={searchValue} onValueChange={setSearchValue} placeholder={t('searchPages')} />` (shadcn `CommandInput` forwards `value`/`onValueChange`). Reset `setSearchValue('')` when the dialog closes (`onOpenChange`). `SearchIcon` is already imported there as `Search` — check the existing import name and reuse it.

i18n key (en/de/fr, near `searchPages`):

| key | en | de | fr |
|---|---|---|---|
| `searchResultsForLabel` | `Search in data` | `In Daten suchen` | `Rechercher dans les données` |

Also add Task 3's page keys in the same edit (all three languages, near `searchPages`):

| key | en | de | fr |
|---|---|---|---|
| `searchResults` | `Search results` | `Suchergebnisse` | `Résultats de recherche` |
| `searchResultsFor` | (param or concat) `Results for “{query}”` | `Ergebnisse für „{query}“` | `Résultats pour « {query} »` |
| `searchResultsDescription` | `Matches across orders, products, customers, invoices, and users.` | `Treffer in Bestellungen, Produkten, Kunden, Rechnungen und Benutzern.` | `Correspondances dans les commandes, produits, clients, factures et utilisateurs.` |
| `searchPrompt` | `Type a query in the search bar to find orders, products, customers, invoices, and users.` | `Geben Sie in der Suchleiste einen Begriff ein, um Bestellungen, Produkte, Kunden, Rechnungen und Benutzer zu finden.` | `Saisissez une requête dans la barre de recherche pour trouver commandes, produits, clients, factures et utilisateurs.` |

- [ ] **Step 4: Verify**

Run: `bun run lint && bun run build`
Expected: lint passes, build exit 0. With dev server running (`bun run dev`), manually verify:
1. `/search` with no `q` shows the prompt state.
2. `/search?q=martin` shows grouped sections (Orders/Customers depending on mock data) and links work.
3. `/search?q=zzzz` shows `NoSearchResultsState`.
4. ⌘K dialog typing a data term shows the "Search in data" item navigating to `/search?q=`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/search.tsx src/App.tsx src/components/app-sidebar-header.tsx src/i18n/index.ts
git commit -m "feat: add global search results page and wire into command dialog"
```

---

## Self-Review Notes

- Error pages: dropped from scope — already implemented in `src/pages/errors/` + `ErrorPageTemplate` + routes in `App.tsx` (verified).
- Type consistency: `SearchSection` shape is defined once in Task 3 and consumed only there + `app-sidebar-header` (which only uses `.key`, `.label`, and navigates to `/search?q=` — it does not read items' fields except `items[0]?.title`, safe on empty).
- `useTranslations(key)` takes no parameters (verified at `src/i18n/index.ts:2036-2038`) — Tasks 2 and 3 use concatenation for dynamic strings.
- No placeholders: all component code is given in full; all i18n keys have exact strings for en/de/fr.
