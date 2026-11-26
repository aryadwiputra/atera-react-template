import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router';
import { PageTransition } from '@/components/shared/page-transition';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

export default function SettingsLayout() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isTeamPath = pathname === '/users' || pathname.startsWith('/settings/departments');
    const activeTab =
        pathname === '/settings'
            ? searchParams.get('tab') === 'team'
                ? 'team'
                : 'general'
            : isTeamPath
              ? 'team'
              : 'general';

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <div className="space-y-4">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold tracking-tight">{t('settings')}</h1>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                            {t('settingsDescription')}
                        </p>
                    </div>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) =>
                            navigate(value === 'team' ? '/settings?tab=team' : '/settings', {
                                replace: true,
                            })
                        }
                    >
                        <TabsList variant="line">
                            <TabsTrigger value="general">{t('general')}</TabsTrigger>
                            <TabsTrigger value="team">{t('team')}</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <Outlet />
            </main>
        </PageTransition>
    );
}
