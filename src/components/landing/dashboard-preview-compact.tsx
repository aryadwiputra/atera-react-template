import { metrics } from '@/components/dashboard/types';
import { PreviewFrame } from '@/components/landing/preview-frame';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

const chartBars = [42, 56, 48, 68, 60, 78, 66, 88, 75, 96, 84, 100];
const compactOrders = [
    { id: '#ORD-7291', customer: 'Olivia Martin', amount: '$249.00' },
    { id: '#ORD-7289', customer: 'Jackson Lee', amount: '$129.00' },
    { id: '#ORD-7286', customer: 'Isabella Nguyen', amount: '$49.00' },
];

export function DashboardPreviewCompact() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    return (
        <PreviewFrame label="Dashboard preview">
            <div className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-0.5 rounded-md border p-0.5 text-[10px]">
                        <span className="rounded bg-background px-2 py-1 font-medium shadow-xs">
                            {t('overview')}
                        </span>
                        <span className="px-2 py-1 text-muted-foreground">{t('analytics')}</span>
                        <span className="px-2 py-1 text-muted-foreground">{t('orders')}</span>
                    </div>
                    <span className="text-[10px] font-semibold">Atera</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {metrics.slice(0, 3).map((metric) => (
                        <div key={metric.label} className="rounded-md border bg-card p-2">
                            <p className="truncate text-[10px] text-muted-foreground">
                                {t(metric.label)}
                            </p>
                            <p className="mt-1 text-sm font-semibold">{metric.value}</p>
                            <p className="text-[10px] text-muted-foreground">{metric.change}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-md border bg-card p-2">
                    <div className="mb-2 flex items-center justify-between text-[10px]">
                        <span className="font-medium">{t('overview')}</span>
                        <span className="text-muted-foreground">2026</span>
                    </div>
                    <div className="flex h-20 items-end gap-1" aria-hidden="true">
                        {chartBars.map((value, index) => (
                            <div
                                key={index}
                                className="flex-1 rounded-sm bg-foreground/80"
                                style={{ height: `${value}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-1.5">
                    {compactOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between gap-2 rounded-md border bg-card px-2 py-1.5 text-[10px]"
                        >
                            <span className="truncate font-medium">{order.customer}</span>
                            <span className="shrink-0 text-muted-foreground">{order.id}</span>
                            <span className="shrink-0 font-medium">{order.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </PreviewFrame>
    );
}
