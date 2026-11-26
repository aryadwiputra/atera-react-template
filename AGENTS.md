# Repository Guidelines

## Project Overview

Atera is a local-first admin dashboard SPA built on React 19, TypeScript 7, and Vite 8. It is frontend-only: no backend and no network calls. Orders persist in IndexedDB through Dexie and are read with TanStack Query; other domains remain in-memory mock modules. Auth is localStorage-based.

## Architecture & Data Flow

**Routing** — `src/App.tsx` builds the route tree with `createBrowserRouter` (react-router v8) and an inline 404 catch-all.

- `/` public home
- Auth routes under `src/layouts/auth-layout.tsx`: login, sign-up, forgot/reset password, 2FA, verify-email, lock-screen
- App routes under `src/layouts/protected-layout.tsx` (guard → `Navigate` to `/login`): dashboard, analytics, orders, products, customers, ecommerce/crm/saas variants, charts, invoices, billing/pricing, mail, chat, files, kanban, calendar, wizard, profile, users, notifications, settings
- Nav items without explicit routes fall back to `AppPlaceholder` via computed `placeholderRoutes`

**State** — no Redux/Zustand. Hand-rolled external stores consumed via `useSyncExternalStore`, plus TanStack Query for persisted server-state:

- Session: `src/hooks/use-auth.ts` + `src/lib/auth.ts` (localStorage; demo account `demo@example.com` / `AteraDemo2026!`)
- Appearance: `src/hooks/use-appearance.tsx` (light/dark/system; localStorage + cookie; toggles `.dark` class)
- Preferences: `src/hooks/use-customize-preferences.tsx` (accent/neutral/radius/font/density/layout/sidebar/sidebarWidth/header/container/chart/motion/language; localStorage `atera_theme` with cookie bootstrap and FOUC script; applied as `data-*` attributes on `<html>`)
- Orders: TanStack Query in `src/features/orders/api.ts` over the repository layer; mutations are optimistic with rollback.

**Data flow** — Orders: `src/features/orders/api.ts` → `src/services/order-service.ts` → `src/repositories/*` → `src/lib/db/database.ts` (Dexie). Other domains: pages → `src/services/*` → `src/lib/data/*` mock modules. Backend swap = replace the repository adapter.

**Theme/customization** — `src/main.tsx` calls `initializeTheme()` and `initializeCustomizePreferences()` before render. Design tokens live in `src/app.css` as a Tailwind v4 `@theme` block (oklch CSS vars, shadcn palette) with `[data-accent]`, `[data-neutral]`, `[data-radius]`, `[data-font]`, `[data-density]`, `[data-sidebar]`, `[data-header]`, `[data-container]`, `[data-chart]`, and `[data-motion]` variants plus `.dark` overrides. Layout preference selects the shell in `src/layouts/app-layout.tsx`; Theme Studio is a lazy right-hand sheet.

**i18n** — `src/i18n/index.ts`: English is static; German and French dictionaries load on demand into a `useSyncExternalStore` locale store, consumed via `useTranslations(language)` with English fallback; language sets `document.documentElement.lang`.

## Key Directories

| Path | Purpose |
|---|---|
| `src/pages/` | Route screens (default-export pages; `commerce.tsx`, `workspaces.tsx`, `auth-pages.tsx` are multi-page files with named exports) |
| `src/layouts/` | Shells: `protected-layout`, `auth-layout`, `app-layout` (picks header vs sidebar layout) |
| `src/components/ui/` | shadcn-style Radix primitives (48 components) — button, card, dialog, select, input, sheet, sidebar, command, dropdown-menu, tooltip, avatar, badge, breadcrumb, separator, skeleton, checkbox, table, tabs, accordion, alert, etc. |
| `src/components/shared/` | Cross-cutting pieces: `data-table.tsx`, `page-header.tsx`, `page-transition.tsx`, `scroll-to-top.tsx`, `stat-card.tsx`, `auth-controls.tsx`, `date-picker.tsx`, `empty-state.tsx` |
| `src/components/dashboard/` | Dashboard widgets (metric-card, overview-chart, traffic-sources, goals-card, activity-card, recent-orders) |
| `src/components/` (root) | App chrome: sidebar, header, breadcrumbs, nav, logo |
| `src/hooks/` | Custom hooks (auth, appearance, preferences, mobile, navigation) |
| `src/lib/` | `utils.ts`, `auth.ts`, `navigation.ts`, `query-client.ts`, `data/` (mock modules), `db/` (Dexie schema, seed, export/import) |
| `src/services/` | Thin typed service layer — 20 services; `order-service` now persists through `src/repositories/*` |
| `src/features/` | Domain modules; `orders/api.ts` holds query keys, queries, and optimistic mutations |
| `src/repositories/` | Persistence interfaces + Dexie adapter (`orders-repository`, `dexie-orders-repository`) |
| `src/i18n/` | Static English dictionary + lazy de/fr locales + `useTranslations` |
| `docs/superpowers/` | Design spec and implementation plan Atera |

## Development Commands

Package manager is **Bun** (`bun.lock`); all commands use `bun run <script>`.

```bash
bun install        # install dependencies
bun run dev        # Vite dev server
bun run lint       # oxlint (react/typescript/oxc plugins)
bun run typecheck  # tsc -b
bun run test       # vitest run
bun run test:e2e   # playwright (chromium full, firefox/webkit smoke, visual/a11y)
bun run build      # tsc -b && vite build (type-check + production build)
bun run perf:budget # enforce initial-payload gzip budgets
bun run preview    # preview the production build
```

## Code Conventions & Common Patterns

- **Imports**: use `@/*` alias for anything in `src/` (wired in both `vite.config.ts` and `tsconfig.app.json`; `@/` does not resolve in `tsconfig.node.json`).
- **Styling**: Tailwind CSS v4 with zero JS config — tokens live entirely in `src/app.css`. Merge class names with `cn()` from `@/lib/utils.ts`; use `class-variance-authority` for component variants (see `components/ui/button.tsx`).
- **UI**: build on the Radix-based primitives in `src/components/ui/` before adding another component system. Icons: lucide-react. Charts: recharts. Animations: framer-motion + tw-animate-css.
- **Forms**: react-hook-form + zod schemas with `zodResolver` (see `src/pages/commerce.tsx` for the pattern). Simple cases use plain controlled inputs.
- **Pages**: default-export the route component; wrap content in `PageTransition` + `PageHeader` (with `breadcrumbs` prop).
- **State**: `useState` locally; shared UI state via a `useSyncExternalStore` store (copy the `use-auth.ts`/`lib/auth.ts` pattern); persisted domain state via TanStack Query + repositories. No global state library.
- **Data**: prefer importing from `src/services/*`; add new mock modules in `src/lib/data/*` and corresponding services. For persisted domains, add a repository adapter and feature query hooks.
- **Hooks**: rules-of-hooks enforced as an error by oxlint; colocate shared hooks in `src/hooks/`.

## Important Files

| File | Role |
|---|---|
| `src/main.tsx` | Entry: theme init, `QueryClientProvider`, tooltip/toast providers, error boundary, service worker, vitals |
| `src/App.tsx` | Full lazy route table + 404 |
| `src/app.css` | Tailwind v4 `@theme` tokens, accent/neutral presets, density/sidebar/motion vars (source of truth for theming) |
| `src/lib/navigation.ts` | Navigation item tree (group, icon, href, translationKey, badge) |
| `src/services/` | **Service layer** — typed interfaces for backend swap (order-service, product-service, etc.) |
| `src/lib/db/database.ts` | Dexie schema, seed, export/import/reset (orders + meta) |
| `src/repositories/` | Repository interfaces and the Dexie adapter |
| `scripts/check-bundle.mjs` | gzip budget gate for the initial payload (`bun run perf:budget`) |
| `vite.config.ts` | `react()` + `tailwindcss()` plugins, `@` alias |
| `tsconfig.app.json` | Strict app config (`src/` only, `noUnusedLocals`/`noUnusedParameters`, `verbatimModuleSyntax`) |
| `.oxlintrc.json` | Lint rules |
| `docs/superpowers/specs/`, `docs/superpowers/plans/` | Design spec + implementation plan |
| `/docs` | In-app documentation page (architecture, data layer, components, theming, i18n, adding pages) |

## Runtime/Tooling Preferences

- **Runtime**: Bun for package management and scripts; Node for the Vite toolchain itself.
- **Toolchain**: Vite 8 + `@vitejs/plugin-react`; do not add framework-level dependencies without need.
- **Tailwind**: keep the v4 `@tailwindcss/vite` setup — no `tailwind.config.js`, no PostCSS config. Do not add a separate Tailwind config unless required.
- **TypeScript**: strict mode with no-unused checks must pass; `tsc -b` runs in the build script.
- **Env vars**: standard Vite handling — `import.meta.env.VITE_*` (`vite/client` types included). No `.env` files exist.

## Testing & QA

Vitest + Testing Library and Playwright (E2E + critical a11y via axe) are configured. Verification order:

1. `bun run lint`
2. `bun run typecheck`
3. `bun run test`
4. `bun run build`
5. `bun run perf:budget`
6. `bun run test:e2e` (install once with `bunx playwright install chromium firefox webkit`)

The a11y suite fails on **serious or critical** WCAG A/AA violations for `/`, `/login`, `/dashboard`, and `/orders`. Run `bun run format:check` before committing formatting changes. CI runs the same checks in `.github/workflows/ci.yml`.

For route changes, manually verify `/`, `/login`, and `/dashboard` with the Vite dev server when practical. Demo login: `demo@example.com` / `AteraDemo2026!`.
