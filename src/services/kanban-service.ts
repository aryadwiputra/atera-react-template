import { columns, listTasks, moveTask } from '@/lib/data/kanban'
import type { KanbanTask } from '@/lib/data/kanban'

export interface KanbanService {
  listTasks(): KanbanTask[]
  moveTask(taskId: string, columnId: string): void
  columns: { id: string; title: string }[]
}

export const kanbanService: KanbanService = {
  listTasks,
  moveTask,
  columns,
}
