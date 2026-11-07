import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ActivityCard } from '@/components/dashboard/activity-card'
import { GoalsCard } from '@/components/dashboard/goals-card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { TrafficSources } from '@/components/dashboard/traffic-sources'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { metrics } from '@/components/dashboard/types'

export default function DashboardPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return <div className="min-h-full bg-background"><main className="dashboard-content flex w-full flex-col p-4 md:p-6"><div className="flex items-end justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">{t('dashboard')}</h1><p className="mt-1 text-sm text-muted-foreground">{t('welcome')}</p></div><Button size="sm" className="hidden gap-1.5 md:inline-flex"><Plus className="size-4" />{t('newOrder')}</Button></div><div className="dashboard-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} t={t} />)}</div><div className="dashboard-section grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><OverviewChart t={t} /><TrafficSources t={t} /></div><div className="dashboard-section grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><RecentOrders t={t} /><div className="space-y-4"><GoalsCard t={t} /><ActivityCard t={t} /></div></div></main></div>
}
