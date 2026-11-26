import { onCLS, onINP, onLCP } from 'web-vitals';
import type { Metric } from 'web-vitals';

type VitalsPayload = {
    name: Metric['name'];
    value: number;
    rating: Metric['rating'];
    id: string;
    path: string;
};

function report(metric: Metric) {
    const payload: VitalsPayload = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        path: location.pathname,
    };

    const endpoint = import.meta.env.VITE_RUM_ENDPOINT;

    if (endpoint) {
        try {
            navigator.sendBeacon(endpoint, JSON.stringify(payload));
        } catch {}
        return;
    }

    if (import.meta.env.DEV) {
        console.debug('[vitals]', payload);
    }
}

export function initVitals() {
    onCLS(report);
    onINP(report);
    onLCP(report);
}
