type RouteLoader = () => Promise<unknown>;

type NavigatorWithConnection = Navigator & {
    connection?: { saveData?: boolean };
};

const loaders: Record<string, RouteLoader> = {
    '/dashboard': () => import('@/pages/dashboard'),
    '/analytics': () => import('@/pages/analytics'),
    '/orders': () => import('@/pages/orders'),
    '/customers': () => import('@/pages/customers'),
    '/products': () => import('@/pages/products'),
    '/data-table/client': () => import('@/pages/data-table/client'),
    '/data-table/server': () => import('@/pages/data-table/server'),
};

export function prefetchRoute(href: string): void {
    if ((navigator as NavigatorWithConnection).connection?.saveData) return;

    const path = href.split(/[?#]/, 1)[0];
    const loader = loaders[path];
    if (!loader) return;

    loader().catch(() => {});
}
