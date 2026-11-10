import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { SocialAuthButtons } from '@/components/shared/auth-controls'
import AppLogo from '@/components/app-logo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { notifyAuthChanged, useAuth } from '@/hooks/use-auth'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { getDemoCredentials, signIn, signUp } from '@/lib/auth'

function BrandPanel() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <aside className="hidden flex-1 flex-col justify-between border-r bg-muted/30 p-10 lg:flex">
      <AppLogo />
      <div className="max-w-md space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">{t('authBrandTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('authBrandDescription')}</p>
      </div>
    </aside>
  )
}

export function LoginV2Page() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(getDemoCredentials().email)
  const [password, setPassword] = useState(getDemoCredentials().password)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = signIn(email, password)
    if (!result.ok) {
      setError(t(result.message))
      setLoading(false)
      return
    }
    notifyAuthChanged()
    navigate(destination, { replace: true })
  }

  return (
    <div className="flex min-h-svh">
      <BrandPanel />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('loginTitle')}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t('loginDescription')}</p>
          </div>
          <form className="space-y-5" onSubmit={submit}>
            <label className="space-y-2 text-sm font-medium">
              <span>{t('emailAddress')}</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>{t('password')}</span>
              <div className="relative">
                <Input
                  className="pr-10"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
                {t('rememberMe')}
              </label>
              <Link
                className="text-sm font-medium underline-offset-4 hover:underline"
                to="/forgot-password"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button className="w-full" disabled={loading}>
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              {t('logIn')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link className="font-medium text-foreground underline-offset-4 hover:underline" to="/sign-up">
              {t('signUp')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export function RegisterV2Page() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const form = useForm<z.infer<typeof signUpSchema>>({ resolver: zodResolver(signUpSchema) })

  const submit = (values: z.infer<typeof signUpSchema>) => {
    const result = signUp(values)
    if (!result.ok) {
      setError(result.message)
      return
    }
    notifyAuthChanged()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-svh">
      <BrandPanel />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('createYourAccount')}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t('createAccountDescription')}</p>
          </div>
          <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
            <label className="grid gap-2 text-sm font-medium">
              {t('name')}
              <Input {...form.register('name')} placeholder={t('enterYourName')} />
              {form.formState.errors.name && (
                <span className="text-xs text-destructive">{t('enterName')}</span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {t('email')}
              <Input type="email" {...form.register('email')} placeholder="you@example.com" />
              {form.formState.errors.email && (
                <span className="text-xs text-destructive">{t('enterValidEmail')}</span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {t('password')}
              <Input type="password" {...form.register('password')} placeholder={t('atLeast8Chars')} />
            </label>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button className="mt-2 w-full">{t('createAccount')}</Button>
          </form>
          <SocialAuthButtons />
          <p className="text-center text-sm text-muted-foreground">
            {t('haveAccount')}{' '}
            <Link className="font-medium text-foreground underline-offset-4 hover:underline" to="/login">
              {t('logIn')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
