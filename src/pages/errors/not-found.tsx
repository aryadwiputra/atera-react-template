import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { ErrorPageTemplate } from '@/components/errors/error-page'
import { useTranslations } from '@/i18n'

export default function NotFoundPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <ErrorPageTemplate
      code="404"
      title={t('pageNotFound')}
      description={t('pageNotFoundDescription')}
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
