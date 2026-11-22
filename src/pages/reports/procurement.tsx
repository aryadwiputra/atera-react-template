import { useMemo, useState } from 'react'
import { ChartArea } from '@/components/charts/chart-area'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartCard } from '@/components/charts/chart-config'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { PageTransition } from '@/components/shared/page-transition'
import { ReportToolbar } from '@/components/shared/report-toolbar'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { CheckCircle2, PackageSearch, Truck, XCircle } from 'lucide-react'
import { procurementService } from '@/services/procurement-service'
import type { PurchaseOrder, POStatus } from '@/lib/data/types'
import { applyFilters, countBy, formatMoney, groupByMonth, sumBy } from '@/lib/report-utils'
import type { ReportFilters } from '@/lib/report-utils'

const statusVariant: Record<POStatus, string> = {
    Pending: 'bg-status-warning/15 text-status-warning',
    Approved: 'bg-blue-500/15 text-blue-500',
    Received: 'bg-status-success/15 text-status-success',
    Cancelled: 'bg-destructive/15 text-destructive',
    Draft: 'bg-muted text-muted-foreground',
}

const columnHelper = createAppColumnHelper<PurchaseOrder>()

const columns = [
    columnHelper.accessor('number', { header: 'PO' }),
    columnHelper.accessor('supplier', { header: 'Supplier' }),
    columnHelper.accessor('date', { header: 'Date' }),
    columnHelper.accessor('expectedDelivery', { header: 'Expected' }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
            <Badge className={statusVariant[info.getValue()]}>{info.getValue()}</Badge>
        ),
    }),
    columnHelper.display({
        id: 'total',
        header: 'Total',
        cell: ({ row }) => formatMoney(procurementService.total(row.original)),
    }),
]

export default function ProcurementReportPage() {
    const [filters, setFilters] = useState<ReportFilters>({})
    const rows = useMemo(
        () => procurementService.list().map((po) => ({ ...po, total: procurementService.total(po) })),
        [],
    )

    const filtered = useMemo(
        () => applyFilters(rows, filters, (po) => `${po.number} ${po.supplier}`),
        [rows, filters],
    )

    const spend = sumBy(filtered, (po) => po.total)
    const received = filtered.filter((po) => po.status === 'Received').length
    const cancelled = filtered.filter((po) => po.status === 'Cancelled').length

    const spendTrend = useMemo(() => groupByMonth(filtered, (po) => po.total), [filtered])
    const byStatus = useMemo(() => countBy(filtered, (po) => po.status), [filtered])
    const bySupplier = useMemo(() => {
        const map = new Map<string, number>()
        for (const po of filtered) {
            map.set(po.supplier, (map.get(po.supplier) ?? 0) + po.total)
        }
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value]) => ({ name, value }))
    }, [filtered])

    return (
        <PageTransition>
            <main className="dashboard-content flex min-h-full flex-col p-4 md:p-6">
                <div className="dashboard-section">
                    <ReportToolbar
                        title="Procurement Report"
                        filters={filters}
                        onFiltersChange={setFilters}
                        statusOptions={['Pending', 'Draft', 'Approved', 'Received', 'Cancelled']}
                        exportName="procurement-report.csv"
                        exportRows={filtered}
                        exportColumns={[
                            { key: 'number', header: 'PO' },
                            { key: 'supplier', header: 'Supplier' },
                            { key: 'date', header: 'Date' },
                            { key: 'expectedDelivery', header: 'Expected' },
                            { key: 'status', header: 'Status' },
                            { key: 'total', header: 'Total' },
                        ]}
                    />
                </div>
                <div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total spend" value={formatMoney(spend)} change={`${filtered.length} purchase orders`} icon={Truck} />
                    <StatCard title="Received" value={String(received)} change="orders fulfilled" icon={CheckCircle2} />
                    <StatCard title="Cancelled" value={String(cancelled)} change="orders lost" icon={XCircle} changePositive={false} />
                    <StatCard title="Suppliers" value={String(bySupplier.length)} change="active suppliers" icon={PackageSearch} />
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Spend trend" description="Purchase order value per month">
                        <ChartArea data={spendTrend} dataKey="value" />
                    </ChartCard>
                </div>
                <div className="dashboard-section grid gap-4 xl:grid-cols-2">
                    <ChartCard title="Spend by supplier" description="Top suppliers by order value">
                        <ChartBar data={bySupplier} dataKey="value" />
                    </ChartCard>
                    <ChartCard title="Orders by status">
                        <ChartPie data={byStatus} innerRadius={70} />
                        <PieLegend data={byStatus} />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Purchase orders" description={`${filtered.length} orders`}>
                        <DataTable columns={columns as ColumnDef<typeof tableFeaturesConfig, PurchaseOrder, any>[]} data={filtered} filterPlaceholder="Filter purchase orders..." />
                    </ChartCard>
                </div>
            </main>
        </PageTransition>
    )
}
