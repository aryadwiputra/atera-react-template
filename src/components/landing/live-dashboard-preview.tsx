import { useState } from 'react';
import { PreviewFrame } from '@/components/landing/preview-frame';
import { cn } from '@/lib/utils';

type LiveAppPreviewProps = {
    to: string;
    label: string;
    title: string;
    url: string;
    className?: string;
    heightClassName?: string;
};

export function LiveAppPreview({
    to,
    label,
    title,
    url,
    className,
    heightClassName = 'h-[620px] sm:h-[680px] lg:h-[720px]',
}: LiveAppPreviewProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <PreviewFrame label={label} url={url} className={cn('bg-muted/20', className)}>
            <div className={cn('relative w-full overflow-hidden bg-muted/20', heightClassName)}>
                {!loaded && (
                    <div
                        className="absolute inset-0 animate-pulse bg-gradient-to-b from-muted/60 to-muted/20"
                        aria-hidden="true"
                    />
                )}
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
        />
    );
}
