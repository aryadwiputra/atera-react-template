import { useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import type { Department } from '@/lib/data/types'
import { departmentService } from '@/services/department-service'

export default function SettingsDepartmentsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [departments, setDepartments] = useState(() => departmentService.list())
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', description: '', head: '', memberCount: 0 })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const refresh = () => setDepartments(departmentService.list())

  const query = search.trim().toLowerCase()
  const filtered = departments.filter(
    (department) =>
      !query ||
      department.name.toLowerCase().includes(query) ||
      department.head.toLowerCase().includes(query) ||
      department.description.toLowerCase().includes(query),
  )

  const openCreate = () => {
    setForm({ name: '', description: '', head: '', memberCount: 0 })
    setErrors({})
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (department: Department) => {
    setForm({ name: department.name, description: department.description, head: department.head, memberCount: department.memberCount })
    setErrors({})
    setEditing(department)
    setDialogOpen(true)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = t('name')
    if (!form.head.trim()) next.head = t('head')
    if (!Number.isFinite(form.memberCount) || form.memberCount < 0) next.memberCount = t('memberCount')
    setErrors(next)
    if (Object.keys(next).length > 0) return
    const input = { name: form.name.trim(), description: form.description.trim(), head: form.head.trim(), memberCount: form.memberCount }
    if (editing) {
      departmentService.update(editing.id, input)
      toast({ title: t('departmentUpdated'), variant: 'success' })
    } else {
      departmentService.create(input)
      toast({ title: t('departmentCreated'), variant: 'success' })
    }
    refresh()
    setDialogOpen(false)
    setEditing(null)
  }

  const remove = (department: Department) => {
    departmentService.remove(department.id)
    toast({ title: t('departmentDeleted'), variant: 'success' })
    refresh()
    setDeleteTarget(null)
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{t('departments')}</h2>
          <p className="text-sm text-muted-foreground">{t('departmentsDescriptionLong')}</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          {t('addDepartment')}
        </Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} className="pl-8" />
      </div>
      <Card className="py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('head')}</TableHead>
                <TableHead className="text-center">{t('members')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('created')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">{t('noDepartments')}</TableCell>
                </TableRow>
              ) : (
                filtered.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{department.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{department.description}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{department.head}</TableCell>
                    <TableCell className="text-center text-sm tabular-nums">{department.memberCount}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{department.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-8" aria-label={t('edit')} onClick={() => openEdit(department)}>
                          <Pencil className="size-4" />
                        </Button>
                        <ConfirmDialog
                          open={deleteTarget?.id === department.id}
                          onOpenChange={(open) => !open && setDeleteTarget(null)}
                          title={`${t('delete')} ${department.name}`}
                          description={t('departmentDeleteConfirm')}
                          confirmLabel={t('delete')}
                          cancelLabel={t('cancel')}
                          onConfirm={() => remove(department)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:text-destructive"
                              aria-label={t('delete')}
                              onClick={(event) => {
                                event.stopPropagation()
                                setDeleteTarget(department)
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('editDepartment') : t('addDepartment')}</DialogTitle>
            <DialogDescription>{t('departmentsDescription')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-3">
            <label className="grid gap-1.5 text-sm font-medium">
              {t('name')}
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Engineering" />
              {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              {t('head')}
              <Input value={form.head} onChange={(event) => setForm((current) => ({ ...current, head: event.target.value }))} placeholder="Olivia Martin" />
              {errors.head && <span className="text-xs text-destructive">{errors.head}</span>}
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              {t('members')}
              <Input
                type="number"
                min={0}
                value={form.memberCount}
                onChange={(event) => setForm((current) => ({ ...current, memberCount: Number(event.target.value) }))}
              />
              {errors.memberCount && <span className="text-xs text-destructive">{errors.memberCount}</span>}
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              {t('description')}
              <Textarea rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
              <Button type="submit">{t('save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
