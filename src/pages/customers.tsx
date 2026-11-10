import { createAppColumnHelper, DataTable } from '@/components/shared/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { tableFeaturesConfig } from '@/components/shared/data-table'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import { Link } from 'react-router'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { customerService } from '@/services/customer-service'
import type { Customer } from '@/lib/data/types'

const helper = createAppColumnHelper<Customer>()

export default function CustomersPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [items, setItems] = useState(customerService.list())
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null)

  const columns: ColumnDef<typeof tableFeaturesConfig, Customer, any>[] = [
    helper.accessor('name', { header: 'Customer', cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('email', { header: t('email') }),
    helper.accessor('company', { header: t('company') }),
    helper.accessor('orders', { header: t('orders') }),
    helper.accessor('spent', { header: 'Total spent', cell: (info) => `$${info.getValue().toFixed(2)}` }),
    helper.accessor('joined', { header: 'Joined' }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('view')}><Link to={`/customers/${row.original.id}`}><Eye className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('edit')}><Link to={`/customers/${row.original.id}/edit`}><Pencil className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t('delete')} onClick={() => setPendingDelete(row.original)}><Trash2 className="size-4" /></Button>
      </div>
    ) }),
  ]

  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader title={t('customers')} description={t('customersDescription')} actions={<Button size="sm" asChild><Link to="/customers/new"><Plus className="size-4" />{t('create')}</Link></Button>} />
    <DataTable columns={columns} data={items} filterPlaceholder={t('filterCustomers')} />
    <ConfirmDialog
      open={pendingDelete !== null}
      onOpenChange={(open) => !open && setPendingDelete(null)}
      title={t('deleteCustomer')}
      description={t('deleteCustomerDescription')}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      trigger={<span />}
      onConfirm={() => {
        if (!pendingDelete) return
        customerService.remove(pendingDelete.id)
        setItems(customerService.list())
        toast({ title: t('customerDeleted'), variant: 'success' })
      }}
    />
  </main></PageTransition>
}
