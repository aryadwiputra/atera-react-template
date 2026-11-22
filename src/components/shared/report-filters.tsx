import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/shared/date-picker'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { ReportFilters } from '@/lib/report-utils'

export function ReportFilterBar({
    filters,
    onFiltersChange,
    statusOptions,
}: {
    filters: ReportFilters
    onFiltersChange: (filters: ReportFilters) => void
    statusOptions?: string[]
}) {
    const set = (patch: Partial<ReportFilters>) => onFiltersChange({ ...filters, ...patch })
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
            <Filter className="size-4 text-muted-foreground" />
            <DatePicker
                value={filters.from}
                onChange={(value) => set({ from: value })}
                placeholder="From"
                ariaLabel="Filter from date"
            />
            <DatePicker
                value={filters.to}
                onChange={(value) => set({ to: value })}
                placeholder="To"
                ariaLabel="Filter to date"
            />
            {statusOptions && (
                <Select
                    value={filters.status ?? 'all'}
                    onValueChange={(value) => set({ status: value })}
                >
                    <SelectTrigger className="w-36" aria-label="Filter status">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <Input
                className="w-48"
                placeholder="Search..."
                value={filters.search ?? ''}
                onChange={(event) => set({ search: event.target.value })}
                aria-label="Search report data"
            />
            {Object.values(filters).some(Boolean) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({})}
                >
                    <X className="size-4" />
                    Clear
                </Button>
            )}
        </div>
    )
}
