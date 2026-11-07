import { useSyncExternalStore } from 'react';

export type ColorPreset =
    | 'neutral'
    | 'zinc'
    | 'blue'
    | 'violet'
    | 'rose'
    | 'orange';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type Layout = 'sidebar' | 'top-nav';
export type Container = 'fluid' | 'boxed';
export type Language = 'en' | 'de' | 'fr';

export type CustomizePreferences = {
    color: ColorPreset;
    density: Density;
    layout: Layout;
    container: Container;
    language: Language;
};

export type PreferencesReturn = CustomizePreferences & {
    readonly updatePreferences: (
        updates: Partial<CustomizePreferences>,
    ) => void;
    readonly resetPreferences: () => void;
};

export const defaultPreferences: CustomizePreferences = {
    color: 'neutral',
    density: 'comfortable',
    layout: 'sidebar',
    container: 'fluid',
    language: 'en',
};

const listeners = new Set<() => void>();
let currentPreferences: CustomizePreferences = defaultPreferences;

const validValues = {
    color: ['neutral', 'zinc', 'blue', 'violet', 'rose', 'orange'],
    density: ['compact', 'comfortable', 'spacious'],
    layout: ['sidebar', 'top-nav'],
    container: ['fluid', 'boxed'],
    language: ['en', 'de', 'fr'],
} as const;

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

const isValid = <K extends keyof CustomizePreferences>(
    key: K,
    value: string,
): value is CustomizePreferences[K] => {
    return (validValues[key] as readonly string[]).includes(value);
};

const readPreferences = (): CustomizePreferences => {
    if (typeof document === 'undefined') {
        return defaultPreferences;
    }

    return Object.keys(defaultPreferences).reduce(
        (preferences, key) => {
            const preferenceKey = key as keyof CustomizePreferences;
            const value = readCookie(`customize_${preferenceKey}`);

            if (value && isValid(preferenceKey, value)) {
                preferences[preferenceKey] = value as never;
            }

            return preferences;
        },
        { ...defaultPreferences },
    );
};

const applyPreferences = (preferences: CustomizePreferences): void => {
    const root = document.documentElement;

    root.dataset.color = preferences.color;
    root.dataset.density = preferences.density;
    root.dataset.layout = preferences.layout;
    root.dataset.container = preferences.container;
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

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeCustomizePreferences(): void {
    if (typeof document === 'undefined') {
        return;
    }

    currentPreferences = readPreferences();
    applyPreferences(currentPreferences);
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

    const updatePreferences = (
        updates: Partial<CustomizePreferences>,
    ): void => {
        currentPreferences = { ...currentPreferences, ...updates };

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                setCookie(`customize_${key}`, value);
            }
        });

        applyPreferences(currentPreferences);
        notify();
    };

    const resetPreferences = (): void => {
        currentPreferences = defaultPreferences;
        Object.keys(defaultPreferences).forEach((key) => {
            setCookie(
                `customize_${key}`,
                defaultPreferences[key as keyof CustomizePreferences],
            );
        });
        applyPreferences(currentPreferences);
        notify();
    };

    return { ...preferences, updatePreferences, resetPreferences };
}
