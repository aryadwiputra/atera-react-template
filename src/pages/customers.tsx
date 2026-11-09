import { createAppColumnHelper } from '@/components/shared/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { tableFeaturesConfig } from '@/components/shared/data-table'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listCustomers } from '@/lib/data/customers'
import type { Customer } from '@/lib/data/types'

const helper = createAppColumnHelper<Customer>()
const columns: ColumnDef<typeof tableFeaturesConfig, Customer, any>[] = [helper.accessor('name', { header: 'Customer', cell: (info) => <span className="font-medium">{info.getValue()}</span> }), helper.accessor('email', { header: 'Email' }), helper.accessor('company', { header: 'Company' }), helper.accessor('orders', { header: 'Orders' }), helper.accessor('spent', { header: 'Total spent', cell: (info) => `$${info.getValue().toFixed(2)}` }), helper.accessor('joined', { header: 'Joined' })]

export default function CustomersPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t('customers')} description="Keep track of your customer relationships." actions={<Button size="sm" variant="outline"><Mail className="size-4" />Contact customers</Button>} /><DataTable columns={columns} data={listCustomers()} filterPlaceholder="Filter customers..." /></main></PageTransition>
}
