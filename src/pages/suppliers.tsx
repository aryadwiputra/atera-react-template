import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function SuppliersPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('suppliers')}
          description={t('suppliersDescription')}
          breadcrumbs={[{ title: t('enterprise'), href: '/suppliers' }, { title: t('suppliers'), href: '/suppliers' }]}
        />
      </main>
    </PageTransition>
  )
}
