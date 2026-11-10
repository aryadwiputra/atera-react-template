import { Link } from 'react-router'
import AppLogo from '@/components/app-logo'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs">
      <code>{children}</code>
    </pre>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-medium">{children}</h2>
}

const serviceInventory: [name: string, description: string][] = [
  ['orderService', 'orders CRUD (list, get, create, update, remove)'],
  ['productService', 'products CRUD (list, get, create, update, remove)'],
  ['customerService', 'customers CRUD (list, get, create, update, remove)'],
  ['invoiceService', 'invoices CRUD (list, get, create, update, remove)'],
  ['userService', 'users (list, create, update, remove)'],
  ['assetService', 'assets CRUD (list, get, create, update, remove)'],
  ['procurementService', 'purchase orders (list, get, update)'],
  ['inventoryService', 'inventory items (list)'],
  ['supplierService', 'suppliers CRUD (list, get, create, update)'],
  ['hrService', 'employees and open positions (list, create, update)'],
  ['calendarService', 'calendar events (list)'],
  ['crmService', 'CRM deals (list, get, create)'],
  ['editorDocumentService', 'editor documents CRUD (list, get, create, update, remove)'],
  ['fileService', 'files (list)'],
  ['financeService', 'finance transactions CRUD (list, get, create, update, remove)'],
  ['kanbanService', 'kanban tasks (list)'],
  ['mailService', 'mail messages (list)'],
  ['notificationService', 'notifications (list)'],
  ['posService', 'point of sale items, categories and order creation (listItems, getItem, listCategories, createOrder)'],
  ['profileService', 'current user profile (get)'],
]

export default function DocsPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" aria-label="Back to Atera">
            <AppLogo />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">Back to app</Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-medium tracking-tight">Atera Documentation</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A developer oriented guide to the Atera admin dashboard: architecture, data layer, components,
          theming, i18n and the recipe for adding a new page.
        </p>
        <Tabs defaultValue="architecture" className="mt-8 gap-6">
          <TabsList>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="theming">Theming</TabsTrigger>
            <TabsTrigger value="i18n">i18n</TabsTrigger>
            <TabsTrigger value="pages">Adding a page</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>Folder structure</SectionHeading>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li><span className="font-mono text-xs">src/pages</span> - route screens. Most files default-export one page; multi-page files such as commerce.tsx and workspaces.tsx export named pages.</li>
                <li><span className="font-mono text-xs">src/layouts</span> - app shells: protected-layout (auth guard), auth-layout, app-layout (picks sidebar vs top-nav).</li>
                <li><span className="font-mono text-xs">src/components/ui</span> - 49 Radix-based shadcn-style primitives (button, card, dialog, select, tabs and more).</li>
                <li><span className="font-mono text-xs">src/components/shared</span> - cross-cutting pieces: DataTable, StatCard, PageHeader, PageTransition, ConfirmDialog, DatePicker, EmptyState.</li>
                <li><span className="font-mono text-xs">src/components/dashboard</span> - dashboard widgets (metric-card, overview-chart, traffic-sources, goals-card, activity-card, recent-orders).</li>
                <li><span className="font-mono text-xs">src/hooks</span> - custom hooks: use-auth, use-appearance, use-customize-preferences, use-mobile, use-navigation.</li>
                <li><span className="font-mono text-xs">src/lib</span> - utilities: cn() in utils.ts, auth.ts session store, navigation.ts nav tree.</li>
                <li><span className="font-mono text-xs">src/lib/data</span> - 21 in-memory mock data modules with typed CRUD functions.</li>
                <li><span className="font-mono text-xs">src/services</span> - 20 typed service files, one per domain, delegating to the data modules.</li>
                <li><span className="font-mono text-xs">src/i18n</span> - translation dictionary and the useTranslations hook.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <SectionHeading>Data flow</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The app is frontend only. Data flows in one direction: UI components call the service layer,
                which delegates to the in-memory data modules. The service interface is the swap point: to
                move to a real backend you replace the mock implementation with fetch or GraphQL calls in
                one file per domain, without touching a single page.
              </p>
              <CodeBlock>{`UI (pages, components)
  -> service layer (src/services/*-service.ts)
  -> data modules (src/lib/data/*)
  -> swap point for a real REST / GraphQL backend`}</CodeBlock>
            </div>
            <div className="space-y-3">
              <SectionHeading>State</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                There is no Redux or Zustand. Shared state lives in hand-rolled external stores consumed
                through useSyncExternalStore: session (use-auth + lib/auth.ts, persisted in localStorage),
                appearance (light/dark/system) and customization preferences (color, density, layout,
                container). Local state stays local with useState.
              </p>
            </div>
            <div className="space-y-3">
              <SectionHeading>Routing</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                App.tsx builds the route tree with createBrowserRouter (react-router v8) for 63 routes.
                App routes live under ProtectedLayout, which guards them and redirects unauthenticated
                users to /login. Navigation items without an explicit route fall back to AppPlaceholder
                through the computed placeholderRoutes spread.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>The service pattern</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every domain has one file in src/services exporting a typed interface plus a mock
                implementation that delegates to the existing src/lib/data module. All entity types live
                in src/lib/data/types.ts. Here is the order domain:
              </p>
              <CodeBlock>{`// src/services/order-service.ts
import { type Order } from '@/lib/data/types'
import { createOrder, getOrder, listOrders, removeOrder, updateOrder } from '@/lib/data/orders'

export interface OrderService {
  list(): Order[]
  get(id: string): Order | undefined
  create(input: Omit<Order, 'id'>): Order
  update(id: string, updates: Partial<Order>): Order | undefined
  remove(id: string): void
}

export const orderService: OrderService = {
  list: listOrders,
  get: getOrder,
  create: createOrder,
  update: updateOrder,
  remove: removeOrder,
}`}</CodeBlock>
            </div>
            <div className="space-y-3">
              <SectionHeading>Swapping mock for HTTP</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Because pages only depend on the interface, moving to a real backend means implementing
                the same interface with fetch in a new file and changing one export. Nothing else moves.
              </p>
              <CodeBlock>{`// src/services/http-order-service.ts (future)
export const httpOrderService: OrderService = {
  async list() {
    const response = await fetch('/api/orders')
    return response.json()
  },
  // ...same shape for get, create, update, remove
}

// one-line swap at the consumption site or in an index barrel
import { httpOrderService as orderService } from '@/services/http-order-service'`}</CodeBlock>
            </div>
            <div className="space-y-3">
              <SectionHeading>Service inventory</SectionHeading>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-medium">Service</th>
                      <th className="px-4 py-2 font-medium">Covers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceInventory.map(([name, description]) => (
                      <tr key={name} className="border-b last:border-b-0">
                        <td className="px-4 py-2 font-mono text-xs">{name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>Base primitives</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The base layer is src/components/ui: 49 files, Radix-based shadcn-style primitives
                (button, card, dialog, select, input, sheet, sidebar, command, dropdown-menu, tooltip,
                avatar, badge, breadcrumb, separator, skeleton, tabs and more). Build on these before
                adding another component system. Icons come from lucide-react, charts from recharts.
              </p>
            </div>
            <div className="space-y-3">
              <SectionHeading>Shared components</SectionHeading>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-medium">Component</th>
                      <th className="px-4 py-2 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">DataTable</td>
                      <td className="px-4 py-2 text-muted-foreground">Generic TanStack table wrapper with text filter, column sorting, pagination, column visibility and CSV export. Also renders a mobile card layout via renderMobileCard.</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">StatCard</td>
                      <td className="px-4 py-2 text-muted-foreground">Metric tile with title, value, change indicator and optional lucide icon.</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">PageHeader</td>
                      <td className="px-4 py-2 text-muted-foreground">Page title, optional description, actions slot and breadcrumbs.</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">PageTransition</td>
                      <td className="px-4 py-2 text-muted-foreground">Wraps page content for consistent route change animation.</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">ConfirmDialog</td>
                      <td className="px-4 py-2 text-muted-foreground">Confirmation dialog for destructive actions.</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">DatePicker</td>
                      <td className="px-4 py-2 text-muted-foreground">Calendar based date input.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">EmptyState</td>
                      <td className="px-4 py-2 text-muted-foreground">Empty table and empty screen placeholders.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-3">
              <SectionHeading>DataTable usage</SectionHeading>
              <CodeBlock>{`import { DataTable, createAppColumnHelper } from '@/components/shared/data-table'
import { orderService } from '@/services/order-service'

const columnHelper = createAppColumnHelper<Order>()
const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('customerName', { header: 'Customer' }),
  columnHelper.accessor('status', { header: 'Status' }),
]

export function OrderList() {
  return <DataTable columns={columns} data={orderService.list()} />
}`}</CodeBlock>
            </div>
          </TabsContent>

          <TabsContent value="theming" className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>Design tokens</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The single source of truth is the Tailwind v4 @theme block in src/app.css. Tokens are
                oklch CSS variables using the shadcn palette (background, foreground, card, primary,
                secondary, muted, accent, destructive, border, ring and more).
              </p>
            </div>
            <div className="space-y-3">
              <SectionHeading>Color presets</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Five color presets ship out of the box, selected through [data-color] on the html
                element: zinc, blue, violet, rose and orange. Each preset redefines the accent tokens;
                the .dark class flips the palette for dark mode. The appearance store (use-appearance)
                persists light, dark or system and toggles the class on document.documentElement.
              </p>
            </div>
            <div className="space-y-3">
              <SectionHeading>Density and container</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The customization store (use-customize-preferences) applies density and layout choices
                as data attributes on html plus the --density-space CSS variable, so spacing scales
                without JavaScript recalculations. Container mode switches the app shell between full
                width and a centered max width. All choices persist in cookies and are re-applied by
                initializeTheme() and initializeCustomizePreferences() in main.tsx before render.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="i18n" className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>Dictionary</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Translations live in the hand-rolled translations object in src/i18n/index.ts with three
                locales: en, de and fr. Pages consume them through useTranslations(language), where the
                language comes from the customization store, and the hook also sets
                document.documentElement.lang.
              </p>
            </div>
            <div className="space-y-3">
              <SectionHeading>No interpolation</SectionHeading>
              <p className="text-sm leading-relaxed text-muted-foreground">
                There is no interpolation helper. TranslationKey is keyof typeof translations.en, so a
                key must exist in the en dictionary or TypeScript fails. To compose dynamic text,
                concatenate the translated fragment with the dynamic value at the call site.
              </p>
              <CodeBlock>{`const { language } = useCustomizePreferences()
const t = useTranslations(language)

// composed at the call site, not in the dictionary
<p>{t('total')}: {orderService.get(id)?.total}</p>`}</CodeBlock>
              <p className="text-sm leading-relaxed text-muted-foreground">
                One hazard to know: duplicate keys inside the same locale object trigger TS1117 at build
                time. If a key seems ignored, check for a duplicate further down the dictionary.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <div className="space-y-3">
              <SectionHeading>Adding a page</SectionHeading>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>Add a data module in src/lib/data (or reuse one) and a matching service file in src/services.</li>
                <li>Create src/pages/my-page.tsx with a default export. Wrap content in PageTransition and PageHeader with breadcrumbs ({'{'}title, href{'}'} items).</li>
                <li>Import the page in src/App.tsx, add a protected route inside the ProtectedLayout children (before the placeholderRoutes spread) and add the path to explicitPaths.</li>
                <li>Add an entry to src/lib/navigation.ts with title, href, icon, group and translationKey.</li>
                <li>Add the i18n keys to all three locales in src/i18n/index.ts.</li>
                <li>Run bun run lint and bun run build. Both must pass.</li>
              </ol>
            </div>
            <div className="space-y-3">
              <SectionHeading>Skeleton</SectionHeading>
              <CodeBlock>{`import { PageTransition } from '@/components/shared/page-transition'
import { PageHeader } from '@/components/shared/page-header'

export default function MyPage() {
  return (
    <PageTransition>
      <PageHeader
        title="My page"
        description="What this page shows."
        breadcrumbs={[{ title: 'Home', href: '/dashboard' }, { title: 'My page' }]}
      />
    </PageTransition>
  )
}`}</CodeBlock>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
