import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, Building2, CalendarDays, ChevronRight, FileText, Mail, MapPin, Package, Pencil, Receipt, Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'
import type { BreadcrumbItem } from '@/types'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useToast } from '@/components/shared/toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { getProfile, saveProfile } from '@/lib/data/profile'
import { listOrders } from '@/lib/data/orders'
import { listInvoices } from '@/lib/data/invoices'
import { listFiles } from '@/lib/data/files'
import type { Order } from '@/lib/data/types'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Enter at least 2 characters.'),
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
})
type ProfileFormValues = z.input<typeof profileSchema>

const initialsOf = (name: string) => name.trim().split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U'

const orderStatusTone = (status: Order['status']) =>
  status === 'Paid' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive'

export default function ProfilePage() {
  const { session } = useAuth()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const [profile, setProfile] = useState(getProfile())
  const fullName = profile.fullName || session?.name || 'User'
  const { email, jobTitle, company, location } = profile
  const joined = session?.authenticatedAt ? new Date(session.authenticatedAt) : new Date()

  const orders = listOrders()
  const invoices = listInvoices()
  const files = listFiles()
  const recentOrders = orders.slice(0, 3)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName,
      email,
      jobTitle,
      company,
      location,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    saveProfile(values)
    setProfile(values)
    toast({ title: t('profileSaved'), variant: 'success' })
  })

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('dashboard'), href: '/dashboard' },
    { title: t('profile'), href: '/profile' },
  ]

  const activityRows = [
    { label: t('recentOrders'), value: orders.length, icon: Package, href: '/orders' },
    { label: t('recentInvoices'), value: invoices.length, icon: Receipt, href: '/invoices' },
    { label: t('recentFiles'), value: files.length, icon: FileText, href: '/files' },
  ]

  const preferenceLinks = [
    { title: t('appearance'), description: t('appearanceDescription'), href: '/settings/appearance' },
    { title: t('notifications'), description: t('notificationsSettingsDescription'), href: '/settings/notifications' },
    { title: t('billing'), description: t('billingSettingsDescription'), href: '/settings/billing' },
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('profile')} description={t('profileDescription')} breadcrumbs={breadcrumbs} />

        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent" />
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
            <div className="-mt-10">
              <Avatar className="h-20 w-20 border-4 border-background text-lg">
                <AvatarFallback>{initialsOf(fullName)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1 pt-4 sm:pt-0">
              <h2 className="truncate text-xl font-semibold tracking-tight">{fullName}</h2>
              <p className="truncate text-sm text-muted-foreground">
                {[jobTitle, company].filter(Boolean).join(' · ') || t('role')}
              </p>
            </div>
            <Button variant="outline" type="button" onClick={() => form.setFocus('fullName')}>
              <Pencil className="size-4" />
              {t('editProfile')}
            </Button>
          </div>
          <div className="grid gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4 shrink-0" />
              <span className="truncate">{company || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{location || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              <span className="truncate">
                {t('joined')} {joined.toLocaleDateString(language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('accountDetails')}</CardTitle>
              <CardDescription>{t('profileSettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  {t('fullName')}
                  <Input type="text" {...form.register('fullName')} placeholder={t('fullName')} />
                  {form.formState.errors.fullName && <span className="text-xs text-destructive">{form.formState.errors.fullName.message}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1"><Mail className="size-3.5" />{t('email')}</span>
                  <Input type="email" {...form.register('email')} placeholder={t('email')} />
                  {form.formState.errors.email && <span className="text-xs text-destructive">{form.formState.errors.email.message}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{t('jobTitle')}</span>
                  <Input type="text" {...form.register('jobTitle')} placeholder={t('jobTitle')} />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1"><Building2 className="size-3.5" />{t('company')}</span>
                  <Input type="text" {...form.register('company')} placeholder={t('company')} />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1"><MapPin className="size-3.5" />{t('locations')}</span>
                  <Input type="text" {...form.register('location')} placeholder={t('locations')} />
                </label>
                <div className="flex gap-2 pt-1">
                  <Button type="submit"><Save className="size-4" />{t('saveChanges')}</Button>
                  <Button type="button" variant="outline" onClick={() => form.reset({ fullName, email, jobTitle, company, location })}>{t('resetDefaults')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('activitySummary')}</CardTitle>
              <CardDescription>{t('recentActivity')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {activityRows.map((row) => (
                  <Link key={row.href} to={row.href} className="rounded-lg border border-border p-4 transition-colors hover:bg-muted">
                    <row.icon className="size-5 text-muted-foreground" />
                    <div className="mt-3 text-2xl font-semibold tracking-tight">{row.value}</div>
                    <div className="text-sm text-muted-foreground">{row.label}</div>
                  </Link>
                ))}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">{t('recentOrders')}</h3>
                  <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    {t('viewAll')} <ChevronRight className="size-3.5" />
                  </Link>
                </div>
                <div className="grid gap-2">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0 font-medium tabular-nums">{order.id}</span>
                        <span className="truncate text-muted-foreground">{order.customer}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="tabular-nums">${order.amount.toFixed(2)}</span>
                        <Badge variant={orderStatusTone(order.status)}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {preferenceLinks.map((link) => (
            <Link key={link.href} to={link.href} className="group flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted">
              <div className="min-w-0">
                <div className="text-sm font-medium">{link.title}</div>
                <div className="truncate text-sm text-muted-foreground">{link.description}</div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </main>
    </PageTransition>
  )
}
