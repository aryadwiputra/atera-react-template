import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { ErrorPageTemplate } from '@/components/errors/error-page'
import { useTranslations } from '@/i18n'

export default function ComingSoonPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <ErrorPageTemplate
      code="coming soon"
      title={t('comingSoon')}
      description={t('comingSoonDescription')}
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
