import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartArea } from '@/components/charts/chart-area'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartLine } from '@/components/charts/chart-line'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { ChartRadar } from '@/components/charts/chart-radar'
import { ChartRadialBar } from '@/components/charts/chart-radial-bar'
import { ChartScatter } from '@/components/charts/chart-scatter'
import { ChartTreemap } from '@/components/charts/chart-treemap'
import { ChartComposed } from '@/components/charts/chart-composed'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

const areaData = [
  { name: 'Jan', value: 42 }, { name: 'Feb', value: 56 }, { name: 'Mar', value: 48 }, { name: 'Apr', value: 68 },
  { name: 'May', value: 60 }, { name: 'Jun', value: 78 }, { name: 'Jul', value: 66 }, { name: 'Aug', value: 88 },
  { name: 'Sep', value: 75 }, { name: 'Oct', value: 96 }, { name: 'Nov', value: 84 }, { name: 'Dec', value: 100 },
]
const barData = [
  { name: 'Mon', value: 32 }, { name: 'Tue', value: 48 }, { name: 'Wed', value: 39 }, { name: 'Thu', value: 61 },
  { name: 'Fri', value: 54 }, { name: 'Sat', value: 28 }, { name: 'Sun', value: 35 },
]
const lineData = [
  { name: 'Jan', revenue: 32, users: 18 }, { name: 'Feb', revenue: 41, users: 24 }, { name: 'Mar', revenue: 38, users: 29 },
  { name: 'Apr', revenue: 55, users: 36 }, { name: 'May', revenue: 62, users: 42 }, { name: 'Jun', revenue: 74, users: 51 },
]
const pieData = [
  { name: 'Direct', value: 42 }, { name: 'Search', value: 31 }, { name: 'Referral', value: 17 }, { name: 'Social', value: 10 },
]
const radarData = [
  { subject: 'Sales', value: 82 }, { subject: 'Marketing', value: 68 }, { subject: 'Development', value: 91 },
  { subject: 'Support', value: 74 }, { subject: 'Operations', value: 60 }, { subject: 'Design', value: 87 },
]
const radialBarData = [
  { name: 'Target', value: 82 }, { name: 'Growth', value: 64 }, { name: 'Reach', value: 48 },
]
const scatterData = [
  { x: 30, y: 45, z: 120 }, { x: 42, y: 62, z: 90 }, { x: 55, y: 51, z: 140 }, { x: 63, y: 78, z: 110 },
  { x: 71, y: 66, z: 160 }, { x: 84, y: 89, z: 130 }, { x: 92, y: 74, z: 100 },
]
const treemapData = [
  { name: 'Search', size: 1200 }, { name: 'Direct', size: 850 }, { name: 'Social', size: 640 }, { name: 'Email', size: 480 },
  { name: 'Referral', size: 320 }, { name: 'Ads', size: 210 },
]
const composedData = [
  { name: 'Jan', revenue: 32, profit: 18 }, { name: 'Feb', revenue: 41, profit: 22 }, { name: 'Mar', revenue: 38, profit: 20 },
  { name: 'Apr', revenue: 55, profit: 31 }, { name: 'May', revenue: 62, profit: 36 }, { name: 'Jun', revenue: 74, profit: 42 },
]

export default function ChartsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('charts')} description={t('chartsDescription')} />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>{t('chartArea')}</CardTitle></CardHeader>
            <CardContent><ChartArea data={areaData} dataKey="value" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartBar')}</CardTitle></CardHeader>
            <CardContent><ChartBar data={barData} dataKey="value" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartLine')}</CardTitle></CardHeader>
            <CardContent><ChartLine data={lineData} dataKeys={['revenue', 'users']} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartPie')}</CardTitle></CardHeader>
            <CardContent className="space-y-3"><ChartPie data={pieData} /><PieLegend data={pieData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartRadar')}</CardTitle></CardHeader>
            <CardContent><ChartRadar data={radarData} dataKey="value" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartRadialBar')}</CardTitle></CardHeader>
            <CardContent><ChartRadialBar data={radialBarData} dataKey="value" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartTreemap')}</CardTitle></CardHeader>
            <CardContent><ChartTreemap data={treemapData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartScatter')}</CardTitle></CardHeader>
            <CardContent><ChartScatter data={scatterData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('chartComposed')}</CardTitle></CardHeader>
            <CardContent><ChartComposed data={composedData} barKeys={['revenue']} lineKeys={['profit']} /></CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  )
}
