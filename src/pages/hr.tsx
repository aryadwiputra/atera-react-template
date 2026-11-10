import type { ColumnDef } from '@tanstack/react-table'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { useToast } from '@/components/shared/toast'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pencil, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { createEmployee, listEmployees, listOpenPositions, updateEmployee } from '@/lib/data/hr'
import type { Employee, EmployeeStatus } from '@/lib/data/types'
import { cn } from '@/lib/utils'

const statusBadge: Record<EmployeeStatus, string> = {
  Active: 'bg-status-success/15 text-status-success',
  'On Leave': 'bg-status-warning/15 text-status-warning',
  Remote: 'bg-chart-1/15 text-chart-1',
  Offboarded: 'bg-muted text-muted-foreground',
}

const statuses: EmployeeStatus[] = ['Active', 'On Leave', 'Remote', 'Offboarded']

type FormState = Pick<Employee, 'name' | 'position' | 'department' | 'email' | 'startDate' | 'status'>

const emptyForm: FormState = {
  name: '',
  position: '',
  department: '',
  email: '',
  startDate: new Date().toISOString().slice(0, 10),
  status: 'Active',
}

export default function HrPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const [employees, setEmployees] = useState(listEmployees)
  const [openPositions] = useState(listOpenPositions)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const refresh = () => setEmployees(listEmployees())

  const headcount = employees.filter((employee) => employee.status !== 'Offboarded').length
  const onLeave = employees.filter((employee) => employee.status === 'On Leave').length

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (employee: Employee) => {
    setEditing(employee)
    const { id: _id, ...rest } = employee
    setForm(rest)
    setFormOpen(true)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (form.name.trim() === '' || form.email.trim() === '') return
    if (editing) {
      updateEmployee(editing.id, form)
    } else {
      createEmployee(form)
    }
    toast({ title: t('employeeSaved'), description: form.name, variant: 'success' })
    refresh()
    setFormOpen(false)
  }

  const helper = createAppColumnHelper<Employee>()
  const columns: ColumnDef<typeof tableFeaturesConfig, Employee, any>[] = [
    helper.accessor('name', { cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('position', { header: t('positionLabel') }),
    helper.accessor('department', { header: t('department') }),
    helper.accessor('email', { header: t('email') }),
    helper.accessor('startDate', { header: t('startDate') }),
    helper.accessor('status', { header: t('employeeStatus'), cell: (info) => (
      <Badge className={cn('border-transparent', statusBadge[info.getValue() as EmployeeStatus])}>{info.getValue()}</Badge>
    ) }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" className="size-8" aria-label={t('edit')} onClick={() => openEdit(row.original)}><Pencil className="size-4" /></Button>
      </div>
    ) }),
  ]

  const summary = [
    {
      title: t('headcount'),
      value: String(headcount),
      icon: Users,
      description: t('hrDescription'),
      change: '',
    },
    {
      title: t('onLeaveToday'),
      value: String(onLeave),
      icon: Users,
      description: t('onLeaveToday'),
      change: '',
    },
    {
      title: t('openPositionsCount'),
      value: String(openPositions.length),
      icon: Users,
      description: t('openPositions'),
      change: '',
    },
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('hr')}
          description={t('hrDescription')}
          actions={<Button size="sm" onClick={openCreate}><Plus className="size-4" />{t('addEmployee')}</Button>}
          breadcrumbs={[{ title: t('enterprise'), href: '/hr' }, { title: t('hr'), href: '/hr' }]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summary.map((card) => (
            <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} description={card.description} change={card.change} />
          ))}
        </div>
        <DataTable columns={columns} data={employees} filterPlaceholder={t('search')} />
        <Card>
          <CardHeader>
            <CardTitle>{t('openPositions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">{t('positionLabel')}</th>
                  <th className="pb-2 font-medium">{t('department')}</th>
                  <th className="pb-2 text-right font-medium">{t('applicants')}</th>
                  <th className="pb-2 text-right font-medium">{t('postedAt')}</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((position) => (
                  <tr key={position.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{position.title}</td>
                    <td className="py-2">{position.department}</td>
                    <td className="py-2 text-right tabular-nums">{position.applicants}</td>
                    <td className="py-2 text-right tabular-nums">{position.postedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('edit') : t('addEmployee')}</DialogTitle>
            <DialogDescription>{t('hrDescription')}</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium">
              {t('employeeName')}
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('positionLabel')}
                <Input value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('department')}
                <Input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              {t('email')}
              <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('startDate')}
                <Input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('employeeStatus')}
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as EmployeeStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
              <Button type="submit">{editing ? t('saveChanges') : t('addEmployee')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
