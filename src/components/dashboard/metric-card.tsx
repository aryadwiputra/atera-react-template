import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Metric, Translator } from './types'

export function MetricCard({ metric, t }: { metric: Metric; t: Translator }) {
  return <Card className="gap-3 py-5 shadow-none"><CardHeader className="gap-0 px-5"><CardDescription className="text-xs">{t(metric.label)}</CardDescription><CardTitle className="mt-2 text-2xl tracking-tight">{metric.value}</CardTitle></CardHeader><CardContent className="px-5"><div className={cn('flex items-center gap-1 text-xs font-medium', metric.positive ? 'text-foreground' : 'text-muted-foreground')}>{metric.positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}<span>{metric.change}</span><span className="font-normal text-muted-foreground">{t('vsLastMonth')}</span></div></CardContent></Card>
}
