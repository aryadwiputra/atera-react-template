import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { SkipToContent } from '@/components/shared/skip-to-content';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { usePageMeta } from '@/hooks/use-page-meta';
import { useTranslations } from '@/i18n';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({ children, breadcrumbs }: AppLayoutProps) {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    usePageMeta();

    return (
        <AppShell variant="header">
            <SkipToContent label={t('skipToContent')} />
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
