import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Translator } from './types'

const goals = [
  ['revenueTarget', '$38,420 / $50,000', '77%'],
  ['newCustomers', '184 / 250', '74%'],
  ['conversionRate', '3.8% / 5.0%', '76%'],
] as const

export function GoalsCard({ t }: { t: Translator }) {
  return <Card className="gap-5 py-5 shadow-none"><CardHeader className="flex-row items-center justify-between px-5"><div><CardTitle className="text-base">{t('monthlyGoals')}</CardTitle><CardDescription className="mt-1 text-xs">{t('trackProgress')}</CardDescription></div><Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-4" /></Button></CardHeader><CardContent className="space-y-5 px-5">{goals.map(([label, value, progress]) => <div key={label} className="space-y-2"><div className="flex justify-between text-xs"><span>{t(label)}</span><span className="text-muted-foreground">{progress}</span></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: progress }} /></div><p className="text-[11px] text-muted-foreground">{value}</p></div>)}</CardContent></Card>
}
