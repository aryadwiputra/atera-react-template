import type { ColumnDef } from '@tanstack/react-table'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Boxes, PackageCheck, Warehouse } from 'lucide-react'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type TranslationKey } from '@/i18n'
import { listInventory } from '@/lib/data/inventory'
import type { InventoryItem } from '@/lib/data/types'
import { cn } from '@/lib/utils'

const available = (item: InventoryItem) => item.onHand - item.reserved

const stockStatus = (item: InventoryItem) => {
  const avail = available(item)
  return avail <= 0 ? 'Out' : avail <= item.reorderPoint ? 'Low' : 'OK'
}

const statusClassMap: Record<string, string> = {
  OK: 'bg-status-success/15 text-status-success',
  Low: 'bg-status-warning/15 text-status-warning',
  Out: 'bg-destructive/15 text-destructive',
}

const statusKeyMap: Record<string, TranslationKey> = { OK: 'stockOk', Low: 'stockLow', Out: 'stockOut' }

export default function InventoryPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  const items = listInventory()
  const lowStockCount = items.filter((item) => stockStatus(item) !== 'OK').length
  const totalUnits = items.reduce((sum, item) => sum + item.onHand, 0)

  const helper = createAppColumnHelper<InventoryItem>()
  const columns: ColumnDef<typeof tableFeaturesConfig, InventoryItem, any>[] = [
    helper.accessor('sku', { cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('name', { header: t('itemName') }),
    helper.accessor('warehouse', { header: t('warehouse') }),
    helper.accessor('onHand', { header: t('onHand'), cell: (info) => <span className="tabular-nums">{info.getValue()}</span> }),
    helper.accessor('reserved', { header: t('reserved'), cell: (info) => <span className="tabular-nums">{info.getValue()}</span> }),
    helper.accessor((item) => available(item), { id: 'available', header: t('available'), cell: (info) => <span className="tabular-nums">{info.getValue()}</span> }),
    helper.accessor('reorderPoint', { header: t('reorderPoint'), cell: (info) => <span className="tabular-nums">{info.getValue()}</span> }),
    helper.accessor((item) => stockStatus(item), { id: 'status', header: t('status'), cell: (info) => (
      <Badge className={cn(statusClassMap[info.getValue()])}>{t(statusKeyMap[info.getValue()])}</Badge>
    ) }),
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('inventory')}
          description={t('inventoryDescription')}
          breadcrumbs={[{ title: t('enterprise'), href: '/inventory' }, { title: t('inventory'), href: '/inventory' }]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title={t('totalSkus')} value={String(items.length)} change="" icon={Boxes} />
          <StatCard title={t('lowStockCount')} value={String(lowStockCount)} change="" changePositive={false} icon={PackageCheck} description={t('inventoryDescription')} />
          <StatCard title={t('totalUnits')} value={totalUnits.toLocaleString('en-US')} change="" icon={Warehouse} />
        </div>
        <DataTable data={items} columns={columns} filterPlaceholder={t('inventory')} />
      </main>
    </PageTransition>
  )
}
