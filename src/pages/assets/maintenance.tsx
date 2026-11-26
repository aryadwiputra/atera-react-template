import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { UserRound, Wallet, Wrench } from 'lucide-react';
import {
    createAppColumnHelper,
    DataTable,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations, type TranslationKey } from '@/i18n';
import { formatAssetValue, getWarrantyState, type WarrantyState } from '@/lib/assets';
import type { Asset } from '@/lib/data/types';
import { assetService } from '@/services/asset-service';

const helper = createAppColumnHelper<Asset>();

const warrantyClasses: Record<WarrantyState, string> = {
    active: 'bg-status-success/15 text-status-success',
    expiring: 'bg-status-warning/15 text-status-warning',
    expired: 'bg-destructive/10 text-destructive',
};

const warrantyLabelKeys: Record<WarrantyState, TranslationKey> = {
    active: 'warrantyActive',
    expiring: 'warrantyExpiring',
    expired: 'warrantyExpired',
};

export default function AssetMaintenancePage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const assets = useMemo(
        () => assetService.list().filter((asset) => asset.status === 'Maintenance'),
        [],
    );
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const assignedCount = assets.filter((asset) => asset.assignedTo.trim()).length;

    const columns: ColumnDef<typeof tableFeaturesConfig, Asset, any>[] = [
        helper.accessor((row) => `${row.tag} ${row.name}`, {
            id: 'asset',
            header: t('asset'),
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="font-mono text-[11px] text-muted-foreground">
                        {row.original.tag}
                    </div>
                    <div className="truncate font-medium">{row.original.name}</div>
                </div>
            ),
        }),
        helper.accessor('category', { header: t('category') }),
        helper.accessor('assignedTo', {
            header: t('assignedTo'),
            cell: ({ getValue }) => getValue() || t('unassigned'),
        }),
        helper.accessor('location', { header: t('location') }),
        helper.accessor('warrantyEnd', {
            header: t('warranty'),
            cell: ({ getValue }) => {
                const state = getWarrantyState(getValue());
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{getValue()}</span>
                        <Badge className={warrantyClasses[state]}>
                            {t(warrantyLabelKeys[state])}
                        </Badge>
                    </div>
                );
            },
        }),
        helper.accessor('value', {
            header: t('assetValue'),
            cell: ({ getValue }) => (
                <span className="font-medium tabular-nums">{formatAssetValue(getValue())}</span>
            ),
        }),
    ];

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={t('assetMaintenance')}
                    description={t('assetMaintenanceDescription')}
                    breadcrumbs={[
                        { title: t('assets'), href: '/assets' },
                        { title: t('assetMaintenance'), href: '/assets/maintenance' },
                    ]}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        title={t('assetsInMaintenance')}
                        value={assets.length}
                        icon={Wrench}
                    />
                    <StatCard
                        title={t('assetValue')}
                        value={formatAssetValue(totalValue)}
                        icon={Wallet}
                    />
                    <StatCard title={t('assignedAssets')} value={assignedCount} icon={UserRound} />
                </div>

                <DataTable columns={columns} data={assets} filterPlaceholder={t('searchAssets')} />
            </main>
        </PageTransition>
    );
}
