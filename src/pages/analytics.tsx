import { Activity, DollarSign, Users, Zap } from 'lucide-react'
import { ChartArea } from '@/components/charts/chart-area'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { ChartCard } from '@/components/charts/chart-config'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

const trend = [
  { month: 'Jan', revenue: 32, users: 18 },
  { month: 'Feb', revenue: 41, users: 24 },
  { month: 'Mar', revenue: 38, users: 29 },
  { month: 'Apr', revenue: 55, users: 36 },
  { month: 'May', revenue: 62, users: 42 },
  { month: 'Jun', revenue: 74, users: 51 },
]

const channels = [
  { name: 'Organic', value: 42 },
  { name: 'Direct', value: 28 },
  { name: 'Referral', value: 18 },
  { name: 'Social', value: 12 },
]

const bars = [
  { name: 'Mon', value: 32 },
  { name: 'Tue', value: 48 },
  { name: 'Wed', value: 39 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 54 },
  { name: 'Sat', value: 28 },
  { name: 'Sun', value: 35 },
]

export default function AnalyticsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('analytics')} description={t('analyticsDescription')} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t('totalRevenue')} value="$48,295" change="+12.5%" icon={DollarSign} />
          <StatCard title={t('activeUsers')} value="2,847" change="+8.2%" icon={Users} />
          <StatCard title={t('engagementRate')} value="68.4%" change="+4.6%" icon={Activity} />
          <StatCard title={t('conversionRate')} value="7.8%" change="+1.9%" icon={Zap} />
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <ChartCard title={t('performanceTrend')} description={t('revenueAndUsersOverTime')}>
            <ChartArea data={trend} dataKey="revenue" xKey="month" />
          </ChartCard>
          <ChartCard title={t('acquisitionChannels')} description={t('whereVisitorsComeFrom')}>
            <ChartPie data={channels} innerRadius={70} />
            <PieLegend data={channels} />
          </ChartCard>
        </div>
        <ChartCard title={t('weeklyActivity')} description={t('eventsThisWeek')}>
          <ChartBar data={bars} dataKey="value" xKey="name" />
        </ChartCard>
      </main>
    </PageTransition>
  )
}
