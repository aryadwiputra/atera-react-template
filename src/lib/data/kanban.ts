export type KanbanTask = {
  id: string
  title: string
  assignee: string
  priority: 'low' | 'medium' | 'high'
  columnId: string
}

let tasks: KanbanTask[] = [
  { id: 'TASK-001', title: 'Review onboarding flow', assignee: 'Avery Morgan', priority: 'high', columnId: 'backlog' },
  { id: 'TASK-002', title: 'Prepare Q4 report', assignee: 'Sofia Chen', priority: 'medium', columnId: 'backlog' },
  { id: 'TASK-003', title: 'Update dashboard metrics', assignee: 'Marcus Reed', priority: 'high', columnId: 'in-progress' },
  { id: 'TASK-004', title: 'Customer interviews', assignee: 'Nora Patel', priority: 'low', columnId: 'in-progress' },
  { id: 'TASK-005', title: 'Launch workspace', assignee: 'Avery Morgan', priority: 'medium', columnId: 'done' },
  { id: 'TASK-006', title: 'Invite finance team', assignee: 'Sofia Chen', priority: 'low', columnId: 'done' },
]

export const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
]

export const listTasks = () => [...tasks]

export const moveTask = (taskId: string, columnId: string) => {
  tasks = tasks.map((task) => task.id === taskId ? { ...task, columnId } : task)
}
