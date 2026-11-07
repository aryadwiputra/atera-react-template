import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { chartData, type Translator } from './types'

export function OverviewChart({ t }: { t: Translator }) {
  const [range, setRange] = useState('revenue')
  return <Card className="min-w-0 gap-4 py-5 shadow-none"><CardHeader className="flex-row items-start justify-between px-5"><div><CardTitle className="text-base">{t('overview')}</CardTitle><CardDescription className="mt-1 text-xs">{t('monthlyPerformance')}</CardDescription></div><div className="flex rounded-md border p-0.5">{(['revenue', 'orders', 'profit'] as const).map((item) => <button key={item} type="button" onClick={() => setRange(item)} className={cn('rounded px-2 py-1 text-[11px] text-muted-foreground transition-colors', range === item && 'bg-muted font-medium text-foreground')}>{t(item)}</button>)}</div></CardHeader><CardContent className="px-5"><div className="flex h-56 items-end gap-2 border-b border-l px-2 pt-6 pb-0 sm:gap-4">{chartData.map((height, index) => <div key={index} className="flex h-full flex-1 items-end"><div className="w-full rounded-t-sm bg-foreground/80 transition-all hover:bg-foreground" style={{ height: `${height}%` }} /></div>)}</div><div className="mt-2 flex justify-between pl-2 text-[10px] text-muted-foreground">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month) => <span key={month}>{month}</span>)}</div></CardContent></Card>
}
