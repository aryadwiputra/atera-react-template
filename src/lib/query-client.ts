import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'always',
            retry: 0,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
        mutations: {
            networkMode: 'always',
            retry: 0,
        },
    },
});
