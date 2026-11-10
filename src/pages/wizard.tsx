import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useToast } from '@/components/shared/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const wizardSchema = z.object({
  projectName: z.string().min(1),
  projectType: z.enum(['Web App', 'Mobile', 'Desktop']),
  inviteEmails: z.string().refine((value) => value.split(',').some((item) => item.trim().length > 0)),
  visibility: z.enum(['Public', 'Private']),
  notificationsEnabled: z.boolean(),
})

type WizardValues = z.input<typeof wizardSchema>

const stepFields = [
  ['projectName', 'projectType'],
  ['inviteEmails'],
  ['visibility', 'notificationsEnabled'],
] as const

export default function WizardPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      projectName: '',
      projectType: 'Web App',
      inviteEmails: '',
      visibility: 'Private',
      notificationsEnabled: true,
    },
  })
  const values = form.watch()

  const goToStep = async (target: number) => {
    if (target > step) {
      const valid = await form.trigger(stepFields[step - 1] as never)
      if (!valid) return
    }
    setStep(target)
  }

  const startOver = () => {
    form.reset()
    setStep(1)
  }

  const finish = () => {
    toast({ title: t('projectSetup'), description: values.projectName, variant: 'success' })
    startOver()
  }

  const summaryRows = [
    { label: t('projectName'), value: values.projectName },
    { label: t('projectType'), value: values.projectType },
    { label: t('inviteTeam'), value: values.inviteEmails },
    {
      label: t('preferences'),
      value: `${values.visibility === 'Public' ? t('public') : t('private')} · ${values.notificationsEnabled ? t('notificationsEnabled') : ''}`,
    },
  ]

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('wizardTitle')} description={t('projectSetupDescription')} />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((item) => (
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
              {step === 1 ? t('projectDetails') : step === 2 ? t('teamSetup') : step === 3 ? t('preferences') : t('review')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('projectName')}</label>
                <Input {...form.register('projectName')} placeholder={t('projectName')} />
                {form.formState.errors.projectName && <p className="text-xs text-destructive">{t('projectName')}</p>}
                <label className="text-sm font-medium">{t('projectType')}</label>
                <Select value={values.projectType} onValueChange={(value) => form.setValue('projectType', value as 'Web App' | 'Mobile' | 'Desktop')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web App">Web App</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('inviteTeam')}</label>
                <Input {...form.register('inviteEmails')} placeholder="a@x.com, b@x.com" />
                {form.formState.errors.inviteEmails && <p className="text-xs text-destructive">{t('inviteTeam')}</p>}
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('public')} / {t('private')}</label>
                <Select value={values.visibility} onValueChange={(value) => form.setValue('visibility', value as 'Public' | 'Private')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">{t('public')}</SelectItem>
                    <SelectItem value="Private">{t('private')}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notificationsEnabled"
                    checked={values.notificationsEnabled}
                    onCheckedChange={(checked) => form.setValue('notificationsEnabled', checked === true)}
                  />
                  <label htmlFor="notificationsEnabled" className="text-sm font-medium">{t('notificationsEnabled')}</label>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-3">
                {summaryRows.map((row) => (
                  <div key={row.label} className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-medium">{row.value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  {t('back')}
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={() => void goToStep(step + 1)}>{t('nextStep')}</Button>
              ) : (
                <Button onClick={finish}>{t('finish')}</Button>
              )}
              <Button variant="ghost" onClick={startOver}>
                {t('startOver')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
