import { useEffect, useRef, useState } from 'react';
import { LiveAppPreview } from '@/components/landing/live-dashboard-preview';
import { cn } from '@/lib/utils';

const previewHeight = 'h-[520px] sm:h-[560px] lg:h-[600px]';

const pages = [
    { label: 'Analytics', path: '/analytics' },
    { label: 'Orders', path: '/orders' },
    { label: 'Customers', path: '/customers' },
    { label: 'Kanban', path: '/kanban' },
] as const;

export function ShowcasePreview() {
    const [active, setActive] = useState<(typeof pages)[number]>(pages[0]);
    const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = containerRef.current;

        if (!node || visible) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '300px' },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <div id="showcase-preview" ref={containerRef} className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Preview pages">
                {pages.map((page) => {
                    const selected = page.path === active.path;
                    return (
                        <button
                            key={page.path}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setActive(page)}
                            className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                                selected
                                    ? 'border-transparent bg-primary text-primary-foreground'
                                    : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
                            )}
                        >
                            {page.label}
                        </button>
                    );
                })}
            </div>
            {visible ? (
                <LiveAppPreview
                    key={active.path}
                    to={active.path}
                    label={`${active.label} page preview`}
                    title={`Atera ${active.label} page preview`}
                    url={`app.atera.dev${active.path}`}
                    heightClassName={previewHeight}
                />
            ) : (
                <div aria-hidden className={cn('rounded-xl border bg-muted/30', previewHeight)} />
            )}
        </div>
    );
}
