import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SkipToContent } from '@/components/shared/skip-to-content';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { usePageMeta } from '@/hooks/use-page-meta';
import { useTranslations } from '@/i18n';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    usePageMeta();

    return (
        <AppShell variant="sidebar">
            <SkipToContent label={t('skipToContent')} />
            <AppSidebarHeader breadcrumbs={breadcrumbs} />
            <div className="flex min-h-0 min-w-0 flex-1">
                <AppSidebar />
                <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                    {children}
                </AppContent>
            </div>
        </AppShell>
    );
}
