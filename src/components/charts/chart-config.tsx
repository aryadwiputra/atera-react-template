import type { ReactNode } from 'react'
import { CartesianGrid } from 'recharts'
import { cn } from '@/lib/utils'

export const chartColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const
export type ChartColor = (typeof chartColors)[number]

export interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function ChartCard({ title, description, children, actions, className }: ChartCardProps) {
  return (
    <div className={cn('flex h-full flex-col gap-3 rounded-[--radius-lg] border bg-card p-5 shadow-none', className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium leading-none tracking-tight">{title}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export function baseChartProps(data?: Record<string, number>[]) {
  return { data, width: '100%', height: 280 } as const
}

export function ChartGrid({ horizontal = true, vertical = false }: { horizontal?: boolean; vertical?: boolean }) {
  return <CartesianGrid horizontal={horizontal} vertical={vertical} strokeDasharray="3 3" className="stroke-border" />
}

export function getChartColor(index: number): ChartColor {
  return chartColors[index % chartColors.length]
}

export function range(min: number, max: number, step: number): Array<number> {
  const stepLen = Math.ceil((max - min) / step)
  return Array.from({ length: stepLen + 1 }, (_, i) => min + i * step)
}
