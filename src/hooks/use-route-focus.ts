import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export function useRouteFocus() {
    const { pathname } = useLocation();
    const previousPathname = useRef<string | null>(null);

    useEffect(() => {
        if (previousPathname.current === null) {
            previousPathname.current = pathname;
            return;
        }

        if (previousPathname.current === pathname) {
            return;
        }

        previousPathname.current = pathname;

        if (window.self !== window.top) {
            return;
        }

        requestAnimationFrame(() => {
            document.getElementById('main-content')?.focus({ preventScroll: true });
        });
    }, [pathname]);
}
