import { beforeEach, describe, expect, it } from 'vitest';
import {
    defaultPreferences,
    exportPreferences,
    importPreferences,
    initializeCustomizePreferences,
    sanitizePreferences,
} from './use-customize-preferences';

const clearThemeState = () => {
    window.localStorage.clear();
    document.cookie = 'atera_theme=;path=/;max-age=0';
    ['color', 'density', 'layout', 'container', 'language'].forEach((key) => {
        document.cookie = `customize_${key}=;path=/;max-age=0`;
    });
};

const stored = () => JSON.parse(exportPreferences()) as { preferences: Record<string, string> };

describe('customize preferences', () => {
    beforeEach(() => {
        clearThemeState();
    });

    it('falls back to defaults for malformed input and unknown values', () => {
        expect(sanitizePreferences(null)).toEqual(defaultPreferences);
        expect(sanitizePreferences({ accent: 'neon', density: 'tiny', language: 'de' })).toEqual({
            ...defaultPreferences,
            language: 'de',
        });
    });

    it('imports a versioned theme and applies it to the document', () => {
        const result = importPreferences(
            JSON.stringify({
                version: 2,
                preferences: { accent: 'green', neutral: 'stone', density: 'spacious' },
            }),
        );

        expect(result).toEqual({ ok: true });
        expect(stored().preferences).toMatchObject({
            accent: 'green',
            neutral: 'stone',
            density: 'spacious',
        });
        expect(document.documentElement.dataset.accent).toBe('green');
        expect(document.documentElement.dataset.neutral).toBe('stone');
    });

    it('rejects invalid JSON without changing the theme', () => {
        importPreferences(JSON.stringify({ preferences: { accent: 'rose' } }));
        const before = exportPreferences();

        expect(importPreferences('{not json')).toEqual({ ok: false, error: 'invalidJson' });
        expect(exportPreferences()).toBe(before);
    });

    it('migrates the legacy customize cookies', () => {
        document.cookie = 'customize_color=zinc;path=/';
        document.cookie = 'customize_density=compact;path=/';
        document.cookie = 'customize_language=de;path=/';

        initializeCustomizePreferences();

        expect(stored().preferences).toMatchObject({
            accent: 'mono',
            neutral: 'slate',
            density: 'compact',
            language: 'de',
        });
        expect(document.cookie).toContain('atera_theme=');
        expect(document.documentElement.lang).toBe('de');
    });
});
