import { Activity, DollarSign, Server, Users } from 'lucide-react'
import { ChartArea } from '@/components/charts/chart-area'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { ChartCard } from '@/components/charts/chart-config'
import { StatCard } from '@/components/shared/stat-card'
import { ProgressRingCard, SparklineCard, KpiDeltaCard } from '@/components/widgets/mini-widgets'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type TranslationKey } from '@/i18n'

const sparkData = [
  { value: 12 }, { value: 18 }, { value: 15 }, { value: 24 },
  { value: 21 }, { value: 32 }, { value: 29 }, { value: 38 },
]

const badgeVariants = ['default', 'secondary', 'destructive', 'outline'] as const

const progressItems: { key: TranslationKey; value: number }[] = [
  { key: 'storageUsed', value: 72 },
  { key: 'monthlyBandwidth', value: 48 },
  { key: 'teamSeats', value: 90 },
]

const avatarPeople = [
  { initials: 'AM', name: 'Avery Morgan' },
  { initials: 'SC', name: 'Sofia Chen' },
  { initials: 'MR', name: 'Marcus Reed' },
  { initials: 'LW', name: 'Lily Wong' },
  { initials: 'JK', name: 'Jonas Klein' },
]

const areaTrend = [
  { month: 'Jan', value: 24 },
  { month: 'Feb', value: 35 },
  { month: 'Mar', value: 30 },
  { month: 'Apr', value: 46 },
  { month: 'May', value: 52 },
  { month: 'Jun', value: 68 },
]

const weeklyBars = [
  { name: 'Mon', value: 32 },
  { name: 'Tue', value: 48 },
  { name: 'Wed', value: 39 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 54 },
  { name: 'Sat', value: 28 },
  { name: 'Sun', value: 35 },
]

const trafficSources = [
  { name: 'Organic', value: 42 },
  { name: 'Direct', value: 28 },
  { name: 'Referral', value: 18 },
  { name: 'Social', value: 12 },
]

export default function WidgetsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('widgets')} description={t('widgetsDescription')} />
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('statCards')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title={t('totalRevenue')} value="$48,295" change="+12.5%" icon={DollarSign} />
            <StatCard title={t('activeUsers')} value="2,847" change="+8.2%" icon={Users} />
            <StatCard title={t('engagementRate')} value="68.4%" change="+4.6%" icon={Activity} />
            <StatCard title={t('serverUptime')} value="99.9%" change="-0.1%" changePositive={false} icon={Server} />
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('miniWidgets')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SparklineCard title={t('weeklyVisitors')} value="12,847" data={sparkData} />
            <SparklineCard title={t('newSignups')} value="1,204" data={[...sparkData].reverse()} colorIndex={1} />
            <ProgressRingCard title={t('storageUsed')} value={72} label="840 GB / 1 TB" colorIndex={2} />
            <KpiDeltaCard title={t('conversionRate')} value="4.6%" delta={12.5} />
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('progressBars')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {progressItems.map((item) => (
              <div key={item.key} className="space-y-2 rounded-[--radius-lg] border bg-card p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t(item.key)}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('badges')}</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-[--radius-lg] border bg-card p-5">
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {t(variant === 'default' ? 'statusActive' : variant === 'secondary' ? 'statusPending' : variant === 'destructive' ? 'statusFailed' : 'statusDraft')}
              </Badge>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('avatars')}</h2>
          <div className="flex flex-wrap items-center gap-2 rounded-[--radius-lg] border bg-card p-5">
            {avatarPeople.map((person) => (
              <Avatar key={person.initials} className="border bg-muted" title={person.name}>
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('miniCharts')}</h2>
          <div className="grid gap-4 xl:grid-cols-3">
            <ChartCard title={t('visitorsOverTime')} description={t('visitorsOverTimeDescription')}>
              <ChartArea data={areaTrend} dataKey="value" xKey="month" />
            </ChartCard>
            <ChartCard title={t('weeklyActivity')} description={t('eventsThisWeek')}>
              <ChartBar data={weeklyBars} dataKey="value" xKey="name" />
            </ChartCard>
            <ChartCard title={t('acquisitionChannels')} description={t('whereVisitorsComeFrom')}>
              <ChartPie data={trafficSources} innerRadius={70} />
              <PieLegend data={trafficSources} />
            </ChartCard>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
