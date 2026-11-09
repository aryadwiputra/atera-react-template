import { Link } from 'react-router'
import { CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function SettingsBillingPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('billing')} description={t('billingSettingsDescription')} />
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{t('currentPlan')}</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted"><CreditCard className="size-5" /></div>
              <div>
                <p className="text-sm font-medium">Pro</p>
                <p className="text-xs text-muted-foreground">{t('billedMonthly')}</p>
              </div>
            </div>
            <Button asChild variant="outline"><Link to="/pricing">{t('upgrade')}</Link></Button>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
