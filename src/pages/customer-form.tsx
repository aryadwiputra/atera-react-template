import { DatePicker } from '@/components/shared/date-picker'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { customerService } from '@/services/customer-service'

const customerSchema = z.object({ name: z.string().min(2), email: z.string().email(), company: z.string().min(2), orders: z.coerce.number().int().nonnegative(), spent: z.coerce.number().nonnegative(), joined: z.string().min(1) })
type CustomerFormValues = z.input<typeof customerSchema>
type CustomerSubmitValues = z.output<typeof customerSchema>

type FormProps = { label: string; error?: string; children: React.ReactNode }
function Field({ label, error, children }: FormProps) {
  return <label className="grid gap-2 text-sm font-medium">{label}{children}{error && <span className="text-xs text-destructive">{error}</span>}</label>
}

export default function CustomerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const existing = id ? customerService.get(id) : undefined
  const form = useForm<CustomerFormValues, unknown, CustomerSubmitValues>({ resolver: zodResolver(customerSchema), defaultValues: existing ?? { name: '', email: '', company: '', orders: 0, spent: 0, joined: new Date().toISOString().slice(0, 10) } })
  if (id && !existing) return <Navigate to="/customers" replace />
  const submit = (values: CustomerSubmitValues) => { if (id) customerService.update(id, values); else customerService.create(values); navigate('/customers') }
  return <PageTransition><main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6"><PageHeader breadcrumbs={[{ title: t('customers'), href: '/customers' }, { title: id ? t('editCustomer') : t('newCustomer'), href: id ? `/customers/${id}/edit` : '/customers/new' }]} title={id ? t('editCustomer') : t('newCustomer')} description={t('customersDescription')} actions={<Button variant="outline" asChild><Link to="/customers"><ArrowLeft className="size-4" />{t('backToCustomers')}</Link></Button>} /><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"><Card><CardHeader><CardTitle>{t('customers')}</CardTitle></CardHeader><CardContent><form className="grid gap-5 sm:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
    <Field label={t('name')} error={form.formState.errors.name?.message}><Input {...form.register('name')} /></Field>
    <Field label={t('email')} error={form.formState.errors.email?.message}><Input type="email" {...form.register('email')} /></Field>
    <Field label={t('company')} error={form.formState.errors.company?.message}><Input {...form.register('company')} /></Field>
    <Field label={t('orders')} error={form.formState.errors.orders?.message}><Input type="number" {...form.register('orders')} /></Field>
    <Field label={t('totalSpent')} error={form.formState.errors.spent?.message}><Input type="number" step="0.01" {...form.register('spent')} /></Field>
    <Field label={t('date')} error={form.formState.errors.joined?.message}><DatePicker value={form.watch('joined')} onChange={(value) => form.setValue('joined', value)} /></Field>
    <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" asChild><Link to="/customers">{t('cancel')}</Link></Button><Button type="submit"><Save className="size-4" />{t('create')}</Button></div>
  </form></CardContent></Card></div></main></PageTransition>
}
