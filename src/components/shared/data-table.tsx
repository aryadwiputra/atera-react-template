import { createColumnHelper, flexRender, tableFeatures, useTable, type ColumnDef, type RowData } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown, Download, Eye, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyTableState } from '@/components/shared/empty-state'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const tableFeaturesConfig = tableFeatures({})
export const createAppColumnHelper = <TData extends RowData>() => createColumnHelper<typeof tableFeaturesConfig, TData>()
type SortState = { id: string; direction: 'asc' | 'desc' } | null
type DataTableProps<TData extends RowData> = { columns: ColumnDef<typeof tableFeaturesConfig, TData, any>[]; data: TData[]; filterPlaceholder?: string; renderMobileCard?: (row: TData) => React.ReactNode }

type ColumnShape<TData extends RowData> = ColumnDef<typeof tableFeaturesConfig, TData, any> & { accessorKey?: string; accessorFn?: (row: TData, index: number) => unknown; id?: string }
const asColumnShape = <TData extends RowData>(column: ColumnDef<typeof tableFeaturesConfig, TData, any>) => column as ColumnShape<TData>
const getCellValue = <TData extends RowData>(row: TData, column: ColumnDef<typeof tableFeaturesConfig, TData, any>) => {
  const shape = asColumnShape(column)
  if (shape.accessorKey) return (row as Record<string, unknown>)[shape.accessorKey]
  if (shape.accessorFn) return shape.accessorFn(row, 0)
  return undefined
}
const exportCsv = <TData extends RowData>(rows: TData[], columns: ColumnDef<typeof tableFeaturesConfig, TData, any>[], visible: Record<string, boolean>) => {
  const active = columns.filter((column) => visible[String(asColumnShape(column).id ?? asColumnShape(column).accessorKey)] !== false)
  const values = [active.map((column) => String(column.header ?? asColumnShape(column).id ?? '')).join(','), ...rows.map((row) => active.map((column) => JSON.stringify(String(getCellValue(row, column) ?? ''))).join(','))].join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([values], { type: 'text/csv' }))
  link.download = 'export.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

export function DataTable<TData extends RowData>({ columns, data, filterPlaceholder = 'Filter...', renderMobileCard }: DataTableProps<TData>) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState<SortState>(null)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const filteredData = useMemo(() => {
    const query = filter.trim().toLowerCase()
    const filtered = query ? data.filter((row) => Object.values(row as Record<string, unknown>).some((value) => String(value).toLowerCase().includes(query))) : data
    if (!sort) return filtered
    return [...filtered].sort((left, right) => { const leftColumn = columns.find((column) => String(asColumnShape(column).id ?? asColumnShape(column).accessorKey) === sort.id); const rightColumn = columns.find((column) => String(asColumnShape(column).id ?? asColumnShape(column).accessorKey) === sort.id); const a = String(leftColumn ? getCellValue(left, leftColumn) : ''); const b = String(rightColumn ? getCellValue(right, rightColumn) : ''); return sort.direction === 'asc' ? a.localeCompare(b, undefined, { numeric: true }) : b.localeCompare(a, undefined, { numeric: true }) })
  }, [columns, data, filter, sort])
  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const table = useTable({ features: tableFeaturesConfig, columns, data: pageData })
  const visibleHeaders = table.getHeaderGroups()[0]?.headers.filter((header) => visible[header.column.id] !== false) ?? []
  const toggleSort = (id: string) => { setSort((current) => current?.id === id ? { id, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { id, direction: 'asc' }); setPage(1) }
  const toggleSelected = (index: number) => setSelected((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next })
  return <Card><CardContent className="space-y-0 p-0"><div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-xs"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder={filterPlaceholder} value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1) }} /></div><div className="flex items-center gap-2"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Eye className="size-4" />{t('view')}</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>{t('columns')}</DropdownMenuLabel><DropdownMenuSeparator />{table.getAllLeafColumns().map((column) => <DropdownMenuCheckboxItem key={column.id} checked={visible[column.id] !== false} onCheckedChange={(checked) => setVisible((current) => ({ ...current, [column.id]: checked }))}>{column.columnDef.header as string}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu><Button variant="outline" size="sm" onClick={() => exportCsv(filteredData, columns, visible)}><Download className="size-4" />{t('export')}</Button></div></div><div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2 text-xs text-muted-foreground"><span>{selected.size ? `${selected.size} ${t('selected')}` : `${filteredData.length} ${t('results')}`}</span>{filter && <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setFilter('')}><X className="size-3" />{t('clear')}</Button>}</div><div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><thead className="border-b"><tr><th className="w-10 px-4"><input aria-label={t('selectAllVisibleRows')} type="checkbox" checked={pageData.length > 0 && pageData.every((_, index) => selected.has((currentPage - 1) * pageSize + index))} onChange={(event) => setSelected((current) => { const next = new Set(current); pageData.forEach((_, index) => event.target.checked ? next.add((currentPage - 1) * pageSize + index) : next.delete((currentPage - 1) * pageSize + index)); return next })} /></th>{visibleHeaders.map((header) => <th key={header.id} className="h-11 px-4 text-left text-xs font-medium text-muted-foreground">{header.isPlaceholder ? null : <button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort(header.column.id)}>{flexRender(header.column.columnDef.header, header.getContext())}{sort?.id === header.column.id ? sort.direction === 'asc' ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-50" />}</button>}</th>)}</tr></thead><tbody>{table.getRowModel().rows.length ? table.getRowModel().rows.map((row, index) => <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30"><td className="px-4 py-3"><input aria-label={`Select row ${index + 1}`} type="checkbox" checked={selected.has((currentPage - 1) * pageSize + index)} onChange={() => toggleSelected((currentPage - 1) * pageSize + index)} /></td>{row.getAllCells().filter((cell) => visible[cell.column.id] !== false).map((cell) => <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={visibleHeaders.length + 1}><EmptyTableState onClear={filter ? () => { setFilter(''); setPage(1) } : undefined} /></td></tr>}</tbody></table></div><div className="space-y-2 px-4 py-3 md:hidden">{pageData.length ? pageData.map((row, index) => renderMobileCard ? <div key={index} className="rounded-lg border p-3">{renderMobileCard(row)}</div> : <div key={index} className="rounded-lg border p-3 text-sm">{Object.entries(row as Record<string, unknown>).map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-b py-2 last:border-0"><span className="text-muted-foreground">{key}</span><span className="text-right font-medium">{String(value)}</span></div>)}</div>) : <EmptyTableState onClear={filter ? () => { setFilter(''); setPage(1) } : undefined} />}</div><div className="flex flex-col gap-3 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><span>{t('rowsPerPage')}</span><select className="h-8 rounded-md border bg-background px-2" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }}><option value="5">5</option><option value="10">10</option><option value="25">25</option></select><span>{filteredData.length ? `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredData.length)} of ${filteredData.length}` : '0 rows'}</span></div><div className="flex items-center gap-1"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>{t('previous')}</Button><span className="px-2">{currentPage} / {pageCount}</span><Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>{t('next')}</Button></div></div></CardContent></Card>
}
