import { CheckCircle2, FolderKanban, ListChecks, Users } from 'lucide-react'
import { ChartBar } from '@/components/charts/chart-bar'
import { ChartCard } from '@/components/charts/chart-config'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const taskCompletion = [
  { name: 'Mon', value: 18 },
  { name: 'Tue', value: 26 },
  { name: 'Wed', value: 31 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 15 },
  { name: 'Sat', value: 8 },
  { name: 'Sun', value: 6 },
]

type ProjectStatus = 'onTrack' | 'atRisk' | 'delayed'

const projects: Array<{
  name: string
  progress: number
  team: string[]
  dueDate: string
  status: ProjectStatus
}> = [
  {
    name: 'Website Redesign',
    progress: 82,
    team: ['AK', 'JD', 'MS'],
    dueDate: 'Nov 18, 2026',
    status: 'onTrack',
  },
  {
    name: 'Mobile App v2',
    progress: 47,
    team: ['RB', 'TD', 'AK', 'JL'],
    dueDate: 'Dec 01, 2026',
    status: 'atRisk',
  },
  {
    name: 'API Migration',
    progress: 93,
    team: ['MS', 'JD'],
    dueDate: 'Nov 12, 2026',
    status: 'onTrack',
  },
  {
    name: 'Customer Portal',
    progress: 34,
    team: ['RB', 'AK', 'JL'],
    dueDate: 'Dec 15, 2026',
    status: 'delayed',
  },
  {
    name: 'Marketing Site',
    progress: 100,
    team: ['TD', 'MS'],
    dueDate: 'Oct 30, 2026',
    status: 'onTrack',
  },
]

const statusStyles: Record<ProjectStatus, string> = {
  onTrack: 'bg-status-success/15 text-status-success',
  atRisk: 'bg-status-warning/15 text-status-warning',
  delayed: 'bg-status-danger/15 text-status-danger',
}

function initialsColor(index: number) {
  const colors = [
    'bg-chart-1/20 text-chart-1',
    'bg-chart-2/20 text-chart-2',
    'bg-chart-3/20 text-chart-3',
    'bg-chart-4/20 text-chart-4',
    'bg-chart-5/20 text-chart-5',
  ]
  return colors[index % colors.length]
}

export default function ProjectManagementPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('projectManagement')} description={t('projectManagementDescription')} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t('activeProjects')} value="12" change="+2" icon={FolderKanban} />
          <StatCard title={t('totalTasks')} value="148" change="+24" icon={ListChecks} />
          <StatCard title={t('completedTasks')} value="96" change="+18" icon={CheckCircle2} />
          <StatCard title={t('teamMembers')} value="8" change="+1" icon={Users} />
        </div>
        <ChartCard title={t('taskCompletion')} description={t('taskCompletionDescription')}>
          <ChartBar data={taskCompletion} dataKey="value" xKey="name" />
        </ChartCard>
        <Card className="gap-4 shadow-none">
          <CardHeader>
            <CardTitle>{t('projects')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-2 py-3 font-medium">{t('project')}</th>
                    <th className="px-2 py-3 font-medium">{t('progress')}</th>
                    <th className="px-2 py-3 font-medium">{t('team')}</th>
                    <th className="px-2 py-3 font-medium">{t('dueDate')}</th>
                    <th className="px-2 py-3 font-medium">{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.name} className="border-b last:border-0">
                      <td className="px-2 py-3 font-medium">{project.name}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex -space-x-2">
                          {project.team.map((member, index) => (
                            <span
                              key={member}
                              className={cn(
                                'flex size-7 items-center justify-center rounded-full border-2 border-background text-2xs font-semibold',
                                initialsColor(index),
                              )}
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-3">{project.dueDate}</td>
                      <td className="px-2 py-3">
                        <Badge variant="outline" className={statusStyles[project.status]}>
                          {t(project.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
