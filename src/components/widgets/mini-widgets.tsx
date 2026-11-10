import { TrendingDown, TrendingUp } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { getChartColor } from '@/components/charts/chart-config'
import { cn } from '@/lib/utils'

export type SparklineCardProps = {
  title: string
  value: string
  data: { value: number }[]
  colorIndex?: number
  className?: string
}

export function SparklineCard({ title, value, data, colorIndex = 0, className }: SparklineCardProps) {
  const color = getChartColor(colorIndex)
  return (
    <Card className={cn('gap-3 overflow-hidden py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <div className="-mx-5 -mb-5">
          <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <Area dataKey="value" type="monotone" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export type ProgressRingCardProps = {
  title: string
  value: number
  label: string
  colorIndex?: number
  className?: string
}

export function ProgressRingCard({ title, value, label, colorIndex = 0, className }: ProgressRingCardProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const circumference = 2 * Math.PI * 42
  const color = getChartColor(colorIndex)
  return (
    <Card className={cn('gap-3 py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative size-28">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - clamped / 100)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tracking-tight">{clamped}%</span>
        </div>
      </CardContent>
    </Card>
  )
}

export type KpiDeltaCardProps = {
  title: string
  value: string
  delta: number
  suffix?: string
  className?: string
}

export function KpiDeltaCard({ title, value, delta, suffix, className }: KpiDeltaCardProps) {
  const positive = delta >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <Card className={cn('gap-3 py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            positive ? 'bg-status-success/10 text-status-success' : 'bg-destructive/10 text-destructive'
          )}
        >
          <Icon className="size-3" />
          {positive ? '+' : ''}{delta}%{suffix ? ` ${suffix}` : ''}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}
