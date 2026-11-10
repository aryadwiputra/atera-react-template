import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function AssetsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('assets')}
          description={t('assetsDescription')}
          breadcrumbs={[{ title: t('enterprise'), href: '/assets' }, { title: t('assets'), href: '/assets' }]}
        />
      </main>
    </PageTransition>
  )
}
