import type { AuthResult, AuthSession } from './data/types';

const sessionKey = 'atera_session';
const accountsKey = 'atera_accounts';
const previewKey = 'atera_preview_session';
const demoAccount = { email: 'demo@example.com', password: 'AteraDemo2026!', name: 'Demo User' };

type Account = {
    email: string;
    name: string;
    password?: string;
    passwordHash?: string;
    salt?: string;
};

let sessionCache: AuthSession | null | undefined;
let previewSession: AuthSession | null = null;

const isEmbedded = () => typeof window !== 'undefined' && window.self !== window.top;

const readPreviewSession = (): AuthSession | null => {
    if (!isEmbedded() || typeof sessionStorage === 'undefined') return null;
    const stored = sessionStorage.getItem(previewKey);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as AuthSession;
    } catch {
        return null;
    }
};

const writePreviewSession = (session: AuthSession | null) => {
    if (!isEmbedded() || typeof sessionStorage === 'undefined') return;
    if (session) {
        sessionStorage.setItem(previewKey, JSON.stringify(session));
        return;
    }
    sessionStorage.removeItem(previewKey);
};

export const authStorageKeys = { session: sessionKey, accounts: accountsKey } as const;

const encode = (buffer: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));

const hashPassword = async (password: string, salt: string) => {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(`${salt}:${password}`),
    );
    return encode(digest);
};

const createSalt = () => encode(crypto.getRandomValues(new Uint8Array(16)).buffer);

const readAccounts = (): Account[] => {
    if (typeof localStorage === 'undefined') return [demoAccount];
    const stored = localStorage.getItem(accountsKey);
    if (!stored) return [demoAccount];
    try {
        return [demoAccount, ...(JSON.parse(stored) as Account[])];
    } catch {
        return [demoAccount];
    }
};

const writeAccounts = (accounts: Account[]) => {
    const persistent = accounts.filter(
        (account) => account.email.toLowerCase() !== demoAccount.email,
    );
    localStorage.setItem(accountsKey, JSON.stringify(persistent));
};

export const getSession = (): AuthSession | null => {
    if (previewSession) return previewSession;
    const storedPreview = readPreviewSession();
    if (storedPreview) {
        previewSession = storedPreview;
        return previewSession;
    }
    if (sessionCache !== undefined) return sessionCache;
    if (typeof localStorage === 'undefined') {
        sessionCache = null;
        return sessionCache;
    }
    const stored = localStorage.getItem(sessionKey);
    if (!stored) {
        sessionCache = null;
        return sessionCache;
    }
    try {
        sessionCache = JSON.parse(stored) as AuthSession;
    } catch {
        sessionCache = null;
    }
    return sessionCache;
};

export const isAuthenticated = () => getSession() !== null;

export const startPreviewSession = (): boolean => {
    if (typeof window === 'undefined') return false;
    previewSession = {
        email: demoAccount.email,
        name: demoAccount.name,
        authenticatedAt: new Date().toISOString(),
    };
    writePreviewSession(previewSession);
    return true;
};

export const invalidateSessionCache = () => {
    sessionCache = undefined;
};

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const accounts = readAccounts();
    const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!account) return { ok: false, message: 'invalidCredentials' };

    const isDemo = account.email.toLowerCase() === demoAccount.email;
    const hashed = account.passwordHash && account.salt;
    const valid = isDemo
        ? password === demoAccount.password
        : hashed
          ? (await hashPassword(password, account.salt as string)) === account.passwordHash
          : password === account.password;

    if (!valid) return { ok: false, message: 'invalidCredentials' };

    if (!isDemo && account.password !== undefined && !hashed) {
        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);
        writeAccounts(
            accounts.map((item) =>
                item.email.toLowerCase() === email.toLowerCase()
                    ? { email: item.email, name: item.name, salt, passwordHash }
                    : item,
            ),
        );
    }

    const session: AuthSession = {
        email: account.email,
        name: account.name,
        authenticatedAt: new Date().toISOString(),
    };
    localStorage.setItem(sessionKey, JSON.stringify(session));
    sessionCache = session;
    return { ok: true, session };
};

export const signUp = async (input: {
    email: string;
    name: string;
    password: string;
}): Promise<AuthResult> => {
    if (!input.email.includes('@')) return { ok: false, message: 'invalidEmail' };
    if (readAccounts().some((account) => account.email.toLowerCase() === input.email.toLowerCase()))
        return { ok: false, message: 'accountExists' };
    const salt = createSalt();
    const passwordHash = await hashPassword(input.password, salt);
    writeAccounts([
        ...readAccounts(),
        { email: input.email, name: input.name, salt, passwordHash },
    ]);
    return signIn(input.email, input.password);
};

export const signOut = () => {
    previewSession = null;
    writePreviewSession(null);
    localStorage.removeItem(sessionKey);
    sessionCache = null;
};
export const getDemoCredentials = () => ({
    email: demoAccount.email,
    password: demoAccount.password,
});
