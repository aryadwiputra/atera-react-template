import { useSyncExternalStore } from 'react';
import { authStorageKeys, getSession, invalidateSessionCache, signOut } from '@/lib/auth';

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (typeof window === 'undefined')
        return () => {
            listeners.delete(listener);
        };
    const onStorage = (event: StorageEvent) => {
        if (
            event.key === null ||
            event.key === authStorageKeys.session ||
            event.key === authStorageKeys.accounts
        ) {
            invalidateSessionCache();
            listener();
        }
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
    };
};
export const notifyAuthChanged = () => listeners.forEach((listener) => listener());

export function useAuth() {
    const session = useSyncExternalStore(subscribe, getSession, () => null);
    return {
        session,
        isAuthenticated: session !== null,
        signOut: () => {
            signOut();
            notifyAuthChanged();
        },
    };
}
