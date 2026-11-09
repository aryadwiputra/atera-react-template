import { Link } from 'react-router'
import { ArrowRight, BarChart3, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type TranslationKey } from '@/i18n'

export default function AppPlaceholder({ title, description, route }: { title: string; description?: string; route?: string }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const label = title as TranslationKey
  return <PageTransition><main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t(label)} description={description ?? t('pageDescription')} /><div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><BarChart3 className="size-5 text-muted-foreground" /><CardTitle className="mt-2 text-base">Workspace overview</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Your {t(label).toLowerCase()} workspace is ready for data and workflows.</p></CardContent></Card><Card><CardHeader><CheckCircle2 className="size-5 text-muted-foreground" /><CardTitle className="mt-2 text-base">Built for clarity</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Use this area to monitor progress, collaborate, and take action.</p></CardContent></Card><Card><CardHeader><ArrowRight className="size-5 text-muted-foreground" /><CardTitle className="mt-2 text-base">Next step</CardTitle></CardHeader><CardContent>{route ? <Button asChild variant="outline" size="sm"><Link to={route}>Open related view</Link></Button> : <p className="text-sm text-muted-foreground">Connect your workspace data to continue.</p>}</CardContent></Card></div></main></PageTransition>
}
