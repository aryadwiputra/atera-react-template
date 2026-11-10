import type { ColumnDef } from '@tanstack/react-table'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { useToast } from '@/components/shared/toast'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ClipboardList, ClipboardCheck, DollarSign, FileClock } from 'lucide-react'
import { useState } from 'react'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { procurementService } from '@/services/procurement-service'
import type { POStatus, PurchaseOrder } from '@/lib/data/types'

const helper = createAppColumnHelper<PurchaseOrder>()

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

const statusBadgeClass: Record<POStatus, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Pending: 'bg-status-warning/15 text-status-warning',
  Approved: 'bg-chart-1/15 text-chart-1',
  Received: 'bg-status-success/15 text-status-success',
  Cancelled: 'bg-destructive/15 text-destructive',
}

export default function ProcurementPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const [items, setItems] = useState(procurementService.list)
  const [detail, setDetail] = useState<PurchaseOrder | null>(null)

  const refresh = () => setItems(procurementService.list())

  const openPos = items.filter((po) => po.status === 'Draft' || po.status === 'Pending' || po.status === 'Approved').length
  const pendingApproval = items.filter((po) => po.status === 'Pending').length
  const totalSpendYtd = items
    .filter((po) => po.status === 'Approved' || po.status === 'Received')
    .reduce((sum, po) => sum + procurementService.total(po), 0)

  const approvePo = (po: PurchaseOrder) => {
    procurementService.update(po.id, { status: 'Approved' })
    refresh()
    toast({ title: t('poApproved'), variant: 'success' })
    setDetail(null)
  }

  const cancelPo = (po: PurchaseOrder) => {
    procurementService.update(po.id, { status: 'Cancelled' })
    refresh()
    toast({ title: t('poCancelled'), variant: 'success' })
    setDetail(null)
  }

  const columns: ColumnDef<typeof tableFeaturesConfig, PurchaseOrder, any>[] = [
    helper.accessor('number', { header: t('poNumber'), cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('supplier', { header: t('poSupplier') }),
    helper.accessor('items', { header: t('itemsCount'), cell: (info) => info.getValue().length }),
    helper.accessor('date', { header: t('poDate') }),
    helper.accessor('expectedDelivery', { header: t('expectedDelivery') }),
    helper.accessor('status', { header: t('poStatus'), cell: (info) => (
      <Badge variant="secondary" className={statusBadgeClass[info.getValue() as POStatus]}>{info.getValue()}</Badge>
    ) }),
    helper.display({ id: 'total', header: t('poTotal'), cell: ({ row }) => (
      <span className="font-semibold tabular-nums">{formatMoney(procurementService.total(row.original))}</span>
    ) }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" aria-label={t('viewPo')} onClick={() => setDetail(row.original)}>
          <ClipboardList className="size-4" />
        </Button>
      </div>
    ) }),
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('procurement')}
          description={t('procurementDescription')}
          breadcrumbs={[{ title: t('enterprise'), href: '/procurement' }, { title: t('procurement'), href: '/procurement' }]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t('openPos')} value={String(openPos)} change={t('procurementDescription')} icon={ClipboardList} />
          <StatCard title={t('pendingApproval')} value={String(pendingApproval)} change={t('procurementDescription')} icon={ClipboardCheck} />
          <StatCard title={t('totalSpendYtd')} value={formatMoney(totalSpendYtd)} change={t('procurementDescription')} icon={DollarSign} />
          <StatCard title={t('expectedDelivery')} value={String(items.length)} change={t('procurementDescription')} icon={FileClock} />
        </div>
        <DataTable columns={columns} data={items} filterPlaceholder={t('poNumber')} />
      </main>

      <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.number}</SheetTitle>
                <SheetDescription>{detail.supplier}</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('poDate')}</span>
                    <span>{detail.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('expectedDelivery')}</span>
                    <span>{detail.expectedDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('poStatus')}</span>
                    <Badge variant="secondary" className={statusBadgeClass[detail.status]}>{detail.status}</Badge>
                  </div>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-sm font-semibold">{t('lineItems')}</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="text-left font-medium">{t('lineItemName')}</th>
                        <th className="text-right font-medium">{t('quantity')}</th>
                        <th className="text-right font-medium">{t('unitPrice')}</th>
                        <th className="text-right font-medium">{t('poTotal')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items.map((item) => (
                        <tr key={item.name} className="border-t">
                          <td className="py-1.5">{item.name}</td>
                          <td className="py-1.5 text-right tabular-nums">{item.qty}</td>
                          <td className="py-1.5 text-right tabular-nums">{formatMoney(item.price)}</td>
                          <td className="py-1.5 text-right tabular-nums">{formatMoney(item.qty * item.price)}</td>
                        </tr>
                      ))}
                      <tr className="border-t font-semibold">
                        <td colSpan={3} className="py-1.5">{t('poTotal')}</td>
                        <td className="py-1.5 text-right tabular-nums">{formatMoney(procurementService.total(detail))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-auto flex gap-2">
                {detail.status === 'Pending' && (
                  <Button className="flex-1" onClick={() => approvePo(detail)}>{t('approvePo')}</Button>
                )}
                {(detail.status === 'Draft' || detail.status === 'Pending') && (
                  <Button variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => cancelPo(detail)}>{t('cancelPo')}</Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageTransition>
  )
}
