# Repository Guidelines

## Project Overview

Atera is a mock-data admin dashboard SPA — a Atera admin dashboard template built on React 19, TypeScript 7, and Vite 8. It is frontend-only: no backend, no network calls, and no data-fetching layer. All data is in-memory mock modules; auth is localStorage-based.

## Architecture & Data Flow

**Routing** — `src/App.tsx` builds the route tree with `createBrowserRouter` (react-router v8) and an inline 404 catch-all.

- `/` public home
- Auth routes under `src/layouts/auth-layout.tsx`: login, sign-up, forgot/reset password, 2FA, verify-email, lock-screen
- App routes under `src/layouts/protected-layout.tsx` (guard → `Navigate` to `/login`): dashboard, analytics, orders, products, customers, ecommerce/crm/saas variants, charts, invoices, billing/pricing, mail, chat, files, kanban, calendar, wizard, profile, users, notifications, settings
- Nav items without explicit routes fall back to `AppPlaceholder` via computed `placeholderRoutes`

**State** — no Redux/Zustand/Context. Hand-rolled external stores consumed via `useSyncExternalStore`:

- Session: `src/hooks/use-auth.ts` + `src/lib/auth.ts` (localStorage; demo account `demo@example.com` / `AteraDemo2026!`)
- Appearance: `src/hooks/use-appearance.tsx` (light/dark/system; localStorage + cookie; toggles `.dark` class)
- Preferences: `src/hooks/use-customize-preferences.tsx` (color/density/layout/container/language; `customize_*` cookies; applied as `data-*` attributes on `<html>` plus `--density-space` CSS var)

**Data flow** — pages import from typed service interfaces in `src/services/*` (thin wrappers over `src/lib/data/*`). Backend swap = write one new service per domain; no page changes.

**Theme/customization** — `src/main.tsx` calls `initializeTheme()` and `initializeCustomizePreferences()` before render. Design tokens live in `src/app.css` as a Tailwind v4 `@theme` block (oklch CSS vars, shadcn palette) plus `[data-color='zinc'|'blue'|...]` presets and `.dark` variants. Layout preference (sidebar vs top-nav) selects the component in `src/layouts/app-layout.tsx`.

**i18n** — `src/i18n/index.ts`: hand-rolled `translations` object (en/de/fr), consumed via `useTranslations(language)`; language sets `document.documentElement.lang`.

## Key Directories

| Path | Purpose |
|---|---|
| `src/pages/` | Route screens (default-export pages; `commerce.tsx`, `workspaces.tsx`, `auth-pages.tsx` are multi-page files with named exports) |
| `src/layouts/` | Shells: `protected-layout`, `auth-layout`, `app-layout` (picks header vs sidebar layout) |
| `src/components/ui/` | shadcn-style Radix primitives (49 components) — button, card, dialog, select, input, sheet, sidebar, command, dropdown-menu, tooltip, avatar, badge, breadcrumb, separator, skeleton, checkbox, table, tabs, accordion, alert, etc. |
| `src/components/shared/` | Cross-cutting pieces: `data-table.tsx`, `page-header.tsx`, `page-transition.tsx`, `scroll-to-top.tsx`, `stat-card.tsx`, `auth-controls.tsx`, `date-picker.tsx`, `empty-state.tsx` |
| `src/components/dashboard/` | Dashboard widgets (metric-card, overview-chart, traffic-sources, goals-card, activity-card, recent-orders) |
| `src/components/` (root) | App chrome: sidebar, header, breadcrumbs, nav, logo |
| `src/hooks/` | Custom hooks (auth, appearance, preferences, mobile, navigation) |
| `src/lib/` | `utils.ts`, `auth.ts`, `navigation.ts`, `data/` (mock repositories) |
| `src/services/` | Thin typed service layer over `src/lib/data/*` — 20 services for easy backend integration |
| `src/i18n/` | Translation dictionary + `useTranslations` |
| `docs/superpowers/` | Design spec and implementation plan Atera |

## Development Commands

Package manager is **Bun** (`bun.lock`); all commands use `bun run <script>`.

```bash
bun install        # install dependencies
bun run dev        # Vite dev server
bun run lint       # oxlint (react/typescript/oxc plugins)
bun run build      # tsc -b && vite build (type-check + production build)
bun run preview    # preview the production build
```

## Code Conventions & Common Patterns

- **Imports**: use `@/*` alias for anything in `src/` (wired in both `vite.config.ts` and `tsconfig.app.json`; `@/` does not resolve in `tsconfig.node.json`).
- **Styling**: Tailwind CSS v4 with zero JS config — tokens live entirely in `src/app.css`. Merge class names with `cn()` from `@/lib/utils.ts`; use `class-variance-authority` for component variants (see `components/ui/button.tsx`).
- **UI**: build on the Radix-based primitives in `src/components/ui/` before adding another component system. Icons: lucide-react. Charts: recharts. Animations: framer-motion + tw-animate-css.
- **Forms**: react-hook-form + zod schemas with `zodResolver` (see `src/pages/commerce.tsx` for the pattern). Simple cases use plain controlled inputs.
- **Pages**: default-export the route component; wrap content in `PageTransition` + `PageHeader` (with `breadcrumbs` prop).
- **State**: `useState` locally; shared state via a `useSyncExternalStore` store (copy the `use-auth.ts`/`lib/auth.ts` pattern). No global state library.
- **Data**: prefer importing from `src/services/*`; add new modules in `src/lib/data/*` and corresponding services.
- **Hooks**: rules-of-hooks enforced as an error by oxlint; colocate shared hooks in `src/hooks/`.

## Important Files

| File | Role |
|---|---|
| `src/main.tsx` | Entry: theme/customization init, `TooltipProvider`, router render |
| `src/App.tsx` | Full route table + 404 |
| `src/app.css` | Tailwind v4 `@theme` tokens, color presets, density vars (source of truth for theming) |
| `src/lib/navigation.ts` | Navigation item tree (group, icon, href, translationKey, badge) |
| `src/services/` | **Service layer** — typed interfaces for backend swap (order-service, product-service, etc.) |
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

No test framework is configured — do not invent a test command. Verification order:

1. `bun run lint`
2. `bun run build`

For route changes, manually verify `/`, `/login`, and `/dashboard` with the Vite dev server when practical. Demo login: `demo@example.com` / `AteraDemo2026!`.
