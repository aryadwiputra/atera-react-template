import { ListX, SearchX, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

export type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyTableState({ onClear }: { onClear?: () => void }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <EmptyState
      icon={ListX}
      title={t('noMatches')}
      action={onClear ? <Button variant="outline" size="sm" onClick={onClear}>{t('clear')}</Button> : undefined}
    />
  )
}

export function NoSearchResultsState({ query }: { query?: string }) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <EmptyState
      icon={SearchX}
      title={t('noSearchResults')}
      description={query ? `${t('noSearchResultsFor')} "${query}"` : t('noSearchResultsDescription')}
    />
  )
}
