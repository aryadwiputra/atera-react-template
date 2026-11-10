# Service Layer + /docs Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a thin typed service layer over the in-memory data modules and wire all pages to consume it, plus an in-app `/docs` page documenting architecture, data layer, components, theming, i18n, and how to add pages.

**Architecture:** Each domain gets one file in `src/services/` exporting a typed interface + a mock implementation that delegates to the existing `src/lib/data/*` functions. Pages swap direct data imports for service calls so a real backend only requires replacing one file per domain. The docs page is a React component at `/docs` using the app's own Tabs/Card components, hardcoded English (developer audience).

**Tech Stack:** React 19, TypeScript, react-router v8, Tailwind v4, shadcn-style components in `src/components/ui/`, Bun.

**Spec:** This plan follows the design approved in chat (thin service layer, pages consume services, docs page with tabs: Architecture, Data Layer, UI Components, Theming, i18n, Adding a Page).

## Global Constraints

- No new npm dependencies.
- Do not modify `src/lib/data/*` — services delegate to them.
- Do not modify `src/components/ui/*`.
- Keep i18n keys as-is; the docs page content is hardcoded English.
- Verification is `bun run lint` (pre-existing warnings acceptable) + `bun run build` (exit 0). There is NO test framework — do not invent one.
- Commit only the files each task lists. Never commit `.opencode/` or `.playwright-mcp/`.
- Icons: lucide-react. Styling: `cn()` from `@/lib/utils`, semantic tokens (bg-background, text-muted-foreground, etc.). No em dashes in code or docs content.

---

## Verified data-layer facts (authoritative)

Every domain in `src/lib/data/` exports these exact functions (verified by grep):

| Module | Exported functions |
|---|---|
| `orders` | `listOrders()`, `getOrder(id)`, `createOrder(Omit<Order,'id'>)`, `updateOrder(id, Partial<Order>)`, `removeOrder(id)` |
| `products` | `listProducts()`, `getProduct(id)`, `createProduct(Omit<Product,'id'|'sales'>)`, `updateProduct(id, Partial<Product>)`, `removeProduct(id)` |
| `customers` | `listCustomers()`, `getCustomer(id)`, `createCustomer(Omit<Customer,'id'>)`, `updateCustomer(id, Partial<Customer>)`, `removeCustomer(id)` |
| `invoices` | `listInvoices()`, `getInvoice(id)`, `createInvoice(Omit<Invoice,'id'>)`, `updateInvoice(id, Partial<Invoice>)`, `removeInvoice(id)` |
| `users` | `listUsers()`, `createUser(Omit<User,'id'|'lastActive'>)`, `updateUser(id, Partial<User>)`, `removeUser(id)` |
| `assets` | `listAssets()`, `getAsset(id)`, `createAsset(Omit<Asset,'id'>)`, `updateAsset(id, Partial<Asset>)`, `removeAsset(id)` |
| `procurement` | `listPurchaseOrders()`, `getPurchaseOrder(id)`, `updatePurchaseOrder(id, Partial<PurchaseOrder>)` |
| `inventory` | `listInventory()` |
| `suppliers` | `listSuppliers()`, `getSupplier(id)`, `createSupplier(Omit<Supplier,'id'>)`, `updateSupplier(id, Partial<Supplier>)` |
| `hr` | `listEmployees()`, `listOpenPositions()`, `createEmployee(Omit<Employee,'id'>)`, `updateEmployee(id, Partial<Employee>)` |
| `calendar` | `listEvents()` |
| `crm` | `listDeals()`, `getDeal(id)`, `createDeal(Omit<Deal,'id'>)` |
| `editor-docs` | `listEditorDocuments()`, `getEditorDocument(id)`, `createEditorDocument(Partial<Pick<EditorDocument,'title'|'content'>>?)`, `updateEditorDocument(id, Partial<...>)`, `removeEditorDocument(id)` |
| `files` | `listFiles()` |
| `finance` | `listTransactions()`, `getTransaction(id)`, `createTransaction(Omit<FinanceTransaction,'id'>)`, `updateTransaction(id, ...)`, `removeTransaction(id)` |
| `kanban` | `listTasks()` |
| `mail` | `listMail()` |
| `notifications` | `listNotifications()` |
| `pos` | `listPosItems()`, `getPosItem(id)`, `listCategories()`, `createOrderFromCart(cartLines, total, paymentMethod, customer, customerEmail)` |
| `profile` | `getProfile()` |

All types live in `src/lib/data/types.ts`. Return types: `list*` return arrays of copies; `get*` return `T | undefined` except `getEditorDocument`/`getProfile` which return nullable/non-nullable.

**Page import map** (files importing each data module — all must be switched to services in the relevant task):

- `orders`: 4 importing files; `products`: 3; `customers`: 4; `invoices`: 4; `users`: 3; `types`: 14 (type-only, keep as-is); each other module: 1 file.
- Import path pattern in pages/components/layouts: `from '@/lib/data/<module>'`. Find consumers with: `grep -rn "from '@/lib/data/" src/pages src/components src/layouts`.

## Service file pattern (use for every domain)

```ts
// src/services/order-service.ts
import { type Order } from '@/lib/data/types'
import { createOrder, getOrder, listOrders, removeOrder, updateOrder } from '@/lib/data/orders'

export interface OrderService {
  list(): Order[]
  get(id: string): Order | undefined
  create(input: Omit<Order, 'id'>): Order
  update(id: string, updates: Partial<Order>): Order | undefined
  remove(id: string): boolean
}

export const orderService: OrderService = {
  list: listOrders,
  get: getOrder,
  create: createOrder,
  update: updateOrder,
  remove: removeOrder,
}
```

Notes:
- Import type with `import { type X }` (project uses `verbatimModuleSyntax`).
- For domains without some operations (e.g. `inventory` has only `list`), the interface only contains what exists. Do not invent CRUD that the mock module does not have.
- `pos`: interface = `listItems()`, `getItem(id)`, `listCategories()`, `createOrder(...)`. `profile`: interface = `get()`.
- Name files `<domain>-service.ts` (singular: `order-service.ts`, `editor-docs-service.ts`).
- In pages, replace e.g. `listOrders()` with `orderService.list()`, `createOrder(x)` with `orderService.create(x)`, etc. Type imports (`import { type Order } from '@/lib/data/types'`) stay unchanged.

---

### Task 1: Core commerce services + page wiring

**Files:**
- Create: `src/services/order-service.ts`, `src/services/product-service.ts`, `src/services/customer-service.ts`, `src/services/invoice-service.ts`, `src/services/user-service.ts`
- Modify: every file under `src/pages/`, `src/components/`, `src/layouts/` that imports from `@/lib/data/{orders,products,customers,invoices,users}` (find with grep; ~4+3+4+4+3 files, some overlap, e.g. search.tsx imports several)

**Interfaces:**
- Produces: `orderService: OrderService`, `productService: ProductService`, `customerService: CustomerService`, `invoiceService: InvoiceService`, `userService: UserService` (exact shape per the pattern above, adjusted to each module's exported functions).

- [ ] **Step 1:** Create the five service files using the pattern, importing types from `@/lib/data/types` and delegating to the mock functions.
- [ ] **Step 2:** Grep `grep -rln "from '@/lib/data/orders'" src` (repeat per module) and switch every consumer to the service (e.g. `listOrders()` → `orderService.list()`). Keep `type` imports as-is.
- [ ] **Step 3:** `bun run lint` — expect no NEW warnings vs baseline. `bun run build` — expect exit 0.
- [ ] **Step 4:** Commit:
```bash
git add src/services/ <modified page/component files>
git commit -m "feat: add core commerce services and wire pages"
```

### Task 2: Enterprise (ERP) services + page wiring

**Files:**
- Create: `src/services/asset-service.ts`, `src/services/procurement-service.ts`, `src/services/inventory-service.ts`, `src/services/supplier-service.ts`, `src/services/hr-service.ts`
- Modify: every file importing from `@/lib/data/{assets,procurement,inventory,suppliers,hr}` (1 file each; assets.tsx, procurement page, inventory.tsx, suppliers.tsx, hr.tsx)

**Interfaces:**
- Produces: `assetService`, `procurementService`, `inventoryService`, `supplierService`, `hrService` (hrService gets `listEmployees()`, `listOpenPositions()`, `createEmployee()`, `updateEmployee()`).

- [ ] **Step 1:** Create the five service files per the pattern and the verified function table above.
- [ ] **Step 2:** Switch the consuming pages to service calls.
- [ ] **Step 3:** `bun run lint && bun run build` — pre-existing warnings only, exit 0.
- [ ] **Step 4:** Commit:
```bash
git add src/services/ <modified page files>
git commit -m "feat: add ERP services and wire pages"
```

### Task 3: App-domain services + page wiring

**Files:**
- Create: `src/services/calendar-service.ts`, `src/services/crm-service.ts`, `src/services/editor-document-service.ts`, `src/services/file-service.ts`, `src/services/finance-service.ts`, `src/services/kanban-service.ts`, `src/services/mail-service.ts`, `src/services/notification-service.ts`, `src/services/pos-service.ts`, `src/services/profile-service.ts`
- Modify: the ~10 files importing from those modules (calendar.tsx, pipeline.tsx, editor.tsx, files.tsx, finance.tsx, kanban.tsx, mail.tsx, notifications consumers, pos.tsx, profile.tsx, plus any dashboard/header components importing notifications/users)

**Interfaces:**
- Produces: `calendarService`, `crmService`, `editorDocumentService`, `fileService`, `financeService`, `kanbanService`, `mailService`, `notificationService`, `posService`, `profileService`.

- [ ] **Step 1:** Create the ten service files. Match each module's exact exports (read-only modules get read-only interfaces).
- [ ] **Step 2:** Switch consumers. After this task, `grep -rn "from '@/lib/data/" src/pages src/components src/layouts | grep -v types` must return ZERO lines.
- [ ] **Step 3:** `bun run lint && bun run build` — pre-existing warnings only, exit 0.
- [ ] **Step 4:** Commit:
```bash
git add src/services/ <modified page files>
git commit -m "feat: add app-domain services and wire pages"
```

### Task 4: /docs page

**Files:**
- Create: `src/pages/docs.tsx`
- Modify: `src/App.tsx` (add `/docs` route next to `/terms` `/privacy`, public, no layout guard; import `lazy` like other public pages or direct import — follow the existing pattern used for TermsPage/PrivacyPage)

**Interfaces:**
- Consumes: nothing from Tasks 1-3 at runtime; documents them.
- Produces: `DocsPage` default export; route `/docs`.

**Content requirements (all hardcoded English, developer audience):**

- [ ] **Step 1:** Build `src/pages/docs.tsx` exporting `DocsPage`:
  - Outer: `<main className="min-h-svh bg-background text-foreground">`, top header with `<AppLogo />` + a "Back to app" link to `/dashboard`, title "Atera Documentation".
  - Body: `max-w-4xl mx-auto px-6 py-10`, tabs from `@/components/ui/tabs` (Tabs, TabsList, TabsTrigger, TabsContent). Tabs: `architecture`, `data`, `components`, `theming`, `i18n`, `pages`.
  - **Architecture tab**: folder-structure list (`src/pages`, `src/layouts`, `src/components/ui`, `src/components/shared`, `src/components/dashboard`, `src/hooks`, `src/lib`, `src/lib/data`, `src/services`, `src/i18n`) each with a one-line responsibility; a "Data flow" section: UI → service layer → data modules → (swap point for REST/GraphQL); note on state: no Redux, `useSyncExternalStore` stores for session/appearance/preferences; routing: `createBrowserRouter` in App.tsx, protected layout guard, placeholder routes.
  - **Data tab**: explain the service pattern with a real code block (the `OrderService` example above), how to swap mock for HTTP: implement `OrderService` with fetch in a new file, change one export. Include the service inventory table (20 services, one line each: name + what it covers).
  - **Components tab**: table of the shared components: `DataTable` (props, filter/sort/paginate/CSV), `StatCard`, `PageHeader`, `PageTransition`, `ConfirmDialog`, `DatePicker`, `EmptyState` + the shadcn-style base in `src/components/ui/` (49 files, Radix-based). Short usage snippet for `DataTable`.
  - **Theming tab**: `@theme` tokens in `src/app.css`, oklch vars, 5 `[data-color]` presets (zinc, blue, violet, rose, orange), `.dark` class, density presets (`--density-space`), container mode, how `useAppearance`/`useCustomizePreferences` apply them.
  - **i18n tab**: `translations` object in `src/i18n/index.ts` (en/de/fr), `useTranslations(language)`, no interpolation (concatenate), TranslationKey type, duplicate-key TS1117 hazard.
  - **Adding a page tab**: numbered recipe: 1) add data module or service, 2) create `src/pages/my-page.tsx` default export with `PageTransition` + `PageHeader` (breadcrumbs `{title, href}`), 3) import in App.tsx + add protected route before the placeholder spread + add path to `explicitPaths`, 4) add entry to `navigation.ts` (title, href, icon, group, translationKey), 5) add i18n keys to all three locales, 6) run `bun run lint && bun run build`.
  - Code blocks: wrap in `<pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs"><code>...</code></pre>`; long prose in `text-sm leading-relaxed text-muted-foreground`; section headings `text-lg font-medium`.
- [ ] **Step 2:** Add the `/docs` route in `src/App.tsx` beside the TermsPage/PrivacyPage routes (public).
- [ ] **Step 3:** `bun run lint && bun run build` — pre-existing warnings only, exit 0.
- [ ] **Step 4:** Commit:
```bash
git add src/pages/docs.tsx src/App.tsx
git commit -m "feat: add in-app documentation page"
```

## Self-Review

Spec coverage: thin service layer (Tasks 1-3), pages consume services (approved by user), docs page with 6 tabs (Task 4). Placeholder scan: service shapes defined exactly per verified exports; docs content specified per tab. Type consistency: file names and export names fixed in the pattern; `editorDocumentService` (not `editorDocsService`) to avoid awkward abbreviation.
