import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { initializeTheme } from './hooks/use-appearance';
import { initializeCustomizePreferences } from './hooks/use-customize-preferences';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToastProvider } from '@/components/shared/toast';
import { AppErrorBoundary } from '@/components/errors/app-error-boundary';
import { queryClient } from '@/lib/query-client';
import './index.css';
import App from './App.tsx';

const CHUNK_RELOAD_KEY = 'atera:chunk-reload';
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    try {
        if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return;
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    } catch {}
    window.location.reload();
});
window.addEventListener('load', () => {
    try {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {}
});

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

initializeTheme();
initializeCustomizePreferences();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={0}>
                <ToastProvider>
                    <AppErrorBoundary>
                        <App />
                    </AppErrorBoundary>
                </ToastProvider>
            </TooltipProvider>
        </QueryClientProvider>
    </StrictMode>,
);

const loadVitals = () => {
    import('./lib/vitals').then(({ initVitals }) => initVitals()).catch(() => {});
};

if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(loadVitals, { timeout: 3000 });
} else {
    window.addEventListener('load', loadVitals, { once: true });
}
