import { createAppColumnHelper, DataTable } from '@/components/shared/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { tableFeaturesConfig } from '@/components/shared/data-table'
import { useToast } from '@/components/shared/toast'
import { Pencil, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { supplierService } from '@/services/supplier-service'
import type { Supplier } from '@/lib/data/types'

const helper = createAppColumnHelper<Supplier>()

type SupplierForm = { name: string; contact: string; email: string; phone: string; country: string; rating: string; onTimeRate: string; status: Supplier['status'] }

const emptyForm: SupplierForm = { name: '', contact: '', email: '', phone: '', country: '', rating: '4.0', onTimeRate: '90', status: 'Active' }

const statusClass: Record<Supplier['status'], string> = {
  Active: 'bg-status-success/15 text-status-success',
  'On Hold': 'bg-status-warning/15 text-status-warning',
}

export default function SuppliersPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [items, setItems] = useState(supplierService.list())
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState<SupplierForm>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }
  const openEdit = (supplier: Supplier) => {
    setEditing(supplier)
    setForm({ name: supplier.name, contact: supplier.contact, email: supplier.email, phone: supplier.phone, country: supplier.country, rating: String(supplier.rating), onTimeRate: String(supplier.onTimeRate), status: supplier.status })
    setFormOpen(true)
  }
  const submit = () => {
    const payload = { name: form.name, contact: form.contact, email: form.email, phone: form.phone, country: form.country, rating: Number(form.rating), onTimeRate: Number(form.onTimeRate), status: form.status }
    if (editing) supplierService.update(editing.id, payload)
    else supplierService.create(payload)
    setItems(supplierService.list())
    setFormOpen(false)
    toast({ title: t('supplierSaved'), variant: 'success' })
  }

  const columns: ColumnDef<typeof tableFeaturesConfig, Supplier, any>[] = [
    helper.accessor('name', { header: t('supplierName'), cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('contact', { header: t('contactPerson') }),
    helper.accessor('email', { header: t('email') }),
    helper.accessor('phone', { header: t('phone') }),
    helper.accessor('country', { header: t('country') }),
    helper.accessor('rating', { header: t('rating'), cell: (info) => (
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`size-3 ${star <= Math.round(info.getValue()) ? 'fill-status-warning text-status-warning' : 'text-muted-foreground/30'}`} />
          ))}
        </div>
        <span className="text-muted-foreground">{info.getValue().toFixed(1)}</span>
      </div>
    ) }),
    helper.accessor('onTimeRate', { header: t('onTimeRate'), cell: (info) => <span className="tabular-nums">{info.getValue()}%</span> }),
    helper.accessor((supplier) => supplier.status, { id: 'status', header: t('status'), cell: (info) => { const status = info.getValue<Supplier['status']>(); return <Badge className={statusClass[status]}>{status === 'On Hold' ? t('onHold') : status}</Badge> } }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" aria-label={t('edit')} onClick={() => openEdit(row.original)}><Pencil className="size-4" /></Button>
      </div>
    ) }),
  ]

  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader
      title={t('suppliers')}
      description={t('suppliersDescription')}
      breadcrumbs={[{ title: t('enterprise'), href: '/suppliers' }, { title: t('suppliers'), href: '/suppliers' }]}
      actions={<Button size="sm" onClick={openCreate}><Plus className="size-4" />{t('addSupplier')}</Button>}
    />
    <DataTable columns={columns} data={items} filterPlaceholder={t('supplierName')} />
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{editing ? t('editSupplier') : t('addSupplier')}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-name">{t('supplierName')}</label><Input id="supplier-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid gap-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-contact">{t('contactPerson')}</label><Input id="supplier-contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div className="grid gap-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-email">{t('email')}</label><Input id="supplier-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid gap-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-phone">{t('phone')}</label><Input id="supplier-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="grid gap-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-country">{t('country')}</label><Input id="supplier-country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          <div className="grid gap-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-rating">{t('rating')}</label><Input id="supplier-rating" type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          <div className="grid gap-2"><label className="grid gap-2 text-sm font-medium" htmlFor="supplier-otd">{t('onTimeRate')}</label><Input id="supplier-otd" type="number" min={0} max={100} value={form.onTimeRate} onChange={(e) => setForm({ ...form, onTimeRate: e.target.value })} /></div>
          <div className="grid gap-2">
            <label className="grid gap-2 text-sm font-medium">{t('status')}</label>
            <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as SupplierForm['status'] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">{t('active')}</SelectItem>
                <SelectItem value="On Hold">{t('onHold')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
          <Button onClick={submit}>{editing ? t('save') : t('addSupplier')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </main></PageTransition>
}
