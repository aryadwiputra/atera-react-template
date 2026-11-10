import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/data/notifications'
import { listUsers } from '@/lib/data/users'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export function NotificationsPage() { const { language } = useCustomizePreferences(); const t = useTranslations(language); const [items, setItems] = useState(listNotifications()); return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t('notifications')} description={t('workspaceActivityDescription')} actions={<Button variant="outline" onClick={() => { markAllNotificationsRead(); setItems(listNotifications()) }}>{t('markAllRead')}</Button>} /><Card><CardContent className="p-0">{items.map((item) => <button type="button" key={item.id} onClick={() => { markNotificationRead(item.id); setItems(listNotifications()) }} className="flex w-full items-start gap-4 border-b p-4 text-left last:border-0 hover:bg-muted/30"><div className={`mt-1 size-2 rounded-full ${item.read ? 'bg-muted' : 'bg-primary'}`} /><div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.description}</p><p className="mt-1 text-xs text-muted-foreground">{item.time}</p></div></button>)}</CardContent></Card></main></PageTransition> }

export function UsersPage() { const { language } = useCustomizePreferences(); const t = useTranslations(language); const users = listUsers(); return <PageTransition><main className="flex min-h-full flex-col gap-6 p-4 md:p-6"><PageHeader title={t('users')} description={t('usersDescription')} actions={<Button size="sm"><UserPlus className="size-4" />{t('inviteUser')}</Button>} /><Card><CardContent className="p-0">{users.map((user) => <div key={user.id} className="flex items-center gap-4 border-b p-4 last:border-0"><div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">{user.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0 flex-1"><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div><Badge variant="secondary">{user.role}</Badge><span className="hidden text-sm text-muted-foreground sm:inline">{user.status}</span></div>)}</CardContent></Card></main></PageTransition> }


