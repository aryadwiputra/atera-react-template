import { lazy, Suspense } from 'react';
import type { ThemeStudioProps } from '@/components/theme-studio';

const ThemeStudio = lazy(() =>
    import('@/components/theme-studio').then((module) => ({ default: module.ThemeStudio })),
);

export function CustomizeDialog(props: ThemeStudioProps) {
    if (!props.open) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            <ThemeStudio {...props} />
        </Suspense>
    );
}
