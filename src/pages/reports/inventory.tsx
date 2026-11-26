import { useMemo, useState } from 'react';
import { ChartBar } from '@/components/charts/chart-bar';
import { ChartCard } from '@/components/charts/chart-config';
import {
    createAppColumnHelper,
    DataTable,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import { PageTransition } from '@/components/shared/page-transition';
import { ReportToolbar } from '@/components/shared/report-toolbar';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Boxes, Warehouse } from 'lucide-react';
import { inventoryService } from '@/services/inventory-service';
import type { InventoryItem } from '@/lib/data/types';
import { applyFilters, sumBy, type ReportFilters } from '@/lib/report-utils';

const columnHelper = createAppColumnHelper<InventoryItem>();

const stockState = (item: InventoryItem) =>
    item.onHand === 0
        ? 'Out of stock'
        : item.onHand <= item.reorderPoint
          ? 'Low stock'
          : 'In stock';

const stateVariant = {
    'In stock': 'bg-status-success/15 text-status-success',
    'Low stock': 'bg-status-warning/15 text-status-warning',
    'Out of stock': 'bg-destructive/15 text-destructive',
};

const columns = [
    columnHelper.accessor('sku', { header: 'SKU' }),
    columnHelper.accessor('name', { header: 'Item' }),
    columnHelper.accessor('warehouse', { header: 'Warehouse' }),
    columnHelper.accessor('onHand', { header: 'On hand' }),
    columnHelper.accessor('reserved', { header: 'Reserved' }),
    columnHelper.accessor('reorderPoint', { header: 'Reorder point' }),
    columnHelper.display({
        id: 'state',
        header: 'State',
        cell: ({ row }) => {
            const state = stockState(row.original);
            return <Badge className={stateVariant[state]}>{state}</Badge>;
        },
    }),
];

export default function InventoryReportPage() {
    const [filters, setFilters] = useState<ReportFilters>({});
    const inventory = useMemo(() => inventoryService.list(), []);
    const filtered = useMemo(
        () => applyFilters(inventory, filters, (i) => `${i.sku} ${i.name} ${i.warehouse}`),
        [inventory, filters],
    );

    const units = sumBy(filtered, (item) => item.onHand);
    const reserved = sumBy(filtered, (item) => item.reserved);
    const lowStock = filtered.filter((item) => item.onHand > 0 && item.onHand <= item.reorderPoint);
    const outOfStock = filtered.filter((item) => item.onHand === 0);

    const byWarehouse = useMemo(() => {
        const map = new Map<string, number>();
        for (const item of filtered) {
            map.set(item.warehouse, (map.get(item.warehouse) ?? 0) + item.onHand);
        }
        return [...map.entries()].map(([name, value]) => ({ name, value }));
    }, [filtered]);

    const lowestStock = useMemo(
        () =>
            [...filtered]
                .sort((a, b) => a.onHand - b.onHand)
                .slice(0, 8)
                .map((item) => ({ name: item.name, value: item.onHand })),
        [filtered],
    );

    return (
        <PageTransition>
            <main className="dashboard-content flex min-h-full flex-col p-4 md:p-6">
                <ReportToolbar
                    title="Inventory Report"
                    filters={filters}
                    onFiltersChange={setFilters}
                    exportName="inventory-report.csv"
                    exportRows={filtered.map((item) => ({ ...item, state: stockState(item) }))}
                    exportColumns={[
                        { key: 'sku', header: 'SKU' },
                        { key: 'name', header: 'Item' },
                        { key: 'warehouse', header: 'Warehouse' },
                        { key: 'onHand', header: 'On hand' },
                        { key: 'reserved', header: 'Reserved' },
                        { key: 'reorderPoint', header: 'Reorder point' },
                        { key: 'state', header: 'State' },
                    ]}
                />
                <div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Units on hand"
                        value={units.toLocaleString('en-US')}
                        change={`${filtered.length} SKUs`}
                        icon={Boxes}
                    />
                    <StatCard
                        title="Reserved"
                        value={reserved.toLocaleString('en-US')}
                        change="units reserved"
                        icon={Warehouse}
                    />
                    <StatCard
                        title="Low stock"
                        value={String(lowStock.length)}
                        change="items at/below reorder point"
                        icon={AlertTriangle}
                        changePositive={false}
                    />
                    <StatCard
                        title="Out of stock"
                        value={String(outOfStock.length)}
                        change="items need restock"
                        icon={AlertTriangle}
                        changePositive={false}
                    />
                </div>
                <div className="dashboard-section grid gap-4 xl:grid-cols-2">
                    <ChartCard title="Stock by warehouse" description="Units on hand per warehouse">
                        <ChartBar data={byWarehouse} dataKey="value" />
                    </ChartCard>
                    <ChartCard title="Lowest stock items" description="Units on hand, lowest first">
                        <ChartBar data={lowestStock} dataKey="value" />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Inventory levels" description={`${filtered.length} items`}>
                        <DataTable
                            columns={
                                columns as ColumnDef<
                                    typeof tableFeaturesConfig,
                                    InventoryItem,
                                    any
                                >[]
                            }
                            data={filtered}
                            filterPlaceholder="Filter items..."
                        />
                    </ChartCard>
                </div>
            </main>
        </PageTransition>
    );
}
