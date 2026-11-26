import { beforeEach, describe, expect, it } from 'vitest';
import {
    authStorageKeys,
    getDemoCredentials,
    getSession,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
} from './auth';

describe('auth', () => {
    beforeEach(() => {
        signOut();
        localStorage.clear();
    });

    it('signs in with the demo credentials', async () => {
        const credentials = getDemoCredentials();
        const result = await signIn(credentials.email, credentials.password);

        expect(result.ok).toBe(true);
        expect(getSession()?.email).toBe(credentials.email);
        expect(isAuthenticated()).toBe(true);
    });

    it('rejects invalid credentials', async () => {
        const result = await signIn('demo@example.com', 'wrong-password');
        expect(result.ok).toBe(false);
        expect(isAuthenticated()).toBe(false);
    });

    it('signs out', async () => {
        const credentials = getDemoCredentials();
        await signIn(credentials.email, credentials.password);
        signOut();

        expect(getSession()).toBeNull();
    });

    it('signs up a new account and authenticates it', async () => {
        const result = await signUp({
            email: 'new@example.com',
            password: 'Secret123!',
            name: 'New User',
        });

        expect(result.ok).toBe(true);
        expect(getSession()?.name).toBe('New User');
    });

    it('never stores the plain password', async () => {
        await signUp({ email: 'hashed@example.com', password: 'Secret123!', name: 'Hashed User' });

        const stored = localStorage.getItem(authStorageKeys.accounts) ?? '';
        expect(stored).not.toContain('Secret123!');
        expect(stored).toContain('passwordHash');
    });

    it('authenticates a stored account with its password', async () => {
        await signUp({ email: 'again@example.com', password: 'Secret123!', name: 'Again' });
        signOut();

        const result = await signIn('again@example.com', 'Secret123!');
        expect(result.ok).toBe(true);
    });

    it('rejects an email that already exists', async () => {
        const result = await signUp({
            email: 'demo@example.com',
            password: 'x',
            name: 'Duplicate',
        });

        expect(result.ok).toBe(false);
    });
});
