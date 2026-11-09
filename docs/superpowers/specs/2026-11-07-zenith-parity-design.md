# Atera Zenith Parity Design

**Date:** 2026-11-07
**Status:** Approved
**Reference:** https://zenith.dashboardpack.com/dashboard

## Goal

Expand the current Atera Vite + React SPA into a functional mock-data admin template with the page coverage and interaction patterns of Zenith Dashboard, while preserving Atera branding and the existing React Router architecture.

## Scope

The implementation covers five dashboards (overview, analytics, eCommerce, CRM, SaaS), commerce CRUD pages, app pages, settings/system pages, complete auth UI flows, error/status pages, charts, data tables, forms, responsive layouts, theme preferences, and full EN/DE/FR translations.

The app remains a frontend-only SPA. Data persistence is an in-memory mock repository with localStorage-backed auth/session and preferences where useful. No backend, API, payment processor, real email, or real file storage is introduced.

## Architecture

React Router remains the routing boundary. Auth routes render through a standalone `AuthLayout`; authenticated dashboard routes render through the existing `AppLayout`; unmatched paths render the 404 page. Route definitions use focused page components under `src/pages/`, with shared shell and UI code kept in `src/layouts/`, `src/components/`, and `src/components/ui/`.

Navigation is defined once in `src/lib/navigation.ts` and consumed by the sidebar, mobile navigation, command palette, and route metadata. Mock domain repositories live under `src/lib/data/` and expose typed list/get/create/update/delete operations. Pages consume repositories through small hooks or direct typed calls and never duplicate domain fixtures.

## Dependencies

Add only the approved libraries:

- `recharts` for reusable dashboard and showcase charts
- `@tanstack/react-table` for sortable, filterable, paginated data tables
- `react-hook-form`, `zod`, and `@hookform/resolvers` for validated forms
- `framer-motion` for page transitions and Kanban drag interactions
- `date-fns` for calendar/date formatting

Continue using the existing Radix-based primitives, Tailwind CSS v4, `cn`, Lucide icons, and React Router. Do not add a separate framework or backend.

## Route Inventory

### Auth and utility

`/login`, `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/two-factor`, `/verify-email`, `/lock-screen`, `/403`, `/404`, `/500`, `/coming-soon`, `/maintenance`.

### Dashboard

`/dashboard`, `/analytics`, `/ecommerce`, `/crm`, `/saas`, `/charts`.

### Commerce

`/orders`, `/orders/new`, `/orders/:id`, `/orders/:id/edit`, `/products`, `/products/new`, `/products/:id`, `/products/:id/edit`, `/customers`, `/invoices`, `/billing`, `/pricing`.

### Apps

`/mail`, `/chat`, `/files`, `/kanban`, `/calendar`, `/wizard`.

### Account and system

`/profile`, `/settings/profile`, `/settings/appearance`, `/settings/notifications`, `/settings/billing`, `/users`, `/notifications`, `/support`.

## Functional Requirements

1. **Mock authentication:** sign-in validates a demo account (`demo@example.com` / `ZenithDemo2026!`) and accepts a registered mock account, stores a session flag, redirects to `/dashboard`, and protects dashboard routes. Sign-up validates and creates a mock account. Forgot/reset, two-factor, verification, and lock-screen flows are functional UI simulations with deterministic success states.
2. **CRUD:** orders and products support list, detail, create, edit, delete, search, filtering, sorting, pagination, and status feedback using typed mock repositories.
3. **Tables:** shared TanStack Table wrapper supports column definitions, sorting, filtering, pagination, row selection where needed, CSV export, and responsive mobile cards.
4. **Forms:** shared React Hook Form + Zod patterns provide field validation, errors, submit/loading states, and success feedback.
5. **Charts:** shared Recharts wrappers cover area, bar, line/composed, pie, radar, radial bar, treemap, and scatter examples. Charts respect theme tokens and remain responsive.
6. **Interaction:** page transitions use Framer Motion; Kanban cards can be moved between columns with drag interactions; command palette searches all enabled navigation entries.
7. **Preferences:** existing color, density, layout, container, theme, language, and customization behavior remains compatible. All pages support light/dark/system appearance and fluid/boxed layouts.
8. **Localization:** every user-facing label introduced by this work has EN, DE, and FR translations. Domain fixture names and IDs may remain stable sample data; UI text may not be hardcoded in pages.
9. **Responsive/accessibility:** pages work at mobile, tablet, and desktop widths; interactive controls have labels, keyboard access, visible focus states, and semantic headings.

## File Boundaries

- `src/App.tsx`: route tree, auth protection, fallback route only.
- `src/layouts/auth-layout.tsx`: auth-only shell.
- `src/layouts/`: dashboard shell composition and transitions.
- `src/lib/navigation.ts`: navigation metadata and route search data.
- `src/lib/data/`: typed mock repositories and fixtures.
- `src/components/shared/`: page headers, data table, forms, dialogs, feedback.
- `src/components/charts/`: Recharts wrappers and theme configuration.
- `src/pages/`: route-level composition only; domain logic stays in data/components.
- `src/i18n/index.ts`: translation keys and locale values.
- `src/components/ui/`: vendored Radix/shadcn primitives only.

## Delivery Phases

1. Foundation: dependencies, shared primitives, navigation, repositories, auth/session helpers, layouts, routing, translations.
2. Dashboards and chart showcase.
3. Commerce CRUD and data tables.
4. Apps: mail, chat, files, Kanban, calendar, wizard.
5. Account/system: settings, profile, users, notifications, support, pricing.
6. Auth and error pages, then final transitions, responsive, accessibility, localization, and manual route audit.

Each phase must leave the app buildable and ends with `bun run lint` and `bun run build`.

## Verification

No automated test framework currently exists. Each phase must run the repository lint and build commands, and manually verify affected routes with the Vite dev server. Verification must include authenticated and unauthenticated navigation, form validation, table interactions, CRUD state changes, theme/language changes, mobile layout, and fallback/error routes.

## Non-Goals

No production authentication, server persistence, real-time collaboration, external API integration, actual email delivery, file uploads to storage, payment processing, or deployment configuration.
