import { useMemo, useState } from 'react';
import { ChartArea } from '@/components/charts/chart-area';
import { ChartBar } from '@/components/charts/chart-bar';
import { ChartCard } from '@/components/charts/chart-config';
import { ChartPie, PieLegend } from '@/components/charts/chart-pie';
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
import { DollarSign, ShoppingCart, TrendingUp, Undo2 } from 'lucide-react';
import { useOrders } from '@/features/orders/api';
import type { Order, OrderStatus } from '@/lib/data/types';
import {
    applyFilters,
    countBy,
    formatMoney,
    groupByMonth,
    sumBy,
    type ReportFilters,
} from '@/lib/report-utils';

const statusVariant: Record<OrderStatus, string> = {
    Paid: 'bg-status-success/15 text-status-success',
    Pending: 'bg-status-warning/15 text-status-warning',
    Refunded: 'bg-muted text-muted-foreground',
};

const columnHelper = createAppColumnHelper<Order>();

const columns = [
    columnHelper.accessor('id', { header: 'Order' }),
    columnHelper.accessor('customer', { header: 'Customer' }),
    columnHelper.accessor('product', { header: 'Product' }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const variant = statusVariant[row.original.status];
            return <Badge className={variant}>{row.original.status}</Badge>;
        },
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => formatMoney(row.original.amount),
    }),
    columnHelper.accessor('date', { header: 'Date' }),
];

export default function SalesReportPage() {
    const [filters, setFilters] = useState<ReportFilters>({});
    const ordersQuery = useOrders();
    const orders = ordersQuery.data ?? [];
    const filtered = useMemo(
        () => applyFilters(orders, filters, (o) => `${o.id} ${o.customer} ${o.product}`),
        [orders, filters],
    );

    const paid = useMemo(() => filtered.filter((order) => order.status === 'Paid'), [filtered]);
    const revenue = sumBy(paid, (order) => order.amount);
    const refunded = filtered.filter((order) => order.status === 'Refunded').length;

    const revenueTrend = useMemo(() => groupByMonth(filtered, (order) => order.amount), [filtered]);
    const byStatus = useMemo(() => countBy(filtered, (order) => order.status), [filtered]);
    const topProducts = useMemo(() => {
        const map = new Map<string, number>();
        for (const order of paid) {
            map.set(order.product, (map.get(order.product) ?? 0) + order.amount);
        }
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }));
    }, [paid]);

    return (
        <PageTransition>
            <main className="dashboard-content flex min-h-full flex-col app-page">
                <ReportToolbar
                    title="Sales Report"
                    filters={filters}
                    onFiltersChange={setFilters}
                    statusOptions={['Paid', 'Pending', 'Refunded']}
                    exportName="sales-report.csv"
                    exportRows={filtered}
                    exportColumns={[
                        { key: 'id', header: 'Order' },
                        { key: 'customer', header: 'Customer' },
                        { key: 'product', header: 'Product' },
                        { key: 'status', header: 'Status' },
                        { key: 'amount', header: 'Amount' },
                        { key: 'date', header: 'Date' },
                    ]}
                />
                <div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Revenue"
                        value={formatMoney(revenue)}
                        change={`${paid.length} paid orders`}
                        icon={DollarSign}
                    />
                    <StatCard
                        title="Orders"
                        value={String(filtered.length)}
                        change={`${byStatus.find((s) => s.name === 'Pending')?.value ?? 0} pending`}
                        icon={ShoppingCart}
                    />
                    <StatCard
                        title="Refunded"
                        value={String(refunded)}
                        change="refunds in period"
                        icon={Undo2}
                        changePositive={false}
                    />
                    <StatCard
                        title="Avg. order"
                        value={formatMoney(paid.length ? Math.round(revenue / paid.length) : 0)}
                        change="per paid order"
                        icon={TrendingUp}
                    />
                </div>
                <div className="dashboard-section grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
                    <ChartCard title="Revenue trend" description="Order value per month">
                        <ChartArea data={revenueTrend} dataKey="value" />
                    </ChartCard>
                    <ChartCard title="Orders by status">
                        <ChartPie data={byStatus} innerRadius={70} />
                        <PieLegend data={byStatus} />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Top products" description="Revenue by product (paid orders)">
                        <ChartBar data={topProducts} dataKey="value" />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Orders" description={`${filtered.length} orders in period`}>
                        <DataTable
                            columns={columns as ColumnDef<typeof tableFeaturesConfig, Order, any>[]}
                            data={filtered}
                            filterPlaceholder="Filter orders..."
                        />
                    </ChartCard>
                </div>
            </main>
        </PageTransition>
    );
}
