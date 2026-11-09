import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function WizardPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState('')
  const [emails, setEmails] = useState('')
  const [error, setError] = useState('')

  const nextStep = () => {
    if (step === 1 && !company.trim()) {
      setError(t('companyNameRequired'))
      return
    }
    if (step === 2 && !emails.trim()) {
      setError(t('inviteEmailsRequired'))
      return
    }
    setError('')
    setStep((prev) => Math.min(3, prev + 1))
  }

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('workspaceSetup')} description={t('wizardDescription')} />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-sm transition-colors',
                    step >= item ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {step > item ? <Check className="size-4" /> : item}
                </div>
              ))}
            </div>
            <CardTitle className="pt-4">
              {step === 1 ? t('companyStep') : step === 2 ? t('teamStep') : t('readyStep')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('companyName')}</label>
                <Input value={company} onChange={(event) => { setCompany(event.target.value); setError('') }} placeholder={t('companyNamePlaceholder')} />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('inviteEmails')}</label>
                <Input value={emails} onChange={(event) => { setEmails(event.target.value); setError('') }} placeholder={t('inviteEmailsPlaceholder')} />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Check className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{company}</p>
                    <p className="text-xs text-muted-foreground">{t('companyName')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Check className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{emails.split(',').filter((item) => item.trim()).length} {t('invitedMembers')}</p>
                    <p className="text-xs text-muted-foreground">{emails}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => { setStep((prev) => prev - 1); setError('') }}>
                  {t('back')}
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={nextStep}>{t('continue')}</Button>
              ) : (
                <Button onClick={() => setStep(1)}>{t('finish')}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
