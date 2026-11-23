import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SettingCard({ icon: Icon, title, description, href, actionLabel }: { icon: LucideIcon; title: string; description: string; href: string; actionLabel: string }) {
  return (
    <Link to={href} className={cn('group block h-full focus-visible:outline-none')}>
      <Card className="flex h-full flex-row items-center gap-4 p-4 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>
        </div>
        <span aria-hidden="true" title={actionLabel} className="flex size-8 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:border-primary/40 group-hover:text-primary">
          <ArrowRight className="size-4" />
        </span>
      </Card>
    </Link>
  )
}
