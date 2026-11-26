import { LoaderCircle } from 'lucide-react';

export function RouteFallback() {
    return (
        <div className="flex min-h-[40vh] w-full items-center justify-center p-6">
            <LoaderCircle
                className="size-6 animate-spin text-muted-foreground"
                aria-label="Loading"
            />
        </div>
    );
}
