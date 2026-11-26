import { Bell, Languages, Moon, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { CustomizeDialog } from '@/components/theme-studio-lazy';
import { useAppearance } from '@/hooks/use-appearance';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
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
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

import { useNavigate } from 'react-router';
import { navigationItems } from '@/lib/navigation';
import { buildSearchSections } from '@/lib/search';
import type { Order } from '@/lib/data/types';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
    const { isMobile, state } = useSidebar();
    const preferences = useCustomizePreferences();
    const t = useTranslations(preferences.language);
    const isCollapsed = !isMobile && state === 'collapsed';
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!searchOpen) return;
        let cancelled = false;
        import('@/services/order-service')
            .then(({ orderService }) => orderService.list())
            .then((rows) => {
                if (!cancelled) setOrders(rows);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [searchOpen]);

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
        <header
            data-app-header
            className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur"
        >
            <div
                className={`flex h-full shrink-0 items-center border-r border-sidebar-border bg-sidebar transition-[width,padding] duration-200 ease-linear ${
                    isCollapsed ? 'justify-center px-0' : 'px-4 md:px-6'
                }`}
                style={{
                    width: isMobile
                        ? 'auto'
                        : isCollapsed
                          ? 'var(--sidebar-width-icon)'
                          : 'var(--sidebar-width)',
                }}
            >
                <Link
                    to="/dashboard"
                    className={`flex shrink-0 items-center ${
                        isCollapsed ? 'w-full justify-center' : ''
                    }`}
                >
                    <AppLogo compact={isCollapsed} />
                </Link>
                <SidebarTrigger className="ml-3 size-8 md:hidden" />
                <span className="ml-3 truncate text-sm font-medium md:hidden">
                    {breadcrumbs.at(-1)?.title ?? t('dashboard')}
                </span>
            </div>
            <div className="flex h-full min-w-0 flex-1 items-center justify-between gap-4 px-4 md:px-6">
                <Button
                    variant="outline"
                    className="hidden h-9 w-full max-w-72 justify-start gap-2 px-3 text-sm font-normal text-muted-foreground md:inline-flex"
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="size-4" />
                    <span>{t('search')}</span>
                    <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-2xs">
                        ⌘ K
                    </kbd>
                </Button>
                <CommandDialog
                    open={searchOpen}
                    onOpenChange={(open) => {
                        setSearchOpen(open);
                        if (!open) setSearchValue('');
                    }}
                >
                    <CommandInput
                        value={searchValue}
                        onValueChange={setSearchValue}
                        placeholder={t('searchPages')}
                    />
                    <CommandList>
                        <CommandEmpty>{t('noResults')}</CommandEmpty>
                        {navigationItems.map((item) => (
                            <CommandItem
                                key={item.href}
                                value={[item.title, ...item.keywords].join(' ')}
                                onSelect={() => {
                                    setSearchOpen(false);
                                    navigate(item.href);
                                }}
                            >
                                <item.icon className="size-4" />
                                {t(item.translationKey)}
                            </CommandItem>
                        ))}
                        {searchValue.trim() &&
                            buildSearchSections(searchValue, orders).map((section) => (
                                <CommandItem
                                    key={section.key}
                                    value={`data-${section.key}-${section.items[0]?.title ?? ''}`}
                                    onSelect={() => {
                                        setSearchOpen(false);
                                        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
                                    }}
                                >
                                    <Search className="size-4" />
                                    {t('searchResultsForLabel')}: “{searchValue}” · {section.label}
                                </CommandItem>
                            ))}
                    </CommandList>
                </CommandDialog>
                <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" className="hidden h-8 rounded-md px-3 text-xs md:inline-flex">
                        {t('newOrder')}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Toggle theme"
                        onClick={() =>
                            updateAppearance(
                                appearance === 'system'
                                    ? 'dark'
                                    : resolvedAppearance === 'dark'
                                      ? 'light'
                                      : 'dark',
                            )
                        }
                    >
                        <Moon className="size-4" />
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
                            <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span className="flex flex-col gap-1">
                                    <span className="font-medium">{t('newOrderReceived')}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {t('reviewOrder')}
                                    </span>
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span className="flex flex-col gap-1">
                                    <span className="font-medium">{t('weeklyReport')}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {t('businessSummary')}
                                    </span>
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <CustomizeDialog
                open={customizeOpen}
                onOpenChange={setCustomizeOpen}
                preferences={preferences}
                t={t}
                appearance={appearance}
                updateAppearance={updateAppearance}
            />
        </header>
    );
}
