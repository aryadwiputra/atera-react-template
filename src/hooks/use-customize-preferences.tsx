import { useSyncExternalStore } from 'react';

export type Accent = 'mono' | 'blue' | 'violet' | 'orange' | 'green' | 'rose';
export type Neutral = 'neutral' | 'slate' | 'stone';
export type Radius = 'none' | 'sm' | 'md' | 'lg';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type Layout = 'sidebar' | 'top-nav';
export type SidebarStyle = 'plain' | 'floating' | 'inset';
export type SidebarWidth = 'compact' | 'regular' | 'wide';
export type HeaderMode = 'sticky' | 'static';
export type Container = 'fluid' | 'boxed';
export type ChartPalette = 'accent' | 'mono' | 'vivid';
export type Motion = 'standard' | 'reduced';
export type Language = 'en' | 'de' | 'fr';

export type CustomizePreferences = {
    accent: Accent;
    neutral: Neutral;
    radius: Radius;
    font: FontFamily;
    density: Density;
    layout: Layout;
    sidebar: SidebarStyle;
    sidebarWidth: SidebarWidth;
    header: HeaderMode;
    container: Container;
    chart: ChartPalette;
    motion: Motion;
    language: Language;
};

export type PreferencesReturn = CustomizePreferences & {
    readonly updatePreferences: (updates: Partial<CustomizePreferences>) => void;
    readonly resetPreferences: () => void;
};

export const defaultPreferences: CustomizePreferences = {
    accent: 'mono',
    neutral: 'neutral',
    radius: 'md',
    font: 'sans',
    density: 'comfortable',
    layout: 'sidebar',
    sidebar: 'plain',
    sidebarWidth: 'regular',
    header: 'sticky',
    container: 'fluid',
    chart: 'accent',
    motion: 'standard',
    language: 'en',
};

export type ThemePresetId =
    'atera-mono' | 'slate-blue' | 'sand-orange' | 'ink-violet' | 'forest-green';

export const themePresets: Record<
    ThemePresetId,
    { name: string; preferences: Partial<CustomizePreferences> }
> = {
    'atera-mono': {
        name: 'Atera Mono',
        preferences: {
            accent: 'mono',
            neutral: 'neutral',
            radius: 'md',
            font: 'sans',
            chart: 'accent',
        },
    },
    'slate-blue': {
        name: 'Slate Blue',
        preferences: {
            accent: 'blue',
            neutral: 'slate',
            radius: 'sm',
            font: 'sans',
            chart: 'accent',
        },
    },
    'sand-orange': {
        name: 'Sand Orange',
        preferences: {
            accent: 'orange',
            neutral: 'stone',
            radius: 'lg',
            font: 'sans',
            chart: 'accent',
        },
    },
    'ink-violet': {
        name: 'Ink Violet',
        preferences: {
            accent: 'violet',
            neutral: 'slate',
            radius: 'sm',
            font: 'sans',
            chart: 'vivid',
        },
    },
    'forest-green': {
        name: 'Forest Green',
        preferences: {
            accent: 'green',
            neutral: 'stone',
            radius: 'sm',
            font: 'sans',
            chart: 'accent',
        },
    },
};

const STORAGE_KEY = 'atera_theme';
const COOKIE_KEY = 'atera_theme';
const LEGACY_COOKIE_PREFIX = 'customize_';
const SCHEMA_VERSION = 2;

const listeners = new Set<() => void>();
let currentPreferences: CustomizePreferences = defaultPreferences;

const validValues = {
    accent: ['mono', 'blue', 'violet', 'orange', 'green', 'rose'],
    neutral: ['neutral', 'slate', 'stone'],
    radius: ['none', 'sm', 'md', 'lg'],
    font: ['sans', 'serif', 'mono'],
    density: ['compact', 'comfortable', 'spacious'],
    layout: ['sidebar', 'top-nav'],
    sidebar: ['plain', 'floating', 'inset'],
    sidebarWidth: ['compact', 'regular', 'wide'],
    header: ['sticky', 'static'],
    container: ['fluid', 'boxed'],
    chart: ['accent', 'mono', 'vivid'],
    motion: ['standard', 'reduced'],
    language: ['en', 'de', 'fr'],
} as const satisfies Record<keyof CustomizePreferences, readonly string[]>;

const isValid = <K extends keyof CustomizePreferences>(
    key: K,
    value: unknown,
): value is CustomizePreferences[K] =>
    typeof value === 'string' && (validValues[key] as readonly string[]).includes(value);

export function sanitizePreferences(value: unknown): CustomizePreferences {
    if (!value || typeof value !== 'object') {
        return { ...defaultPreferences };
    }

    const input = value as Record<string, unknown>;
    const next = { ...defaultPreferences };

    (Object.keys(defaultPreferences) as Array<keyof CustomizePreferences>).forEach((key) => {
        if (isValid(key, input[key])) {
            next[key] = input[key] as never;
        }
    });

    return next;
}

const setCookie = (name: string, value: string): void => {
    document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
};

const readCookie = (name: string): string | null => {
    return (
        document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith(`${name}=`))
            ?.split('=')[1] ?? null
    );
};

const removeLegacyCookies = (): void => {
    (Object.keys(validValues) as string[]).forEach((key) => {
        document.cookie = `${LEGACY_COOKIE_PREFIX}${key}=;path=/;max-age=0;SameSite=Lax`;
    });
};

const legacyAccent: Record<string, Accent> = {
    neutral: 'mono',
    zinc: 'mono',
    blue: 'blue',
    violet: 'violet',
    rose: 'rose',
    orange: 'orange',
};

const readLegacyCookies = (): CustomizePreferences => {
    const next = { ...defaultPreferences };
    const color = readCookie(`${LEGACY_COOKIE_PREFIX}color`);

    if (color && color in legacyAccent) {
        next.accent = legacyAccent[color];
        if (color === 'zinc') {
            next.neutral = 'slate';
        }
    }

    (['density', 'layout', 'container', 'language'] as const).forEach((key) => {
        const value = readCookie(`${LEGACY_COOKIE_PREFIX}${key}`);
        if (isValid(key, value)) {
            next[key] = value as never;
        }
    });

    return next;
};

const readShareLink = (): CustomizePreferences | null => {
    const encoded = new URLSearchParams(window.location.search).get('theme');
    if (!encoded) {
        return null;
    }

    try {
        const parsed = JSON.parse(atob(encoded)) as { preferences?: unknown };
        return sanitizePreferences(parsed.preferences ?? parsed);
    } catch {
        return null;
    }
};

const readStoredPreferences = (): CustomizePreferences => {
    const shared = readShareLink();
    if (shared) {
        return shared;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as { preferences?: unknown };
            return sanitizePreferences(parsed.preferences ?? parsed);
        }
    } catch {
        // fall through to the cookie copy
    }

    const cookie = readCookie(COOKIE_KEY);
    if (cookie) {
        try {
            const parsed = JSON.parse(decodeURIComponent(cookie)) as { preferences?: unknown };
            return sanitizePreferences(parsed.preferences ?? parsed);
        } catch {
            // fall through to legacy cookies
        }
    }

    return readLegacyCookies();
};

const applyPreferences = (preferences: CustomizePreferences): void => {
    const root = document.documentElement;

    root.dataset.accent = preferences.accent;
    root.dataset.neutral = preferences.neutral;
    root.dataset.radius = preferences.radius;
    root.dataset.font = preferences.font;
    root.dataset.density = preferences.density;
    root.dataset.layout = preferences.layout;
    root.dataset.sidebar = preferences.sidebar;
    root.dataset.sidebarWidth = preferences.sidebarWidth;
    root.dataset.header = preferences.header;
    root.dataset.container = preferences.container;
    root.dataset.chart = preferences.chart;
    root.dataset.motion = preferences.motion;
    delete root.dataset.color;
    root.style.setProperty(
        '--density-space',
        preferences.density === 'compact'
            ? '0.75'
            : preferences.density === 'spacious'
              ? '1.25'
              : '1',
    );
    root.lang = preferences.language;
};

const persist = (preferences: CustomizePreferences): void => {
    const payload = JSON.stringify({ version: SCHEMA_VERSION, preferences });
    try {
        window.localStorage.setItem(STORAGE_KEY, payload);
    } catch {
        // storage can be unavailable; the cookie still carries the theme
    }
    setCookie(COOKIE_KEY, encodeURIComponent(payload));
    removeLegacyCookies();
};

const notify = (): void => listeners.forEach((listener) => listener());

let storageListenerBound = false;

const bindStorageListener = (): void => {
    if (storageListenerBound || typeof window === 'undefined') {
        return;
    }

    storageListenerBound = true;
    window.addEventListener('storage', (event) => {
        if (event.key !== STORAGE_KEY || !event.newValue) {
            return;
        }

        try {
            const parsed = JSON.parse(event.newValue) as { preferences?: unknown };
            currentPreferences = sanitizePreferences(parsed.preferences ?? parsed);
            applyPreferences(currentPreferences);
            notify();
        } catch {
            // ignore malformed writes from other tabs
        }
    });
};

export function initializeCustomizePreferences(): void {
    if (typeof document === 'undefined') {
        return;
    }

    currentPreferences = readStoredPreferences();
    applyPreferences(currentPreferences);
    persist(currentPreferences);
    bindStorageListener();
}

const applyPatch = (updates: Partial<CustomizePreferences>): CustomizePreferences => {
    const next = { ...currentPreferences };

    (Object.keys(updates) as Array<keyof CustomizePreferences>).forEach((key) => {
        if (isValid(key, updates[key])) {
            next[key] = updates[key] as never;
        }
    });

    return next;
};

export function exportPreferences(): string {
    return JSON.stringify({ version: SCHEMA_VERSION, preferences: currentPreferences }, null, 2);
}

export function importPreferences(json: string): { ok: boolean; error?: string } {
    let parsed: unknown;

    try {
        parsed = JSON.parse(json);
    } catch {
        return { ok: false, error: 'invalidJson' };
    }

    const preferences = sanitizePreferences(
        parsed && typeof parsed === 'object' && 'preferences' in parsed
            ? (parsed as { preferences: unknown }).preferences
            : parsed,
    );

    currentPreferences = preferences;
    applyPreferences(preferences);
    persist(preferences);
    notify();

    return { ok: true };
}

export function sharePreferences(): string {
    const encoded = btoa(JSON.stringify({ preferences: currentPreferences }));
    const url = new URL(window.location.href);
    url.searchParams.set('theme', encoded);
    return url.toString();
}

export function getCssVariables(): string {
    const styles = getComputedStyle(document.documentElement);
    const tokens = [
        '--background',
        '--foreground',
        '--card',
        '--card-foreground',
        '--primary',
        '--primary-foreground',
        '--secondary',
        '--muted',
        '--muted-foreground',
        '--border',
        '--input',
        '--ring',
        '--radius',
        '--chart-1',
        '--chart-2',
        '--chart-3',
        '--chart-4',
        '--chart-5',
    ];

    return tokens
        .map((token) => `    ${token}: ${styles.getPropertyValue(token).trim()};`)
        .join('\n');
}

export function useCustomizePreferences(): PreferencesReturn {
    const preferences = useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        () => currentPreferences,
        () => defaultPreferences,
    );

    const updatePreferences = (updates: Partial<CustomizePreferences>): void => {
        currentPreferences = applyPatch(updates);
        applyPreferences(currentPreferences);
        persist(currentPreferences);
        notify();
    };

    const resetPreferences = (): void => {
        currentPreferences = { ...defaultPreferences };
        applyPreferences(currentPreferences);
        persist(currentPreferences);
        notify();
    };

    return { ...preferences, updatePreferences, resetPreferences };
}
