import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

export default function SettingsNotificationsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ orders: true, reports: true, news: false })

  const items = [
    { id: 'orders', label: t('orderUpdates'), description: t('orderUpdatesDescription') },
    { id: 'reports', label: t('weeklyReport'), description: t('weeklyReportsDescription') },
    { id: 'news', label: t('productNews'), description: t('productNewsDescription') },
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('notifications')} description={t('notificationsSettingsDescription')} />
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{t('emailNotifications')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled[item.id]}
                  onClick={() => setEnabled((current) => ({ ...current, [item.id]: !current[item.id] }))}
                  className={cn(
                    'inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors',
                    enabled[item.id] ? 'bg-primary' : 'bg-input',
                  )}
                >
                  <span className={cn('pointer-events-none block size-5 rounded-full bg-background shadow transition-transform', enabled[item.id] ? 'translate-x-5' : 'translate-x-0.5')} />
                </button>
              </div>
            ))}
            <Button variant="outline">{t('saveChanges')}</Button>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
