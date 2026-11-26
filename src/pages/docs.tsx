import { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Check, Copy, Link2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { HashLink } from '@/components/landing/hash-link';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/use-page-meta';
import { cn } from '@/lib/utils';

const SectionContext = createContext('');

function slugify(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function CodeBlock({ children, label = 'Code' }: { children: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(children);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = children;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border bg-muted/40">
            <div className="flex items-center justify-between gap-2 border-b bg-background/60 px-3 py-1.5">
                <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-2 text-[11px]"
                    onClick={copyCode}
                    aria-label={copied ? 'Copied code' : 'Copy code'}
                >
                    {copied ? (
                        <Check aria-hidden className="size-3.5" />
                    ) : (
                        <Copy aria-hidden className="size-3.5" />
                    )}
                    <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                </Button>
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                <code>{children}</code>
            </pre>
        </div>
    );
}

function SectionHeading({ children }: { children: string }) {
    const sectionId = useContext(SectionContext);
    const id = `${sectionId}-${slugify(children)}`;

    return (
        <h3
            id={id}
            aria-label={children}
            className="group flex scroll-mt-24 items-center gap-2 text-base font-semibold"
        >
            {children}
            <HashLink
                href={`#${id}`}
                aria-label={`Link to ${children}`}
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
                <Link2 aria-hidden className="size-4" />
            </HashLink>
        </h3>
    );
}

function DocsSection({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <SectionContext.Provider value={id}>
            <section
                id={id}
                aria-labelledby={`${id}-heading`}
                className="scroll-mt-24 border-t pt-8 first:border-t-0 first:pt-0"
            >
                <h2
                    id={`${id}-heading`}
                    aria-label={title}
                    className="group flex scroll-mt-24 items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
                >
                    {title}
                    <HashLink
                        href={`#${id}`}
                        aria-label={`Link to ${title}`}
                        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    >
                        <Link2 aria-hidden className="size-4" />
                    </HashLink>
                </h2>
                <div className="mt-5 space-y-6">{children}</div>
            </section>
        </SectionContext.Provider>
    );
}

const docsSections = [
    { id: 'getting-started', label: 'Getting started' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'data', label: 'Data layer' },
    { id: 'components', label: 'UI components' },
    { id: 'theming', label: 'Theming' },
    { id: 'i18n', label: 'i18n' },
    { id: 'pages', label: 'Adding a page' },
    { id: 'testing', label: 'Testing' },
    { id: 'deployment', label: 'Deployment' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
] as const;

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
    [
        'posService',
        'point of sale items, categories and order creation (listItems, getItem, listCategories, createOrder)',
    ],
    ['profileService', 'current user profile (get)'],
];

export default function DocsPage() {
    usePageMeta();
    const [active, setActive] = useState<string>(docsSections[0].id);

    useEffect(() => {
        const onScroll = () => {
            let current: string = docsSections[0].id;

            for (const section of docsSections) {
                const element = document.getElementById(section.id);
                if (element && element.getBoundingClientRect().top <= 140) current = section.id;
            }

            setActive(current);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <main className="min-h-svh bg-background text-foreground">
            <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link
                            to="/"
                            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <AppLogo />
                        </Link>
                        <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
                        <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                            Documentation
                        </span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard">Back to app</Link>
                    </Button>
                </div>
            </header>

            <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:pt-14">
                <div className="max-w-3xl">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Atera documentation
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        A developer guide to the Atera admin dashboard: setup, architecture, data
                        layer, components, theming, i18n, testing, deployment and troubleshooting.
                    </p>
                </div>

                <nav
                    aria-label="Documentation sections"
                    className="mt-8 flex gap-1 overflow-x-auto pb-1 lg:hidden"
                >
                    {docsSections.map((section) => (
                        <HashLink
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => setActive(section.id)}
                            aria-current={active === section.id ? 'location' : undefined}
                            className={cn(
                                'shrink-0 rounded-md border px-3 py-1.5 text-sm transition-colors',
                                active === section.id
                                    ? 'border-primary/30 bg-primary/10 text-foreground'
                                    : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            {section.label}
                        </HashLink>
                    ))}
                </nav>

                <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <p className="text-xs font-medium text-muted-foreground">
                                On this page
                            </p>
                            <nav
                                aria-label="Documentation sections"
                                className="mt-3 flex flex-col border-l"
                            >
                                {docsSections.map((section) => (
                                    <HashLink
                                        key={section.id}
                                        href={`#${section.id}`}
                                        onClick={() => setActive(section.id)}
                                        aria-current={
                                            active === section.id ? 'location' : undefined
                                        }
                                        className={cn(
                                            '-ml-px border-l-2 px-4 py-1.5 text-sm transition-colors',
                                            active === section.id
                                                ? 'border-primary font-medium text-foreground'
                                                : 'border-transparent text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {section.label}
                                    </HashLink>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <article className="min-w-0 max-w-3xl space-y-10">
                        <DocsSection id="getting-started" title="Getting started">
                            <div className="space-y-3">
                                <SectionHeading>Requirements</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Bun 1.4+ for installs and scripts, and Node 20+ for the Vite
                                    toolchain. No environment variables are required for local
                                    development. The app has no backend; orders persist in the
                                    browser through IndexedDB.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Run the app</SectionHeading>
                                <CodeBlock label="bash">{`bun install
bun run dev`}</CodeBlock>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Open the URL printed by Vite, usually
                                    <span className="font-mono text-xs">
                                        {' '}
                                        http://localhost:5173
                                    </span>
                                    . Sign in with the demo account:
                                </p>
                                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                                    <p>
                                        Email:{' '}
                                        <span className="font-mono text-xs">demo@example.com</span>
                                    </p>
                                    <p className="mt-1">
                                        Password:{' '}
                                        <span className="font-mono text-xs">AteraDemo2026!</span>
                                    </p>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The demo login is a local gate, not production authentication.
                                    Credentials stay in this browser.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Scripts</SectionHeading>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Script</th>
                                                <th className="px-4 py-2 font-medium">Does</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                ['bun run dev', 'Start the Vite dev server'],
                                                ['bun run build', 'Type-check and build to dist/'],
                                                ['bun run preview', 'Serve the production build'],
                                                ['bun run lint', 'Run oxlint'],
                                                ['bun run typecheck', 'Run tsc -b'],
                                                ['bun run test', 'Run Vitest once'],
                                                ['bun run test:watch', 'Run Vitest in watch mode'],
                                                ['bun run test:e2e', 'Run Playwright projects'],
                                                ['bun run format', 'Format with Prettier'],
                                                ['bun run format:check', 'Verify formatting'],
                                                [
                                                    'bun run perf:budget',
                                                    'Enforce initial bundle gzip budgets',
                                                ],
                                            ].map(([script, description]) => (
                                                <tr
                                                    key={script}
                                                    className="border-b last:border-b-0"
                                                >
                                                    <td className="px-4 py-2 font-mono text-xs">
                                                        {script}
                                                    </td>
                                                    <td className="px-4 py-2 text-muted-foreground">
                                                        {description}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>What persists</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Orders are local-first. They survive reloads in IndexedDB, and
                                    the Local workspace bar can export, import or reset them. Other
                                    domains still use in-memory mock modules, so their edits reset
                                    on reload. The embedded landing preview uses a separate database
                                    and an in-memory demo session, so it never touches your data.
                                </p>
                            </div>
                        </DocsSection>

                        <DocsSection id="architecture" title="Architecture">
                            <div className="space-y-3">
                                <SectionHeading>Folder structure</SectionHeading>
                                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                                    <li>
                                        <span className="font-mono text-xs">src/pages</span> - route
                                        screens. Most files default-export one page; multi-page
                                        files such as commerce.tsx and workspaces.tsx export named
                                        pages.
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/layouts</span> - app
                                        shells: protected-layout (auth guard), auth-layout,
                                        app-layout (picks sidebar vs top-nav).
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/components/ui</span>{' '}
                                        - 48 Radix-based shadcn-style primitives (button, card,
                                        dialog, select, tabs and more).
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">
                                            src/components/shared
                                        </span>{' '}
                                        - cross-cutting pieces: DataTable, StatCard, PageHeader,
                                        PageTransition, ConfirmDialog, DatePicker, EmptyState.
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">
                                            src/components/dashboard
                                        </span>{' '}
                                        - dashboard widgets (metric-card, overview-chart,
                                        traffic-sources, goals-card, activity-card, recent-orders).
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/hooks</span> -
                                        custom hooks: use-auth, use-appearance,
                                        use-customize-preferences, use-mobile, use-navigation.
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/lib</span> -
                                        utilities: cn() in utils.ts, auth.ts session store,
                                        navigation.ts nav tree.
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/lib/data</span> - 24
                                        in-memory mock data modules with typed CRUD functions.
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/services</span> - 24
                                        typed service files, one per domain. Orders delegates to its
                                        repository adapter; the other domains delegate to data
                                        modules.
                                    </li>
                                    <li>
                                        <span className="font-mono text-xs">src/i18n</span> -
                                        translation dictionary and the useTranslations hook.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Data flow</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The app is frontend only, but orders are local-first. Pages use
                                    TanStack Query hooks, the service layer delegates to a
                                    repository backed by IndexedDB through Dexie, and the repository
                                    is the swap point for a real API. Other domains still use
                                    services over in-memory data modules.
                                </p>
                                <CodeBlock>{`UI (pages, components)
  -> query hooks (src/features/orders/api.ts) for orders
  -> service layer (src/services/*-service.ts)
  -> repository adapter (src/repositories/*) for orders
  -> IndexedDB via Dexie (src/lib/db/database.ts)
  -> other domains: in-memory modules (src/lib/data/*)`}</CodeBlock>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>State</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    There is no Redux or Zustand. Persisted order state lives in
                                    TanStack Query, with optimistic mutations and rollback. Shared
                                    UI state uses hand-rolled external stores consumed through
                                    useSyncExternalStore: session (use-auth + lib/auth.ts, persisted
                                    in localStorage), appearance (light/dark/system) and theme
                                    preferences (accent, neutral, radius, font, density, layout,
                                    sidebar, header, container, chart, motion, language, persisted
                                    in localStorage with a cookie bootstrap). Local state stays
                                    local with useState.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Routing</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    App.tsx builds the route tree with createBrowserRouter
                                    (react-router v8) and lazy-loads every page. App routes live
                                    under ProtectedLayout, which guards them and redirects
                                    unauthenticated users to /login. Navigation items without an
                                    explicit route fall back to AppPlaceholder through the computed
                                    placeholderRoutes spread.
                                </p>
                            </div>
                        </DocsSection>

                        <DocsSection id="data" title="Data layer">
                            <div className="space-y-3">
                                <SectionHeading>The service pattern</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Every domain has one file in src/services exporting a typed
                                    interface. Orders delegates to a repository adapter backed by
                                    Dexie; the other domains delegate to the in-memory module in
                                    src/lib/data. All entity types live in src/lib/data/types.ts.
                                    Here is the order domain:
                                </p>
                                <CodeBlock>{`// src/services/order-service.ts
import { type Order } from '@/lib/data/types'
import { ordersRepository } from '@/repositories'

export interface OrderService {
  list(): Promise<Order[]>
  get(id: string): Promise<Order | undefined>
  create(input: Omit<Order, 'id'>): Promise<Order>
  update(id: string, updates: Partial<Order>): Promise<Order | undefined>
  remove(id: string): Promise<void>
}

export const orderService: OrderService = {
  list: () => ordersRepository.list(),
  get: (id) => ordersRepository.get(id),
  create: (input) => ordersRepository.create(input),
  update: (id, updates) => ordersRepository.update(id, updates),
  remove: (id) => ordersRepository.remove(id),
}`}</CodeBlock>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Swapping mock for HTTP</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Pages and query hooks depend on the service interface, and the
                                    order service depends on the repository interface. To connect a
                                    real API, implement OrdersRepository with fetch and swap the
                                    adapter export; the pages and hooks stay unchanged.
                                </p>
                                <CodeBlock>{`// src/repositories/http-orders-repository.ts (future)
export const httpOrdersRepository: OrdersRepository = {
  async list() {
    const response = await fetch('/api/orders')
    return response.json()
  },
  // ...same shape for get, create, update, remove, export, import, reset
}

// src/repositories/index.ts
export const ordersRepository = httpOrdersRepository`}</CodeBlock>
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
                                                    <td className="px-4 py-2 font-mono text-xs">
                                                        {name}
                                                    </td>
                                                    <td className="px-4 py-2 text-muted-foreground">
                                                        {description}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </DocsSection>

                        <DocsSection id="components" title="UI components">
                            <div className="space-y-3">
                                <SectionHeading>Base primitives</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The base layer is src/components/ui: 48 files, Radix-based
                                    shadcn-style primitives (button, card, dialog, select, input,
                                    sheet, sidebar, command, dropdown-menu, tooltip, avatar, badge,
                                    breadcrumb, separator, skeleton, tabs and more). Build on these
                                    before adding another component system. Icons come from
                                    lucide-react, charts from recharts.
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
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    DataTable
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Generic TanStack table wrapper with text filter,
                                                    column sorting, pagination, column visibility
                                                    and CSV export. Also renders a mobile card
                                                    layout via renderMobileCard.
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    StatCard
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Metric tile with title, value, change indicator
                                                    and optional lucide icon.
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    PageHeader
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Page title, optional description, actions slot
                                                    and breadcrumbs.
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    PageTransition
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Wraps page content for consistent route change
                                                    animation.
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    ConfirmDialog
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Confirmation dialog for destructive actions.
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    DatePicker
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Calendar based date input.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    EmptyState
                                                </td>
                                                <td className="px-4 py-2 text-muted-foreground">
                                                    Empty table and empty screen placeholders.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>DataTable usage</SectionHeading>
                                <CodeBlock>{`import { DataTable, createAppColumnHelper } from '@/components/shared/data-table'
import { useOrders } from '@/features/orders/api'

const columnHelper = createAppColumnHelper<Order>()
const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('customer', { header: 'Customer' }),
  columnHelper.accessor('status', { header: 'Status' }),
]

export function OrderList() {
  const { data = [] } = useOrders()
  return <DataTable columns={columns} data={data} />
}`}</CodeBlock>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>DataTable: client or server</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Without the server prop, DataTable filters, sorts, slices and
                                    exports the data you pass in. With the server prop, DataTable
                                    renders the current page exactly as given and reports intent
                                    through callbacks; your query owns filtering, sorting, paging
                                    and loading. The component never fetches by itself.
                                </p>
                                <CodeBlock label="tsx">{`const [page, setPage] = useState(1)
const [pageSize, setPageSize] = useState(10)
const [sort, setSort] = useState<SortState>(null)
const [filter, setFilter] = useState('')

<DataTable
  columns={columns}
  data={rows}
  filterPlaceholder="Search people..."
  server={{
    rowCount: total,
    page,
    pageSize,
    sort,
    filter,
    isLoading,
    onPageChange: setPage,
    onPageSizeChange: (size) => {
      setPageSize(size)
      setPage(1)
    },
    onSortChange: (next) => {
      setSort(next)
      setPage(1)
    },
    onFilterChange: (value) => {
      setFilter(value)
      setPage(1)
    },
  }}
/>`}</CodeBlock>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    See the client and server demos under Apps → Data Table in the
                                    sidebar for working versions.
                                </p>
                            </div>
                        </DocsSection>

                        <DocsSection id="theming" title="Theming">
                            <div className="space-y-3">
                                <SectionHeading>Design tokens</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The single source of truth is the Tailwind v4 @theme block in
                                    src/app.css. Tokens are oklch CSS variables using the shadcn
                                    palette (background, foreground, card, primary, secondary,
                                    muted, accent, destructive, border, ring and more).
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Theme Studio</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The Theme Studio sheet combines presets with individual
                                    controls: accent, neutral base, chart palette, radius, typeface,
                                    density, layout, sidebar style and width, header mode, container
                                    and motion. A preset bundles accent, neutral, radius and chart;
                                    accent only changes the accent color. Choices are applied as
                                    data attributes on html and stored in localStorage under
                                    atera_theme, with a cookie bootstrap and a small inline script
                                    in index.html to avoid a flash on first paint.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Density and layout</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Density is driven by CSS variables (control height, card
                                    padding, row padding, page and panel gaps, sidebar item height)
                                    that core primitives and page shells consume. Container and
                                    header modes are data attributes on html, so both app layouts
                                    follow the same preference. Reduced motion is honored by CSS and
                                    by the MotionConfig wrapper in the chunks that use Framer
                                    Motion.
                                </p>
                            </div>
                        </DocsSection>

                        <DocsSection id="i18n" title="i18n">
                            <div className="space-y-3">
                                <SectionHeading>Dictionary</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    English ships in the main bundle; German and French live in
                                    src/i18n/locales and load on demand into a useSyncExternalStore
                                    dictionary store, with English as the fallback. Pages consume
                                    them through useTranslations(language), where the language comes
                                    from the theme preferences, and the hook also sets
                                    document.documentElement.lang.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>No interpolation</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    There is no interpolation helper. TranslationKey is keyof typeof
                                    translations.en, so a key must exist in the en dictionary or
                                    TypeScript fails. To compose dynamic text, concatenate the
                                    translated fragment with the dynamic value at the call site.
                                </p>
                                <CodeBlock>{`const { language } = useCustomizePreferences()
const t = useTranslations(language)
const order = useOrder(id)

// composed at the call site, not in the dictionary
<p>{t('total')}: {order.data?.amount}</p>`}</CodeBlock>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    One hazard to know: duplicate keys inside the same locale object
                                    trigger TS1117 at build time. If a key seems ignored, check for
                                    a duplicate further down the dictionary.
                                </p>
                            </div>
                        </DocsSection>

                        <DocsSection id="pages" title="Adding a page">
                            <div className="space-y-3">
                                <SectionHeading>Steps</SectionHeading>
                                <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                                    <li>
                                        Add a data module in src/lib/data (or reuse one) and a
                                        matching service file in src/services.
                                    </li>
                                    <li>
                                        Create src/pages/my-page.tsx with a default export. Wrap
                                        content in PageTransition and PageHeader with breadcrumbs (
                                        {'{'}title, href{'}'} items).
                                    </li>
                                    <li>
                                        Add a lazy import in src/App.tsx, a protected route inside
                                        the ProtectedLayout children (before the placeholderRoutes
                                        spread) and the path to explicitPaths.
                                    </li>
                                    <li>
                                        Add an entry to src/lib/navigation.ts with title, href,
                                        icon, group and translationKey.
                                    </li>
                                    <li>
                                        Add the i18n keys to src/i18n/locales/en.ts (and de/fr for
                                        parity).
                                    </li>
                                    <li>Run bun run lint, bun run typecheck and bun run build.</li>
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
                        </DocsSection>

                        <DocsSection id="testing" title="Testing and quality gates">
                            <div className="space-y-3">
                                <SectionHeading>Commands</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Unit tests use Vitest and Testing Library; end-to-end tests use
                                    Playwright. Install the browsers once before the first E2E run.
                                </p>
                                <CodeBlock label="bash">{`bunx playwright install chromium firefox webkit
bun run test
bun run test:e2e
bun run perf:budget`}</CodeBlock>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>What runs</SectionHeading>
                                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                                    <li>
                                        Unit: auth hashing, preference migration, search, order
                                        service and route fallback.
                                    </li>
                                    <li>
                                        E2E: smoke routes, SEO metadata, a11y, landing preview,
                                        docs, theme studio and controls, DataTable, workspace
                                        persistence and offline mode.
                                    </li>
                                    <li>
                                        Visual: one login-page baseline at 1280x800 in Chromium.
                                    </li>
                                    <li>
                                        Budget: initial JS and CSS gzip sizes from the built
                                        <span className="font-mono text-xs"> dist/ </span>
                                        output.
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Accessibility gate</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The axe suite fails on serious or critical WCAG 2.x AA
                                    violations for the landing page, login, dashboard and orders. It
                                    also scans the users status chips and the open row menu.
                                    Animations are allowed to settle before contrast is checked.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Updating snapshots</SectionHeading>
                                <CodeBlock label="bash">{`bunx playwright test --project=visual --update-snapshots`}</CodeBlock>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Review the new PNG before committing it. Visual changes that are
                                    intentional should update the baseline; everything else is a
                                    regression.
                                </p>
                            </div>
                        </DocsSection>

                        <DocsSection id="deployment" title="Deployment and PWA">
                            <div className="space-y-3">
                                <SectionHeading>Static hosting</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Build once and serve the
                                    <span className="font-mono text-xs"> dist/ </span>
                                    folder from any static host. There is no server runtime.
                                </p>
                                <CodeBlock label="bash">{`bun run build
bun run preview`}</CodeBlock>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>SPA fallback</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Deep links must return index.html. The repo ships
                                    <span className="font-mono text-xs"> vercel.json </span>
                                    and
                                    <span className="font-mono text-xs"> public/_redirects </span>
                                    for Vercel and Netlify/Cloudflare Pages. For nginx:
                                </p>
                                <CodeBlock label="nginx">{`location / {
  try_files $uri $uri/ /index.html;
}`}</CodeBlock>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Environment and RUM</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Only one optional variable exists:
                                    <span className="font-mono text-xs"> VITE_RUM_ENDPOINT</span>.
                                    When set, web-vitals sends CLS, INP and LCP with
                                    navigator.sendBeacon. Without it, metrics stay in the dev
                                    console.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>PWA and cache</SectionHeading>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    The manifest and service worker live in
                                    <span className="font-mono text-xs"> public/</span>. The shell
                                    is cached and navigation is network-first, so a deploy can serve
                                    a stale shell until the cache name changes. Bump the cache
                                    version in
                                    <span className="font-mono text-xs"> public/sw.js </span>
                                    with each production release. Orders remain local; offline mode
                                    keeps the shell and the last data available.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <SectionHeading>Before going live</SectionHeading>
                                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                                    <li>
                                        Replace the example domain in robots.txt, sitemap.xml and
                                        canonical metadata.
                                    </li>
                                    <li>
                                        Use an absolute og:image URL instead of the local preview
                                        path.
                                    </li>
                                    <li>
                                        Remember that demo authentication is not a security
                                        boundary.
                                    </li>
                                </ul>
                            </div>
                        </DocsSection>

                        <DocsSection id="troubleshooting" title="Troubleshooting">
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Symptom</th>
                                            <th className="px-4 py-2 font-medium">Fix</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            [
                                                'Blank page when refreshing a deep link',
                                                'Add the SPA fallback. The host must serve index.html for unknown paths.',
                                            ],
                                            [
                                                'Failed to fetch dynamically imported module after a deploy',
                                                'The app reloads once on vite:preloadError. If it persists, clear the service worker cache and hard refresh.',
                                            ],
                                            [
                                                'Theme flashes on first paint',
                                                'Keep the inline bootstrap script before React. Clear a stale atera_theme cookie or localStorage entry when testing.',
                                            ],
                                            [
                                                'German or French stays English',
                                                'de/fr chunks load on demand. Check the network tab; English is the intentional fallback when a chunk fails.',
                                            ],
                                            [
                                                'Duplicate i18n key at build time',
                                                'TypeScript reports TS1117. Search the locale file for the same key further down the object.',
                                            ],
                                            [
                                                'Orders disappeared',
                                                'Site data was cleared or the browser is private. Import a workspace JSON export, or reset to reseed.',
                                            ],
                                            [
                                                'Old build still loads after deploy',
                                                'Bump the cache name in public/sw.js, then unregister the old service worker in DevTools.',
                                            ],
                                            [
                                                'WebKit E2E cannot launch',
                                                'Install host dependencies with bunx playwright install --with-deps webkit.',
                                            ],
                                        ].map(([symptom, fix]) => (
                                            <tr key={symptom} className="border-b last:border-b-0">
                                                <td className="px-4 py-2 align-top font-medium">
                                                    {symptom}
                                                </td>
                                                <td className="px-4 py-2 align-top text-muted-foreground">
                                                    {fix}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DocsSection>
                    </article>
                </div>
            </div>
        </main>
    );
}
