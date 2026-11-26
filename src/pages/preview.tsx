import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { startPreviewSession } from '@/lib/auth';

const previewPaths = new Set(['/dashboard', '/analytics', '/orders', '/customers', '/kanban']);

const resolveTarget = (search: string) => {
    const requested = new URLSearchParams(search).get('to');
    if (!requested) return '/dashboard';
    const path = requested.startsWith('/') ? requested : `/${requested}`;
    return previewPaths.has(path) ? path : '/dashboard';
};

export default function PreviewPage() {
    const { search } = useLocation();
    const [started] = useState(startPreviewSession);

    return <Navigate to={started ? resolveTarget(search) : '/login'} replace />;
}
