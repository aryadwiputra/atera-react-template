import { Bell, Languages, Moon, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { useAppearance } from '@/hooks/use-appearance';
import {
    useCustomizePreferences,
    type ColorPreset,
    type Container,
    type Density,
    type Language,
    type Layout,
    type PreferencesReturn,
} from '@/hooks/use-customize-preferences';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

import { useNavigate } from 'react-router';
import { navigationItems } from '@/lib/navigation';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';


const colors: ColorPreset[] = [
    'neutral',
    'zinc',
    'blue',
    'violet',
    'rose',
    'orange',
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { appearance, resolvedAppearance, updateAppearance } =
        useAppearance();
    const { isMobile, state } = useSidebar();
    const preferences = useCustomizePreferences();
    const t = useTranslations(preferences.language);
    const isCollapsed = !isMobile && state === 'collapsed';
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();
    const [customizeOpen, setCustomizeOpen] = useState(false);

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
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur">
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
                <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                    <CommandInput placeholder={t('searchPages')} />
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
                    </CommandList>
                </CommandDialog>
                <div className="ml-auto flex items-center gap-1">
                    <Button
                        size="sm"
                        className="hidden h-8 rounded-md px-3 text-xs md:inline-flex"
                    >
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
                            <DropdownMenuLabel>
                                {t('notifications')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span className="flex flex-col gap-1">
                                    <span className="font-medium">
                                        {t('newOrderReceived')}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {t('reviewOrder')}
                                    </span>
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span className="flex flex-col gap-1">
                                    <span className="font-medium">
                                        {t('weeklyReport')}
                                    </span>
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

type CustomizeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preferences: PreferencesReturn;
    t: ReturnType<typeof useTranslations>;
    appearance: ReturnType<typeof useAppearance>['appearance'];
    updateAppearance: ReturnType<typeof useAppearance>['updateAppearance'];
};

export function CustomizeDialog({
    open,
    onOpenChange,
    preferences,
    t,
    appearance,
    updateAppearance,
}: CustomizeDialogProps) {
    const update = <K extends keyof PreferencesReturn>(
        key: K,
        value: PreferencesReturn[K],
    ) => preferences.updatePreferences({ [key]: value });
    const colorClasses: Record<ColorPreset, string> = {
        neutral: 'bg-foreground',
        zinc: 'bg-swatch',
        blue: 'bg-swatch',
        violet: 'bg-swatch',
        rose: 'bg-swatch',
        orange: 'bg-swatch',
    };
    const labels: Record<ColorPreset, string> = {
        neutral: 'Neutral',
        zinc: 'Zinc',
        blue: 'Blue',
        violet: 'Violet',
        rose: 'Rose',
        orange: 'Orange',
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('customize')}</DialogTitle>
                    <DialogDescription>
                        {t('color')}, {t('density')}, {t('layout')},{' '}
                        {t('container')} {t('and')} {t('language')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-5">
                    <PreferenceRow label={t('theme')}>
                        <div className="grid grid-cols-3 gap-2">
                            {(['light', 'dark', 'system'] as const).map(
                                (mode) => (
                                    <Button
                                        key={mode}
                                        variant={
                                            appearance === mode
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="capitalize"
                                        onClick={() => updateAppearance(mode)}
                                    >
                                        {t(mode)}
                                    </Button>
                                ),
                            )}
                        </div>
                    </PreferenceRow>
                    <PreferenceRow label={t('color')}>
                        <div className="grid grid-cols-3 gap-2">
                            {colors.map((color) => (
                                <Button
                                    key={color}
                                    variant={
                                        preferences.color === color
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="justify-start gap-2"
                                    onClick={() => update('color', color)}
                                >
                                    <span
                                        className={`size-3 rounded-full ${colorClasses[color]}`}
                                    />
                                    {labels[color]}
                                </Button>
                            ))}
                        </div>
                    </PreferenceRow>
                    <PreferenceRow label={t('density')}>
                        <Select
                            value={preferences.density}
                            onValueChange={(value) =>
                                update('density', value as Density)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="compact">
                                    {t('compact')}
                                </SelectItem>
                                <SelectItem value="comfortable">
                                    {t('comfortable')}
                                </SelectItem>
                                <SelectItem value="spacious">
                                    {t('spacious')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </PreferenceRow>
                    <PreferenceRow label={t('layout')}>
                        <Select
                            value={preferences.layout}
                            onValueChange={(value) =>
                                update('layout', value as Layout)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sidebar">
                                    {t('sidebar')}
                                </SelectItem>
                                <SelectItem value="top-nav">
                                    {t('topNav')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </PreferenceRow>
                    <PreferenceRow label={t('container')}>
                        <Select
                            value={preferences.container}
                            onValueChange={(value) =>
                                update('container', value as Container)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fluid">
                                    {t('fluid')}
                                </SelectItem>
                                <SelectItem value="boxed">
                                    {t('boxed')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </PreferenceRow>
                    <PreferenceRow label={t('language')}>
                        <Select
                            value={preferences.language}
                            onValueChange={(value) =>
                                update('language', value as Language)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">
                                    {t('english')}
                                </SelectItem>
                                <SelectItem value="de">
                                    {t('deutsch')}
                                </SelectItem>
                                <SelectItem value="fr">
                                    {t('francais')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </PreferenceRow>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={preferences.resetPreferences}
                    >
                        {t('resetDefaults')}
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                        {t('close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function PreferenceRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            {children}
        </div>
    );
}
