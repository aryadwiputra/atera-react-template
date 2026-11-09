import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function HomePage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <section>
      <h1>{t('ateraSpa')}</h1>
    </section>
  )
}
