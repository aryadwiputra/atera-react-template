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
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, Clock3 } from 'lucide-react'
import { financeService } from '@/services/finance-service'
import type { FinanceTransaction } from '@/lib/data/types'
import { applyFilters, countBy, formatMoney, sumBy, type ReportFilters } from "@/lib/report-utils"

const statusVariant: Record<FinanceTransaction['status'], string> = {
    Cleared: 'bg-status-success/15 text-status-success',
    Pending: 'bg-status-warning/15 text-status-warning',
}

const columnHelper = createAppColumnHelper<FinanceTransaction>()

const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('date', { header: 'Date' }),
    columnHelper.accessor('description', { header: 'Description' }),
    columnHelper.accessor('category', { header: 'Category' }),
    columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ row }) => (
            <Badge className={row.original.type === 'Income'
                ? 'bg-status-success/15 text-status-success'
                : 'bg-destructive/15 text-destructive'}
            >
                {row.original.type}
            </Badge>
        ),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const variant = statusVariant[row.original.status]
            return <Badge className={variant}>{row.original.status}</Badge>
        },
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => formatMoney(row.original.amount),
    }),
]

export default function FinanceReportPage() {
    const [filters, setFilters] = useState<ReportFilters>({})
    const rows = useMemo(
        () => financeService.list().map((t) => ({ ...t, status: t.type as FinanceTransaction['status'] })),
        [],
    )
    const filtered = useMemo(
        () => applyFilters(rows, filters, (t) => `${t.id} ${t.description} ${t.category}`),
        [rows, filters],
    )

    const income = sumBy(filtered.filter((t) => t.type === 'Income'), (t) => t.amount)
    const expense = sumBy(filtered.filter((t) => t.type === 'Expense'), (t) => t.amount)
    const pending = rows.filter((t) => t.status === 'Pending').length

    const flowTrend = useMemo(() => {
        const map = new Map<string, { income: number; expense: number }>()
        for (const t of filtered) {
            const key = t.date.slice(0, 7)
            const entry = map.get(key) ?? { income: 0, expense: 0 }
            if (t.type === 'Income') entry.income += t.amount
            else entry.expense += t.amount
            map.set(key, entry)
        }
        return [...map.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => ({
                name: new Date(`${key}-01`).toLocaleString('en-US', { month: 'short', year: '2-digit' }),
                ...value,
            }))
    }, [filtered])

    const expenseByCategory = useMemo(
        () =>
            countBy(filtered.filter((t) => t.type === 'Expense'), (t) => t.category).map(
                (entry) => {
                    const total = sumBy(
                        filtered.filter((t) => t.type === 'Expense' && t.category === entry.name),
                        (t) => t.amount,
                    )
                    return { name: entry.name, value: total }
                },
            ),
        [filtered],
    )

    return (
        <PageTransition>
            <main className="dashboard-content flex min-h-full flex-col p-4 md:p-6">
                <ReportToolbar
                    title="Finance Report"
                    filters={filters}
                    onFiltersChange={setFilters}
                    statusOptions={['Income', 'Expense']}
                    exportName="finance-report.csv"
                    exportRows={filtered}
                    exportColumns={[
                        { key: 'id', header: 'ID' },
                        { key: 'date', header: 'Date' },
                        { key: 'description', header: 'Description' },
                        { key: 'category', header: 'Category' },
                        { key: 'type', header: 'Type' },
                        { key: 'status', header: 'Status' },
                        { key: 'amount', header: 'Amount' },
                    ]}
                />
                <div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Income" value={formatMoney(income)} change="total in period" icon={ArrowUpRight} />
                    <StatCard title="Expenses" value={formatMoney(expense)} change="total in period" icon={ArrowDownRight} changePositive={false} />
                    <StatCard title="Net" value={formatMoney(income - expense)} change={income >= expense ? 'positive' : 'negative'} icon={CircleDollarSign} changePositive={income >= expense} />
                    <StatCard title="Pending" value={String(pending)} change="transactions" icon={Clock3} />
                </div>
                <div className="dashboard-section grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
                    <ChartCard title="Income vs expenses" description="Monthly cash flow">
                        <ChartBar
                            data={flowTrend}
                            stacked
                            series={[
                                { key: 'income', colorIndex: 1 },
                                { key: 'expense', colorIndex: 2 },
                            ]}
                        />
                    </ChartCard>
                    <ChartCard title="Expenses by category">
                        <ChartPie data={expenseByCategory} innerRadius={70} />
                        <PieLegend data={expenseByCategory} />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Net flow" description="Income minus expenses per month">
                        <ChartArea data={flowTrend.map((m) => ({ name: m.name, value: m.income - m.expense }))} dataKey="value" />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Transactions" description={`${filtered.length} transactions in period`}>
                        <DataTable columns={columns as ColumnDef<typeof tableFeaturesConfig, FinanceTransaction, any>[]} data={filtered} filterPlaceholder="Filter transactions..." />
                    </ChartCard>
                </div>
            </main>
        </PageTransition>
    )
}
