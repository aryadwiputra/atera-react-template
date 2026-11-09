import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { ErrorPageTemplate } from '@/components/errors/error-page'
import { useTranslations } from '@/i18n'

export default function ForbiddenPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <ErrorPageTemplate
      code="403"
      title={t('accessDenied')}
      description={t('accessDeniedDescription')}
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
