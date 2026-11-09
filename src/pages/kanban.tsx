import { Plus } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { columns, listTasks, moveTask } from '@/lib/data/kanban'

export default function KanbanPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [tasks, setTasks] = useState(listTasks())

  const handleDrop = (taskId: string, columnId: string) => {
    moveTask(taskId, columnId)
    setTasks(listTasks())
  }

  const priorityColor = { high: 'bg-destructive/15 text-destructive', medium: 'bg-muted text-muted-foreground', low: 'bg-muted/50 text-muted-foreground' } as const
  const priorityLabel = { high: 'highPriority', medium: 'mediumPriority', low: 'lowPriority' } as const

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('kanban')} description={t('kanbanDescription')} actions={<Button size="sm"><Plus className="size-4" />{t('addTask')}</Button>} />
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.columnId === column.id)
            return (
              <Card key={column.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{column.title}</h2>
                    <Badge variant="secondary">{columnTasks.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileDrag={{ scale: 1.03, zIndex: 10, boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.2)' }}
                        drag
                        dragSnapToOrigin
                        className="cursor-grab rounded-lg border bg-background p-4 active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{task.title}</p>
                          <Badge variant="outline" className={cn('shrink-0 text-[10px]', priorityColor[task.priority])}>{t(priorityLabel[task.priority])}</Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{task.assignee}</p>
                        <div className="mt-3 flex gap-1">
                          {columns.filter((col) => col.id !== task.columnId).map((col) => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => handleDrop(task.id, col.id)}
                              className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              title={col.title}
                            >
                              {col.title} →
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                        {t('dragHere')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </PageTransition>
  )
}
