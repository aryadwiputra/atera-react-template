import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { LocalWorkspaceBar } from '@/components/local-workspace-bar';
import { OfflineBanner } from '@/components/offline-banner';
import { useRouteFocus } from '@/hooks/use-route-focus';
import { cn } from '@/lib/utils';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, className, ...props }: Props) {
    useRouteFocus();

    if (variant === 'sidebar') {
        return (
            <SidebarInset
                id="main-content"
                tabIndex={-1}
                className={cn('outline-none', className)}
                {...props}
            >
                <OfflineBanner />
                <LocalWorkspaceBar />
                {children}
            </SidebarInset>
        );
    }

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className={cn(
                'mx-auto flex h-full w-full flex-1 flex-col gap-[var(--page-gap,1.5rem)] outline-none',
                className,
            )}
            {...props}
        >
            <OfflineBanner />
            <LocalWorkspaceBar />
            {children}
        </main>
    );
}
