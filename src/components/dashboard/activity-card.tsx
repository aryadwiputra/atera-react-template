import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { activities, type Translator } from './types'

export function ActivityCard({ t }: { t: Translator }) {
  return <Card className="gap-5 py-5 shadow-none"><CardHeader className="flex-row items-center justify-between px-5"><div><CardTitle className="text-base">{t('recentActivity')}</CardTitle><CardDescription className="mt-1 text-xs">{t('latestUpdates')}</CardDescription></div><Button variant="ghost" size="sm" className="h-7 text-xs">{t('viewAll')}</Button></CardHeader><CardContent className="space-y-5 px-5">{activities.map(({ title, description, detail, time }) => <div key={title} className="flex gap-3"><div className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted"><Check className="size-3.5" /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium">{t(title)}</p><p className="mt-0.5 truncate text-[11px] text-muted-foreground">{detail ? `${detail} ${t(description)}` : t(description)}</p></div><span className="text-2xs text-muted-foreground">{time}</span></div>)}</CardContent></Card>
}
