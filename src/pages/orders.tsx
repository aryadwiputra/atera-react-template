import { createAppColumnHelper, DataTable } from '@/components/shared/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { tableFeaturesConfig } from '@/components/shared/data-table'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import { Link } from 'react-router'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listOrders, removeOrder } from '@/lib/data/orders'
import type { Order } from '@/lib/data/types'

const helper = createAppColumnHelper<Order>()

export default function OrdersPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [items, setItems] = useState(listOrders())
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null)

  const columns: ColumnDef<typeof tableFeaturesConfig, Order, any>[] = [
    helper.accessor('id', { header: t('orderId'), cell: (info) => <span className="font-medium">#{info.getValue()}</span> }),
    helper.accessor('customer', { header: t('customer') }),
    helper.accessor('product', { header: t('product') }),
    helper.accessor('status', { header: t('status'), cell: (info) => <Badge variant={info.getValue() === 'Paid' ? 'default' : 'secondary'}>{info.getValue()}</Badge> }),
    helper.accessor('amount', { header: t('amount'), cell: (info) => `$${info.getValue().toFixed(2)}` }),
    helper.accessor('date', { header: t('date') }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('view')}><Link to={`/orders/${row.original.id}`}><Eye className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('edit')}><Link to={`/orders/${row.original.id}/edit`}><Pencil className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t('delete')} onClick={() => setPendingDelete(row.original)}><Trash2 className="size-4" /></Button>
      </div>
    ) }),
  ]

  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader title={t('orders')} description={t('ordersDescription')} actions={<Button asChild size="sm"><Link to="/orders/new"><Plus className="size-4" />{t('newOrder')}</Link></Button>} />
    <DataTable columns={columns} data={items} filterPlaceholder={t('filterOrders')} />
    <ConfirmDialog
      open={pendingDelete !== null}
      onOpenChange={(open) => !open && setPendingDelete(null)}
      title={t('deleteOrder')}
      description={t('deleteOrderDescription')}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      trigger={<span />}
      onConfirm={() => {
        if (!pendingDelete) return
        removeOrder(pendingDelete.id)
        setItems(listOrders())
        toast({ title: t('orderDeleted'), variant: 'success' })
      }}
    />
  </main></PageTransition>
}
