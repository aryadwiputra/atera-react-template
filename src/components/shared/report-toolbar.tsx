import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportFilterBar } from '@/components/shared/report-filters'
import { downloadCsv } from '@/lib/export-csv'
import { exportToExcel, exportToPdf } from '@/lib/export-data'
import type { ReportFilters } from '@/lib/report-utils'

export function ReportToolbar({
    title,
    filters,
    onFiltersChange,
    statusOptions,
    exportName,
    exportRows,
    exportColumns,
}: {
    title: string
    filters: ReportFilters
    onFiltersChange: (filters: ReportFilters) => void
    statusOptions?: string[]
    exportName: string
    exportRows: Array<Record<string, unknown>>
    exportColumns: { key: string; header: string }[]
}) {
    const base = exportName.replace(/\.csv$/, '')
    const headers = exportColumns.map((column) => column.header)
    const flatRows = exportRows.map((row) =>
        Object.fromEntries(exportColumns.map((column) => [column.header, row[column.key]])),
    )
    return (
        <div className="flex flex-col gap-3">
            <ReportFilterBar
                filters={filters}
                onFiltersChange={onFiltersChange}
                statusOptions={statusOptions}
            />
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadCsv(`${base}.csv`, flatRows)}>
                    <Download className="size-4" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToExcel(`${base}.xlsx`, flatRows)}>
                    <FileSpreadsheet className="size-4" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToPdf(`${base}.pdf`, title, flatRows, headers)}>
                    <FileText className="size-4" /> PDF
                </Button>
            </div>
        </div>
    )
}
