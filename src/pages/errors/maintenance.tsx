import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { ErrorPageTemplate } from '@/components/errors/error-page'
import { useTranslations } from '@/i18n'

export default function MaintenancePage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <ErrorPageTemplate
      code="maintenance"
      title={t('underMaintenance')}
      description={t('maintenanceDescription')}
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
