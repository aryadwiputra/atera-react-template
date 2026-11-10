import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2, LoaderCircle, LockKeyhole, MailCheck } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { PasswordInput, SocialAuthButtons } from '@/components/shared/auth-controls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { notifyAuthChanged, useAuth } from '@/hooks/use-auth'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { signIn, signUp } from '@/lib/auth'

function AuthForm({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <div className="w-full max-w-sm space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
      <Link className="flex items-center justify-center gap-2 text-sm font-medium underline-offset-4 hover:underline" to="/login">
        <ArrowLeft className="size-4" />
        {t('backToSignIn')}
      </Link>
    </div>
  )
}

const signUpSchema = z.object({ name: z.string().min(2, 'enterName'), email: z.string().email(), password: z.string().min(8) })

export function SignUpPage() {
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof signUpSchema>>({ resolver: zodResolver(signUpSchema) })
  const submit = (values: z.infer<typeof signUpSchema>) => {
    setLoading(true)
    setError('')
    const result = signUp(values)
    if (!result.ok) {
      setError(t(result.message))
      setLoading(false)
      return
    }
    notifyAuthChanged()
    navigate('/dashboard', { replace: true })
  }
  return (
    <AuthForm title={t('createYourAccount')} description={t('createAccountDescription')}>
      <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
        <label className="grid gap-2 text-sm font-medium">
          {t('name')}
          <Input {...form.register('name')} placeholder={t('enterYourName')} />
          {form.formState.errors.name && <span className="text-xs text-destructive">{t('enterName')}</span>}
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t('email')}
          <Input type="email" {...form.register('email')} placeholder="you@example.com" />
          {form.formState.errors.email && <span className="text-xs text-destructive">{t('enterValidEmail')}</span>}
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t('password')}
          <PasswordInput {...form.register('password')} placeholder={t('atLeast8Chars')} />
        </label>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button className="mt-2 w-full" disabled={loading}>
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {t('createAccount')}
        </Button>
      </form>
      <SocialAuthButtons />
    </AuthForm>
  )
}

const emailSchema = z.object({ email: z.string().email() })

export function ForgotPasswordPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [sent, setSent] = useState(false)
  const form = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) })
  return (
    <AuthForm title={t('forgotPasswordTitle')} description={t('enterEmailResetLink')}>
      {sent ? (
        <SuccessState icon={<MailCheck className="size-8" />} title={t('checkYourInbox')} description={t('resetLinkSent')} />
      ) : (
        <form className="space-y-5" onSubmit={form.handleSubmit(() => setSent(true))}>
          <label className="grid gap-2 text-sm font-medium">
            {t('email')}
            <Input type="email" {...form.register('email')} placeholder="you@example.com" />
          </label>
          <Button className="mt-2 w-full">{t('sendResetLink')}</Button>
        </form>
      )}
    </AuthForm>
  )
}

export function ResetPasswordPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [saved, setSaved] = useState(false)
  const schema = z
    .object({ password: z.string().min(8), confirm: z.string().min(8) })
    .refine((value) => value.password === value.confirm, { path: ['confirm'] })
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  return (
    <AuthForm title={t('resetPassword')} description={t('chooseNewPassword')}>
      {saved ? (
        <SuccessState icon={<CheckCircle2 className="size-8" />} title={t('passwordUpdated')} description={t('passwordResetSuccess')} />
      ) : (
        <form className="space-y-5" onSubmit={form.handleSubmit(() => setSaved(true))}>
          <label className="grid gap-2 text-sm font-medium">
            {t('newPassword')}
            <PasswordInput {...form.register('password')} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {t('confirmPassword')}
            <PasswordInput {...form.register('confirm')} />
          </label>
          <Button className="mt-2 w-full">{t('updatePassword')}</Button>
        </form>
      )}
    </AuthForm>
  )
}

function SuccessState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
      <div className="text-primary">{icon}</div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function TwoFactorPage() {
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  const setDigit = (index: number, raw: string) => {
    const chars = raw.replace(/\D/g, '').split('')
    if (chars.length === 0) {
      setDigits((current) => current.map((value, position) => (position === index ? '' : value)))
      return
    }
    setDigits((current) => {
      const next = [...current]
      for (const [offset, char] of chars.entries()) {
        if (index + offset > 5) break
        next[index + offset] = char
      }
      return next
    })
    const target = Math.min(index + chars.length, 5)
    inputs.current[target]?.focus()
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
      return
    }
    if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < 5) inputs.current[index + 1]?.focus()
  }

  const submit = () => {
    setLoading(true)
    setTimeout(() => navigate('/dashboard', { replace: true }), 300)
  }

  return (
    <AuthForm title={t('twoFactor')} description={t('enterSixDigitCode')}>
      <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); if (digits.every(Boolean)) submit() }}>
        <div className="flex justify-between gap-2" onPaste={(event) => { event.preventDefault(); setDigit(0, event.clipboardData.getData('text')) }}>
          {digits.map((digit, index) => (
            <Input
              key={index}
              ref={(element) => { inputs.current[index] = element }}
              className="h-12 w-full text-center text-lg"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={(event) => event.target.select()}
            />
          ))}
        </div>
        <Button className="mt-2 w-full" disabled={!digits.every(Boolean) || loading}>
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {t('verifyCode')}
        </Button>
      </form>
    </AuthForm>
  )
}

export function VerifyEmailPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <AuthForm title={t('verifyYourEmail')} description={t('verifyYourEmailDescription')}>
      <SuccessState icon={<MailCheck className="size-8" />} title={t('verificationEmailSent')} description={t('checkInboxVerification')} />
      <Button className="w-full" variant="outline">
        {t('resendEmail')}
      </Button>
    </AuthForm>
  )
}

export function LockScreenPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const form = useForm<{ password: string }>()
  return (
    <AuthForm title={t('welcomeBack')} description={t('lockScreenDescription')}>
      <form className="space-y-5" onSubmit={form.handleSubmit((values) => {
        setLoading(true)
        setError('')
        const result = signIn(session?.email ?? '', values.password)
        if (!result.ok) {
          setError(t(result.message))
          setLoading(false)
          return
        }
        navigate('/dashboard', { replace: true })
      })}>
        <div className="flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <LockKeyhole className="size-6" />
          </div>
        </div>
        <PasswordInput placeholder={t('password')} {...form.register('password', { required: true })} />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button className="mt-2 w-full" disabled={loading}>
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {t('unlock')}
        </Button>
      </form>
    </AuthForm>
  )
}
