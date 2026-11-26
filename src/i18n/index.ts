import type { Language } from '@/hooks/use-customize-preferences';
import { de } from './locales/de';
import { en } from './locales/en';
import { fr } from './locales/fr';

export const translations = { en, de, fr } as const;

export type TranslationKey = keyof typeof en;
export type Translator = (key: TranslationKey) => string;

export function useTranslations(language: Language) {
    return (key: TranslationKey): string => {
        const localized = translations[language] as Record<string, string>;
        return localized[key] ?? translations.en[key] ?? key;
    };
}
