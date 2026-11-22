## File Structure

| File | Responsibility |
|---|---|
| `src/lib/navigation.ts` | Update nav items: distinct titles, icons, translationKeys per report |
| `src/i18n/index.ts` | Add translation keys: `salesReport`, `financeReport`, `inventoryReport`, `customerReport`, `hrReport`, `procurementReport`, `exportExcel`, `exportPdf`, `dateFrom`, `dateTo`, `applyFilters`, `clearFilters` (en/de/fr) |
| `src/lib/report-utils.ts` | Extend: `ReportFilters` type, `useReportData` accepts filters |
| `src/components/shared/report-filters.tsx` | **New** — shared filter bar (date range, status select, search input, Apply/Clear buttons) |
| `src/lib/export-data.ts` | **New** — `exportToExcel`, `exportToPdf` wrappers (dynamic import xlsx/jspdf to keep bundle lean) |
| `src/components/shared/report-toolbar.tsx` | Update: add Excel/PDF export buttons alongside CSV |
| `src/pages/reports/sales.tsx` | Wire filters + new exports |
| `src/pages/reports/finance.tsx` | Wire filters + new exports |
| `src/pages/reports/inventory.tsx` | Wire filters + new exports |
| `src/pages/reports/customers.tsx` | Wire filters + new exports |
| `src/pages/reports/hr.tsx` | Wire filters + new exports |
| `src/pages/reports/procurement.tsx` | Wire filters + new exports |

---

### Task 1: Sidebar nav — distinct report labels & icons

**Files:**
- Modify: `src/lib/navigation.ts:22-28`
- Modify: `src/i18n/index.ts` (en ~line 29, de ~line 802, fr ~line 1578)

**Interfaces:**
- Consumes: existing `NavigationItem` shape (`title`, `href`, `icon`, `group`, `keywords`, `translationKey`)
- Produces: 6 nav items with unique `translationKey`s (`salesReport`, `financeReport`, `inventoryReport`, `customerReport`, `hrReport`, `procurementReport`)

- [ ] **Step 1: Update nav items in `src/lib/navigation.ts`**

Replace the 6 report lines with distinct titles, icons, translationKeys:

```typescript
  { title: 'Sales Report', href: '/reports/sales', icon: ShoppingCart, group: 'reports', keywords: ['sales', 'revenue', 'orders'], translationKey: 'salesReport' },
  { title: 'Finance Report', href: '/reports/finance', icon: CircleDollarSign, group: 'reports', keywords: ['finance', 'income', 'expenses'], translationKey: 'financeReport' },
  { title: 'Inventory Report', href: '/reports/inventory', icon: Warehouse, group: 'reports', keywords: ['stock', 'inventory', 'warehouse'], translationKey: 'inventoryReport' },
  { title: 'Customer Report', href: '/reports/customers', icon: Users, group: 'reports', keywords: ['customers', 'clients'], translationKey: 'customerReport' },
  { title: 'HR Report', href: '/reports/hr', icon: Contact, group: 'reports', keywords: ['employees', 'hr', 'people'], translationKey: 'hrReport' },
  { title: 'Procurement Report', href: '/reports/procurement', icon: Truck, group: 'reports', keywords: ['purchase', 'procurement', 'suppliers'], translationKey: 'procurementReport' },
```

- [ ] **Step 2: Add translation keys in `src/i18n/index.ts`**

Next to `reports:` in each locale block add:

```typescript
        salesReport: 'Sales Report',
        financeReport: 'Finance Report',
        inventoryReport: 'Inventory Report',
        customerReport: 'Customer Report',
        hrReport: 'HR Report',
        procurementReport: 'Procurement Report',
```

German: `'Verkaufsbericht'`, `'Finanzbericht'`, `'Lagerbestand'`, `'Kundenbericht'`, `'HR-Bericht'`, `'Beschaffungsbericht'`.
French: `'Rapport de ventes'`, `'Rapport financier'`, `'Rapport de stock'`, `'Rapport clients'`, `'Rapport RH'`, `'Rapport d'achat'` (escape apostrophe).

- [ ] **Step 3: Verify**

Run: `bun run build` — expect PASS.

---

### Task 2: Shared filter bar component

**Files:**
- Create: `src/components/shared/report-filters.tsx`
- Modify: `src/lib/report-utils.ts`

**Interfaces:**
- Produces:
  - `ReportFilters = { from?: string; to?: string; status?: string; search?: string }`
  - `<ReportToolbar filters onFiltersChange statusOptions exportName exportRows exportColumns />`
  - `applyFilters(rows, filters)` — generic filter helper in `report-utils.ts`

- [ ] **Step 1: Extend `report-utils.ts`**

Add:

```typescript
export type ReportFilters = {
    from?: string
    to?: string
    status?: string
    search?: string
}

export function applyFilters<T extends { date?: string }>(
    rows: T[],
    filters: ReportFilters,
    searchText: (row: T) => string,
): T[] {
    return rows.filter((row) => {
        if (filters.from && (!row.date || row.date < filters.from)) return false
        if (filters.to && (!row.date || row.date > filters.to)) return false
        if (filters.status && filters.status !== 'all') {
            const status = (row as Record<string, unknown>).status
            if (status !== filters.status) return false
        }
        if (filters.search && !searchText(row).toLowerCase().includes(filters.search.toLowerCase())) return false
        return true
    })
}
```

Note: keep existing `useReportData` for range presets; pages can use `applyFilters` with explicit from/to instead. Remove `useReportData` if no page uses it after migration (check with grep first).

- [ ] **Step 2: Create `src/components/shared/report-filters.tsx`**

```typescript
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/shared/date-picker'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { ReportFilters } from '@/lib/report-utils'

export function ReportFilterBar({
    filters,
    onFiltersChange,
    statusOptions,
}: {
    filters: ReportFilters
    onFiltersChange: (filters: ReportFilters) => void
    statusOptions?: string[]
}) {
    const set = (patch: Partial<ReportFilters>) => onFiltersChange({ ...filters, ...patch })
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
            <Filter className="size-4 text-muted-foreground" />
            <DatePicker
                value={filters.from}
                onChange={(value) => set({ from: value })}
                placeholder="From"
                ariaLabel="Filter from date"
            />
            <DatePicker
                value={filters.to}
                onChange={(value) => set({ to: value })}
                placeholder="To"
                ariaLabel="Filter to date"
            />
            {statusOptions && (
                <Select
                    value={filters.status ?? 'all'}
                    onValueChange={(value) => set({ status: value })}
                >
                    <SelectTrigger className="w-36" aria-label="Filter status">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <Input
                className="w-48"
                placeholder="Search..."
                value={filters.search ?? ''}
                onChange={(event) => set({ search: event.target.value })}
                aria-label="Search report data"
            />
            {Object.values(filters).some(Boolean) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({})}
                >
                    <X className="size-4" />
                    Clear
                </Button>
            )}
        </div>
    )
}
```

Note: filters apply **immediately on change** (controlled inputs, no Apply button). The `DataTable`'s own search stays; this is the data-level filter.

- [ ] **Step 3: Verify**

Run: `bun run build` — expect PASS.

---

### Task 3: Excel + PDF export utilities

**Files:**
- Create: `src/lib/export-data.ts`
- Modify: `package.json` (add `xlsx`, `jspdf`, `jspdf-autotable`)

**Interfaces:**
- Produces:
  - `exportToExcel(filename: string, rows: Array<Record<string, unknown>>)`
  - `exportToPdf(filename: string, title: string, rows: Array<Record<string, unknown>>, headers: string[])`

- [ ] **Step 1: Install deps**

Run: `bun add xlsx jspdf jspdf-autotable`

- [ ] **Step 2: Create `src/lib/export-data.ts`**

```typescript
export async function exportToExcel(filename: string, rows: Array<Record<string, unknown>>) {
    if (rows.length === 0) return
    const XLSX = await import('xlsx')
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
    XLSX.writeFile(workbook, filename)
}

export async function exportToPdf(
    filename: string,
    title: string,
    rows: Array<Record<string, unknown>>,
    headers: string[],
) {
    if (rows.length === 0) return
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()
    doc.text(title, 14, 16)
    const values = rows.map((row) => headers.map((header) => String(row[header] ?? '')))
    autoTable(doc, { head: [headers], body: values })
    doc.save(filename)
}
```

Dynamic `import()` keeps them out of the main chunk; Vite code-splits automatically.

- [ ] **Step 3: Verify**

Run: `bun run build` — expect PASS with new split chunks for xlsx/jspdf.

---

### Task 4: Update ReportToolbar with Excel/PDF export

**Files:**
- Modify: `src/components/shared/report-toolbar.tsx`

**Interfaces:**
- Consumes: `exportToExcel`, `exportToPdf` from `export-data.ts`
- Produces: toolbar with 3 export buttons (CSV, Excel, PDF) taking the same filtered `rows`

- [ ] **Step 1: Rewrite toolbar**

```typescript
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { downloadCsv } from '@/lib/export-csv'
import { exportToExcel, exportToPdf } from '@/lib/export-data'
import type { ReportFilters } from '@/lib/report-utils'
import { ReportFilterBar } from '@/components/shared/report-filters'

export function ReportToolbar({
    title,
    filters,
    onFiltersChange,
    statusOptions,
    exportName,
    exportRows,
    exportColumns,
}: {
    title: string
    filters: ReportFilters
    onFiltersChange: (filters: ReportFilters) => void
    statusOptions?: string[]
    exportName: string
    exportRows: Array<Record<string, unknown>>
    exportColumns: { key: string; header: string }[]
}) {
    const base = exportName.replace(/\.csv$/, '')
    const headers = exportColumns.map((column) => column.header)
    const flatRows = exportRows.map((row) =>
        Object.fromEntries(exportColumns.map((column) => [column.header, row[column.key]])),
    )
    return (
        <div className="flex flex-col gap-3">
            <ReportFilterBar
                filters={filters}
                onFiltersChange={onFiltersChange}
                statusOptions={statusOptions}
            />
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadCsv(`${base}.csv`, flatRows)}>
                    <Download className="size-4" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToExcel(`${base}.xlsx`, flatRows)}>
                    <FileSpreadsheet className="size-4" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToPdf(`${base}.pdf`, title, flatRows, headers)}>
                    <FileText className="size-4" /> PDF
                </Button>
            </div>
        </div>
    )
}
```

Note: `exportColumns` maps internal row keys to human headers so all 3 export formats share it.

- [ ] **Step 2: Verify**

Run: `bun run build` — expect PASS.

---

### Task 5: Wire filters + exports into all 6 report pages

**Files:**
- Modify: all files in `src/pages/reports/`

**Pattern per page** (sales example; same for others):

```typescript
const [filters, setFilters] = useState<ReportFilters>({})
const orders = useMemo(() => orderService.list(), [])
const filtered = useMemo(
    () => applyFilters(orders, filters, (o) => `${o.id} ${o.customer} ${o.product}`),
    [orders, filters],
)
```

Then pass `filtered` to **charts, stat cards, DataTable, and exportRows** so everything reflects the filter.

Per-page specifics:

| Page | statusOptions | searchText fields | exportColumns |
|---|---|---|---|
| sales | `['Paid','Pending','Refunded']` | id, customer, product | id, customer, product, status, amount, date |
| finance | `['Income','Expense']` | id, description, category | id, date, description, category, type, status, amount |
| inventory | none (no status) | sku, name, warehouse | sku, name, warehouse, onHand, reserved, reorderPoint, state |
| customers | none | name, email, company | name, email, company, orders, spent, joined |
| hr | `['Active','Remote','On Leave','Offboarded']` | name, position, department | name, position, department, email, startDate, status |
| procurement | `['Pending','Draft','Approved','Received','Cancelled']` | number, supplier | number, supplier, date, expectedDelivery, status, total |

Notes:
- finance `type` field maps to the status filter (Income/Expense).
- inventory "state" column is computed; export it via a derived field (add `state: stockState(item)` to export rows).
- procurement "total" is computed via `procurementService.total(po)`; add `total` to export rows.
- Remove `ReportRange`/`useReportData` usage; date filters replace presets.
- Remove unused imports (`countBy` etc. stay where used).

- [ ] **Step 1: sales.tsx** — wire filters, filtered data everywhere, new toolbar props.
- [ ] **Step 2: finance.tsx** — same.
- [ ] **Step 3: inventory.tsx** — same (no status select).
- [ ] **Step 4: customers.tsx** — same (no status select).
- [ ] **Step 5: hr.tsx** — same.
- [ ] **Step 6: procurement.tsx** — same (include computed total in export rows).
- [ ] **Step 7: Verify**

Run: `bun run lint && bun run build` — expect clean.

---

### Task 6: Browser smoke test + visual check

**Files:** none (verification only)

- [ ] **Step 1: Run dev server** — `bun run dev --port 5199`, login `demo@example.com` / `AteraDemo2026!`
- [ ] **Step 2: Check sidebar** — Reports group shows 6 distinct labeled items with correct icons.
- [ ] **Step 3: Per page** (`/reports/sales`, `/reports/finance`, `/reports/inventory`, `/reports/customers`, `/reports/hr`, `/reports/procurement`):
  - Set date from/to → charts + table + stat cards update.
  - Set status filter → rows narrow.
  - Type in search → rows narrow.
  - Click Clear → resets.
  - Click CSV / Excel / PDF → file downloads with filtered rows only.
- [ ] **Step 4: Fix any findings** found during smoke test.

---

## Self-Review

**Spec coverage:**
- Sidebar distinct names/icons → Task 1
- Filtering for all data (charts + table) → Tasks 2, 5
- Export to Excel/PDF → Tasks 3, 4, 5
- Export reflects filters → Task 5 (exportRows = filtered)

**Placeholder scan:** none — all steps have concrete code.

**Type consistency:** `ReportFilters` defined in Task 2, consumed in Tasks 4 and 5. `exportColumns` shape `{ key, header }` defined in Task 4, used in Task 5.
