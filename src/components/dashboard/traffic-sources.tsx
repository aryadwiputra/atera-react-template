import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Translator } from './types'

const sources = [{ label: 'direct', value: '35%', width: '35%' }, { label: 'organicSearch', value: '28%', width: '28%' }, { label: 'referral', value: '22%', width: '22%' }, { label: 'social', value: '15%', width: '15%' }] as const

export function TrafficSources({ t }: { t: Translator }) {
  return <Card className="gap-5 py-5 shadow-none"><CardHeader className="px-5"><CardTitle className="text-base">{t('trafficSources')}</CardTitle><CardDescription className="text-xs">{t('visitorSources')}</CardDescription></CardHeader><CardContent className="space-y-5 px-5"><div className="text-3xl font-semibold tracking-tight">284K <span className="text-xs font-normal text-muted-foreground">{t('visits')}</span></div><div className="flex h-2 overflow-hidden rounded-full bg-muted">{sources.map((source, index) => <div key={source.label} className={cn('h-full', index % 2 === 0 ? 'bg-foreground' : 'bg-foreground/45')} style={{ width: source.width }} />)}</div><div className="space-y-3">{sources.map((source, index) => <div key={source.label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-muted-foreground"><span className={cn('size-2 rounded-full', index % 2 === 0 ? 'bg-foreground' : 'bg-foreground/45')} />{t(source.label)}</span><span className="font-medium text-foreground">{source.value}</span></div>)}</div></CardContent></Card>
}
