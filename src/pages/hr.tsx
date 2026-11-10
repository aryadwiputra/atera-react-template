import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function HrPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('hr')}
          description={t('hrDescription')}
          breadcrumbs={[{ title: t('enterprise'), href: '/hr' }, { title: t('hr'), href: '/hr' }]}
        />
      </main>
    </PageTransition>
  )
}
