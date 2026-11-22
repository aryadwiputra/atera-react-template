import { useMemo, useState } from 'react'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartCard } from '@/components/charts/chart-config'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { PageTransition } from '@/components/shared/page-transition'
import { ReportToolbar } from '@/components/shared/report-toolbar'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { BriefcaseBusiness, CalendarClock, UserRoundX, Users } from 'lucide-react'
import { hrService } from '@/services/hr-service'
import type { Employee, EmployeeStatus } from '@/lib/data/types'
import { applyFilters, countBy } from '@/lib/report-utils'
import type { ReportFilters } from '@/lib/report-utils'

const statusVariant: Record<EmployeeStatus, string> = {
    Active: 'bg-status-success/15 text-status-success',
    Remote: 'bg-blue-500/15 text-blue-500',
    'On Leave': 'bg-status-warning/15 text-status-warning',
    Offboarded: 'bg-muted text-muted-foreground',
}

const columnHelper = createAppColumnHelper<Employee>()

const columns = [
    columnHelper.accessor('name', { header: 'Employee' }),
    columnHelper.accessor('position', { header: 'Position' }),
    columnHelper.accessor('department', { header: 'Department' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('startDate', { header: 'Start date' }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
            <Badge className={statusVariant[info.getValue()]}>{info.getValue()}</Badge>
        ),
    }),
]

export default function HrReportPage() {
    const [filters, setFilters] = useState<ReportFilters>({})
    const employees = useMemo(() => hrService.listEmployees(), [])
    const openPositions = useMemo(() => hrService.listOpenPositions(), [])

    const filtered = useMemo(
        () => applyFilters(employees, filters, (e) => `${e.name} ${e.position} ${e.department}`),
        [employees, filters],
    )

    const active = filtered.filter((e) => e.status === 'Active' || e.status === 'Remote').length
    const onLeave = filtered.filter((e) => e.status === 'On Leave').length
    const offboarded = filtered.filter((e) => e.status === 'Offboarded').length

    const byDepartment = useMemo(() => countBy(filtered, (e) => e.department), [filtered])
    const byStatus = useMemo(() => countBy(filtered, (e) => e.status), [filtered])
    const headcountTrend = useMemo(() => {
        const hires = [...filtered].filter((e) => e.status !== 'Offboarded').sort((a, b) => a.startDate.localeCompare(b.startDate))
        const map = new Map<string, number>()
        for (const hire of hires) {
            const key = hire.startDate.slice(0, 7)
            map.set(key, (map.get(key) ?? 0) + 1)
        }
        let cumulative = 0
        return [...map.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, added]) => {
                cumulative += added
                return {
                    name: new Date(`${key}-01`).toLocaleString('en-US', { month: 'short', year: '2-digit' }),
                    value: cumulative,
                }
            })
    }, [filtered])

    return (
        <PageTransition>
            <main className="dashboard-content flex min-h-full flex-col p-4 md:p-6">
                <div className="dashboard-section">
                    <ReportToolbar
                        title="HR Report"
                        filters={filters}
                        onFiltersChange={setFilters}
                        statusOptions={['Active', 'Remote', 'On Leave', 'Offboarded']}
                        exportName="hr-report.csv"
                        exportRows={filtered}
                        exportColumns={[
                            { key: 'name', header: 'Employee' },
                            { key: 'position', header: 'Position' },
                            { key: 'department', header: 'Department' },
                            { key: 'email', header: 'Email' },
                            { key: 'startDate', header: 'Start date' },
                            { key: 'status', header: 'Status' },
                        ]}
                    />
                </div>
                <div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Active headcount" value={String(active)} change={`${filtered.length} total employees`} icon={Users} />
                    <StatCard title="On leave" value={String(onLeave)} change="currently away" icon={CalendarClock} changePositive={false} />
                    <StatCard title="Offboarded" value={String(offboarded)} change="all time" icon={UserRoundX} />
                    <StatCard title="Open positions" value={String(openPositions.length)} change="roles hiring" icon={BriefcaseBusiness} />
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Headcount growth" description="Cumulative active employees by start month">
                        <ChartBar data={headcountTrend} dataKey="value" />
                    </ChartCard>
                </div>
                <div className="dashboard-section grid gap-4 xl:grid-cols-2">
                    <ChartCard title="Employees by department">
                        <ChartBar data={byDepartment} dataKey="value" />
                    </ChartCard>
                    <ChartCard title="Workforce status">
                        <ChartPie data={byStatus} innerRadius={70} />
                        <PieLegend data={byStatus} />
                    </ChartCard>
                </div>
                <div className="dashboard-section">
                    <ChartCard title="Employees" description={`${filtered.length} employees`}>
                        <DataTable columns={columns as ColumnDef<typeof tableFeaturesConfig, Employee, any>[]} data={filtered} filterPlaceholder="Filter employees..." />
                    </ChartCard>
                </div>
            </main>
        </PageTransition>
    )
}
