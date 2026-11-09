import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatCardProps = {
  title: string
  value: string
  change: string
  changePositive?: boolean
  icon?: LucideIcon
  description?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('gap-3 py-5 shadow-none', className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className={cn('font-medium', changePositive ? 'text-foreground' : 'text-destructive')}>{change}</span>
          <span className="ml-1">{description ?? 'vs last month'}</span>
        </p>
      </CardContent>
    </Card>
  )
}
