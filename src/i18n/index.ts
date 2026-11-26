import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { Language } from '@/hooks/use-customize-preferences';
import { en } from './locales/en';

type Dictionary = Record<string, string>;

export type TranslationKey = keyof typeof en;
export type Translator = (key: TranslationKey) => string;

const dictionaries: Partial<Record<Language, Dictionary>> = { en: en as Dictionary };
const pending = new Set<Language>();
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const loaders: Record<Exclude<Language, 'en'>, () => Promise<Dictionary>> = {
    de: () => import('./locales/de').then((module) => module.de as Dictionary),
    fr: () => import('./locales/fr').then((module) => module.fr as Dictionary),
};

const ensureLocale = (language: Language): void => {
    if (language === 'en' || dictionaries[language] || pending.has(language)) {
        return;
    }

    pending.add(language);
    loaders[language]()
        .then((dictionary) => {
            dictionaries[language] = dictionary;
            pending.delete(language);
            notify();
        })
        .catch(() => pending.delete(language));
};

export function getTranslations(language: Language): Dictionary {
    return dictionaries[language] ?? (en as Dictionary);
}

export function useTranslations(language: Language): Translator {
    const dictionary = useSyncExternalStore(
        subscribe,
        () => getTranslations(language),
        () => en as Dictionary,
    );

    useEffect(() => {
        ensureLocale(language);
    }, [language]);

    return useMemo(
        () => (key: TranslationKey) => dictionary[key] ?? (en as Dictionary)[key] ?? key,
        [dictionary],
    );
}
