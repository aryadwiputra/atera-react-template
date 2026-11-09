import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useToast } from '@/components/shared/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import type { Translator } from '@/i18n'

const contactSchema = z.object({
  name: z.string().min(2, 'nameRequired'),
  email: z.string().email('invalidEmail'),
  message: z.string().min(10, 'messageRequired'),
})

type ContactValues = z.infer<typeof contactSchema>

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}

function InputVariantsSection({ t }: { t: Translator }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('inputVariants')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label={t('text')}>
          <Input placeholder={t('text')} />
        </Field>
        <Field label={t('disabled')}>
          <Input disabled placeholder={t('disabled')} />
        </Field>
        <Field label={t('readOnly')}>
          <Input readOnly value="Read only" />
        </Field>
      </CardContent>
    </Card>
  )
}

function SelectSection({ t }: { t: Translator }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('selectOption')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Field label={t('selectOption')}>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t('selectAnOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">{t('optionOne')}</SelectItem>
              <SelectItem value="two">{t('optionTwo')}</SelectItem>
              <SelectItem value="three">{t('optionThree')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  )
}

function ValidationSection({ t }: { t: Translator }) {
  const { toast } = useToast()
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = () => {
    toast({ title: t('validationPassed'), variant: 'success' })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('validation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label={t('name')} error={form.formState.errors.name?.message}>
            <Input {...form.register('name')} placeholder={t('name')} />
          </Field>
          <Field label={t('email')} error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register('email')} placeholder={t('email')} />
          </Field>
          <Field label={t('message')} error={form.formState.errors.message?.message}>
            <Input {...form.register('message')} placeholder={t('message')} />
          </Field>
          <Button type="submit">{t('submit')}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function FileUploadSection({ t }: { t: Translator }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('fileUpload')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"
          onClick={() => inputRef.current?.click()}
        >
          <p>{t('dragDropFile')}</p>
          <p>
            {t('browse')} — {fileName ?? t('noFileSelected')}
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default function FormsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return (
    <PageTransition>
      <main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('forms')} description={t('formsDescription')} />
      </main>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputVariantsSection t={t} />
        <SelectSection t={t} />
        <ValidationSection t={t} />
        <FileUploadSection t={t} />
      </div>
    </PageTransition>
  )
}
