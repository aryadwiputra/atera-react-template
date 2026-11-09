import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/shared/toast'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function SettingsProfilePage() {
  const { session } = useAuth()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [name, setName] = useState(session?.name ?? '')
  const [email, setEmail] = useState(session?.email ?? '')

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('profile')} description={t('profileSettingsDescription')} />
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{t('profileInformation')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="grid gap-2 text-sm font-medium">
              {t('name')}
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {t('email')}
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <Button onClick={() => toast({ title: t('changesSaved'), variant: 'success' })}>{t('saveChanges')}</Button>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
