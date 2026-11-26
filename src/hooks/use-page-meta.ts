import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { translations } from '@/i18n';
import { navigationItems } from '@/lib/navigation';

const siteName = 'Atera';
const indexablePaths = new Set(['/', '/docs', '/terms', '/privacy']);
const defaultDescription =
    'Atera is a fully typed React 19 admin dashboard template with 60+ ready routes, 48 shadcn-style UI components, dark mode, theming, and three languages.';

type PageMeta = {
    title: string;
    description: string;
};

const publicPages: Record<string, PageMeta> = {
    '/': {
        title: 'Atera — a React dashboard template that ships fast',
        description: defaultDescription,
    },
    '/docs': {
        title: `Documentation · ${siteName}`,
        description:
            'Architecture, data layer, UI components, theming and i18n notes for the Atera template.',
    },
    '/terms': {
        title: `Terms of service · ${siteName}`,
        description: 'Terms of service for the Atera demo dashboard.',
    },
    '/privacy': {
        title: `Privacy policy · ${siteName}`,
        description: 'Privacy policy for the Atera demo dashboard.',
    },
    '/login': {
        title: `Log in · ${siteName}`,
        description: 'Sign in to the Atera admin dashboard demo.',
    },
    '/sign-in': {
        title: `Log in · ${siteName}`,
        description: 'Sign in to the Atera admin dashboard demo.',
    },
    '/login-v2': {
        title: `Log in · ${siteName}`,
        description: 'Sign in to the Atera admin dashboard demo.',
    },
    '/sign-up': {
        title: `Create account · ${siteName}`,
        description: 'Create an Atera demo account.',
    },
    '/register-v2': {
        title: `Create account · ${siteName}`,
        description: 'Create an Atera demo account.',
    },
    '/forgot-password': {
        title: `Forgot password · ${siteName}`,
        description: 'Request a password reset for your Atera demo account.',
    },
    '/reset-password': {
        title: `Reset password · ${siteName}`,
        description: 'Choose a new password for your Atera demo account.',
    },
    '/two-factor': {
        title: `Two-factor authentication · ${siteName}`,
        description: 'Verify your identity to continue to the Atera dashboard.',
    },
    '/verify-email': {
        title: `Verify email · ${siteName}`,
        description: 'Verify your email address to finish setting up Atera.',
    },
    '/lock-screen': {
        title: `Locked · ${siteName}`,
        description: 'Unlock your Atera session.',
    },
};

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
    const selector = `meta[${attribute}="${key}"]`;
    let element = document.head.querySelector<HTMLMetaElement>(selector);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
    let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!element) {
        element = document.createElement('link');
        element.rel = 'canonical';
        document.head.appendChild(element);
    }
    element.href = href;
}

export function usePageMeta() {
    const { pathname } = useLocation();
    const { language } = useCustomizePreferences();

    useEffect(() => {
        const localized = translations[language] as Record<string, string>;
        const translate = (key: keyof typeof translations.en) =>
            localized[key] ?? translations.en[key] ?? key;

        const navigationItem = navigationItems
            .filter(
                (item) =>
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(`${item.href}/`)),
            )
            .sort((a, b) => b.href.length - a.href.length)[0];

        const publicMeta = publicPages[pathname];
        const title =
            publicMeta?.title ??
            (navigationItem
                ? `${translate(navigationItem.translationKey)} · ${siteName}`
                : `Page not found · ${siteName}`);
        const description =
            publicMeta?.description ??
            (navigationItem
                ? `${translate(navigationItem.translationKey)} — a ready-made route in the ${siteName} admin dashboard template.`
                : defaultDescription);
        const url = `${window.location.origin}${pathname}`;
        const image = `${window.location.origin}/dashboard-preview.png`;

        document.title = title;
        upsertMeta('name', 'description', description);
        upsertMeta(
            'name',
            'robots',
            indexablePaths.has(pathname) ? 'index, follow' : 'noindex, nofollow',
        );
        upsertMeta('property', 'og:title', title);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:url', url);
        upsertMeta('property', 'og:image', image);
        upsertMeta('property', 'og:site_name', siteName);
        upsertMeta('name', 'twitter:title', title);
        upsertMeta('name', 'twitter:description', description);
        upsertMeta('name', 'twitter:image', image);
        upsertCanonical(url);
    }, [pathname, language]);
}
