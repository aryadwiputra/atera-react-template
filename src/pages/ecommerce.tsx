import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChartArea } from '@/components/charts/chart-area'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { ChartCard } from '@/components/charts/chart-config'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

const revenueData = [
  { name: 'Jan', value: 58 }, { name: 'Feb', value: 71 }, { name: 'Mar', value: 64 }, { name: 'Apr', value: 82 },
  { name: 'May', value: 78 }, { name: 'Jun', value: 94 }, { name: 'Jul', value: 89 }, { name: 'Aug', value: 106 },
  { name: 'Sep', value: 98 }, { name: 'Oct', value: 114 }, { name: 'Nov', value: 121 }, { name: 'Dec', value: 138 },
]

const channelData = [
  { name: 'Store', value: 42 }, { name: 'Marketplace', value: 31 }, { name: 'Social', value: 17 }, { name: 'Wholesale', value: 10 },
]

const weeklyBars = [
  { name: 'Mon', value: 45 }, { name: 'Tue', value: 61 }, { name: 'Wed', value: 52 }, { name: 'Thu', value: 73 },
  { name: 'Fri', value: 68 }, { name: 'Sat', value: 34 }, { name: 'Sun', value: 29 },
]

export default function EcommercePage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('ecommerce')}
          description={t('salesPerformanceDescription')}
          actions={<Button size="sm"><Plus className="size-4" />{t('addReport')}</Button>}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t('revenue')} value="$84,290" change="+12.5%" />
          <StatCard title={t('orders')} value="1,284" change="+8.1%" />
          <StatCard title={t('conversionRate')} value="4.82%" change="+0.4%" />
          <StatCard title={t('refunds')} value="$2,481" change="-2.3%" changePositive={false} />
        </div>
        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <ChartCard title={t('performanceOverview')}>
            <ChartArea data={revenueData} dataKey="value" />
          </ChartCard>
          <ChartCard title={t('channelMix')}>
            <ChartPie data={channelData} />
            <PieLegend data={channelData} />
          </ChartCard>
        </div>
        <ChartCard title={t('weeklyOrders')}>
          <ChartBar data={weeklyBars} dataKey="value" />
        </ChartCard>
      </main>
    </PageTransition>
  )
}
