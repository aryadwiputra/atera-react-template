import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex items-center">
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-background dark:text-foreground" />
            </div>
            <div
                className={`ml-3 text-left text-sm leading-none ${compact ? 'hidden' : ''}`}
            >
                <span className="truncate font-semibold">Atera</span>
                <span className="mt-1 block truncate text-2xs text-muted-foreground">
                    Dashboard
                </span>
            </div>
        </div>
    );
}
