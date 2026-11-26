import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { MapPin, UserRound, Wallet } from 'lucide-react';
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
import { useTranslations } from '@/i18n';
import { formatAssetValue, summarizeAssetsByAssignee, type AssigneeSummary } from '@/lib/assets';
import { assetService } from '@/services/asset-service';

const helper = createAppColumnHelper<AssigneeSummary>();

export default function AssetAssignmentsPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const assets = useMemo(() => assetService.list(), []);
    const groups = useMemo(() => summarizeAssetsByAssignee(assets), [assets]);
    const assignedGroups = groups.filter((group) => group.assignee);
    const unassignedCount = assets.filter((asset) => !asset.assignedTo.trim()).length;
    const locationCount = new Set(assets.map((asset) => asset.location)).size;
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

    const columns: ColumnDef<typeof tableFeaturesConfig, AssigneeSummary, any>[] = [
        helper.accessor('assignee', {
            header: t('assignedTo'),
            cell: ({ getValue }) => {
                const assignee = getValue();
                return (
                    <span className={assignee ? 'font-medium' : 'text-muted-foreground'}>
                        {assignee || t('unassigned')}
                    </span>
                );
            },
        }),
        helper.accessor('assetCount', {
            header: t('assets'),
            cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
        }),
        helper.accessor('tags', {
            header: t('assetTags'),
            cell: ({ getValue }) => {
                const tags = getValue() as string[];
                return (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="font-mono text-[11px]">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                );
            },
        }),
        helper.accessor('locations', {
            header: t('locations'),
            cell: ({ getValue }) => (
                <span className="text-muted-foreground">
                    {(getValue() as string[]).join(' · ')}
                </span>
            ),
        }),
        helper.accessor('totalValue', {
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
                    title={t('assetAssignments')}
                    description={t('assetAssignmentsDescription')}
                    breadcrumbs={[
                        { title: t('assets'), href: '/assets' },
                        { title: t('assetAssignments'), href: '/assets/assignments' },
                    ]}
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title={t('assignedAssets')}
                        value={assignedGroups.length}
                        icon={UserRound}
                    />
                    <StatCard title={t('unassigned')} value={unassignedCount} icon={UserRound} />
                    <StatCard title={t('locations')} value={locationCount} icon={MapPin} />
                    <StatCard
                        title={t('assetValue')}
                        value={formatAssetValue(totalValue)}
                        icon={Wallet}
                    />
                </div>

                <DataTable columns={columns} data={groups} filterPlaceholder={t('searchAssets')} />
            </main>
        </PageTransition>
    );
}
