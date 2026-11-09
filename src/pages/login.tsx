import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useAuth } from '@/hooks/use-auth'
import { getDemoCredentials, signIn } from '@/lib/auth'
import { notifyAuthChanged } from '@/hooks/use-auth'
import { useTranslations } from '@/i18n'

export default function LoginPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(getDemoCredentials().email)
  const [password, setPassword] = useState(getDemoCredentials().password)
  const [showPassword, setShowPassword] = useState(false)
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

  return <div className="w-full max-w-sm space-y-6">
    <div><h1 className="text-2xl font-semibold tracking-tight">{t('loginTitle')}</h1><p className="mt-2 text-sm text-muted-foreground">{t('loginDescription')}</p></div>
    <form className="space-y-4" onSubmit={submit}>
      <label className="space-y-2 text-sm font-medium"><span>{t('emailAddress')}</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label className="space-y-2 text-sm font-medium"><span>{t('password')}</span><div className="relative"><Input className="pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button className="w-full" disabled={loading}>{loading && <LoaderCircle className="size-4 animate-spin" />}{t('logIn')}</Button>
    </form>
    <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground"><strong className="text-foreground">{t('demoAccess')}</strong><p className="mt-1">{t('signInDemo')}</p></div>
    <p className="text-center text-sm text-muted-foreground">{t('noAccount')} <Link className="font-medium text-foreground underline-offset-4 hover:underline" to="/sign-up">{t('signUp')}</Link></p>
  </div>
}
