import type { ColumnDef } from '@tanstack/react-table';
import {
    DataTable,
    createAppColumnHelper,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { Badge } from '@/components/ui/badge';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import type { DemoPerson } from '@/pages/data-table/data';
import { demoPeople } from '@/pages/data-table/data';

const helper = createAppColumnHelper<DemoPerson>();

export default function DataTableClientPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    const columns: ColumnDef<typeof tableFeaturesConfig, DemoPerson, any>[] = [
        helper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>
            ),
        }),
        helper.accessor('name', { header: t('name') }),
        helper.accessor('email', { header: t('emailAddress') }),
        helper.accessor('role', { header: t('role') }),
        helper.accessor('status', {
            header: t('status'),
            cell: (info) => (
                <Badge
                    variant={
                        info.getValue() === 'Active'
                            ? 'default'
                            : info.getValue() === 'Away'
                              ? 'secondary'
                              : 'outline'
                    }
                >
                    {info.getValue()}
                </Badge>
            ),
        }),
        helper.accessor('joined', { header: 'Joined' }),
    ];

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('dataTableClient')}
                    description={t('dataTableClientDescription')}
                />
                <DataTable
                    columns={columns}
                    data={demoPeople}
                    filterPlaceholder={t('searchPeople')}
                />
            </main>
        </PageTransition>
    );
}
