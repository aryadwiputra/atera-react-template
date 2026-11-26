import { useEffect, useState } from 'react';
import { PreviewFrame } from '@/components/landing/preview-frame';
import { cn } from '@/lib/utils';

type LiveAppPreviewProps = {
    to: string;
    label: string;
    title: string;
    url: string;
    className?: string;
    heightClassName?: string;
    defer?: boolean;
};

export function LiveAppPreview({
    to,
    label,
    title,
    url,
    className,
    heightClassName = 'h-[620px] sm:h-[680px] lg:h-[720px]',
    defer = false,
}: LiveAppPreviewProps) {
    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(!defer);

    useEffect(() => {
        if (ready) {
            return;
        }

        const idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });

        return () => window.cancelIdleCallback(idleId);
    }, [ready]);

    return (
        <PreviewFrame label={label} url={url} className={cn('bg-muted/20', className)}>
            <div className={cn('relative w-full overflow-hidden bg-muted/20', heightClassName)}>
                {!loaded && (
                    <div
                        className="absolute inset-0 animate-pulse bg-gradient-to-b from-muted/60 to-muted/20"
                        aria-hidden="true"
                    />
                )}
                {ready && (
                    <iframe
                        src={`/preview?to=${encodeURIComponent(to)}`}
                        title={title}
                        className={cn(
                            'h-full w-full border-0 bg-background transition-opacity duration-500',
                            loaded ? 'opacity-100' : 'opacity-0',
                        )}
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                    />
                )}
            </div>
        </PreviewFrame>
    );
}

export function LiveDashboardPreview() {
    return (
        <LiveAppPreview
            to="/dashboard"
            label="Live dashboard preview"
            title="Atera live dashboard preview"
            url="app.atera.dev/dashboard"
            defer
        />
    );
}
