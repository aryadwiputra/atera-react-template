# Assets Management + ERP Supply Chain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five admin pages — Assets, Procurement, Inventory, Suppliers, HR — under a new `enterprise` nav group, following existing mock-data page patterns.

**Architecture:** Each page = `src/pages/<page>.tsx` (default export, PageTransition + PageHeader + StatCards + DataTable) + `src/lib/data/<page>.ts` (typed in-memory arrays + list/get/create/update/remove). Types go in `src/lib/data/types.ts`. Routes in `src/App.tsx` (protected children + `explicitPaths`), nav in `src/lib/navigation.ts` (new group `'enterprise'`), ~45 i18n keys × en/de/fr. No new dependencies, no shared component changes (DataTable already wires EmptyTableState).

**Tech Stack:** React 19, TypeScript strict, react-router v8, TanStack table via existing `DataTable`, lucide-react, Tailwind v4 tokens, Bun.

**Spec:** `docs/superpowers/specs/2026-11-10-assets-erp-design.md`

## Global Constraints

- Frontend-only mock data: typed in-memory arrays in `src/lib/data/` with `list/get/create/update/remove` exports.
- No new npm dependencies. Icons: lucide-react only.
- All UI text via i18n keys added to en, de, and fr in `src/i18n/index.ts`. `useTranslations` has no interpolation — dynamic values use string concatenation.
- Tailwind v4 tokens only: status badges use `status-success`/`status-warning`/`status-danger`/`chart-*` tokens (pattern: `bg-status-success/15 text-status-success`), no hardcoded palette classes.
- Package manager is Bun; verify with `bun run lint` then `bun run build` (both must pass; lint warnings pre-existing are OK).
- Established helpers to reuse (verified): `formatMoney` pattern `const formatMoney = (v: number) => \`$${v.toLocaleString('en-US')}\`` (finance.tsx:43); `ConfirmDialog` props `{open, onOpenChange, title, description, confirmLabel, cancelLabel, trigger, onConfirm}`; `PageHeader` props `{title, description?, actions?, breadcrumbs?}` with `BreadcrumbItem = {title, href}` both required; `StatCard` props `{title, value, change?, changePositive?, icon, description?, className?}`; `createAppColumnHelper<T>()` + `helper.accessor(field, {header, cell})`; group label i18n keys live at en ~line 24 (`overview: 'Overview'`).

## Task Order Note

Task 1 (nav + i18n scaffold) unblocks every page task. Tasks 2–6 are independent pages — execute in order; each commits separately.

---

### Task 1: Navigation group, types, routes wiring, i18n scaffold

**Files:**
- Modify: `src/lib/data/types.ts` (append new types at end)
- Modify: `src/lib/navigation.ts`
- Modify: `src/App.tsx`
- Modify: `src/i18n/index.ts` (en ~line 24 block, de ~line 715 block, fr ~line 1380 block — group labels; plus one page-keys block per locale)
- Create: 5 stub pages `src/pages/assets.tsx`, `src/pages/procurement.tsx`, `src/pages/inventory.tsx`, `src/pages/suppliers.tsx`, `src/pages/hr.tsx`

**Interfaces:**
- Produces: types below consumed by Tasks 2–6; routes `/assets /procurement /inventory /suppliers /hr`; nav group `'enterprise'`; translationKeys `assets, procurement, inventory, suppliers, hr, enterprise`.

- [ ] **Step 1: Add types to `src/lib/data/types.ts`**

```ts
export type AssetStatus = 'In Use' | 'Available' | 'Maintenance' | 'Retired'
export type Asset = { id: string; tag: string; name: string; category: string; assignedTo: string; location: string; purchaseDate: string; warrantyEnd: string; value: number; status: AssetStatus }

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled'
export type PurchaseOrder = { id: string; number: string; supplier: string; items: { name: string; qty: number; price: number }[]; date: string; expectedDelivery: string; status: POStatus }

export type InventoryItem = { id: string; sku: string; name: string; warehouse: string; onHand: number; reserved: number; reorderPoint: number }

export type SupplierStatus = 'Active' | 'On Hold'
export type Supplier = { id: string; name: string; contact: string; email: string; phone: string; country: string; rating: number; onTimeRate: number; status: SupplierStatus }

export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Offboarded'
export type Employee = { id: string; name: string; position: string; department: string; email: string; startDate: string; status: EmployeeStatus }
export type OpenPosition = { id: string; title: string; department: string; applicants: number; postedAt: string }
```

- [ ] **Step 2: Add nav group + items in `src/lib/navigation.ts`**

Add to imports: `Boxes, ClipboardList, Warehouse, Truck, Contact` from lucide-react.
Change: `export type NavigationGroup = 'overview' | 'enterprise' | 'commerce' | 'apps' | 'system'`
Change: `export const navigationGroups = ['overview', 'enterprise', 'commerce', 'apps', 'system'] as const`
Insert 5 items after the Charts item (last `overview` entry):

```ts
{ title: 'Assets', href: '/assets', icon: Boxes, group: 'enterprise', keywords: ['equipment', 'registry'], translationKey: 'assets' },
{ title: 'Procurement', href: '/procurement', icon: ClipboardList, group: 'enterprise', keywords: ['purchase orders', 'po'], translationKey: 'procurement' },
{ title: 'Inventory', href: '/inventory', icon: Warehouse, group: 'enterprise', keywords: ['stock', 'warehouse'], translationKey: 'inventory' },
{ title: 'Suppliers', href: '/suppliers', icon: Truck, group: 'enterprise', keywords: ['vendors', 'partners'], translationKey: 'suppliers' },
{ title: 'HR', href: '/hr', icon: Contact, group: 'enterprise', keywords: ['employees', 'people', 'human resources'], translationKey: 'hr' },
```

- [ ] **Step 3: Wire routes in `src/App.tsx`**

Add lazy imports next to existing page imports:

```ts
const AssetsPage = lazy(() => import('@/pages/assets'))
const ProcurementPage = lazy(() => import('@/pages/procurement'))
const InventoryPage = lazy(() => import('@/pages/inventory'))
const SuppliersPage = lazy(() => import('@/pages/suppliers'))
const HrPage = lazy(() => import('@/pages/hr'))
```

Add route elements to the protected children array (next to `/finance` etc.) and add the 5 hrefs to the `explicitPaths` Set:

```tsx
{ path: 'assets', element: <AssetsPage /> },
{ path: 'procurement', element: <ProcurementPage /> },
{ path: 'inventory', element: <InventoryPage /> },
{ path: 'suppliers', element: <SuppliersPage /> },
{ path: 'hr', element: <HrPage /> },
```

- [ ] **Step 4: Create 5 stub pages** (same shape for each, title i18n key varies)

```tsx
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function AssetsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader title={t('assets')} description={t('assetsDescription')} breadcrumbs={[{ title: t('enterprise'), href: '/assets' }, { title: t('assets'), href: '/assets' }]} />
  </main></PageTransition>
}
```

(Procurement uses `procurement`/`procurementDescription`, breadcrumbs first entry `t('enterprise')` href `/procurement`; same pattern for inventory, suppliers, hr.)

- [ ] **Step 5: i18n scaffold (en, de, fr)**

In en group-labels block (~line 24, after `overview: 'Overview',`): `enterprise: 'Enterprise',`
In de (~715, after `overview: 'Übersicht',`): `enterprise: 'Unternehmen',`
In fr: `enterprise: 'Entreprise',`

Add per-locale page-keys blocks (en shown; de/fr translate the strings — see full key list):

```ts
assets: 'Assets', assetsDescription: 'Track company equipment and their assignments.',
procurement: 'Procurement', procurementDescription: 'Manage purchase orders from draft to delivery.',
inventory: 'Inventory', inventoryDescription: 'Monitor stock levels across warehouses.',
suppliers: 'Suppliers', suppliersDescription: 'Manage vendor relationships and performance.',
hr: 'HR', hrDescription: 'Employee directory and open positions.',
enterprise: 'Enterprise',
```

Full key list the plan's page tasks will add later — pre-adding ALL of them here in en/de/fr avoids three locales of churn per task. Per page (all keys prefixed with the page name or generic):

- assets: `totalAssets, inUse, inMaintenance, totalAssetValue, assetTag, assetName, category, assignedTo, location, purchaseDate, warrantyEnd, addAsset, editAsset, deleteAsset, deleteAssetDescription, assetDeleted, assetSaved, assetHistory`
- procurement: `openPos, pendingApproval, totalSpendYtd, poNumber, poSupplier, itemsCount, poTotal, poDate, expectedDelivery, poStatus, viewPo, approvePo, cancelPo, poApproved, poCancelled, lineItems, lineItemName, quantity, unitPrice`
- inventory: `totalSkus, lowStockCount, totalUnits, sku, itemName, warehouse, onHand, reserved, available, reorderPoint, stockOk, stockLow, stockOut`
- suppliers: `supplierName, contactPerson, phone, country, rating, onTimeRate, onHold, addSupplier, editSupplier, supplierSaved`
- hr: `headcount, onLeaveToday, openPositionsCount, employeeName, positionLabel, department, email, startDate, employeeStatus, openPositions, applicants, postedAt, addEmployee`
- shared: `edit, delete, cancel, save, saveChanges` — MOST of these already exist (edit/delete/cancel/save verified in orders.tsx usage). Only add ones missing after grep.

de/fr translations (concise): Enterprise=Unternehmen/Entreprise; Assets=Anlagen/Actifs; Procurement=Beschaffung/Achats; Inventory=Lagerbestand/Stock; Suppliers=Lieferanten/Fournisseurs; HR=Personal/ RH; statuses: In Use=In Benutzung/En usage, Available=Verfügbar/Disponible, Maintenance=Wartung/Maintenance, Retired=Ausgemustert/Retiré, Draft=Entwurf/Brouillon, Pending=Ausstehend/En attente, Approved=Genehmigt/Approuvé, Received=Erhalten/Reçu, Cancelled=Storniert/Annulé, On Hold=Angehalten/En pause, On Leave=Im Urlaub/En congé, Remote=Remote/À distance, Offboarded=Ausgeschieden/Parti, OK=OK, Low=Niedrig/Faible, Out=Leer/Épuisé.

- [ ] **Step 6: Verify + commit**

Run: `bun run lint && bun run build` — expect exit 0, stub pages compile.
Commit: `git add src/lib/data/types.ts src/lib/navigation.ts src/App.tsx src/i18n/index.ts src/pages/assets.tsx src/pages/procurement.tsx src/pages/inventory.tsx src/pages/suppliers.tsx src/pages/hr.tsx && git commit -m "feat: add enterprise nav group with assets and ERP route stubs"`

---

### Task 2: Assets page + data

**Files:**
- Create: `src/lib/data/assets.ts`
- Modify: `src/pages/assets.tsx` (replace stub)

**Interfaces:**
- Consumes: `Asset`, `AssetStatus` from Task 1; DataTable/ConfirmDialog/StatCard/Dialog/Select patterns per Global Constraints.
- Produces: `listAssets(): Asset[]`, `getAsset(id: string): Asset | undefined`, `createAsset(asset: Omit<Asset, 'id'>): Asset`, `updateAsset(id: string, updates: Partial<Asset>): Asset | undefined`, `removeAsset(id: string): void`.

- [ ] **Step 1: Create `src/lib/data/assets.ts`** (follow orders.ts CRUD pattern exactly, id prefix `AST-` + zero-padded number)

```ts
import type { Asset } from './types'

let assets: Asset[] = [
  { id: 'AST-001', tag: 'LT-0231', name: 'MacBook Pro 14', category: 'Laptop', assignedTo: 'Olivia Martin', location: 'HQ — Floor 3', purchaseDate: '2025-03-14', warrantyEnd: '2027-03-14', value: 2399, status: 'In Use' },
  { id: 'AST-002', tag: 'LT-0232', name: 'ThinkPad X1 Carbon', category: 'Laptop', assignedTo: 'Jackson Lee', location: 'HQ — Floor 2', purchaseDate: '2025-06-02', warrantyEnd: '2027-06-02', value: 1899, status: 'In Use' },
  { id: 'AST-003', tag: 'MN-0087', name: 'Dell UltraSharp 27', category: 'Monitor', assignedTo: 'Isabella Nguyen', location: 'HQ — Floor 3', purchaseDate: '2025-01-20', warrantyEnd: '2026-01-20', value: 549, status: 'In Use' },
  { id: 'AST-004', tag: 'PH-0150', name: 'iPhone 15 Pro', category: 'Phone', assignedTo: 'William Kim', location: 'Remote', purchaseDate: '2025-02-11', warrantyEnd: '2026-02-11', value: 1099, status: 'Maintenance' },
  { id: 'AST-005', tag: 'VH-0003', name: 'Ford Transit Van', category: 'Vehicle', assignedTo: 'Logistics Team', location: 'Warehouse A', purchaseDate: '2024-09-30', warrantyEnd: '2027-09-30', value: 41500, status: 'In Use' },
  { id: 'AST-006', tag: 'LT-0233', name: 'MacBook Air 13', category: 'Laptop', assignedTo: '', location: 'HQ — IT Storage', purchaseDate: '2025-08-19', warrantyEnd: '2027-08-19', value: 1299, status: 'Available' },
  { id: 'AST-007', tag: 'PR-0042', name: 'Zebra Label Printer', category: 'Printer', assignedTo: 'Warehouse A', location: 'Warehouse A', purchaseDate: '2024-11-05', warrantyEnd: '2026-11-05', value: 780, status: 'In Use' },
  { id: 'AST-008', tag: 'SR-0012', name: 'Dell PowerEdge R750', category: 'Server', assignedTo: 'IT Team', location: 'HQ — Server Room', purchaseDate: '2024-05-22', warrantyEnd: '2029-05-22', value: 8900, status: 'In Use' },
  { id: 'AST-009', tag: 'LT-0119', name: 'ThinkPad T14', category: 'Laptop', assignedTo: 'Emma Davis', location: 'Remote', purchaseDate: '2023-12-01', warrantyEnd: '2025-12-01', value: 1450, status: 'Maintenance' },
  { id: 'AST-010', tag: 'DS-0056', name: 'Sonos Docking Station', category: 'Peripheral', assignedTo: '', location: 'HQ — Floor 1', purchaseDate: '2023-07-14', warrantyEnd: '2024-07-14', value: 449, status: 'Retired' },
  { id: 'AST-011', tag: 'TB-0033', name: 'Caldigit TS4 Dock', category: 'Peripheral', assignedTo: 'Noah Patel', location: 'HQ — Floor 2', purchaseDate: '2025-04-08', warrantyEnd: '2027-04-08', value: 380, status: 'In Use' },
  { id: 'AST-012', tag: 'CN-0007', name: 'Sony Conference Camera', category: 'AV Equipment', assignedTo: '', location: 'HQ — Meeting Room B', purchaseDate: '2025-05-30', warrantyEnd: '2027-05-30', value: 1250, status: 'Available' },
]

export const listAssets = () => [...assets]
export const getAsset = (id: string) => assets.find((asset) => asset.id === id)
export const createAsset = (asset: Omit<Asset, 'id'>) => {
  const created = { ...asset, id: `AST-${String(assets.length + 1).padStart(3, '0')}` }
  assets = [created, ...assets]
  return created
}
export const updateAsset = (id: string, updates: Partial<Asset>) => {
  assets = assets.map((asset) => asset.id === id ? { ...asset, ...updates } : asset)
  return getAsset(id)
}
export const removeAsset = (id: string) => {
  assets = assets.filter((asset) => asset.id !== id)
}
```

- [ ] **Step 2: Build the page in `src/pages/assets.tsx`**

Structure (follow finance.tsx KPI + orders.tsx table + commerce.tsx dialog patterns):
- `formatMoney = (v: number) => \`$${v.toLocaleString('en-US')}\``
- State: `items` (from `listAssets()`), `detail: Asset | null` (Sheet), `formOpen: boolean`, `editing: Asset | null`, `form: {tag,name,category,assignedTo,location,purchaseDate,warrantyEnd,value,status}` controlled inputs, `pendingDelete: Asset | null`.
- StatCards row (`grid gap-4 sm:grid-cols-2 xl:grid-cols-4`): total assets (`items.length`, Boxes icon), in use (status==='In Use'), in maintenance (status==='Maintenance'), total value (sum of non-Retired `value`, formatMoney).
- DataTable columns: tag (font-medium), name, category, assignedTo (or `—`), location, purchaseDate, warrantyEnd, value (formatMoney, tabular-nums), status Badge with class map `{ 'In Use': 'bg-status-success/15 text-status-success', 'Available': 'bg-chart-1/15 text-chart-1', 'Maintenance': 'bg-status-warning/15 text-status-warning', 'Retired': 'bg-muted text-muted-foreground' }`, actions column: Eye opens Sheet, Pencil opens Dialog prefilled, Trash2 opens ConfirmDialog.
- Detail Sheet (`SheetContent` `sm:max-w-md`): all fields as label/value rows + "History" section — static mock per asset: `['Created', purchaseDate], ['Assigned to ' + (assignedTo || 'stock'), purchaseDate], ['Last audit', '2026-09-15']` as small rows with muted timestamps.
- Asset Dialog: same form for add/edit (label pattern `grid gap-2 text-sm font-medium` + Input; category/location/assignedTo free-text Input; status + Select with 4 AssetStatus options; value Input type number; dates Input type date). Submit calls `createAsset`/`updateAsset`, refreshes via `setItems(listAssets())`, toast `{ title: t('assetSaved'), variant: 'success' }`.
- Delete ConfirmDialog exactly like orders.tsx with `deleteAsset`/`deleteAssetDescription`/`assetDeleted`.
- PageHeader `actions`: `<Button size="sm"><Plus className="size-4" />{t('addAsset')}</Button>` opening the Dialog for create.

- [ ] **Step 3: Verify + commit**

Run: `bun run lint && bun run build` — exit 0.
Commit: `git add src/lib/data/assets.ts src/pages/assets.tsx && git commit -m "feat: add asset registry page with CRUD and detail sheet"`

---

### Task 3: Procurement page + data

**Files:**
- Create: `src/lib/data/procurement.ts`
- Modify: `src/pages/procurement.tsx` (replace stub)

**Interfaces:**
- Consumes: `PurchaseOrder`, `POStatus` from Task 1.
- Produces: `listPurchaseOrders(): PurchaseOrder[]`, `getPurchaseOrder(id: string): PurchaseOrder | undefined`, `updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | undefined` (no create/remove — POs come from elsewhere in a real ERP; YAGNI).

- [ ] **Step 1: Create `src/lib/data/procurement.ts`**

```ts
import type { PurchaseOrder } from './types'

let purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-1041', number: 'PO-1041', supplier: 'Nordic Components AB', items: [{ name: 'USB-C dock, 12-port', qty: 20, price: 149 }, { name: 'HDMI cable 2m', qty: 40, price: 12 }], date: '2026-10-28', expectedDelivery: '2026-11-14', status: 'Pending' },
  { id: 'PO-1040', number: 'PO-1040', supplier: 'Shenzhen ElectroParts', items: [{ name: 'Mechanical keyboard', qty: 15, price: 89 }], date: '2026-10-24', expectedDelivery: '2026-11-20', status: 'Draft' },
  { id: 'PO-1039', number: 'PO-1039', supplier: 'Berlin Office Supply', items: [{ name: 'Standing desk', qty: 6, price: 620 }, { name: 'Ergonomic chair', qty: 8, price: 340 }], date: '2026-10-20', expectedDelivery: '2026-11-06', status: 'Approved' },
  { id: 'PO-1038', number: 'PO-1038', supplier: 'Nordic Components AB', items: [{ name: '27-inch monitor', qty: 10, price: 549 }], date: '2026-10-15', expectedDelivery: '2026-10-30', status: 'Received' },
  { id: 'PO-1037', number: 'PO-1037', supplier: 'Pacific Logistics Co', items: [{ name: 'Pallet rack', qty: 4, price: 950 }, { name: 'Barcode scanner', qty: 6, price: 210 }], date: '2026-10-11', expectedDelivery: '2026-11-02', status: 'Approved' },
  { id: 'PO-1036', number: 'PO-1036', supplier: 'Shenzhen ElectroParts', items: [{ name: 'Webcam 4K', qty: 12, price: 130 }, { name: 'USB hub', qty: 25, price: 35 }], date: '2026-10-06', expectedDelivery: '2026-10-24', status: 'Received' },
  { id: 'PO-1035', number: 'PO-1035', supplier: 'Berlin Office Supply', items: [{ name: 'Paper A4, box', qty: 50, price: 28 }], date: '2026-09-30', expectedDelivery: '2026-10-14', status: 'Cancelled' },
  { id: 'PO-1034', number: 'PO-1034', supplier: 'Tokyo Precision Tools', items: [{ name: 'Torque wrench set', qty: 5, price: 260 }], date: '2026-09-24', expectedDelivery: '2026-10-18', status: 'Received' },
  { id: 'PO-1033', number: 'PO-1033', supplier: 'Pacific Logistics Co', items: [{ name: 'Forklift battery', qty: 2, price: 3200 }], date: '2026-09-18', expectedDelivery: '2026-10-09', status: 'Cancelled' },
  { id: 'PO-1032', number: 'PO-1032', supplier: 'Nordic Components AB', items: [{ name: 'SSD 2TB NVMe', qty: 18, price: 175 }], date: '2026-09-12', expectedDelivery: '2026-09-29', status: 'Received' },
]

export const listPurchaseOrders = () => [...purchaseOrders]
export const getPurchaseOrder = (id: string) => purchaseOrders.find((po) => po.id === id)
export const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
  purchaseOrders = purchaseOrders.map((po) => po.id === id ? { ...po, ...updates } : po)
  return getPurchaseOrder(id)
}
export const poTotal = (po: PurchaseOrder) => po.items.reduce((sum, item) => sum + item.qty * item.price, 0)
```

- [ ] **Step 2: Build the page in `src/pages/procurement.tsx`**

- StatCards: open POs (status Draft+Pending+Approved), pending approval (status Pending), total spend YTD (sum `poTotal` where status Approved or Received), formatMoney.
- Table: number (font-medium), supplier, itemsCount (`items.length`), total (formatMoney(poTotal), tabular-nums), date, expectedDelivery, status Badge map: Draft → `bg-muted text-muted-foreground`, Pending → `bg-status-warning/15 text-status-warning`, Approved → `bg-chart-1/15 text-chart-1`, Received → `bg-status-success/15 text-status-success`, Cancelled → `bg-destructive/15 text-destructive`.
- Detail Sheet (`sm:max-w-lg`): header PO number + supplier, meta rows (date, expectedDelivery, status), line items table (name / qty / unitPrice / line total qty×price) + total row; footer actions: Approve button (visible when status Pending — `updatePurchaseOrder(id, {status:'Approved'})`, toast `t('poApproved')`), Cancel button outline destructive (visible when status Draft or Pending — sets Cancelled, toast `t('poCancelled')`), then refresh + close.
- PageHeader actions: none (POs are created upstream; no create dialog — YAGNI).

- [ ] **Step 3: Verify + commit**

Run: `bun run lint && bun run build` — exit 0.
Commit: `git add src/lib/data/procurement.ts src/pages/procurement.tsx && git commit -m "feat: add procurement purchase orders page with approve/cancel actions"`

---

### Task 4: Inventory page + data

**Files:**
- Create: `src/lib/data/inventory.ts`
- Modify: `src/pages/inventory.tsx` (replace stub)

**Interfaces:**
- Consumes: `InventoryItem` from Task 1.
- Produces: `listInventory(): InventoryItem[]` (read-only).

- [ ] **Step 1: Create `src/lib/data/inventory.ts`**

```ts
import type { InventoryItem } from './types'

let inventory: InventoryItem[] = [
  { id: 'INV-001', sku: 'SKU-1001', name: 'USB-C dock, 12-port', warehouse: 'Warehouse A', onHand: 142, reserved: 20, reorderPoint: 40 },
  { id: 'INV-002', sku: 'SKU-1002', name: 'Mechanical keyboard', warehouse: 'Warehouse A', onHand: 88, reserved: 15, reorderPoint: 30 },
  { id: 'INV-003', sku: 'SKU-1003', name: '27-inch monitor', warehouse: 'Warehouse B', onHand: 35, reserved: 10, reorderPoint: 40 },
  { id: 'INV-004', sku: 'SKU-1004', name: 'Standing desk', warehouse: 'Warehouse B', onHand: 12, reserved: 6, reorderPoint: 10 },
  { id: 'INV-005', sku: 'SKU-1005', name: 'Ergonomic chair', warehouse: 'Warehouse B', onHand: 24, reserved: 8, reorderPoint: 15 },
  { id: 'INV-006', sku: 'SKU-1006', name: 'HDMI cable 2m', warehouse: 'Warehouse A', onHand: 320, reserved: 40, reorderPoint: 100 },
  { id: 'INV-007', sku: 'SKU-1007', name: 'Webcam 4K', warehouse: 'Warehouse A', onHand: 9, reserved: 0, reorderPoint: 25 },
  { id: 'INV-008', sku: 'SKU-1008', name: 'Barcode scanner', warehouse: 'Warehouse C', onHand: 18, reserved: 6, reorderPoint: 12 },
  { id: 'INV-009', sku: 'SKU-1009', name: 'Pallet rack section', warehouse: 'Warehouse C', onHand: 7, reserved: 0, reorderPoint: 4 },
  { id: 'INV-010', sku: 'SKU-1010', name: 'SSD 2TB NVMe', warehouse: 'Warehouse A', onHand: 61, reserved: 18, reorderPoint: 30 },
  { id: 'INV-011', sku: 'SKU-1011', name: 'Torque wrench set', warehouse: 'Warehouse C', onHand: 4, reserved: 2, reorderPoint: 6 },
  { id: 'INV-012', sku: 'SKU-1012', name: 'Paper A4, box', warehouse: 'Warehouse B', onHand: 210, reserved: 30, reorderPoint: 80 },
  { id: 'INV-013', sku: 'SKU-1013', name: 'Forklift battery', warehouse: 'Warehouse C', onHand: 2, reserved: 0, reorderPoint: 2 },
  { id: 'INV-014', sku: 'SKU-1014', name: 'USB hub', warehouse: 'Warehouse A', onHand: 0, reserved: 0, reorderPoint: 20 },
  { id: 'INV-015', sku: 'SKU-1015', name: 'Label roll, 4x6', warehouse: 'Warehouse C', onHand: 96, reserved: 12, reorderPoint: 50 },
]

export const listInventory = () => [...inventory]
```

- [ ] **Step 2: Build the page in `src/pages/inventory.tsx`**

- Derived helpers in the page: `const available = (item: InventoryItem) => item.onHand - item.reserved`; stock status: `available <= 0 ? 'Out' : available <= item.reorderPoint ? 'Low' : 'OK'`.
- StatCards: total SKUs (items.length), low stock count (Low + Out), total units (sum onHand).
- Table: sku (font-medium), name, warehouse, onHand, reserved, available (tabular-nums), reorderPoint, status Badge: OK → `bg-status-success/15 text-status-success`, Low → `bg-status-warning/15 text-status-warning`, Out → `bg-destructive/15 text-destructive`.
- Read-only: no actions column, no PageHeader actions.

- [ ] **Step 3: Verify + commit**

Run: `bun run lint && bun run build` — exit 0.
Commit: `git add src/lib/data/inventory.ts src/pages/inventory.tsx && git commit -m "feat: add inventory stock levels page with low-stock status"`

---

### Task 5: Suppliers page + data

**Files:**
- Create: `src/lib/data/suppliers.ts`
- Modify: `src/pages/suppliers.tsx` (replace stub)

**Interfaces:**
- Consumes: `Supplier` from Task 1.
- Produces: `listSuppliers(): Supplier[]`, `createSupplier(supplier: Omit<Supplier, 'id'>): Supplier`, `updateSupplier(id: string, updates: Partial<Supplier>): Supplier | undefined`.

- [ ] **Step 1: Create `src/lib/data/suppliers.ts`** (CRUD pattern like orders.ts, id prefix `SUP-` + zero-padded)

```ts
import type { Supplier } from './types'

let suppliers: Supplier[] = [
  { id: 'SUP-001', name: 'Nordic Components AB', contact: 'Erik Lindqvist', email: 'erik@nordiccomponents.se', phone: '+46 8 555 011 22', country: 'Sweden', rating: 4.6, onTimeRate: 96, status: 'Active' },
  { id: 'SUP-002', name: 'Shenzhen ElectroParts', contact: 'Wei Zhang', email: 'wei.zhang@szelectro.cn', phone: '+86 755 5550 8811', country: 'China', rating: 4.2, onTimeRate: 89, status: 'Active' },
  { id: 'SUP-003', name: 'Berlin Office Supply', contact: 'Anna Keller', email: 'a.keller@berlinoffice.de', phone: '+49 30 5550 4412', country: 'Germany', rating: 4.8, onTimeRate: 98, status: 'Active' },
  { id: 'SUP-004', name: 'Pacific Logistics Co', contact: 'Grace Tanaka', email: 'gtanaka@paclog.co.jp', phone: '+81 3 5550 7733', country: 'Japan', rating: 3.9, onTimeRate: 84, status: 'On Hold' },
  { id: 'SUP-005', name: 'Tokyo Precision Tools', contact: 'Hiroshi Sato', email: 'hsato@tokyoprecision.jp', phone: '+81 45 5550 2244', country: 'Japan', rating: 4.7, onTimeRate: 95, status: 'Active' },
  { id: 'SUP-006', name: 'Amsterdam Hardware BV', contact: 'Sanne de Vries', email: 'sanne@amshardware.nl', phone: '+31 20 5550 6677', country: 'Netherlands', rating: 4.4, onTimeRate: 92, status: 'Active' },
  { id: 'SUP-007', name: 'Lyon Packaging SARL', contact: 'Théo Moreau', email: 't.moreau@lyonpack.fr', phone: '+33 4 5550 1188', country: 'France', rating: 4.0, onTimeRate: 87, status: 'Active' },
  { id: 'SUP-008', name: 'Austin Tech Depot', contact: 'Maria Gonzales', email: 'maria@austintech.com', phone: '+1 512 555 0192', country: 'USA', rating: 4.5, onTimeRate: 93, status: 'Active' },
  { id: 'SUP-009', name: 'Warsaw Metal Works', contact: 'Piotr Kowalski', email: 'pkowalski@warsawmetal.pl', phone: '+48 22 5550 3355', country: 'Poland', rating: 3.8, onTimeRate: 81, status: 'On Hold' },
  { id: 'SUP-010', name: 'Oslo Safety Gear', contact: 'Ingrid Berg', email: 'ingrid@oslosafety.no', phone: '+47 2 5550 9944', country: 'Norway', rating: 4.3, onTimeRate: 90, status: 'Active' },
]

export const listSuppliers = () => [...suppliers]
export const getSupplier = (id: string) => suppliers.find((supplier) => supplier.id === id)
export const createSupplier = (supplier: Omit<Supplier, 'id'>) => {
  const created = { ...supplier, id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}` }
  suppliers = [created, ...suppliers]
  return created
}
export const updateSupplier = (id: string, updates: Partial<Supplier>) => {
  suppliers = suppliers.map((supplier) => supplier.id === id ? { ...supplier, ...updates } : supplier)
  return getSupplier(id)
}
```

- [ ] **Step 2: Build the page in `src/pages/suppliers.tsx`**

- Table: name (font-medium), contact, email, phone, country, rating (render 5 stars via lucide `Star` `className="size-3 fill-status-warning text-status-warning"` filled for `Math.round(rating)` + muted numeric `rating.toFixed(1)`), onTimeRate (`${value}%` tabular-nums), status Badge (Active → status-success, On Hold → status-warning patterns), actions: Pencil only (no delete — referenced by POs).
- Supplier Dialog (add/edit): name, contact, email, phone, country Inputs; rating Input type number min 0 max 5 step 0.1; onTimeRate Input number; status Select (Active/On Hold). Toast `t('supplierSaved')`.
- PageHeader actions: Add button `t('addSupplier')`.

- [ ] **Step 3: Verify + commit**

Run: `bun run lint && bun run build` — exit 0.
Commit: `git add src/lib/data/suppliers.ts src/pages/suppliers.tsx && git commit -m "feat: add suppliers directory page with rating display"`

---

### Task 6: HR page + data

**Files:**
- Create: `src/lib/data/hr.ts`
- Modify: `src/pages/hr.tsx` (replace stub)

**Interfaces:**
- Consumes: `Employee`, `OpenPosition` from Task 1.
- Produces: `listEmployees(): Employee[]`, `createEmployee(employee: Omit<Employee, 'id'>): Employee`, `updateEmployee(id: string, updates: Partial<Employee>): Employee | undefined`, `listOpenPositions(): OpenPosition[]` (read-only).

- [ ] **Step 1: Create `src/lib/data/hr.ts`**

```ts
import type { Employee, OpenPosition } from './types'

let employees: Employee[] = [
  { id: 'EMP-001', name: 'Olivia Martin', position: 'Engineering Manager', department: 'Engineering', email: 'olivia@example.com', startDate: '2022-03-14', status: 'Active' },
  { id: 'EMP-002', name: 'Jackson Lee', position: 'Frontend Engineer', department: 'Engineering', email: 'jackson@example.com', startDate: '2023-06-05', status: 'Remote' },
  { id: 'EMP-003', name: 'Isabella Nguyen', position: 'Product Designer', department: 'Design', email: 'isabella@example.com', startDate: '2023-01-16', status: 'Active' },
  { id: 'EMP-004', name: 'William Kim', position: 'DevOps Engineer', department: 'Engineering', email: 'william@example.com', startDate: '2022-09-01', status: 'On Leave' },
  { id: 'EMP-005', name: 'Emma Davis', position: 'Account Executive', department: 'Sales', email: 'emma@example.com', startDate: '2021-11-22', status: 'Active' },
  { id: 'EMP-006', name: 'Noah Patel', position: 'Data Analyst', department: 'Analytics', email: 'noah@example.com', startDate: '2024-02-12', status: 'Active' },
  { id: 'EMP-007', name: 'Ava Thompson', position: 'HR Generalist', department: 'People', email: 'ava@example.com', startDate: '2023-04-03', status: 'Active' },
  { id: 'EMP-008', name: 'Liam Rodriguez', position: 'Warehouse Supervisor', department: 'Operations', email: 'liam@example.com', startDate: '2021-08-17', status: 'Active' },
  { id: 'EMP-009', name: 'Sofia Rossi', position: 'Financial Analyst', department: 'Finance', email: 'sofia@example.com', startDate: '2024-05-27', status: 'Remote' },
  { id: 'EMP-010', name: 'Ethan Brooks', position: 'Support Lead', department: 'Customer Success', email: 'ethan@example.com', startDate: '2022-12-05', status: 'Active' },
  { id: 'EMP-011', name: 'Mia Johnson', position: 'Content Strategist', department: 'Marketing', email: 'mia@example.com', startDate: '2023-10-09', status: 'On Leave' },
  { id: 'EMP-012', name: 'Lucas Weber', position: 'Backend Engineer', department: 'Engineering', email: 'lucas@example.com', startDate: '2024-01-08', status: 'Active' },
  { id: 'EMP-013', name: 'Chloe Dupont', position: 'Recruiter', department: 'People', email: 'chloe@example.com', startDate: '2023-07-19', status: 'Active' },
  { id: 'EMP-014', name: 'Daniel Okafor', position: 'QA Engineer', department: 'Engineering', email: 'daniel@example.com', startDate: '2020-06-01', status: 'Offboarded' },
]

let openPositions: OpenPosition[] = [
  { id: 'POS-001', title: 'Senior Backend Engineer', department: 'Engineering', applicants: 34, postedAt: '2026-10-20' },
  { id: 'POS-002', title: 'Product Marketing Manager', department: 'Marketing', applicants: 18, postedAt: '2026-10-14' },
  { id: 'POS-003', title: 'Warehouse Associate', department: 'Operations', applicants: 52, postedAt: '2026-10-08' },
  { id: 'POS-004', title: 'UX Researcher', department: 'Design', applicants: 11, postedAt: '2026-09-29' },
  { id: 'POS-005', title: 'Sales Development Rep', department: 'Sales', applicants: 27, postedAt: '2026-09-22' },
]

export const listEmployees = () => [...employees]
export const listOpenPositions = () => [...openPositions]
export const createEmployee = (employee: Omit<Employee, 'id'>) => {
  const created = { ...employee, id: `EMP-${String(employees.length + 1).padStart(3, '0')}` }
  employees = [created, ...employees]
  return created
}
export const updateEmployee = (id: string, updates: Partial<Employee>) => {
  employees = employees.map((employee) => employee.id === id ? { ...employee, ...updates } : employee)
  return employees.find((employee) => employee.id === id)
}
```

- [ ] **Step 2: Build the page in `src/pages/hr.tsx`**

- StatCards: headcount (status !== 'Offboarded'), on leave today (status === 'On Leave'), open positions (listOpenPositions().length).
- Employee DataTable: name (font-medium), position, department, email, startDate, status Badge map: Active → `bg-status-success/15 text-status-success`, On Leave → `bg-status-warning/15 text-status-warning`, Remote → `bg-chart-1/15 text-chart-1`, Offboarded → `bg-muted text-muted-foreground`.
- Open Positions Card below the table (`Card` + `CardHeader` title `t('openPositions')` + `CardContent`): simple table (plain `<table>` like finance uses, not DataTable) with columns title (font-medium), department, applicants (tabular-nums), postedAt.
- Employee Dialog (add/edit): name, position, department, email Inputs; startDate Input type date; status Select (4 EmployeeStatus options). Toast reuse `t('assetSaved')` pattern — add key `employeeSaved` to i18n in this task (en 'Employee saved', de 'Mitarbeiter gespeichert', fr 'Employé enregistré') if not already added in Task 1.
- PageHeader actions: Add button `t('addEmployee')`.

- [ ] **Step 3: Verify + commit**

Run: `bun run lint && bun run build` — exit 0.
Commit: `git add src/lib/data/hr.ts src/pages/hr.tsx && git commit -m "feat: add HR employee directory page with open positions"`

---

## Self-Review Notes

- Spec coverage: nav group ✓ (Task 1), 5 pages ✓ (Tasks 2–6), StatCards ✓, badges ✓, Sheet detail for Assets/Procurement ✓, dialogs for Assets/Suppliers/HR ✓, read-only Inventory ✓, no delete for Suppliers ✓, i18n 3 locales ✓.
- Type consistency: `POStatus` used in Task 3, `poTotal` exported and consumed only in Task 3, `Asset`/`Supplier`/`Employee` field names consistent between data and page tasks.
- No placeholders: all mock data, key lists, class maps, and CRUD signatures are concrete.
