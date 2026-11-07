import { useCallback } from 'react';

export function useMobileNavigation(): () => void {
    return useCallback(() => {
        document.body.style.removeProperty('pointer-events');
    }, []);
}
