import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import AppLogo from '@/components/app-logo';
import { EASE } from '@/components/landing/ease';
import { HashLink, scrollToHash } from '@/components/landing/hash-link';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Pricing', href: '#pricing' },
];

function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const dark = resolvedAppearance === 'dark';
    return (
        <button
            type="button"
            onClick={() => updateAppearance(dark ? 'light' : 'dark')}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
    );
}

export function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="sticky top-4 z-50 mx-auto w-full max-w-4xl px-4">
            <nav
                aria-label="Main"
                className="flex items-center justify-between rounded-xl border bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md"
            >
                <Link to="/" className="flex items-center">
                    <AppLogo />
                </Link>
                <div className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <HashLink
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                            {link.label}
                        </HashLink>
                    ))}
                </div>
                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
                    <Link to="/login">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </Link>
                    <Link to="/sign-up">
                        <Button size="sm">Get the template</Button>
                    </Link>
                </div>
                <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground md:hidden"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-label="Toggle navigation menu"
                >
                    {open ? <X className="size-4" /> : <Menu className="size-4" />}
                </button>
            </nav>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="absolute inset-x-4 top-full mt-2 flex flex-col gap-1 rounded-xl border bg-background/95 p-4 shadow-md backdrop-blur-md md:hidden"
                    >
                        {navLinks.map((link, index) => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                onClick={(event) => {
                                    if (scrollToHash(link.href)) event.preventDefault();
                                    setOpen(false);
                                }}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: EASE,
                                    delay: Math.min(index * 0.06, 0.4),
                                }}
                                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <div className="mt-2 flex items-center gap-2 border-t pt-3">
                            <ThemeToggle />
                            <Link to="/login" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/sign-up" className="flex-1">
                                <Button className="w-full">Get the template</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
