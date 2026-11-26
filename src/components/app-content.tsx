import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset id="main-content" {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main
            id="main-content"
            className="mx-auto flex h-full w-full flex-1 flex-col gap-[var(--page-gap,1.5rem)]"
            {...props}
        >
            {children}
        </main>
    );
}
