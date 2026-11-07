import { Link } from 'react-router';
import {
    Bell,
    Languages,
    LayoutGrid,
    Menu,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { CustomizeDialog } from '@/components/app-sidebar-header';
import { useAppearance } from '@/hooks/use-appearance';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

import type { BreadcrumbItem, NavItem } from '@/types';

type Props = { breadcrumbs?: BreadcrumbItem[] };

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
];

export function AppHeader({ breadcrumbs = [] }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const appearance = useAppearance();
    const preferences = useCustomizePreferences();
    const { language } = preferences;
    const t = useTranslations(language);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
                <div className="flex h-16 w-full items-center gap-4 px-4 md:px-6">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 bg-sidebar">
                            <SheetHeader>
                                <SheetTitle className="text-left">
                                    <AppLogoIcon className="size-6" />
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8 flex flex-col gap-2">
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        to={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent"
                                    >
                                        {item.icon && (
                                            <item.icon className="size-4" />
                                        )}
                                        {t('dashboard')}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Link
                        to="/dashboard"
                        className="flex shrink-0 items-center"
                    >
                        <AppLogo />
                    </Link>
                    <nav className="hidden items-center gap-1 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                            >
                                {t('dashboard')}
                            </Link>
                        ))}
                    </nav>
                    <div className="ml-auto flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            aria-label={t('search')}
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden size-8 md:inline-flex"
                            aria-label={t('customize')}
                            onClick={() => setCustomizeOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    aria-label={t('language')}
                                >
                                    <Languages className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {(['en', 'de', 'fr'] as const).map((lang) => (
                                    <DropdownMenuItem
                                        key={lang}
                                        onClick={() =>
                                            preferences.updatePreferences({
                                                language: lang,
                                            })
                                        }
                                    >
                                        {t(
                                            lang === 'en'
                                                ? 'english'
                                                : lang === 'de'
                                                  ? 'deutsch'
                                                  : 'francais',
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative size-8"
                                    aria-label={t('notifications')}
                                >
                                    <Bell className="size-4" />
                                    <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72">
                                <DropdownMenuLabel>
                                    {t('notifications')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    {t('newOrderReceived')}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {t('weeklyReport')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                <CommandInput placeholder={t('searchPages')} />
                <CommandList>
                    <CommandEmpty>{t('noResults')}</CommandEmpty>
                    <CommandItem onSelect={() => setSearchOpen(false)}>
                        {t('dashboard')}
                    </CommandItem>
                    <CommandItem onSelect={() => setSearchOpen(false)}>
                        {t('settings')}
                    </CommandItem>
                </CommandList>
            </CommandDialog>
            <CustomizeDialog
                open={customizeOpen}
                onOpenChange={setCustomizeOpen}
                preferences={preferences}
                t={t}
                appearance={appearance.appearance}
                updateAppearance={appearance.updateAppearance}
            />
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b">
                    <div className="flex h-12 w-full items-center px-4 text-muted-foreground md:px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
