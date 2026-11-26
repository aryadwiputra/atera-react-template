import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router';
import AppLogo from '@/components/app-logo';
import { HashLink } from '@/components/landing/hash-link';
import { Reveal } from '@/components/landing/reveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COPYRIGHT_YEAR = new Date().getFullYear();

const pricingPlans = [
    {
        name: 'Personal',
        price: '$29',
        period: 'one-time',
        description: 'For side projects and personal portfolios.',
        features: ['1 project', '6 months of updates', 'Community support', 'Personal use license'],
        highlighted: false,
    },
    {
        name: 'Commercial',
        price: '$59',
        period: 'one-time',
        description: 'For client work and commercial products.',
        features: [
            'Unlimited projects',
            '1 year of updates',
            'Priority email support',
            'Commercial use license',
        ],
        highlighted: true,
    },
    {
        name: 'Extended',
        price: '$149',
        period: 'one-time',
        description: 'For SaaS products and resale rights.',
        features: [
            'Unlimited projects',
            'Lifetime updates',
            'Priority email support',
            'SaaS and resale license',
        ],
        highlighted: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
            <Reveal className="mx-auto max-w-[680px] text-center">
                <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    One purchase, every page included
                </h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                    Pay once and use Atera in as many projects as your license allows. No
                    subscriptions, no per-seat pricing.
                </p>
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
                {pricingPlans.map((plan, index) => (
                    <Reveal key={plan.name} delay={index * 0.08} className="h-full">
                        <div
                            className={cn(
                                'flex h-full flex-col rounded-xl border bg-background p-6',
                                plan.highlighted && 'border-primary shadow-sm',
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold tracking-tight">
                                    {plan.name}
                                </h3>
                                {plan.highlighted && (
                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        Most popular
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold tracking-tight">
                                    {plan.price}
                                </span>
                                <span className="text-sm text-muted-foreground">{plan.period}</span>
                            </div>
                            <p className="mt-3 text-sm text-pretty text-muted-foreground">
                                {plan.description}
                            </p>
                            <ul className="mt-6 flex-1 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/sign-up" className="mt-8">
                                <Button
                                    variant={plan.highlighted ? 'default' : 'outline'}
                                    className="w-full"
                                >
                                    Buy {plan.name} license
                                </Button>
                            </Link>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

export function FinalCta() {
    return (
        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
            <Reveal>
                <div className="flex flex-col items-center gap-6 rounded-xl border bg-primary px-8 py-16 text-center text-primary-foreground">
                    <h2 className="max-w-[680px] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Your next admin panel starts here
                    </h2>
                    <p className="max-w-[520px] text-pretty opacity-80">
                        Start with prebuilt admin pages, typed sample data, and theme controls in
                        one React project.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <Link to="/sign-up">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="bg-background text-foreground hover:bg-background/90"
                            >
                                Get the template
                                <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                            asChild
                        >
                            <HashLink href="#live-preview">Browse the demo</HashLink>
                        </Button>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

export function Footer() {
    const columns = [
        {
            title: 'Template',
            links: [
                { label: 'Features', href: '#features' },
                { label: 'Pages', href: '#pages' },
                { label: 'Stack', href: '#stack' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Live preview', href: '#live-preview' },
            ],
        },
        {
            title: 'Account',
            links: [
                { label: 'Log in', href: '/login' },
                { label: 'Sign up', href: '/sign-up' },
            ],
        },
    ];
    return (
        <footer className="border-t bg-muted/40">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
                <div>
                    <Link to="/" className="inline-flex items-center">
                        <AppLogo />
                    </Link>
                    <p className="mt-4 max-w-xs text-sm text-pretty text-muted-foreground">
                        A React admin dashboard template with every page already built.
                    </p>
                </div>
                {columns.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                        <p className="text-sm font-semibold">{column.title}</p>
                        <ul className="mt-4 space-y-2">
                            {column.links.map((link) => (
                                <li key={link.label}>
                                    {link.href.startsWith('#') ? (
                                        <HashLink
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                                        >
                                            {link.label}
                                        </HashLink>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
            <div className="border-t">
                <p className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-muted-foreground">
                    &copy; {COPYRIGHT_YEAR} Atera. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
