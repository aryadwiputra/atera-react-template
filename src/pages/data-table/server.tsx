import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import {
    DataTable,
    createAppColumnHelper,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import type { SortState } from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { Badge } from '@/components/ui/badge';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import type { DemoPerson } from '@/pages/data-table/data';
import { demoPeople } from '@/pages/data-table/data';

const helper = createAppColumnHelper<DemoPerson>();

function queryPeople(filter: string, sort: SortState) {
    const query = filter.trim().toLowerCase();
    const filtered = query
        ? demoPeople.filter((person) =>
              Object.values(person).some((value) => String(value).toLowerCase().includes(query)),
          )
        : [...demoPeople];

    if (sort) {
        const key = sort.id as keyof DemoPerson;
        filtered.sort((left, right) =>
            String(left[key]).localeCompare(String(right[key]), undefined, { numeric: true }),
        );
        if (sort.direction === 'desc') filtered.reverse();
    }

    return filtered;
}

export default function DataTableServerPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    const [rows, setRows] = useState<DemoPerson[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<SortState>(null);
    const [filter, setFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const matched = queryPeople(filter, sort);
            setTotal(matched.length);
            setRows(matched.slice((page - 1) * pageSize, page * pageSize));
            setIsLoading(false);
        }, 450);

        return () => clearTimeout(timer);
    }, [filter, page, pageSize, sort]);

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
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={t('dataTableServer')}
                    description={t('dataTableServerDescription')}
                />
                <DataTable
                    columns={columns}
                    data={rows}
                    filterPlaceholder={t('searchPeople')}
                    server={{
                        rowCount: total,
                        page,
                        pageSize,
                        sort,
                        filter,
                        isLoading,
                        onPageChange: (nextPage) => {
                            setIsLoading(true);
                            setPage(nextPage);
                        },
                        onPageSizeChange: (nextPageSize) => {
                            setIsLoading(true);
                            setPageSize(nextPageSize);
                            setPage(1);
                        },
                        onSortChange: (nextSort) => {
                            setIsLoading(true);
                            setSort(nextSort);
                            setPage(1);
                        },
                        onFilterChange: (nextFilter) => {
                            setIsLoading(true);
                            setFilter(nextFilter);
                            setPage(1);
                        },
                    }}
                />
            </main>
        </PageTransition>
    );
}
