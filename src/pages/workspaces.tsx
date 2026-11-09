import { Check, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/data/notifications'
import { listUsers } from '@/lib/data/users'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export function NotificationsPage() { const [items, setItems] = useState(listNotifications()); return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title="Notifications" description="Stay up to date with workspace activity." actions={<Button variant="outline" onClick={() => { markAllNotificationsRead(); setItems(listNotifications()) }}>Mark all read</Button>} /><Card><CardContent className="p-0">{items.map((item) => <button type="button" key={item.id} onClick={() => { markNotificationRead(item.id); setItems(listNotifications()) }} className="flex w-full items-start gap-4 border-b p-4 text-left last:border-0 hover:bg-muted/30"><div className={`mt-1 size-2 rounded-full ${item.read ? 'bg-muted' : 'bg-primary'}`} /><div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.description}</p><p className="mt-1 text-xs text-muted-foreground">{item.time}</p></div></button>)}</CardContent></Card></main></PageTransition> }

export function UsersPage() { const users = listUsers(); return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title="Users" description="Manage workspace members and permissions." actions={<Button size="sm"><UserPlus className="size-4" />Invite user</Button>} /><Card><CardContent className="p-0">{users.map((user) => <div key={user.id} className="flex items-center gap-4 border-b p-4 last:border-0"><div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">{user.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0 flex-1"><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div><Badge variant="secondary">{user.role}</Badge><span className="hidden text-sm text-muted-foreground sm:inline">{user.status}</span></div>)}</CardContent></Card></main></PageTransition> }

export function ProfilePage() { const { language } = useCustomizePreferences(); const t = useTranslations(language); return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t('profile')} description="Manage your personal information and account preferences." /><Card className="max-w-2xl"><CardHeader><CardTitle>Personal information</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Full name<Input defaultValue="Demo User" /></label><label className="grid gap-2 text-sm font-medium">Email<Input defaultValue="demo@example.com" type="email" /></label><label className="grid gap-2 text-sm font-medium sm:col-span-2">Role<Input defaultValue="Administrator" disabled /></label><Button className="sm:col-span-2"><Check className="size-4" />Save changes</Button></CardContent></Card></main></PageTransition> }
