import type { ReactNode } from 'react'
import AppLogo from '@/components/app-logo'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-sm lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div className="text-primary-foreground"><AppLogo /></div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] opacity-70">{t('ateraWorkspace')}</p>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight">{t('authBrandTitle')}</h1>
            <p className="mt-5 max-w-md text-sm leading-6 opacity-75">{t('authBrandDescription')}</p>
          </div>
          <p className="text-xs opacity-60">{t('ateraAdminPlatform')}</p>
        </div>
        <div className="flex min-h-[560px] items-center justify-center p-6 sm:p-10">{children}</div>
      </div>
    </main>
  )
}
