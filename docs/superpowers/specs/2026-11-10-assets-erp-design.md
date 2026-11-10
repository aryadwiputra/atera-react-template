# Assets Management + ERP Supply Chain Design

**Date:** 2026-11-10
**Status:** Approved
**Reference:** Follows existing Atera patterns (mock in-memory data, DataTable pages, StatCard headers, i18n en/de/fr).

## Goal

Add five new admin pages to the Atera template — Assets, Procurement, Inventory, Suppliers, and HR — under a new `enterprise` navigation group, following the established page patterns (StatCards + DataTable + detail Sheet/Dialog + mock CRUD).

## Scope

- **Assets Management** — Asset Registry with detail view.
- **ERP Supply Chain** — Procurement (POs), Inventory (stock per warehouse), Suppliers.
- **HR (ringkas)** — employee directory + open positions.

Explicitly out of scope: real ERP concepts beyond the above (accounting/GL, manufacturing/BOM), maintenance schedules, depreciation, QR labels, backend/network calls, new dependencies.

## Global Constraints

- Frontend-only mock data: typed in-memory arrays in `src/lib/data/` with `list/get/create/update/remove` exports.
- No new npm dependencies. Icons: lucide-react only.
- All UI text via i18n keys added to en, de, and fr in `src/i18n/index.ts`. `useTranslations` has no interpolation — dynamic values use string concatenation.
- Tailwind v4 tokens only: status colors use `status-success`/`status-warning`/`status-danger`/`chart-*` (from prior commits), no hardcoded palette classes.
- Routes registered in `src/App.tsx` (`explicitPaths` + protected children) and `src/lib/navigation.ts`.
- Verification: `bun run lint` + `bun run build`.

## Navigation

New group `'enterprise'` added to `NavigationGroup` and `navigationGroups` (order: overview → enterprise → commerce → apps → system). Sidebar components are generic; only `navigation.ts` changes.

| Item | Route | Icon | translationKey |
|---|---|---|---|
| Assets | /assets | Boxes | assets |
| Procurement | /procurement | ClipboardList | procurement |
| Inventory | /inventory | Warehouse | inventory |
| Suppliers | /suppliers | Truck | suppliers |
| HR | /hr | Contact | hr |

## Data Model (added to `src/lib/data/types.ts`)

```ts
export type AssetStatus = 'In Use' | 'Available' | 'Maintenance' | 'Retired'
export type Asset = { id: string; tag: string; name: string; category: string; assignedTo: string; location: string; purchaseDate: string; warrantyEnd: string; value: number; status: AssetStatus }

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled'
export type PurchaseOrder = { id: string; number: string; supplier: string; items: { name: string; qty: number; price: number }[]; date: string; expectedDelivery: string; status: POStatus }

export type InventoryItem = { id: string; sku: string; name: string; warehouse: string; onHand: number; reserved: number; reorderPoint: number }
// derived: available = onHand - reserved; status OK (available > reorderPoint) / Low (available <= reorderPoint, > 0) / Out (available <= 0)

export type SupplierStatus = 'Active' | 'On Hold'
export type Supplier = { id: string; name: string; contact: string; email: string; phone: string; country: string; rating: number; onTimeRate: number; status: SupplierStatus }

export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Offboarded'
export type Employee = { id: string; name: string; position: string; department: string; email: string; startDate: string; status: EmployeeStatus }
export type OpenPosition = { id: string; title: string; department: string; applicants: number; postedAt: string }
```

Mock volumes: ~12 assets, ~10 POs (1–5 line items each), ~15 inventory SKUs, ~10 suppliers, ~14 employees, 5 open positions.

## Pages

Each page: `PageTransition` + `PageHeader` (breadcrumbs), StatCards row where specified, DataTable with filter/sort/paginate/CSV (existing `data-table.tsx`), empty state via `EmptyTableState`, `useCustomizePreferences` + `useTranslations`.

### Assets (`/assets`, `src/pages/assets.tsx`, `src/lib/data/assets.ts`)
- StatCards: total assets, in use, in maintenance, total value.
- Table columns: tag, name, category, assignedTo, location, purchaseDate, warrantyEnd, value, status badge.
- Row detail in a Sheet: all fields + simple history list (static per asset, mock).
- Add/edit via Dialog (tag, name, category, assignedTo, location, dates, value, status select). Delete with confirm.

### Procurement (`/procurement`, `src/pages/procurement.tsx`, `src/lib/data/procurement.ts`)
- StatCards: open POs, pending approval, total spend YTD (sum of Approved/Received).
- Table: number, supplier, items count, total (computed from line items), date, expectedDelivery, status badge.
- Detail Sheet: line items table + approve/cancel actions that call `updatePurchaseOrder` (mock, moves Pending→Approved, any→Cancelled except Received).

### Inventory (`/inventory`, `src/pages/inventory.tsx`, `src/lib/data/inventory.ts`)
- StatCards: total SKUs, low-stock count, total units.
- Table: sku, name, warehouse, onHand, reserved, available (derived), reorderPoint, derived status badge OK/Low/Out. Read-only registry (no CRUD) — YAGNI.

### Suppliers (`/suppliers`, `src/pages/suppliers.tsx`, `src/lib/data/suppliers.ts`)
- Table: name, contact, email, phone, country, rating (star display), onTimeRate (%), status badge.
- Add/edit Dialog. No delete (referenced by POs).

### HR (`/hr`, `src/pages/hr.tsx`, `src/lib/data/hr.ts`)
- StatCards: headcount (non-offboarded), on leave today, open positions.
- Employee table: name, position, department, email, startDate, status badge.
- Below: small Card "Open Positions" table (title, department, applicants, postedAt).

## i18n

~40 new keys × 3 locales: group label `enterprise`, page titles/descriptions, column labels, status values, stat labels, actions (addAsset, approve, cancel, edit, delete, etc.), empty-state strings. de/fr translations mirror existing style.

## Testing / Verification

No test framework configured. Per task: `bun run lint` + `bun run build`. Manual dev-server spot check of the five routes when practical.
