import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { chartData, type Translator } from './types'

export function OverviewChart({ t }: { t: Translator }) {
  return (
    <div className={cn('flex h-full flex-col gap-4 rounded-[--radius-lg] border bg-card p-5 shadow-none')}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-base">{t('overview')}</CardTitle>
          <CardDescription className="mt-1 text-xs">{t('monthlyPerformance')}</CardDescription>
        </div>
        <div className="flex gap-1 rounded-md border p-0.5">
          {(['revenue', 'orders', 'profit'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className="rounded px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(item)}
            </button>
          ))}
        </div>
      </div>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis tickLine={false} axisLine={false} width={32} tickMargin={8} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Area dataKey="value" type="monotone" stroke="var(--chart-1)" fill="url(#overviewGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  )
}
