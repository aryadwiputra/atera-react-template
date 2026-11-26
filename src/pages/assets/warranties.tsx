import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ShieldAlert, ShieldCheck, Wallet } from 'lucide-react';
import {
    createAppColumnHelper,
    DataTable,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations, type TranslationKey } from '@/i18n';
import { formatAssetValue, getWarrantyState, type WarrantyState } from '@/lib/assets';
import type { Asset } from '@/lib/data/types';
import { assetService } from '@/services/asset-service';

const helper = createAppColumnHelper<Asset>();
const warrantyStates: WarrantyState[] = ['active', 'expiring', 'expired'];

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

export default function AssetWarrantiesPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [filter, setFilter] = useState<'all' | WarrantyState>('all');
    const assets = useMemo(() => assetService.list(), []);
    const states = useMemo(
        () => new Map(assets.map((asset) => [asset.id, getWarrantyState(asset.warrantyEnd)])),
        [assets],
    );
    const counts = useMemo(() => {
        const result: Record<WarrantyState, number> = { active: 0, expiring: 0, expired: 0 };
        for (const state of states.values()) result[state] += 1;
        return result;
    }, [states]);
    const filteredAssets = useMemo(
        () =>
            filter === 'all' ? assets : assets.filter((asset) => states.get(asset.id) === filter),
        [assets, filter, states],
    );
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

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
        helper.accessor('assignedTo', {
            header: t('assignedTo'),
            cell: ({ getValue }) => getValue() || t('unassigned'),
        }),
        helper.accessor('warrantyEnd', {
            header: t('warrantyEnd'),
            cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
        }),
        helper.accessor((row) => getWarrantyState(row.warrantyEnd), {
            id: 'warrantyState',
            header: t('warranty'),
            cell: ({ getValue }) => {
                const state = getValue() as WarrantyState;
                return (
                    <Badge className={warrantyClasses[state]}>{t(warrantyLabelKeys[state])}</Badge>
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
                    title={t('assetWarranties')}
                    description={t('assetWarrantiesDescription')}
                    breadcrumbs={[
                        { title: t('assets'), href: '/assets' },
                        { title: t('assetWarranties'), href: '/assets/warranties' },
                    ]}
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title={t('warrantyActive')}
                        value={counts.active}
                        icon={ShieldCheck}
                    />
                    <StatCard
                        title={t('warrantyExpiring')}
                        value={counts.expiring}
                        icon={ShieldAlert}
                    />
                    <StatCard
                        title={t('warrantyExpired')}
                        value={counts.expired}
                        icon={ShieldAlert}
                    />
                    <StatCard
                        title={t('assetValue')}
                        value={formatAssetValue(totalValue)}
                        icon={Wallet}
                    />
                </div>

                <div className="flex flex-wrap gap-2" role="group" aria-label={t('warranty')}>
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        aria-pressed={filter === 'all'}
                        onClick={() => setFilter('all')}
                    >
                        {t('allStatuses')}
                        <span className="ml-1.5 text-xs tabular-nums opacity-70">
                            {assets.length}
                        </span>
                    </Button>
                    {warrantyStates.map((state) => (
                        <Button
                            key={state}
                            variant={filter === state ? 'default' : 'outline'}
                            size="sm"
                            aria-pressed={filter === state}
                            onClick={() => setFilter(state)}
                        >
                            {t(warrantyLabelKeys[state])}
                            <span className="ml-1.5 text-xs tabular-nums opacity-70">
                                {counts[state]}
                            </span>
                        </Button>
                    ))}
                </div>

                <DataTable
                    columns={columns}
                    data={filteredAssets}
                    filterPlaceholder={t('searchAssets')}
                />
            </main>
        </PageTransition>
    );
}
