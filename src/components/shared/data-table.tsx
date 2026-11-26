import {
    createColumnHelper,
    flexRender,
    tableFeatures,
    useTable,
    type ColumnDef,
    type RowData,
} from '@tanstack/react-table';
import {
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    Download,
    Eye,
    LoaderCircle,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { EmptyTableState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const tableFeaturesConfig = tableFeatures({});
export const createAppColumnHelper = <TData extends RowData>() =>
    createColumnHelper<typeof tableFeaturesConfig, TData>();
export type SortState = { id: string; direction: 'asc' | 'desc' } | null;
type DataTableProps<TData extends RowData> = {
    columns: ColumnDef<typeof tableFeaturesConfig, TData, any>[];
    data: TData[];
    filterPlaceholder?: string;
    renderMobileCard?: (row: TData) => React.ReactNode;
};

type ColumnShape<TData extends RowData> = ColumnDef<typeof tableFeaturesConfig, TData, any> & {
    accessorKey?: string;
    accessorFn?: (row: TData, index: number) => unknown;
    id?: string;
};
const asColumnShape = <TData extends RowData>(
    column: ColumnDef<typeof tableFeaturesConfig, TData, any>,
) => column as ColumnShape<TData>;
const getCellValue = <TData extends RowData>(
    row: TData,
    column: ColumnDef<typeof tableFeaturesConfig, TData, any>,
) => {
    const shape = asColumnShape(column);
    if (shape.accessorKey) return (row as Record<string, unknown>)[shape.accessorKey];
    if (shape.accessorFn) return shape.accessorFn(row, 0);
    return undefined;
};
const exportCsv = <TData extends RowData>(
    rows: TData[],
    columns: ColumnDef<typeof tableFeaturesConfig, TData, any>[],
    visible: Record<string, boolean>,
) => {
    const active = columns.filter(
        (column) =>
            visible[String(asColumnShape(column).id ?? asColumnShape(column).accessorKey)] !==
            false,
    );
    const values = [
        active.map((column) => String(column.header ?? asColumnShape(column).id ?? '')).join(','),
        ...rows.map((row) =>
            active
                .map((column) => JSON.stringify(String(getCellValue(row, column) ?? '')))
                .join(','),
        ),
    ].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([values], { type: 'text/csv' }));
    link.download = 'export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
};

export type DataTableServerProps = {
    rowCount: number;
    page: number;
    pageSize: number;
    sort: SortState;
    filter: string;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onSortChange: (sort: SortState) => void;
    onFilterChange: (filter: string) => void;
    isLoading?: boolean;
};

export function DataTable<TData extends RowData>({
    columns,
    data,
    filterPlaceholder = 'Filter...',
    renderMobileCard,
    server,
}: DataTableProps<TData> & { server?: DataTableServerProps }) {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<SortState>(null);
    const [visible, setVisible] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const activeFilter = server?.filter ?? filter;
    const activePage = server?.page ?? page;
    const activePageSize = server?.pageSize ?? pageSize;
    const activeSort = server?.sort ?? sort;
    const filteredData = useMemo(() => {
        if (server) return data;
        const query = activeFilter.trim().toLowerCase();
        const filtered = query
            ? data.filter((row) =>
                  Object.values(row as Record<string, unknown>).some((value) =>
                      String(value).toLowerCase().includes(query),
                  ),
              )
            : data;
        if (!activeSort) return filtered;
        return [...filtered].sort((left, right) => {
            const leftColumn = columns.find(
                (column) =>
                    String(asColumnShape(column).id ?? asColumnShape(column).accessorKey) ===
                    activeSort.id,
            );
            const rightColumn = columns.find(
                (column) =>
                    String(asColumnShape(column).id ?? asColumnShape(column).accessorKey) ===
                    activeSort.id,
            );
            const a = String(leftColumn ? getCellValue(left, leftColumn) : '');
            const b = String(rightColumn ? getCellValue(right, rightColumn) : '');
            return activeSort.direction === 'asc'
                ? a.localeCompare(b, undefined, { numeric: true })
                : b.localeCompare(a, undefined, { numeric: true });
        });
    }, [columns, data, activeFilter, activeSort, server]);
    const totalRows = server?.rowCount ?? filteredData.length;
    const pageCount = Math.max(1, Math.ceil(totalRows / activePageSize));
    const currentPage = Math.min(activePage, pageCount);
    const pageData = server
        ? data
        : filteredData.slice((currentPage - 1) * activePageSize, currentPage * activePageSize);
    const table = useTable({ features: tableFeaturesConfig, columns, data: pageData });
    const visibleHeaders =
        table
            .getHeaderGroups()[0]
            ?.headers.filter((header) => visible[header.column.id] !== false) ?? [];
    const toggleSort = (id: string) => {
        const next =
            activeSort?.id === id
                ? {
                      id,
                      direction:
                          activeSort.direction === 'asc' ? ('desc' as const) : ('asc' as const),
                  }
                : { id, direction: 'asc' as const };
        if (server) {
            server.onSortChange(next);
            server.onPageChange(1);
        } else {
            setSort(next);
            setPage(1);
        }
    };
    const handleFilterChange = (value: string) => {
        if (server) {
            server.onFilterChange(value);
            server.onPageChange(1);
        } else {
            setFilter(value);
            setPage(1);
        }
    };
    const clearFilter = () => handleFilterChange('');
    const handlePageChange = (value: number) => {
        if (server) server.onPageChange(value);
        else setPage(value);
    };
    const handlePageSizeChange = (value: number) => {
        if (server) {
            server.onPageSizeChange(value);
            server.onPageChange(1);
        } else {
            setPageSize(value);
            setPage(1);
        }
    };
    const toggleSelected = (index: number) =>
        setSelected((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    return (
        <Card>
            <CardContent className="space-y-0 p-0" aria-busy={server?.isLoading}>
                <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder={filterPlaceholder}
                            value={activeFilter}
                            onChange={(event) => handleFilterChange(event.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Eye className="size-4" />
                                    {t('view')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('columns')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table.getAllLeafColumns().map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={visible[column.id] !== false}
                                        onCheckedChange={(checked) =>
                                            setVisible((current) => ({
                                                ...current,
                                                [column.id]: checked,
                                            }))
                                        }
                                    >
                                        {column.columnDef.header as string}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                exportCsv(server ? data : filteredData, columns, visible)
                            }
                        >
                            <Download className="size-4" />
                            {t('export')}
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                    <span>
                        {selected.size
                            ? `${selected.size} ${t('selected')}`
                            : `${totalRows} ${t('results')}`}
                    </span>
                    {activeFilter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={clearFilter}
                        >
                            <X className="size-3" />
                            {t('clear')}
                        </Button>
                    )}
                </div>
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="w-10 px-4">
                                    <Checkbox
                                        aria-label={t('selectAllVisibleRows')}
                                        checked={
                                            pageData.length > 0 &&
                                            pageData.every((_, index) =>
                                                selected.has(
                                                    (currentPage - 1) * activePageSize + index,
                                                ),
                                            )
                                        }
                                        onCheckedChange={(checked) =>
                                            setSelected((current) => {
                                                const next = new Set(current);
                                                pageData.forEach((_, index) =>
                                                    checked
                                                        ? next.add(
                                                              (currentPage - 1) * activePageSize +
                                                                  index,
                                                          )
                                                        : next.delete(
                                                              (currentPage - 1) * activePageSize +
                                                                  index,
                                                          ),
                                                );
                                                return next;
                                            })
                                        }
                                    />
                                </th>
                                {visibleHeaders.map((header) => (
                                    <th
                                        key={header.id}
                                        className="h-11 px-4 text-left text-xs font-medium text-muted-foreground"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-1 hover:text-foreground"
                                                onClick={() => toggleSort(header.column.id)}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {activeSort?.id === header.column.id ? (
                                                    activeSort.direction === 'asc' ? (
                                                        <ChevronUp className="size-3" />
                                                    ) : (
                                                        <ChevronDown className="size-3" />
                                                    )
                                                ) : (
                                                    <ChevronsUpDown className="size-3 opacity-50" />
                                                )}
                                            </button>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {server?.isLoading ? (
                                <tr>
                                    <td
                                        colSpan={visibleHeaders.length + 1}
                                        className="px-4 py-12 text-center"
                                    >
                                        <LoaderCircle
                                            aria-label="Loading"
                                            className="mx-auto size-5 animate-spin text-muted-foreground"
                                        />
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className="border-b last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3">
                                            <Checkbox
                                                aria-label={`Select row ${index + 1}`}
                                                checked={selected.has(
                                                    (currentPage - 1) * activePageSize + index,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelected(
                                                        (currentPage - 1) * activePageSize + index,
                                                    )
                                                }
                                            />
                                        </td>
                                        {row
                                            .getAllCells()
                                            .filter((cell) => visible[cell.column.id] !== false)
                                            .map((cell) => (
                                                <td key={cell.id} className="px-4 py-3">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </td>
                                            ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={visibleHeaders.length + 1}>
                                        <EmptyTableState
                                            onClear={activeFilter ? clearFilter : undefined}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="space-y-2 px-4 py-3 md:hidden">
                    {pageData.length ? (
                        pageData.map((row, index) =>
                            renderMobileCard ? (
                                <div key={index} className="rounded-lg border p-3">
                                    {renderMobileCard(row)}
                                </div>
                            ) : (
                                <div key={index} className="rounded-lg border p-3 text-sm">
                                    {Object.entries(row as Record<string, unknown>).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between gap-4 border-b py-2 last:border-0"
                                            >
                                                <span className="text-muted-foreground">{key}</span>
                                                <span className="text-right font-medium">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ),
                        )
                    ) : (
                        <EmptyTableState onClear={activeFilter ? clearFilter : undefined} />
                    )}
                </div>
                <div className="flex flex-col gap-3 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <span>{t('rowsPerPage')}</span>
                        <Select
                            value={String(activePageSize)}
                            onValueChange={(value) => handlePageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>
                            {totalRows
                                ? `${(currentPage - 1) * activePageSize + 1}-${Math.min(currentPage * activePageSize, totalRows)} of ${totalRows}`
                                : '0 rows'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            {t('previous')}
                        </Button>
                        <span className="px-2">
                            {currentPage} / {pageCount}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === pageCount}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            {t('next')}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
