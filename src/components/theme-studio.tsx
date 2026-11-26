import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    exportPreferences,
    getCssVariables,
    importPreferences,
    sharePreferences,
    themePresets,
    type Accent,
    type ChartPalette,
    type Density,
    type FontFamily,
    type HeaderMode,
    type Language,
    type Motion,
    type Neutral,
    type PreferencesReturn,
    type SidebarStyle,
    type SidebarWidth,
    type ThemePresetId,
} from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

export type ThemeStudioProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preferences: PreferencesReturn;
    t: ReturnType<typeof useTranslations>;
    appearance: 'light' | 'dark' | 'system';
    updateAppearance: (appearance: 'light' | 'dark' | 'system') => void;
};

const accentSwatches: Record<Accent, string> = {
    mono: 'oklch(0.205 0 0)',
    blue: 'oklch(0.546 0.245 262.881)',
    violet: 'oklch(0.541 0.281 293.009)',
    orange: 'oklch(0.58 0.19 41.116)',
    green: 'oklch(0.527 0.154 150.069)',
    rose: 'oklch(0.586 0.253 17.585)',
};

const presetColors: Record<ThemePresetId, { accent: string; chart2: string; chart4: string }> = {
    'atera-mono': {
        accent: 'oklch(0.205 0 0)',
        chart2: 'oklch(0.45 0 0)',
        chart4: 'oklch(0.65 0 0)',
    },
    'slate-blue': {
        accent: 'oklch(0.546 0.245 262.881)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart4: 'oklch(0.828 0.189 84.429)',
    },
    'sand-orange': {
        accent: 'oklch(0.58 0.19 41.116)',
        chart2: 'oklch(0.828 0.189 84.429)',
        chart4: 'oklch(0.6 0.118 184.704)',
    },
    'ink-violet': {
        accent: 'oklch(0.541 0.281 293.009)',
        chart2: 'oklch(0.627 0.265 303.9)',
        chart4: 'oklch(0.645 0.246 16.439)',
    },
    'forest-green': {
        accent: 'oklch(0.527 0.154 150.069)',
        chart2: 'oklch(0.696 0.17 162.48)',
        chart4: 'oklch(0.769 0.188 70.08)',
    },
};

const accents: Accent[] = ['mono', 'blue', 'violet', 'orange', 'green', 'rose'];
const neutrals: Neutral[] = ['neutral', 'slate', 'stone'];
const fonts: FontFamily[] = ['sans', 'serif', 'mono'];
const charts: ChartPalette[] = ['accent', 'mono', 'vivid'];
const densities: Density[] = ['compact', 'comfortable', 'spacious'];
const sidebarStyles: SidebarStyle[] = ['plain', 'floating', 'inset'];
const sidebarWidths: SidebarWidth[] = ['compact', 'regular', 'wide'];
const headers: HeaderMode[] = ['sticky', 'static'];
const motions: Motion[] = ['standard', 'reduced'];
const languages: Language[] = ['en', 'de', 'fr'];

function Section({
    title,
    children,
    onReset,
    resetLabel,
}: {
    title: string;
    children: React.ReactNode;
    onReset?: () => void;
    resetLabel?: string;
}) {
    return (
        <section className="space-y-3 border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{title}</h3>
                {onReset && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={onReset}
                    >
                        {resetLabel}
                    </Button>
                )}
            </div>
            {children}
        </section>
    );
}

function Segmented<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: Array<{ value: T; label: string }>;
    onChange: (value: T) => void;
}) {
    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
                {options.map((option) => (
                    <Button
                        key={option.value}
                        type="button"
                        variant={value === option.value ? 'default' : 'outline'}
                        size="sm"
                        aria-pressed={value === option.value}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export function ThemeStudio({
    open,
    onOpenChange,
    preferences,
    t,
    appearance,
    updateAppearance,
}: ThemeStudioProps) {
    const [status, setStatus] = useState('');
    const fileInput = useRef<HTMLInputElement>(null);

    const report = (message: string) => {
        setStatus(message);
        window.setTimeout(() => setStatus(''), 2400);
    };

    const copy = (value: string, message: string) => {
        navigator.clipboard
            .writeText(value)
            .then(() => report(message))
            .catch(() => report(t('copyFailed')));
    };

    const applyPreset = (id: ThemePresetId) => {
        preferences.updatePreferences(themePresets[id].preferences);
    };

    const importFile = async (file: File | undefined) => {
        if (!file) {
            return;
        }
        const result = importPreferences(await file.text());
        report(result.ok ? t('themeImported') : t('importFailed'));
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full gap-0 sm:max-w-lg">
                <SheetHeader className="border-b border-border/70 px-6 pb-4">
                    <SheetTitle>{t('themeStudio')}</SheetTitle>
                    <SheetDescription>{t('themeStudioDescription')}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    <div
                        role="img"
                        aria-label={t('livePreview')}
                        className="rounded-lg border bg-background p-3"
                    >
                        <div className="flex gap-3">
                            <div className="w-16 shrink-0 space-y-2 rounded-md bg-muted/60 p-2">
                                <div className="size-4 rounded-sm bg-primary" />
                                <div className="space-y-1.5 pt-1">
                                    <div className="h-1.5 w-full rounded-full bg-foreground/25" />
                                    <div className="h-1.5 w-4/5 rounded-full bg-foreground/15" />
                                    <div className="h-1.5 w-3/5 rounded-full bg-foreground/15" />
                                    <div className="h-1.5 w-4/5 rounded-full bg-foreground/15" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="h-2 w-16 rounded-full bg-foreground/40" />
                                    <div className="h-3.5 w-9 rounded-md bg-primary" />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[0, 1, 2].map((index) => (
                                        <div key={index} className="rounded-md border bg-card p-2">
                                            <div className="h-1 w-8 rounded-full bg-foreground/25" />
                                            <div className="mt-1.5 h-2 w-10 rounded-full bg-foreground/60" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex h-14 items-end gap-1.5 rounded-md border bg-card p-2">
                                    {[3, 5, 4, 7, 6, 9, 7].map((bar, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 rounded-sm"
                                            style={{
                                                height: `${bar * 8}%`,
                                                backgroundColor: `var(--chart-${(index % 5) + 1})`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Section title={t('presets')}>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(themePresets) as ThemePresetId[]).map((id) => {
                                const preset = themePresets[id];
                                const active =
                                    preferences.accent === preset.preferences.accent &&
                                    preferences.neutral === preset.preferences.neutral &&
                                    preferences.radius === preset.preferences.radius &&
                                    preferences.font === preset.preferences.font &&
                                    preferences.chart === preset.preferences.chart;

                                return (
                                    <Button
                                        key={id}
                                        type="button"
                                        variant={active ? 'default' : 'outline'}
                                        className="h-auto justify-start gap-3 py-2.5"
                                        aria-pressed={active}
                                        onClick={() => applyPreset(id)}
                                    >
                                        <span className="flex -space-x-1">
                                            {[
                                                presetColors[id].accent,
                                                presetColors[id].chart2,
                                                presetColors[id].chart4,
                                            ].map((color) => (
                                                <span
                                                    key={color}
                                                    className="size-3 rounded-full border border-background"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </span>
                                        <span className="min-w-0 text-left">
                                            <span className="block text-xs font-medium">
                                                {preset.name}
                                            </span>
                                            <span className="block text-[10px] text-muted-foreground capitalize">
                                                {preset.preferences.neutral ?? 'neutral'} ·{' '}
                                                {preset.preferences.radius ?? 'md'}
                                            </span>
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </Section>

                    <Section
                        title={t('color')}
                        resetLabel={t('reset')}
                        onReset={() =>
                            preferences.updatePreferences({
                                accent: 'mono',
                                neutral: 'neutral',
                                chart: 'accent',
                            })
                        }
                    >
                        <Segmented
                            label={t('theme')}
                            value={appearance}
                            options={[
                                { value: 'light', label: t('light') },
                                { value: 'dark', label: t('dark') },
                                { value: 'system', label: t('system') },
                            ]}
                            onChange={updateAppearance}
                        />
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">{t('accent')}</p>
                            <div
                                role="group"
                                aria-label={t('accent')}
                                className="grid grid-cols-3 gap-2"
                            >
                                {accents.map((accent) => (
                                    <Button
                                        key={accent}
                                        type="button"
                                        variant={
                                            preferences.accent === accent ? 'default' : 'outline'
                                        }
                                        className="h-auto justify-start gap-2 py-2"
                                        aria-pressed={preferences.accent === accent}
                                        onClick={() => preferences.updatePreferences({ accent })}
                                    >
                                        <span
                                            className="size-3.5 rounded-full border border-border"
                                            style={{ backgroundColor: accentSwatches[accent] }}
                                        />
                                        <span className="text-xs capitalize">{accent}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Segmented
                            label={t('neutral')}
                            value={preferences.neutral}
                            options={neutrals.map((neutral) => ({
                                value: neutral,
                                label: neutral[0].toUpperCase() + neutral.slice(1),
                            }))}
                            onChange={(neutral) => preferences.updatePreferences({ neutral })}
                        />
                        <Segmented
                            label={t('chartPalette')}
                            value={preferences.chart}
                            options={charts.map((chart) => ({
                                value: chart,
                                label: chart[0].toUpperCase() + chart.slice(1),
                            }))}
                            onChange={(chart) => preferences.updatePreferences({ chart })}
                        />
                    </Section>

                    <Section
                        title={t('shape')}
                        resetLabel={t('reset')}
                        onReset={() =>
                            preferences.updatePreferences({ radius: 'md', font: 'sans' })
                        }
                    >
                        <Segmented
                            label={t('radius')}
                            value={preferences.radius}
                            options={[
                                { value: 'none', label: '0' },
                                { value: 'sm', label: '0.375' },
                                { value: 'md', label: '0.625' },
                                { value: 'lg', label: '1rem' },
                            ]}
                            onChange={(radius) => preferences.updatePreferences({ radius })}
                        />
                        <Segmented
                            label={t('font')}
                            value={preferences.font}
                            options={fonts.map((font) => ({
                                value: font,
                                label: font[0].toUpperCase() + font.slice(1),
                            }))}
                            onChange={(font) => preferences.updatePreferences({ font })}
                        />
                    </Section>

                    <Section
                        title={t('layout')}
                        resetLabel={t('reset')}
                        onReset={() =>
                            preferences.updatePreferences({
                                density: 'comfortable',
                                layout: 'sidebar',
                                sidebar: 'plain',
                                sidebarWidth: 'regular',
                                header: 'sticky',
                                container: 'fluid',
                                motion: 'standard',
                            })
                        }
                    >
                        <Segmented
                            label={t('density')}
                            value={preferences.density}
                            options={densities.map((density) => ({
                                value: density,
                                label: t(density),
                            }))}
                            onChange={(density) => preferences.updatePreferences({ density })}
                        />
                        <Segmented
                            label={t('layout')}
                            value={preferences.layout}
                            options={[
                                { value: 'sidebar', label: t('sidebar') },
                                { value: 'top-nav', label: t('topNav') },
                            ]}
                            onChange={(layout) => preferences.updatePreferences({ layout })}
                        />
                        <Segmented
                            label={t('sidebarStyle')}
                            value={preferences.sidebar}
                            options={sidebarStyles.map((sidebar) => ({
                                value: sidebar,
                                label: sidebar[0].toUpperCase() + sidebar.slice(1),
                            }))}
                            onChange={(sidebar) => preferences.updatePreferences({ sidebar })}
                        />
                        <Segmented
                            label={t('sidebarWidth')}
                            value={preferences.sidebarWidth}
                            options={sidebarWidths.map((sidebarWidth) => ({
                                value: sidebarWidth,
                                label: sidebarWidth[0].toUpperCase() + sidebarWidth.slice(1),
                            }))}
                            onChange={(sidebarWidth) =>
                                preferences.updatePreferences({ sidebarWidth })
                            }
                        />
                        <Segmented
                            label={t('headerMode')}
                            value={preferences.header}
                            options={headers.map((header) => ({
                                value: header,
                                label: header[0].toUpperCase() + header.slice(1),
                            }))}
                            onChange={(header) => preferences.updatePreferences({ header })}
                        />
                        <Segmented
                            label={t('container')}
                            value={preferences.container}
                            options={[
                                { value: 'fluid', label: t('fluid') },
                                { value: 'boxed', label: t('boxed') },
                            ]}
                            onChange={(container) => preferences.updatePreferences({ container })}
                        />
                        <Segmented
                            label={t('motion')}
                            value={preferences.motion}
                            options={motions.map((motion) => ({
                                value: motion,
                                label: motion[0].toUpperCase() + motion.slice(1),
                            }))}
                            onChange={(motion) => preferences.updatePreferences({ motion })}
                        />
                    </Section>

                    <Section title={t('language')}>
                        <Segmented
                            label={t('language')}
                            value={preferences.language}
                            options={languages.map((language) => ({
                                value: language,
                                label:
                                    language === 'en'
                                        ? t('english')
                                        : language === 'de'
                                          ? t('deutsch')
                                          : t('francais'),
                            }))}
                            onChange={(language) => preferences.updatePreferences({ language })}
                        />
                    </Section>

                    <Section title={t('advanced')}>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => copy(getCssVariables(), t('copied'))}
                            >
                                {t('copyCss')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => copy(exportPreferences(), t('themeExported'))}
                            >
                                {t('exportTheme')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInput.current?.click()}
                            >
                                {t('importTheme')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => copy(sharePreferences(), t('shareCopied'))}
                            >
                                {t('shareTheme')}
                            </Button>
                        </div>
                        <input
                            ref={fileInput}
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={(event) => void importFile(event.target.files?.[0])}
                        />
                        {status && (
                            <p role="status" className="text-xs text-muted-foreground">
                                {status}
                            </p>
                        )}
                    </Section>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/70 px-6 py-4">
                    <Button variant="outline" onClick={preferences.resetPreferences}>
                        {t('resetDefaults')}
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>{t('close')}</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
