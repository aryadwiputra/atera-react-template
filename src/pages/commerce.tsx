import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Check, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import { DataTable, createAppColumnHelper } from '@/components/shared/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import { tableFeaturesConfig } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listCustomers } from '@/lib/data/customers'
import { createOrder, getOrder, updateOrder } from '@/lib/data/orders'
import { listInvoices, removeInvoice } from '@/lib/data/invoices'
import { createProduct, getProduct, updateProduct } from '@/lib/data/products'
import type { Invoice } from '@/lib/data/types'
import { cn } from '@/lib/utils'

type FormProps = { label: string; error?: string; children: React.ReactNode }
function Field({ label, error, children }: FormProps) {
  return <label className="grid gap-2 text-sm font-medium">{label}{children}{error && <span className="text-xs text-destructive">{error}</span>}</label>
}

const orderSchema = z.object({ customer: z.string().min(2), customerEmail: z.string().email(), product: z.string().min(2), status: z.enum(['Paid', 'Pending', 'Refunded']), amount: z.coerce.number().positive(), date: z.string().min(1) })
type OrderFormValues = z.input<typeof orderSchema>
type OrderSubmitValues = z.output<typeof orderSchema>

export function OrderFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const existing = id ? getOrder(id) : undefined
  const form = useForm<OrderFormValues, unknown, OrderSubmitValues>({ resolver: zodResolver(orderSchema), defaultValues: existing ?? { customer: '', customerEmail: '', product: '', status: 'Pending', amount: 0, date: new Date().toISOString().slice(0, 10) } })
  const submit = (values: OrderSubmitValues) => { if (id) updateOrder(id, values); else createOrder(values); navigate('/orders') }
  return <PageTransition><main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6"><PageHeader breadcrumbs={[{ title: t('orders'), href: '/orders' }, { title: id ? t('editOrder') : t('newOrder'), href: id ? `/orders/${id}/edit` : '/orders/new' }]} title={id ? t('editOrder') : t('newOrder')} description={t('createOrderDescription')} actions={<Button variant="outline" asChild><Link to="/orders"><ArrowLeft className="size-4" />{t('backToOrders')}</Link></Button>} /><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"><Card><CardHeader><CardTitle>{t('orderDetails')}</CardTitle><p className="text-sm text-muted-foreground">{t('orderDetailsDescription')}</p></CardHeader><CardContent><form className="grid gap-5 sm:grid-cols-2" onSubmit={form.handleSubmit(submit)}><Field label={t('customer')} error={form.formState.errors.customer?.message}><Input {...form.register('customer')} placeholder={t('customerName')} /></Field><Field label={t('email')} error={form.formState.errors.customerEmail?.message}><Input type="email" {...form.register('customerEmail')} placeholder="customer@example.com" /></Field><Field label={t('product')} error={form.formState.errors.product?.message}><Input {...form.register('product')} placeholder={t('productOrPlan')} /></Field><Field label={t('amount')} error={form.formState.errors.amount?.message}><Input type="number" step="0.01" {...form.register('amount')} /></Field><Field label={t('status')}><Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as OrderFormValues['status'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Paid">{t('paid')}</SelectItem><SelectItem value="Pending">{t('pending')}</SelectItem><SelectItem value="Refunded">{t('refunded')}</SelectItem></SelectContent></Select></Field><Field label={t('date')}><Input type="date" {...form.register('date')} /></Field><div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" asChild><Link to="/orders">{t('cancel')}</Link></Button><Button type="submit"><Save className="size-4" />{t('saveOrder')}</Button></div></form></CardContent></Card><Card className="h-fit"><CardHeader><CardTitle>{t('orderSummary')}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex justify-between gap-3"><span className="text-muted-foreground">{t('customer')}</span><span className="text-right font-medium">{form.watch('customer') || t('notSelected')}</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">{t('product')}</span><span className="text-right font-medium">{form.watch('product') || t('notSelected')}</span></div><div className="flex justify-between gap-3 border-t pt-3"><span className="text-muted-foreground">{t('total')}</span><span className="font-semibold">${Number(form.watch('amount') || 0).toFixed(2)}</span></div></CardContent></Card></div></main></PageTransition>
}

const productSchema = z.object({ name: z.string().min(2), category: z.string().min(2), price: z.coerce.number().positive(), stock: z.coerce.number().int().nonnegative(), status: z.enum(['Active', 'Draft', 'Archived']) })
type ProductFormValues = z.input<typeof productSchema>
type ProductSubmitValues = z.output<typeof productSchema>
export function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const existing = id ? getProduct(id) : undefined
  const form = useForm<ProductFormValues, unknown, ProductSubmitValues>({ resolver: zodResolver(productSchema), defaultValues: existing ?? { name: '', category: '', price: 0, stock: 0, status: 'Draft' } })
  const submit = (values: ProductSubmitValues) => { if (id) updateProduct(id, values); else createProduct(values); navigate('/products') }
 return <PageTransition><main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6"><PageHeader title={id ? t('editProductTitle') : t('newProductTitle')} description={t('manageCatalogDescription')} actions={<Button variant="outline" asChild><Link to="/products"><ArrowLeft className="size-4" />{t('back')}</Link></Button>} /><Card><CardHeader><CardTitle>{t('productDetails')}</CardTitle></CardHeader><CardContent><form className="grid gap-5 sm:grid-cols-2" onSubmit={form.handleSubmit(submit)}><Field label={t('name')} error={form.formState.errors.name?.message}><Input {...form.register('name')} /></Field><Field label={t('category')} error={form.formState.errors.category?.message}><Input {...form.register('category')} /></Field><Field label={t('price')} error={form.formState.errors.price?.message}><Input type="number" step="0.01" {...form.register('price')} /></Field><Field label={t('stock')}><Input type="number" {...form.register('stock')} /></Field><Field label={t('status')}><Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as ProductFormValues['status'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">{t('active')}</SelectItem><SelectItem value="Draft">{t('draft')}</SelectItem><SelectItem value="Archived">{t('archived')}</SelectItem></SelectContent></Select></Field><div className="flex justify-end sm:col-span-2"><Button type="submit"><Save className="size-4" />{t('saveProduct')}</Button></div></form></CardContent></Card></main></PageTransition>
}

const invoiceHelper = createAppColumnHelper<Invoice>()
export function InvoicesPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [items, setItems] = useState(listInvoices())
  const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null)

  const columns: ColumnDef<typeof tableFeaturesConfig, Invoice, any>[] = [
    invoiceHelper.accessor('id', { header: 'Invoice', cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    invoiceHelper.accessor('customer', { header: 'Customer' }),
    invoiceHelper.accessor('date', { header: 'Issued' }),
    invoiceHelper.accessor('dueDate', { header: 'Due' }),
    invoiceHelper.accessor('amount', { header: 'Amount', cell: (info) => `$${info.getValue().toFixed(2)}` }),
    invoiceHelper.accessor('status', { header: 'Status', cell: (info) => <Badge variant={info.getValue() === 'Paid' ? 'default' : 'secondary'}>{info.getValue()}</Badge> }),
    invoiceHelper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" asChild aria-label={t('edit')}><Link to={`/invoices/${row.original.id}/edit`}><Pencil className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t('delete')} onClick={() => setPendingDelete(row.original)}><Trash2 className="size-4" /></Button>
      </div>
    ) }),
  ]

  return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t('invoices')} description={t('reviewInvoicesDescription')} actions={<Button asChild size="sm"><Link to="/invoices/new"><Plus className="size-4" />{t('createInvoice')}</Link></Button>} /><DataTable columns={columns} data={items} filterPlaceholder={t('filterInvoices')} />
    <ConfirmDialog
      open={pendingDelete !== null}
      onOpenChange={(open) => !open && setPendingDelete(null)}
      title={t('deleteInvoice')}
      description={t('deleteInvoiceDescription')}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      trigger={<span />}
      onConfirm={() => {
        if (!pendingDelete) return
        removeInvoice(pendingDelete.id)
        setItems(listInvoices())
        toast({ title: t('invoiceDeleted'), variant: 'success' })
      }}
    />
  </main></PageTransition>
}

export function BillingPage() { const { language } = useCustomizePreferences(); const t = useTranslations(language); const plans = [{ name: 'Starter', price: '$49', description: 'For growing teams', features: ['3 team members', 'Basic analytics', 'Email support'] }, { name: 'Pro', price: '$129', description: 'For scaling businesses', features: ['Unlimited members', 'Advanced analytics', 'Priority support'] }, { name: 'Enterprise', price: '$599', description: 'For complex operations', features: ['Dedicated success manager', 'Custom reporting', 'SLA and SSO'] }]; return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t('billing')} description={t('manageSubscriptionDescription')} /><div className="grid gap-4 lg:grid-cols-3">{plans.map((plan, index) => <Card key={plan.name} className={cn(index === 1 && 'border-primary shadow-sm')}><CardHeader><div className="flex items-center justify-between"><CardTitle>{plan.name}</CardTitle>{index === 1 && <Badge>{t('currentPlan')}</Badge>}</div><p className="text-sm text-muted-foreground">{plan.description}</p><p className="pt-3 text-3xl font-semibold">{plan.price}<span className="text-sm font-normal text-muted-foreground"> / {t('month')}</span></p></CardHeader><CardContent className="space-y-3">{plan.features.map((feature) => <p key={feature} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary" />{feature}</p>)}<Button variant={index === 1 ? 'default' : 'outline'} className="mt-3 w-full">{index === 1 ? t('managePlan') : t('choosePlan')}</Button></CardContent></Card>)}</div></main></PageTransition> }

export function CustomerDetailPage() { const { id } = useParams(); const { language } = useCustomizePreferences(); const t = useTranslations(language); const customer = id ? listCustomers().find((item) => item.id === id) : undefined; if (!customer) return <Navigate to="/customers" replace />; return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={customer.name} description={customer.email} actions={<Button variant="outline" asChild><Link to="/customers"><ArrowLeft className="size-4" />{t('back')}</Link></Button>} /><div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardTitle>{t('company')}</CardTitle></CardHeader><CardContent>{customer.company}</CardContent></Card><Card><CardHeader><CardTitle>{t('orders')}</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{customer.orders}</CardContent></Card><Card><CardHeader><CardTitle>{t('totalSpent')}</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">${customer.spent.toLocaleString()}</CardContent></Card></div></main></PageTransition> }

export function OrderDetailPage() { const { id } = useParams(); const { language } = useCustomizePreferences(); const t = useTranslations(language); const order = id ? getOrder(id) : undefined; if (!order) return <Navigate to="/orders" replace />; return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={`Order #${order.id}`} description={`${order.customer} · ${order.date}`} actions={<div className="flex gap-2"><Button variant="outline" asChild><Link to="/orders"><ArrowLeft className="size-4" />{t('back')}</Link></Button><Button asChild><Link to={`/orders/${order.id}/edit`}>{t('edit')}</Link></Button></div>} /><Card><CardContent className="grid gap-4 p-6 sm:grid-cols-2"><div><p className="text-sm text-muted-foreground">{t('product')}</p><p className="font-medium">{order.product}</p></div><div><p className="text-sm text-muted-foreground">{t('status')}</p><Badge>{order.status}</Badge></div><div><p className="text-sm text-muted-foreground">{t('customerEmail')}</p><p>{order.customerEmail}</p></div><div><p className="text-sm text-muted-foreground">{t('amount')}</p><p className="text-xl font-semibold">${order.amount.toFixed(2)}</p></div></CardContent></Card></main></PageTransition> }

export function ProductDetailPage() { const { id } = useParams(); const { language } = useCustomizePreferences(); const t = useTranslations(language); const product = id ? getProduct(id) : undefined; if (!product) return <Navigate to="/products" replace />; return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={product.name} description={product.category} actions={<div className="flex gap-2"><Button variant="outline" asChild><Link to="/products"><ArrowLeft className="size-4" />{t('back')}</Link></Button><Button asChild><Link to={`/products/${product.id}/edit`}>{t('edit')}</Link></Button></div>} /><div className="grid gap-4 sm:grid-cols-3"><Card><CardHeader><CardTitle>{t('price')}</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">${product.price}</CardContent></Card><Card><CardHeader><CardTitle>{t('inventory')}</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{product.stock}</CardContent></Card><Card><CardHeader><CardTitle>{t('status')}</CardTitle></CardHeader><CardContent><Badge>{product.status}</Badge></CardContent></Card></div></main></PageTransition> }
