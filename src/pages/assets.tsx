import { DatePicker } from '@/components/shared/date-picker'
import type { ColumnDef } from '@tanstack/react-table'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Boxes, Eye, Pencil, Plus, Trash2, Wrench, Wallet, Cpu } from 'lucide-react'
import { useState } from 'react'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { assetService } from '@/services/asset-service'
import type { Asset, AssetStatus } from '@/lib/data/types'
import { cn } from '@/lib/utils'

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

const assetStatuses: AssetStatus[] = ['In Use', 'Available', 'Maintenance', 'Retired']

const statusClasses: Record<AssetStatus, string> = {
  'In Use': 'bg-status-success/15 text-status-success',
  'Available': 'bg-chart-1/15 text-chart-1',
  'Maintenance': 'bg-status-warning/15 text-status-warning',
  'Retired': 'bg-muted text-muted-foreground',
}

type FormState = Omit<Asset, 'id'>

const emptyForm: FormState = {
  tag: '',
  name: '',
  category: '',
  assignedTo: '',
  location: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  warrantyEnd: new Date().toISOString().slice(0, 10),
  value: 0,
  status: 'Available',
}

export default function AssetsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const [items, setItems] = useState(assetService.list)
  const [detail, setDetail] = useState<Asset | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Asset | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [pendingDelete, setPendingDelete] = useState<Asset | null>(null)

  const refresh = () => setItems(assetService.list())

  const inUseCount = items.filter((item) => item.status === 'In Use').length
  const maintenanceCount = items.filter((item) => item.status === 'Maintenance').length
  const totalValue = items.filter((item) => item.status !== 'Retired').reduce((sum, item) => sum + item.value, 0)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (asset: Asset) => {
    setEditing(asset)
    const { id: _id, ...rest } = asset
    setForm(rest)
    setFormOpen(true)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (form.tag.trim() === '' || form.name.trim() === '') return
    if (editing) {
      assetService.update(editing.id, form)
    } else {
      assetService.create(form)
    }
    refresh()
    setFormOpen(false)
    toast({ title: t('assetSaved'), variant: 'success' })
  }

  const helper = createAppColumnHelper<Asset>()
  const columns: ColumnDef<typeof tableFeaturesConfig, Asset, any>[] = [
    helper.accessor('tag', { header: t('assetTag'), cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('name', { header: t('assetName') }),
    helper.accessor('category', { header: t('category') }),
    helper.accessor('assignedTo', { header: t('assignedTo'), cell: (info) => info.getValue() || '—' }),
    helper.accessor('location', { header: t('location') }),
    helper.accessor('purchaseDate', { header: t('purchaseDate') }),
    helper.accessor('warrantyEnd', { header: t('warrantyEnd') }),
    helper.accessor('value', { header: t('totalAssetValue'), cell: (info) => <span className="tabular-nums">{formatMoney(info.getValue())}</span> }),
    helper.accessor('status', { header: t('status'), cell: (info) => {
      const status = info.getValue() as AssetStatus
      return <Badge className={cn('border-transparent', statusClasses[status])}>{status}</Badge>
    } }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" aria-label={t('view')} onClick={() => setDetail(row.original)}><Eye className="size-4" /></Button>
        <Button variant="ghost" size="icon" className="size-8" aria-label={t('edit')} onClick={() => openEdit(row.original)}><Pencil className="size-4" /></Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t('delete')} onClick={() => setPendingDelete(row.original)}><Trash2 className="size-4" /></Button>
      </div>
    ) }),
  ]

  const stats = [
    { title: t('totalAssets'), value: String(items.length), change: '', icon: Boxes, description: t('assetsDescription') },
    { title: t('inUse'), value: String(inUseCount), change: '', icon: Cpu, description: t('assignedTo') },
    { title: t('inMaintenance'), value: String(maintenanceCount), change: '', icon: Wrench, description: t('inMaintenance') },
    { title: t('totalAssetValue'), value: formatMoney(totalValue), change: '', icon: Wallet, description: t('totalAssetValue') },
  ]

  const history = detail
    ? [
        { label: 'Created', date: detail.purchaseDate },
        { label: `Assigned to ${detail.assignedTo || 'stock'}`, date: detail.purchaseDate },
        { label: 'Last audit', date: '2026-09-15' },
      ]
    : []

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('assets')}
          description={t('assetsDescription')}
          actions={<Button size="sm" onClick={openCreate}><Plus className="size-4" />{t('addAsset')}</Button>}
          breadcrumbs={[{ title: t('enterprise'), href: '/assets' }, { title: t('assets'), href: '/assets' }]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((card) => (
            <StatCard key={card.title} title={card.title} value={card.value} change={card.change ?? ''} icon={card.icon} description={card.description} />
          ))}
        </div>
        <DataTable columns={columns} data={items} filterPlaceholder={t('filterTransactions')} />
      </main>

      <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{detail ? `${detail.tag} — ${detail.name}` : ''}</SheetTitle>
          </SheetHeader>
          {detail && (
            <div className="grid gap-6 overflow-y-auto px-4 pb-6">
              <div className="grid gap-2 text-sm">
                {([
                  [t('assetTag'), detail.tag],
                  [t('assetName'), detail.name],
                  [t('category'), detail.category],
                  [t('assignedTo'), detail.assignedTo || '—'],
                  [t('location'), detail.location],
                  [t('purchaseDate'), detail.purchaseDate],
                  [t('warrantyEnd'), detail.warrantyEnd],
                  [t('totalAssetValue'), formatMoney(detail.value)],
                  [t('status'), detail.status],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b py-1.5 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold">{t('assetHistory')}</h3>
                {history.map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between gap-4 text-sm">
                    <span>{entry.label}</span>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('editAsset') : t('addAsset')}</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('assetTag')}
                <Input value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('assetName')}
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('category')}
                <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('location')}
                <Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              {t('assignedTo')}
              <Input value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('purchaseDate')}
                <DatePicker value={form.purchaseDate} onChange={(value) => setForm({ ...form, purchaseDate: value })} required ariaLabel={t('purchaseDate')} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('warrantyEnd')}
                <DatePicker value={form.warrantyEnd} onChange={(value) => setForm({ ...form, warrantyEnd: value })} required ariaLabel={t('warrantyEnd')} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('totalAssetValue')}
                <Input type="number" min={0} value={form.value} onChange={(event) => setForm({ ...form, value: Number(event.target.value) })} required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('status')}
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as AssetStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {assetStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
              <Button type="submit">{editing ? t('saveChanges') : t('addAsset')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={t('deleteAsset')}
        description={t('deleteAssetDescription')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        trigger={<span />}
        onConfirm={() => {
          if (!pendingDelete) return
          assetService.remove(pendingDelete.id)
          refresh()
          toast({ title: t('assetDeleted'), variant: 'success' })
        }}
      />
    </PageTransition>
  )
}
