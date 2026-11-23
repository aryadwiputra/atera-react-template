import { AtSign, Camera, Clock, Heart, MapPin, MessageSquare, Music2, Play, Search, Send, ThumbsUp, Users, type LucideIcon } from 'lucide-react'
import { useReducer, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type Translator } from '@/i18n'
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

type CommentDetailPanelProps = {
  comment: SocialComment | null
  draft: string
  onDraftChange: (value: string) => void
  onSubmit: (id: string) => void
  onToggleHidden: (id: string) => void
  t: Translator
}

function CommentDetailPanel({ comment, draft, onDraftChange, onSubmit, onToggleHidden, t }: CommentDetailPanelProps) {
  if (!comment) {
    return (
      <aside className="hidden flex-col border-l bg-muted/10 xl:flex">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold">{t('commentDetails')}</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <MessageSquare className="text-muted-foreground size-10" />
          <p className="text-muted-foreground text-sm">{t('selectComment')}</p>
        </div>
      </aside>
    )
  }

  const platform = platformConfig[comment.platform]
  const Icon = platform.icon
  const rows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: MapPin, label: t('location'), value: comment.location },
    { icon: Users, label: t('followers'), value: comment.followers },
    { icon: Clock, label: t('joined'), value: comment.joined },
  ]

  return (
    <aside className="chat-scroll hidden min-h-0 flex-col overflow-y-auto border-l bg-muted/10 xl:flex">
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <h2 className="text-sm font-semibold">{t('commentDetails')}</h2>
        <Badge className={cn('text-xs', statusBadge[comment.status])}>{t(statusLabels[comment.status])}</Badge>
      </div>
      <div className="flex flex-col items-center gap-2 px-4 py-5 text-center">
        <Avatar className="size-14">
          <AvatarFallback className="text-base font-semibold">{comment.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold">{comment.username}</p>
          <Badge variant="outline" className="gap-1 px-1.5 py-0 text-xs">
            <Icon className={cn('size-3', platform.className)} />
            {platform.label}
          </Badge>
        </div>
      </div>
      <dl className="space-y-2.5 border-t px-4 py-4">
        {rows.map(({ icon: RowIcon, label, value }) => (
          <div key={label} className="flex items-start gap-2">
            <RowIcon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <dt className="text-muted-foreground w-20 shrink-0 text-xs">{label}</dt>
            <dd className="min-w-0 flex-1 truncate text-xs font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t px-4 py-4">
        <p className="text-sm leading-relaxed">{comment.text}</p>
        <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" />
            {comment.likes}
          </span>
          <span>{comment.time}</span>
        </div>
      </div>
      {comment.reply && (
        <div className="border-t px-4 py-4">
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">{t('reply')}</h3>
          <div className="flex gap-2">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-[10px]">AT</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{comment.reply.username}</span>
                <span className="text-muted-foreground text-xs">{comment.reply.time}</span>
              </div>
              <p className="bg-muted mt-1 rounded-lg px-3 py-2 text-xs break-words">{comment.reply.text}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-auto flex flex-col gap-2 border-t p-4">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(comment.id)
          }}
        >
          <Input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={t('replyPlaceholder')}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!draft.trim()} aria-label={t('send')}>
            <Send className="size-4" />
          </Button>
        </form>
        <Button variant="ghost" size="sm" onClick={() => onToggleHidden(comment.id)}>
          {comment.status === 'hidden' ? t('unhide') : t('hide')}
        </Button>
      </div>
    </aside>
  )
}

export default function SocialCommentsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [, force] = useReducer((x: number) => x + 1, 0)
  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState<SocialPlatform | 'all'>('all')
  const [status, setStatus] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const query = search.trim().toLowerCase()
  const comments = socialCommentService.list()
  const matches = (c: SocialComment) =>
    !query || c.username.toLowerCase().includes(query) || c.text.toLowerCase().includes(query)

  const visible = comments.filter(
    (c) => (channel === 'all' || c.platform === channel) && (status === 'all' || c.status === status) && matches(c),
  )

  const selected = visible.find((c) => c.id === selectedId) ?? null

  const countFor = (p: SocialPlatform) =>
    comments.filter((c) => c.platform === p && (status === 'all' || c.status === status) && matches(c)).length

  const submitReply = (id: string) => {
    if (!draft.trim()) return
    socialCommentService.reply(id, draft.trim())
    setDraft('')
    force()
  }

  const toggleHidden = (id: string) => {
    socialCommentService.toggleHidden(id)
    force()
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col p-4 md:p-6">
        <Card className="overflow-hidden py-0 md:h-[calc(100svh-7rem)] md:min-h-[520px]">
          <div className="grid min-h-[560px] md:h-full md:min-h-0 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_320px]">
            <aside className="chat-scroll flex min-h-0 flex-col gap-4 overflow-y-auto border-b bg-muted/20 p-4 md:border-r md:border-b-0">
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
            <section className="flex min-h-0 flex-col border-b md:border-b-0 md:border-r">
              <div className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {visible.length === 0 && (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t('noResults')}</div>
                )}
                {visible.map((comment) => {
                const platform = platformConfig[comment.platform]
                const Icon = platform.icon
                return (
                  <button
                    key={comment.id}
                    type="button"
                    onClick={() => setSelectedId(comment.id)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-accent/50',
                      selectedId === comment.id && 'bg-accent',
                    )}
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs">{comment.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{comment.username}</span>
                        <Icon className={cn('size-3.5', platform.className)} />
                        <span className="text-muted-foreground ml-auto shrink-0 text-xs">{comment.time}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{comment.text}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Heart className="size-3.5" />
                          {comment.likes}
                        </span>
                        <Badge className={cn('text-xs', statusBadge[comment.status])}>{t(statusLabels[comment.status])}</Badge>
                      </div>
                    </div>
                  </button>
                )
                })}
              </div>
            </section>
            <CommentDetailPanel
              comment={selected}
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={submitReply}
              onToggleHidden={toggleHidden}
              t={t}
            />
          </div>
        </Card>
      </main>
    </PageTransition>
  )
}
