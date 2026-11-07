import { useLocation } from 'react-router';
import { toUrl } from '@/lib/utils';

export function useCurrentUrl() {
    const location = useLocation();
    const currentUrlPath = location.pathname;

    const isCurrentUrl = (
        urlToCheck: string | { url: string },
        currentUrl?: string,
        startsWith = false,
    ): boolean => {
        const urlToCompare = currentUrl ?? currentUrlPath;
        const urlString = toUrl(urlToCheck);
        return startsWith
            ? urlToCompare.startsWith(urlString)
            : urlString === urlToCompare;
    };

    return {
        currentUrl: currentUrlPath,
        isCurrentUrl,
        isCurrentOrParentUrl: (url: string | { url: string }) =>
            isCurrentUrl(url, undefined, true),
    };
}
