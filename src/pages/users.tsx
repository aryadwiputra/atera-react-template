import { createAppColumnHelper, DataTable } from '@/components/shared/data-table'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import type { ColumnDef } from '@tanstack/react-table'
import { tableFeaturesConfig } from '@/components/shared/data-table'
import { MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { userService } from '@/services/user-service'
import type { User } from '@/lib/data/types'
import { cn } from '@/lib/utils'

const helper = createAppColumnHelper<User>()

const roleBadge = (role: User['role']) => {
  switch (role) {
    case 'Admin': return 'bg-primary/10 text-primary'
    case 'Editor': return 'bg-chart-2/10 text-chart-2'
    case 'Moderator': return 'bg-chart-3/10 text-chart-3'
    default: return 'bg-muted text-muted-foreground'
  }
}

const statusBadge = (status: User['status']) => {
  switch (status) {
    case 'Active': return 'bg-status-success/10 text-status-success'
    case 'Invited': return 'bg-status-warning/10 text-status-warning'
    case 'Suspended': return 'bg-destructive/10 text-destructive'
    default: return 'bg-muted text-muted-foreground'
  }
}

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

type StatusTab = 'all' | 'Active' | 'Inactive' | 'Suspended'

export default function UsersPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [items, setItems] = useState(userService.list())
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [statusTab, setStatusTab] = useState<StatusTab>('all')
  const [form, setForm] = useState({ name: '', email: '', role: 'Viewer' as User['role'], department: 'Engineering' })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const refresh = () => setItems(userService.list())
  const filtered = statusTab === 'all' ? items : items.filter((user) => user.status === statusTab)

  const openCreate = () => {
    setForm({ name: '', email: '', role: 'Viewer', department: 'Engineering' })
    setErrors({})
    setCreateOpen(true)
  }

  const openEdit = (user: User) => {
    setForm({ name: user.name, email: user.email, role: user.role, department: user.department })
    setErrors({})
    setEditTarget(user)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = t('invalidName')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('invalidEmail')
    setErrors(next)
    if (Object.keys(next).length > 0) return
    if (editTarget) {
      userService.update(editTarget.id, { name: form.name.trim(), email: form.email.trim(), role: form.role, department: form.department })
      toast({ title: t('userUpdated'), variant: 'success' })
      setEditTarget(null)
    } else {
      userService.create({ name: form.name.trim(), email: form.email.trim(), role: form.role, department: form.department, status: 'Invited' })
      toast({ title: t('userCreated'), variant: 'success' })
      setCreateOpen(false)
    }
    refresh()
  }

  const roleOptions: { value: User['role']; label: string }[] = [
    { value: 'Admin', label: t('admin') },
    { value: 'Editor', label: t('editor') },
    { value: 'Viewer', label: t('viewer') },
    { value: 'Moderator', label: t('moderator') },
  ]

  const columns: ColumnDef<typeof tableFeaturesConfig, User, any>[] = [
    helper.accessor('name', { header: t('name'), cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8"><AvatarFallback className="text-xs">{initials(row.original.name)}</AvatarFallback></Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ) }),
    helper.accessor('role', { header: t('role'), cell: ({ row }) => <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', roleBadge(row.original.role))}>{row.original.role.toLowerCase()}</span> }),
    helper.accessor('department', { header: t('department'), cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.department}</span> }),
    helper.accessor('status', { header: t('status'), cell: ({ row }) => <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', statusBadge(row.original.status))}><span className="size-1.5 rounded-full bg-current" />{row.original.status.toLowerCase()}</span> }),
    helper.accessor('lastActive', { header: t('lastActive'), cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastActive}</span> }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" aria-label={t('edit')}><MoreHorizontal className="size-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(row.original)}><Pencil className="size-4" />{t('edit')}</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(row.original)}><Trash2 className="size-4" />{t('delete')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ) }),
  ]

  const tabs: { value: StatusTab; label: string }[] = [
    { value: 'all', label: t('viewAll') },
    { value: 'Active', label: t('active') },
    { value: 'Inactive', label: t('inactive') },
    { value: 'Suspended', label: t('suspended') },
  ]

  const formFields = (
    <div className="grid gap-3 py-3">
      <div className="grid gap-2 text-sm font-medium">
        {t('name')}
        <Input name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Avery Morgan" />
        {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
      </div>
      <div className="grid gap-2 text-sm font-medium">
        {t('email')}
        <Input name="email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="avery@atera.test" />
        {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
      </div>
      <div className="grid gap-2 text-sm font-medium">
        {t('role')}
        <Select onValueChange={(value) => setForm((current) => ({ ...current, role: value as User['role'] }))} value={form.role}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{roleOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 text-sm font-medium">
        {t('department')}
        <Input name="department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} placeholder="Engineering" />
      </div>
    </div>
  )

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('users')} description={t('usersDescription')} actions={(
          <Button size="sm" onClick={openCreate}>
            <UserPlus className="size-4" />{t('addUser')}
          </Button>
        )} />
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusTab(tab.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                statusTab === tab.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <DataTable columns={columns} data={filtered} filterPlaceholder={t('searchUsers')} renderMobileCard={(user) => (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-8"><AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(user)} aria-label={t('edit')}><Pencil className="size-4" /></Button>
              <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => setConfirmDelete(user)} aria-label={t('delete')}><Trash2 className="size-4" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="text-muted-foreground">{t('role')}</span><span className="font-medium">{user.role}</span>
              <span className="text-muted-foreground">{t('department')}</span><span className="font-medium">{user.department}</span>
              <span className="text-muted-foreground">{t('status')}</span><span className="font-medium">{user.status}</span>
              <span className="text-muted-foreground">{t('lastActive')}</span><span className="font-medium">{user.lastActive}</span>
            </div>
          </div>
        )} />
        <ConfirmDialog
          open={confirmDelete !== null}
          onOpenChange={(open) => !open && setConfirmDelete(null)}
          title={t('deleteUser')}
          description={t('deleteUserDescription')}
          confirmLabel={t('delete')}
          cancelLabel={t('cancel')}
          onConfirm={() => { if (confirmDelete) { userService.remove(confirmDelete.id); refresh(); toast({ title: t('userDeleted'), variant: 'success' }) } }}
          trigger={<span />}
        />
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('newUser')}</DialogTitle>
              <DialogDescription>{t('newUserDescription')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={submit}>
              {formFields}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>{t('cancel')}</Button>
                <Button type="submit">{t('create')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={editTarget !== null} onOpenChange={(open) => !open && setEditTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('editingUser')}</DialogTitle>
              <DialogDescription>{t('newUserDescription')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={submit}>
              {formFields}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>{t('cancel')}</Button>
                <Button type="submit">{t('saveChanges')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  )
}
