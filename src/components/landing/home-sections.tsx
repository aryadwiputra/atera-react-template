import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Check,
    FolderOpen,
    Kanban,
    MessageSquare,
    ShoppingBag,
    Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { DashboardPreviewCompact } from '@/components/landing/dashboard-preview-compact';
import { EASE } from '@/components/landing/ease';
import { HashLink } from '@/components/landing/hash-link';
import { LiveDashboardPreview } from '@/components/landing/live-dashboard-preview';
import { Reveal } from '@/components/landing/reveal';
import { ShowcasePreview } from '@/components/landing/showcase-preview';
import { TaglineReveal } from '@/components/landing/tagline-reveal';
import { Button } from '@/components/ui/button';

const metrics = [
    { value: '48', label: 'shadcn UI components' },
    { value: '60+', label: 'ready app routes' },
    { value: '3', label: 'languages included' },
    { value: '5', label: 'theme color presets' },
];

const features = [
    {
        icon: BarChart3,
        title: 'Pages that are already built',
        description:
            'Analytics, orders, customers, kanban, chat, mail, calendar, invoices and more. Open a route and it is ready.',
    },
    {
        icon: ShoppingBag,
        title: 'Real mock data out of the box',
        description:
            'In-memory data modules that behave like an API. No backend needed to preview any page before shipping.',
    },
    {
        icon: Users,
        title: 'Dark mode, built in and themeable',
        description:
            'Light, dark and system colors switch in one click. Five color presets and text density tokens included.',
    },
    {
        icon: MessageSquare,
        title: 'Type safe from the start',
        description:
            'TypeScript throughout the library, 24 typed data modules, route tables that error before they break.',
    },
    {
        icon: FolderOpen,
        title: '48 shadcn style components',
        description:
            'Button, dialog, dropdown, sheet, command, tooltip, sidebar and more. Swap one of them into your own design.',
    },
    {
        icon: Kanban,
        title: 'i18n with three languages',
        description:
            'English, German and French translations are already wired in. Add a fourth language in minutes, not days.',
    },
];

export function Hero() {
    const reduceMotion = useReducedMotion();
    return (
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
            <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
                >
                    A React dashboard template for developers
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                    className="mt-5 text-lg text-pretty text-muted-foreground"
                >
                    Atera includes typed admin pages, in-memory sample data, and theme controls,
                    ready to explore and adapt to your project.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
                    className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
                >
                    <Link to="/sign-up">
                        <Button size="lg">
                            Get the template
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" asChild>
                        <HashLink href="#live-preview">Browse the demo</HashLink>
                    </Button>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.24 }}
                    className="mt-4 text-sm text-muted-foreground"
                >
                    One-time purchase. Free updates for 6 months.
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
                className="mt-14 w-full"
            >
                <div id="live-preview" className="scroll-mt-24">
                    <div className="hidden md:block">
                        <LiveDashboardPreview />
                    </div>
                    <div className="md:hidden">
                        <DashboardPreviewCompact />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export function Metrics() {
    return (
        <section className="border-y bg-muted/40" aria-label="Key numbers">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
                {metrics.map((metric, index) => (
                    <Reveal key={metric.label} delay={index * 0.08} className="text-center">
                        <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

export function Features() {
    return (
        <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
            <Reveal className="mx-auto max-w-[680px] text-center">
                <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    Every page your admin panel needs, already built
                </h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                    Login flows, dashboard, analytics, commerce, kanban, chat, calendar, settings —
                    each one wired to typed mock data so you can see it working before you write a
                    line.
                </p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <Reveal key={feature.title} delay={(index % 3) * 0.08}>
                        <div className="flex h-full flex-col gap-3 rounded-xl border bg-background p-6 transition-colors duration-300 hover:bg-accent/40">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <feature.icon className="size-5" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-6 text-pretty text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

const stackGroups = [
    {
        title: 'Framework',
        items: [
            { name: 'React', version: '19.3' },
            { name: 'React Router', version: '8.5' },
            { name: 'TypeScript', version: '7.0' },
            { name: 'Vite', version: '8.3' },
        ],
    },
    {
        title: 'Interface',
        items: [
            { name: 'Tailwind CSS', version: '4.3' },
            { name: 'Radix UI', version: '1.8' },
            { name: 'shadcn', version: '4.23' },
            { name: 'Lucide', version: '1.70' },
        ],
    },
    {
        title: 'Data',
        items: [
            { name: 'TanStack Query', version: '5.108' },
            { name: 'TanStack Table', version: '9.3' },
            { name: 'Dexie', version: '4.4' },
            { name: 'Zod', version: '4.6' },
        ],
    },
    {
        title: 'Workflow',
        items: [
            { name: 'React Hook Form', version: '7.91' },
            { name: 'Recharts', version: '3.8' },
            { name: 'date-fns', version: '4.4' },
            { name: 'Playwright', version: '1.65' },
        ],
    },
];

export function Stack() {
    return (
        <section id="stack" aria-labelledby="stack-title" className="scroll-mt-24 border-t">
            <div className="mx-auto w-full max-w-6xl px-6 py-24">
                <Reveal className="max-w-[680px]">
                    <h2
                        id="stack-title"
                        className="text-3xl font-bold tracking-tight text-balance sm:text-4xl"
                    >
                        The dependencies, already in place
                    </h2>
                    <p className="mt-4 text-pretty text-muted-foreground">
                        No custom runtime and no hidden layer. These are the libraries that ship
                        with the template, installed, typed, and wired into the build.
                    </p>
                </Reveal>
                <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stackGroups.map((group, index) => (
                        <Reveal key={group.title} delay={index * 0.06}>
                            <h3 className="text-sm font-semibold">{group.title}</h3>
                            <ul className="mt-2">
                                {group.items.map((item) => (
                                    <li
                                        key={item.name}
                                        className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 last:border-0"
                                    >
                                        <span className="text-sm">{item.name}</span>
                                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                                            {item.version}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    ))}
                </div>
                <Link
                    to="/docs"
                    className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    Full dependency list in the docs
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
}

export function Showcase() {
    return (
        <section id="pages" className="scroll-mt-24 bg-muted/40">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-2">
                <Reveal>
                    <h2 className="max-w-[680px] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Open any page and it already works
                    </h2>
                    <p className="mt-4 max-w-[680px] text-pretty text-muted-foreground">
                        Each route comes with its own mock data module and typed API. Click around
                        the demo and see how it is put together.
                    </p>
                    <ul className="mt-6 space-y-3">
                        {[
                            'Full auth flow: login, signup, 2FA, reset, lock screen',
                            'Dashboard with charts, metrics, and recent activity',
                            'Commerce pages with tables, forms, and invoicing',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Check className="size-3" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="link" className="mt-8 px-0" asChild>
                        <a href="/preview?to=/dashboard" target="_blank" rel="noreferrer">
                            Open the full preview
                            <ArrowRight className="size-4" />
                        </a>
                    </Button>
                </Reveal>
                <Reveal delay={0.1}>
                    <ShowcasePreview />
                </Reveal>
            </div>
        </section>
    );
}

export function Tagline() {
    return (
        <section className="mx-auto w-full max-w-4xl px-6 py-28">
            <TaglineReveal
                text="Skip three weeks of setup. Start from pages that already work."
                className="text-center text-4xl font-bold tracking-tight text-pretty sm:text-5xl"
            />
        </section>
    );
}
