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
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, Users, UserPlus, Repeat2 } from 'lucide-react';
import { customerService } from '@/services/customer-service';
import { orderService } from '@/services/order-service';
import type { Customer } from '@/lib/data/types';
import { applyFilters, countBy, formatMoney, groupByMonth, sumBy } from '@/lib/report-utils';
import type { ReportFilters } from '@/lib/report-utils';

const columnHelper = createAppColumnHelper<Customer>();

const columns = [
    columnHelper.accessor('name', { header: 'Customer' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('company', { header: 'Company' }),
    columnHelper.accessor('orders', { header: 'Orders' }),
    columnHelper.accessor('spent', {
        header: 'Spent',
        cell: (info) => formatMoney(info.getValue()),
    }),
    columnHelper.accessor('joined', { header: 'Joined' }),
];

export default function CustomersReportPage() {
    const [filters, setFilters] = useState<ReportFilters>({});
    const customers = useMemo(() => customerService.list(), []);
    const orders = useMemo(() => orderService.list(), []);

    const filtered = useMemo(
        () => applyFilters(customers, filters, (c) => `${c.name} ${c.email} ${c.company}`),
        [customers, filters],
    );

    const revenue = sumBy(
        orders.filter((o) => o.status === 'Paid'),
        (o) => o.amount,
    );
    const uniqueBuyers = new Set(orders.map((o) => o.customerEmail));
    const returning = orders.length - uniqueBuyers.size;

    const joinTrend = useMemo(
        () =>
            groupByMonth(
                filtered.map((c) => ({ date: c.joined })),
                () => 1,
            ),
        [filtered],
    );
    const ordersPerCustomer = useMemo(() => groupByMonth(orders, () => 1), [orders]);
    const activityTrend = useMemo(
        () =>
            joinTrend.map((month, index) => ({
                name: month.name,
                'New customers': month.value,
                Orders: ordersPerCustomer[index]?.value ?? 0,
            })),
        [joinTrend, ordersPerCustomer],
    );

    const byCompany = useMemo(() => countBy(filtered, (c) => c.company).slice(0, 8), [filtered]);
    const topCustomers = useMemo(
        () =>
            [...filtered]
                .sort((a, b) => b.spent - a.spent)
                .slice(0, 6)
                .map((c) => ({ name: c.name, value: c.spent })),
        [filtered],
    );

    return (
        <PageTransition>
            <main className="dashboard-content flex min-h-full flex-col p-4 md:p-6">
                <div className="dashboard-section">
                    <ReportToolbar
                        title="Customer Report"
                        filters={filters}
                        onFiltersChange={setFilters}
                        exportName="customers-report.csv"
                        exportRows={filtered}
                        exportColumns={[
                            { key: 'name', header: 'Customer' },
                            { key: 'email', header: 'Email' },
                            { key: 'company', header: 'Company' },
                            { key: 'orders', header: 'Orders' },
                            { key: 'spent', header: 'Spent' },
                            { key: 'joined', header: 'Joined' },
                        ]}
                    />
                </div>
                <div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Customers"
                        value={String(filtered.length)}
                        change="total customers"
                        icon={Users}
                    />
                    <StatCard
                        title="Active buyers"
                        value={String(uniqueBuyers.size)}
                        change="placed an order"
                        icon={UserPlus}
                    />
                    <StatCard
                        title="Repeat orders"
                        value={String(returning)}
                        change="orders beyond first"
                        icon={Repeat2}
                    />
                    <StatCard
                        title="Revenue"
                        value={formatMoney(revenue)}
                        change="from paid orders"
                        icon={Building2}
                    />
                </div>
                <div className="dashboard-section">
                    <ChartCard title="New customers and orders" description="Per month">
                        <ChartArea data={activityTrend} dataKey="New customers" />
                    </ChartCard>
                </div>
                <div className="dashboard-section grid gap-4 xl:grid-cols-2">
                    <ChartCard
                        title="Customers by company"
                        description="Top companies by customer count"
                    >
                        <ChartBar data={byCompany} dataKey="value" />
                    </ChartCard>
                    <ChartCard title="Top customers" description="Lifetime spend">
                        <ChartPie data={topCustomers} innerRadius={70} />
                        <PieLegend data={topCustomers} />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Customer list" description={`${filtered.length} customers`}>
                        <DataTable
                            columns={
                                columns as ColumnDef<typeof tableFeaturesConfig, Customer, any>[]
                            }
                            data={filtered}
                            filterPlaceholder="Filter customers..."
                        />
                    </ChartCard>
                </div>
            </main>
        </PageTransition>
    );
}
