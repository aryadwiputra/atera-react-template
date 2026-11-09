import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { ErrorPageTemplate } from '@/components/errors/error-page'
import { useTranslations } from '@/i18n'

export default function ServerErrorPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <ErrorPageTemplate
      code="500"
      title={t('somethingWentWrong')}
      description={t('serverErrorDescription')}
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
