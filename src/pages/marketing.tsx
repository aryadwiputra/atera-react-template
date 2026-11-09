import { Eye, Megaphone, MoreHorizontal, MousePointerClick, Target } from 'lucide-react'
import { ChartArea } from '@/components/charts/chart-area'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartCard } from '@/components/charts/chart-config'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const visits = [
  { month: 'May', visits: 482 },
  { month: 'Jun', visits: 560 },
  { month: 'Jul', visits: 631 },
  { month: 'Aug', visits: 598 },
  { month: 'Sep', visits: 714 },
  { month: 'Oct', visits: 842 },
]

const channelRoi = [
  { name: 'Search', value: 38 },
  { name: 'Social', value: 24 },
  { name: 'Email', value: 19 },
  { name: 'Display', value: 12 },
  { name: 'Affiliate', value: 9 },
]

type CampaignStatus = 'active' | 'paused' | 'ended'

const campaigns: Array<{
  name: string
  status: CampaignStatus
  budget: string
  roi: string
}> = [
  { name: 'Spring Product Launch', status: 'active', budget: '$12,400', roi: '4.8x' },
  { name: 'Newsletter Referral Drive', status: 'active', budget: '$3,200', roi: '2.6x' },
  { name: 'Retargeting — Q3', status: 'paused', budget: '$8,750', roi: '1.9x' },
  { name: 'Influencer Collab Series', status: 'active', budget: '$15,000', roi: '3.2x' },
  { name: 'Holiday Banner Refresh', status: 'ended', budget: '$5,900', roi: '1.4x' },
]

const statusStyles: Record<CampaignStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  ended: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400',
}

export default function MarketingPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('marketing')} description={t('marketingDescription')} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={t('totalCampaigns')}
            value="24"
            change="+3"
            description={t('thisMonth')}
            icon={Megaphone}
          />
          <StatCard title={t('impressions')} value="1.2M" change="+9.4%" icon={Eye} />
          <StatCard title={t('clicks')} value="86K" change="+12.1%" icon={MousePointerClick} />
          <StatCard title={t('conversions')} value="4,218" change="+6.8%" icon={Target} />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title={t('campaignPerformance')} description={t('campaignPerformanceDescription')}>
            <ChartArea data={visits} dataKey="visits" xKey="month" />
          </ChartCard>
          <ChartCard title={t('channelRoi')} description={t('channelRoiDescription')}>
            <ChartBar data={channelRoi} dataKey="value" xKey="name" />
          </ChartCard>
        </div>
        <Card className="gap-4 shadow-none">
          <CardHeader>
            <CardTitle>{t('campaigns')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-2 py-3 font-medium">{t('campaign')}</th>
                    <th className="px-2 py-3 font-medium">{t('status')}</th>
                    <th className="px-2 py-3 font-medium">{t('budget')}</th>
                    <th className="px-2 py-3 font-medium">{t('roi')}</th>
                    <th className="px-2 py-3 font-medium">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.name} className="border-b last:border-0">
                      <td className="px-2 py-3 font-medium">{campaign.name}</td>
                      <td className="px-2 py-3">
                        <Badge variant="outline" className={cn('capitalize', statusStyles[campaign.status])}>
                          {t(campaign.status)}
                        </Badge>
                      </td>
                      <td className="px-2 py-3">{campaign.budget}</td>
                      <td className="px-2 py-3">{campaign.roi}</td>
                      <td className="px-2 py-3">
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">{t('actions')}</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
