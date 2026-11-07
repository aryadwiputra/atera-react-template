import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo({ compact = false }: { compact?: boolean }) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div
                className={`ml-3 grid flex-1 text-left text-sm leading-none ${compact ? 'hidden' : ''}`}
            >
                <span className="truncate font-semibold">Atera</span>
                <span className="mt-1 truncate text-[10px] text-muted-foreground">
                    Dashboard
                </span>
            </div>
        </>
    );
}
