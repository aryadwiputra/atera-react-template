import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { getDemoCredentials } from '@/lib/auth';

const facts = [
    { value: '60+', label: 'authPanelRoutes' },
    { value: '24', label: 'authPanelModules' },
    { value: '48', label: 'authPanelComponents' },
] as const;

function ThemeToggle() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('toggleTheme')}
            className="text-muted-foreground hover:text-foreground"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}

export function AuthShell({ children }: { children: ReactNode }) {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const demo = getDemoCredentials();

    return (
        <div className="min-h-svh bg-background">
            <div className="mx-auto grid min-h-svh w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
                <aside className="hidden flex-col justify-between border-r border-border/70 bg-muted/20 px-10 py-10 lg:flex xl:px-14">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/"
                            aria-label="Atera home"
                            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <AppLogo />
                        </Link>
                        <ThemeToggle />
                    </div>

                    <div className="max-w-[520px] py-12">
                        <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance xl:text-5xl">
                            {t('authPanelTitle')}
                        </h2>
                        <p className="mt-5 max-w-[48ch] text-sm leading-6 text-pretty text-muted-foreground">
                            {t('authPanelDescription')}
                        </p>

                        <dl className="mt-10 grid grid-cols-3 border-y border-border/70">
                            {facts.map((fact, index) => (
                                <div
                                    key={fact.label}
                                    className={
                                        index === 0
                                            ? 'py-5 pr-4'
                                            : 'border-l border-border/70 py-5 pr-4 pl-4'
                                    }
                                >
                                    <dt className="text-xs leading-5 text-muted-foreground">
                                        {t(fact.label)}
                                    </dt>
                                    <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                                        {fact.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-8">
                            <p className="text-sm font-medium">{t('demoAccess')}</p>
                            <dl className="mt-3 space-y-2 text-sm">
                                <div className="flex items-baseline justify-between gap-6">
                                    <dt className="text-muted-foreground">{t('emailAddress')}</dt>
                                    <dd className="truncate font-medium">{demo.email}</dd>
                                </div>
                                <div className="flex items-baseline justify-between gap-6">
                                    <dt className="text-muted-foreground">{t('password')}</dt>
                                    <dd className="truncate font-medium">{demo.password}</dd>
                                </div>
                            </dl>
                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                {t('authPanelDemoHint')}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        React 19 · TypeScript · Tailwind CSS v4
                    </p>
                </aside>

                <main id="main-content" className="flex min-w-0 flex-col">
                    <div className="flex items-center justify-between px-6 py-6 lg:hidden">
                        <Link
                            to="/"
                            aria-label="Atera home"
                            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <AppLogo />
                        </Link>
                        <ThemeToggle />
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 pt-2 pb-14 sm:px-10 lg:py-16">
                        <div className="w-full max-w-[400px]">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
