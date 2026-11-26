import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance, type Appearance } from '@/hooks/use-appearance';
import {
    useCustomizePreferences,
    type Accent,
    type Container,
    type Density,
    type Layout,
} from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

const accents: Accent[] = ['mono', 'blue', 'violet', 'orange', 'green', 'rose'];

const accentSwatches: Record<Accent, string> = {
    mono: 'oklch(0.205 0 0)',
    blue: 'oklch(0.546 0.245 262.881)',
    violet: 'oklch(0.541 0.281 293.009)',
    orange: 'oklch(0.58 0.19 41.116)',
    green: 'oklch(0.527 0.154 150.069)',
    rose: 'oklch(0.586 0.253 17.585)',
};

export default function SettingsAppearancePage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const appearance = useAppearance();
    const preferences = useCustomizePreferences();

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <Link
                        to="/settings"
                        className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        {t('back')}
                    </Link>
                    <h2 className="text-lg font-semibold">{t('appearance')}</h2>
                    <p className="text-sm text-muted-foreground">{t('appearanceDescription')}</p>
                </div>
                <Button variant="outline" onClick={preferences.resetPreferences}>
                    <RotateCcw className="size-4" />
                    {t('reset')}
                </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('theme')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label className="grid gap-2 text-sm font-medium">
                            {t('appearanceMode')}
                            <Select
                                value={appearance.appearance}
                                onValueChange={(value) =>
                                    appearance.updateAppearance(value as Appearance)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="system">{t('system')}</SelectItem>
                                    <SelectItem value="light">{t('light')}</SelectItem>
                                    <SelectItem value="dark">{t('dark')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            {t('language')}
                            <Select
                                value={preferences.language}
                                onValueChange={(value) =>
                                    preferences.updatePreferences({
                                        language: value as 'en' | 'de' | 'fr',
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="de">Deutsch</SelectItem>
                                    <SelectItem value="fr">Français</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('interface')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label className="grid gap-2 text-sm font-medium">
                            {t('density')}
                            <Select
                                value={preferences.density}
                                onValueChange={(value) =>
                                    preferences.updatePreferences({ density: value as Density })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compact">{t('compact')}</SelectItem>
                                    <SelectItem value="comfortable">{t('comfortable')}</SelectItem>
                                    <SelectItem value="spacious">{t('spacious')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            {t('layout')}
                            <Select
                                value={preferences.layout}
                                onValueChange={(value) =>
                                    preferences.updatePreferences({ layout: value as Layout })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sidebar">{t('sidebar')}</SelectItem>
                                    <SelectItem value="top-nav">{t('topNavigation')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            {t('container')}
                            <Select
                                value={preferences.container}
                                onValueChange={(value) =>
                                    preferences.updatePreferences({ container: value as Container })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fluid">{t('fluid')}</SelectItem>
                                    <SelectItem value="boxed">{t('boxed')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('accent')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {accents.map((accent) => (
                            <Button
                                key={accent}
                                variant={preferences.accent === accent ? 'default' : 'outline'}
                                onClick={() => preferences.updatePreferences({ accent })}
                            >
                                {preferences.accent === accent && <Check className="size-4" />}
                                <span
                                    className="size-3 rounded-full border"
                                    style={{ backgroundColor: accentSwatches[accent] }}
                                />
                                {accent.charAt(0).toUpperCase() + accent.slice(1)}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
