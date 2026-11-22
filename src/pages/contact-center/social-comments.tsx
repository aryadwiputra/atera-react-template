import { AtSign, Camera, Heart, Music2, Play, Search, Send, ThumbsUp, type LucideIcon } from 'lucide-react'
import { useReducer, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import type { SocialComment, SocialPlatform } from '@/lib/data/types'
import { socialCommentService } from '@/services/social-comment-service'

const platforms: SocialPlatform[] = ['instagram', 'facebook', 'x', 'tiktok', 'youtube']

const platformConfig: Record<SocialPlatform, { label: string; icon: LucideIcon; className: string }> = {
  instagram: { label: 'Instagram', icon: Camera, className: 'text-chart-1' },
  facebook: { label: 'Facebook', icon: ThumbsUp, className: 'text-chart-2' },
  x: { label: 'X', icon: AtSign, className: 'text-foreground' },
  tiktok: { label: 'TikTok', icon: Music2, className: 'text-chart-3' },
  youtube: { label: 'YouTube', icon: Play, className: 'text-destructive' },
}

const statusOptions = ['all', 'new', 'replied', 'hidden'] as const

const statusLabels: Record<(typeof statusOptions)[number], 'allChannels' | 'newLabel' | 'repliedLabel' | 'hiddenLabel'> = {
  all: 'allChannels',
  new: 'newLabel',
  replied: 'repliedLabel',
  hidden: 'hiddenLabel',
}

const statusBadge: Record<string, string> = {
  new: '',
  replied: 'bg-status-success/15 text-success',
  hidden: 'bg-muted text-muted-foreground',
}

export default function SocialCommentsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [, force] = useReducer((x: number) => x + 1, 0)
  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState<SocialPlatform | 'all'>('all')
  const [status, setStatus] = useState<string>('all')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const query = search.trim().toLowerCase()
  const comments = socialCommentService.list()
  const matches = (c: SocialComment) =>
    !query || c.username.toLowerCase().includes(query) || c.text.toLowerCase().includes(query)

  const visible = comments.filter(
    (c) => (channel === 'all' || c.platform === channel) && (status === 'all' || c.status === status) && matches(c),
  )

  const countFor = (p: SocialPlatform) =>
    comments.filter((c) => c.platform === p && (status === 'all' || c.status === status) && matches(c)).length


  const submitReply = (id: string) => {
    if (!draft.trim()) return
    socialCommentService.reply(id, draft.trim())
    setDraft('')
    setReplyTo(null)
    force()
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('socialComments')} description={t('socialCommentsDescription')} />
        <Card className="overflow-hidden">
          <div className="grid min-h-[560px] md:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="flex flex-col gap-4 border-b bg-muted/20 p-4 md:border-r md:border-b-0">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} className="pl-8" />
              </div>
              <nav className="flex flex-col gap-1">
                {(['all', ...platforms] as const).map((p) => {
                  const active = channel === p
                  const config = p === 'all' ? null : platformConfig[p]
                  const Icon = config?.icon
                  const label = p === 'all' ? t('allChannels') : platformConfig[p].label
                  const count = p === 'all' ? comments.filter((c) => (status === 'all' || c.status === status) && matches(c)).length : countFor(p)
                  return (
                    <button
                      key={p}
                      onClick={() => setChannel(p)}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                        active ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                      )}
                    >
                      {Icon && <Icon className={cn('size-4', config?.className)} />}
                      <span className="flex-1 text-left">{label}</span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </button>
                  )
                })}
              </nav>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full" aria-label={t('status')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(statusLabels[s])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </aside>
            <section className="flex flex-col gap-4 p-4 md:p-6">
              {visible.length === 0 && (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">{t('noResults')}</div>
              )}
              {visible.map((comment) => {
                const platform = platformConfig[comment.platform]
                const Icon = platform.icon
                return (
                  <div key={comment.id} className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="text-xs">{comment.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{comment.username}</span>
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Icon className={cn('size-3', platform.className)} />
                            {platform.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{comment.text}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="size-3.5" />
                            {comment.likes}
                          </span>
                          <Badge className={cn('text-xs', statusBadge[comment.status])}>{t(statusLabels[comment.status])}</Badge>
                        </div>
                        {comment.reply && (
                          <div className="ml-10 mt-3 border-l pl-3">
                            <span className="text-xs font-medium">You</span>
                            <p className="text-sm text-muted-foreground">{comment.reply.text}</p>
                            <span className="text-xs text-muted-foreground">{comment.reply.time}</span>
                          </div>
                        )}
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setDraft('') }}>
                            {t('reply')}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { socialCommentService.toggleHidden(comment.id); force() }}>
                            {comment.status === 'hidden' ? t('unhide') : t('hide')}
                          </Button>
                        </div>
                        {replyTo === comment.id && (
                          <div className="mt-3 flex gap-2">
                            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t('replyPlaceholder')} onKeyDown={(e) => { if (e.key === 'Enter') submitReply(comment.id) }} />
                            <Button size="sm" onClick={() => submitReply(comment.id)} aria-label={t('send')}>
                              <Send className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
          </div>
        </Card>
      </main>
    </PageTransition>
  )
}
