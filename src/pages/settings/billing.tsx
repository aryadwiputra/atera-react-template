import { ArrowLeft, CreditCard } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function SettingsBillingPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return (
    <div className="space-y-4">
      <div className="min-w-0">
        <Link to="/settings" className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          {t('back')}
        </Link>
        <h2 className="text-lg font-semibold">{t('billing')}</h2>
        <p className="text-sm text-muted-foreground">{t('billingSettingsDescription')}</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t('currentPlan')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Pro</p>
              <p className="text-xs text-muted-foreground">{t('billedMonthly')}</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/pricing">{t('upgrade')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
