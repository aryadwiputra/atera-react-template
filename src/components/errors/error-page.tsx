import { Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

interface ErrorPageProps {
  code: string
  title: string
  description: string
  homeHref?: string
  backHref?: string
  onRetry?: () => void
}

export function ErrorPageTemplate({ code, title, description, homeHref, backHref, onRetry }: ErrorPageProps) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-6xl font-semibold tracking-tight">{code}</p>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-3">
        {homeHref && <Button asChild variant="outline"><a href={homeHref}>{t('goHome')}</a></Button>}
        {backHref && <Button asChild variant="outline"><a href={backHref}>{t('goBack')}</a></Button>}
        {onRetry && <Button onClick={onRetry}><RefreshCw className="size-4" />{t('retry')}</Button>}
      </div>
      <Home className="size-8 text-muted-foreground" />
    </div>
  )
}
