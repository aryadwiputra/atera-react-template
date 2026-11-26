import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PreviewFrameProps = {
    label: string;
    url?: string;
    className?: string;
    children: ReactNode;
};

export function PreviewFrame({
    label,
    url = 'app.atera.dev/dashboard',
    className,
    children,
}: PreviewFrameProps) {
    return (
        <div
            role="region"
            aria-label={label}
            className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', className)}
        >
            <div className="flex items-center gap-3 border-b bg-muted/40 px-3 py-2">
                <div className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                </div>
                <div className="mx-auto flex min-w-0 max-w-[280px] flex-1 items-center justify-center gap-1.5 rounded-md border bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
                    <Lock className="size-2.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{url}</span>
                </div>
                <div className="w-10 shrink-0" aria-hidden="true" />
            </div>
            {children}
        </div>
    );
}
