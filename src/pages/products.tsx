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
import { productService } from '@/services/product-service'
import type { Product } from '@/lib/data/types'

const helper = createAppColumnHelper<Product>()

export default function ProductsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [items, setItems] = useState(productService.list())
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const columns: ColumnDef<typeof tableFeaturesConfig, Product, any>[] = [
    helper.accessor('id', { header: 'SKU', cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('name', { header: t('products') }),
    helper.accessor('category', { header: t('category') }),
    helper.accessor('price', { header: t('price'), cell: (info) => `$${info.getValue().toFixed(2)}` }),
    helper.accessor('stock', { header: t('stock') }),
    helper.accessor('status', { header: t('status'), cell: (info) => <Badge variant={info.getValue() === 'Active' ? 'default' : 'secondary'}>{info.getValue()}</Badge> }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('view')}><Link to={`/products/${row.original.id}`}><Eye className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('edit')}><Link to={`/products/${row.original.id}/edit`}><Pencil className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t('delete')} onClick={() => setPendingDelete(row.original)}><Trash2 className="size-4" /></Button>
      </div>
    ) }),
  ]

  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader title={t('products')} description={t('productsDescription')} actions={<Button asChild size="sm"><Link to="/products/new"><Plus className="size-4" />{t('create')}</Link></Button>} />
    <DataTable columns={columns} data={items} filterPlaceholder={t('filterProducts')} />
    <ConfirmDialog
      open={pendingDelete !== null}
      onOpenChange={(open) => !open && setPendingDelete(null)}
      title={t('deleteProduct')}
      description={t('deleteProductDescription')}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      trigger={<span />}
      onConfirm={() => {
        if (!pendingDelete) return
        productService.remove(pendingDelete.id)
        setItems(productService.list())
        toast({ title: t('productDeleted'), variant: 'success' })
      }}
    />
  </main></PageTransition>
}
