import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import AppLogo from '@/components/app-logo';
import { HashLink } from '@/components/landing/hash-link';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const navLinks = [
    { label: 'Live preview', href: '#live-preview', external: false },
    { label: 'Features', href: '#features', external: false },
    { label: 'Pages', href: '#pages', external: false },
    { label: 'Pricing', href: '#pricing', external: false },
    { label: 'Docs', href: '/docs', external: true },
];

const sectionLinks = navLinks.filter((link) => !link.external);

function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const dark = resolvedAppearance === 'dark';

    return (
        <button
            type="button"
            onClick={() => updateAppearance(dark ? 'light' : 'dark')}
            className="inline-flex size-[calc(var(--control-h,2.25rem)-0.25rem)] items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
    );
}

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('');
    const headerRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const sections = sectionLinks
            .map((link) => document.getElementById(link.href.slice(1)))
            .filter((section): section is HTMLElement => Boolean(section));

        if (!sections.length) return;

        const visible = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visible.add(entry.target.id);
                    else visible.delete(entry.target.id);
                }

                const next = sectionLinks
                    .map((link) => link.href.slice(1))
                    .filter((id) => visible.has(id))
                    .at(-1);

                setActive(next ?? '');
            },
            { rootMargin: '-88px 0px -55% 0px', threshold: [0, 0.25, 0.5] },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!open) return;

        const firstLink = panelRef.current?.querySelector<HTMLElement>('[data-mobile-link]');
        firstLink?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setOpen(false);
            triggerRef.current?.focus();
        };

        const onPointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
        };

        const onResize = () => {
            if (window.innerWidth >= 1024) setOpen(false);
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('resize', onResize);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);

    return (
        <header ref={headerRef} className="sticky top-4 z-50 mx-auto w-full max-w-4xl px-4">
            <div
                className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-2.5 backdrop-blur-md transition-shadow duration-200',
                    scrolled ? 'shadow-md' : 'shadow-sm',
                )}
            >
                <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                    <Link
                        to="/"
                        className="flex items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <AppLogo />
                    </Link>

                    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
                        {navLinks.map((link) => {
                            const isSection = !link.external;
                            const id = isSection ? link.href.slice(1) : '';
                            const current = isSection && active === id;
                            const className = cn(
                                'relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                                current
                                    ? 'text-foreground'
                                    : 'text-muted-foreground hover:text-foreground',
                            );

                            if (!isSection) {
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={cn(className, 'inline-flex items-center gap-1')}
                                    >
                                        {link.label}
                                        <ArrowUpRight aria-hidden className="size-3.5" />
                                        <span className="sr-only">(opens in a new tab)</span>
                                    </Link>
                                );
                            }

                            return (
                                <HashLink
                                    key={link.href}
                                    href={link.href}
                                    aria-current={current ? 'true' : undefined}
                                    onClick={() => setActive(id)}
                                    className={className}
                                >
                                    {link.label}
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary transition-opacity duration-200',
                                            current ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                </HashLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="hidden items-center gap-1.5 lg:flex">
                    <ThemeToggle />
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/login">Log in</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link to="/sign-up">Get the template</Link>
                    </Button>
                </div>

                <button
                    ref={triggerRef}
                    type="button"
                    className="inline-flex size-[calc(var(--control-h,2.25rem)-0.25rem)] items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 lg:hidden"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    aria-label="Toggle navigation menu"
                >
                    {open ? <X className="size-4" /> : <Menu className="size-4" />}
                </button>
            </div>

            {open && (
                <div
                    ref={panelRef}
                    id="mobile-nav"
                    className="absolute inset-x-4 top-full mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-xl border bg-background/95 p-4 shadow-md backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200 motion-reduce:animate-none lg:hidden"
                >
                    <nav aria-label="Mobile" className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                            const isSection = !link.external;
                            const id = isSection ? link.href.slice(1) : '';
                            const current = isSection && active === id;
                            const className = cn(
                                'rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                                current
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                            );

                            if (!isSection) {
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        data-mobile-link
                                        onClick={() => setOpen(false)}
                                        className={cn(className, 'inline-flex items-center gap-1')}
                                    >
                                        {link.label}
                                        <ArrowUpRight aria-hidden className="size-3.5" />
                                        <span className="sr-only">(opens in a new tab)</span>
                                    </Link>
                                );
                            }

                            return (
                                <HashLink
                                    key={link.href}
                                    href={link.href}
                                    data-mobile-link
                                    aria-current={current ? 'true' : undefined}
                                    onClick={() => {
                                        setActive(id);
                                        setOpen(false);
                                    }}
                                    className={className}
                                >
                                    {link.label}
                                </HashLink>
                            );
                        })}

                        <div className="mt-3 flex items-center gap-2 border-t pt-3">
                            <ThemeToggle />
                            <Button variant="outline" className="flex-1" asChild>
                                <Link to="/login">Log in</Link>
                            </Button>
                            <Button className="flex-1" asChild>
                                <Link to="/sign-up">Get the template</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
