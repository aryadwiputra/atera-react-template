import { DatePicker } from '@/components/shared/date-picker'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { createInvoice, getInvoice, updateInvoice } from '@/lib/data/invoices'

const invoiceSchema = z.object({ customer: z.string().min(2), amount: z.coerce.number().positive(), status: z.enum(['Paid', 'Pending', 'Overdue']), date: z.string().min(1), dueDate: z.string().min(1) })
type InvoiceFormValues = z.input<typeof invoiceSchema>
type InvoiceSubmitValues = z.output<typeof invoiceSchema>

export default function InvoiceFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const existing = id ? getInvoice(id) : undefined
  const form = useForm<InvoiceFormValues, unknown, InvoiceSubmitValues>({ resolver: zodResolver(invoiceSchema), defaultValues: existing ?? { customer: '', amount: 0, status: 'Pending', date: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10) } })
  const submit = (values: InvoiceSubmitValues) => { if (id) updateInvoice(id, values); else createInvoice(values); navigate('/invoices') }
  return <PageTransition><main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6"><PageHeader breadcrumbs={[{ title: t('invoices'), href: '/invoices' }, { title: id ? t('editInvoice') : t('newInvoice'), href: id ? `/invoices/${id}/edit` : '/invoices/new' }]} title={id ? t('editInvoice') : t('newInvoice')} description={t('createInvoiceDescription')} actions={<Button variant="outline" asChild><Link to="/invoices"><ArrowLeft className="size-4" />{t('backToInvoices')}</Link></Button>} /><Card><CardHeader><CardTitle>{t('invoiceDetails')}</CardTitle></CardHeader><CardContent><form className="grid gap-5 sm:grid-cols-2" onSubmit={form.handleSubmit(submit)}><label className="grid gap-2 text-sm font-medium">{t('customer')}<Input {...form.register('customer')} /></label><label className="grid gap-2 text-sm font-medium">{t('amount')}<Input type="number" step="0.01" {...form.register('amount')} /></label><label className="grid gap-2 text-sm font-medium">{t('status')}<Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as InvoiceFormValues['status'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Paid">{t('paid')}</SelectItem><SelectItem value="Pending">{t('pending')}</SelectItem><SelectItem value="Overdue">Overdue</SelectItem></SelectContent></Select></label><label className="grid gap-2 text-sm font-medium">{t('date')}<DatePicker value={form.watch('date')} onChange={(value) => form.setValue('date', value)} /></label><label className="grid gap-2 text-sm font-medium">{t('dueDate')}<DatePicker value={form.watch('dueDate')} onChange={(value) => form.setValue('dueDate', value)} /></label><div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" asChild><Link to="/invoices">{t('cancel')}</Link></Button><Button type="submit"><Save className="size-4" />{t('saveChanges')}</Button></div></form></CardContent></Card></main></PageTransition>
}
