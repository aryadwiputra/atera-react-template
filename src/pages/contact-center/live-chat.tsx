import { Clock, Mail, MapPin, MessageSquare, Phone, Search, Send, Ticket, UserRound, X, type LucideIcon } from 'lucide-react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations, type TranslationKey, type Translator } from '@/i18n'
import { PageTransition } from '@/components/shared/page-transition'
import { useToast } from '@/components/shared/toast'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import type { ChatMessage, Conversation, ConversationChannel, ConversationStatus, TicketInput } from '@/lib/data/types'
import { conversationService } from '@/services/conversation-service'
import { cn } from '@/lib/utils'

const statusStrip: Record<ConversationStatus, string> = {
  open: 'bg-status-warning',
  pending: 'bg-chart-1',
  resolved: 'bg-status-success',
}

const channelLabels: Record<ConversationChannel, string> = {
  whatsapp: 'WhatsApp',
  webchat: 'Webchat',
  email: 'Email',
  messenger: 'Messenger',
}

const channels: ConversationChannel[] = ['whatsapp', 'webchat', 'email', 'messenger']

type StatusFilter = 'all' | 'unread' | ConversationStatus
type ChannelFilter = 'all' | ConversationChannel

const statusFilters: { value: StatusFilter; label: TranslationKey }[] = [
  { value: 'all', label: 'statusAll' },
  { value: 'unread', label: 'unread' },
  { value: 'open', label: 'statusOpen' },
  { value: 'pending', label: 'statusPending' },
  { value: 'resolved', label: 'statusResolved' },
]

const quickReplies = ['Thanks for reaching out!', 'Let me check that for you.', 'Is there anything else?']

const agents = ['Ayu Pratama', 'Rizky Ananda', 'Dana Wijaya']

type ConversationListProps = {
  conversations: Conversation[]
  total: number
  selectedId: string | null
  search: string
  statusFilter: StatusFilter
  channelFilter: ChannelFilter
  onSearch: (value: string) => void
  onStatusFilter: (value: StatusFilter) => void
  onChannelFilter: (value: ChannelFilter) => void
  onSelect: (id: string) => void
  onReset: () => void
  t: Translator
}

function ConversationList({
  conversations,
  total,
  selectedId,
  search,
  statusFilter,
  channelFilter,
  onSearch,
  onStatusFilter,
  onChannelFilter,
  onSelect,
  onReset,
  t,
}: ConversationListProps) {
  const hasFilters = Boolean(search.trim()) || statusFilter !== 'all' || channelFilter !== 'all'

  return (
    <aside className="flex min-h-0 flex-col border-b bg-muted/20 md:border-r md:border-b-0">
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{t('inbox')}</h2>
          <Badge variant="secondary" className="px-1.5 py-0 text-xs">
            {conversations.length}/{total}
          </Badge>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="icon" className="size-7" onClick={onReset} aria-label={t('resetFilters')}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-2 border-b p-3">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={t('search')} className="pl-8" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={channelFilter} onValueChange={(value) => onChannelFilter(value as ChannelFilter)}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allChannels')}</SelectItem>
              {channels.map((channel) => (
                <SelectItem key={channel} value={channel}>{channelLabels[channel]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => onStatusFilter(value as StatusFilter)}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>{t(filter.label)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <MessageSquare className="text-muted-foreground size-8" />
            <p className="text-muted-foreground text-sm">{t('noConversations')}</p>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={onReset}>
                {t('resetFilters')}
              </Button>
            )}
          </div>
        ) : (
          conversations.map((conversation) => {
            const last = conversation.messages[conversation.messages.length - 1]
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  'relative flex w-full items-start gap-3 border-b p-3 text-left transition-colors hover:bg-accent/50',
                  selectedId === conversation.id && 'bg-accent',
                )}
              >
                <span className={cn('absolute top-0 bottom-0 left-0 w-0.5', statusStrip[conversation.status])} />
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">{conversation.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{conversation.customer}</span>
                    {conversation.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                    <span className="text-muted-foreground ml-auto shrink-0 text-xs">{last?.time}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge variant="outline" className="text-muted-foreground px-1.5 py-0 text-xs">
                      {channelLabels[conversation.channel]}
                    </Badge>
                    <span className="text-muted-foreground truncate text-xs">{last?.body}</span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}

type MessageBubbleProps = {
  message: ChatMessage
  initials: string
  customer: string
}

function MessageBubble({ message, initials, customer }: MessageBubbleProps) {
  const isAgent = message.sender === 'agent'
  return (
    <div className={cn('flex max-w-[80%] items-end gap-2', isAgent && 'ml-auto flex-row-reverse')}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-[10px]">{isAgent ? 'ME' : initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-1">
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2 text-sm break-words',
            isAgent ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted',
          )}
        >
          {message.body}
        </div>
        <span className={cn('text-muted-foreground text-xs', isAgent && 'text-right')}>
          {isAgent ? 'You' : customer} · {message.time}
        </span>
      </div>
    </div>
  )
}

type ComposerProps = {
  draft: string
  onDraftChange: (value: string) => void
  onSubmit: () => void
  t: Translator
}

function Composer({ draft, onDraftChange, onSubmit, t }: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [draft])

  return (
    <footer className="flex flex-col gap-2 border-t p-4">
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((text) => (
          <Button key={text} type="button" variant="outline" size="sm" onClick={() => onDraftChange(text)}>
            {text}
          </Button>
        ))}
      </div>
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Textarea
          ref={textareaRef}
          value={draft}
          rows={1}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder={t('messagePlaceholder')}
          className="max-h-[120px] min-h-10 flex-1 resize-none"
        />
        <Button type="submit" size="icon" disabled={!draft.trim()} aria-label={t('send')}>
          <Send className="size-4" />
        </Button>
      </form>
    </footer>
  )
}

type CustomerPanelProps = {
  conversation: Conversation | null
  onAssigneeChange: (assignee: string) => void
  onSaveTicket: (input: TicketInput) => void
  t: Translator
}

const emptyTicketForm = (conversation: Conversation | null): TicketInput => ({
  subject: conversation?.ticketSubject ?? '',
  category: conversation?.ticketCategory ?? '',
  type: conversation?.ticketType ?? '',
  priority: conversation?.ticketPriority ?? '',
  description: conversation?.ticketDescription ?? '',
  escalated: false,
})

function CustomerPanel({ conversation, onAssigneeChange, onSaveTicket, t }: CustomerPanelProps) {
  const [editingTicket, setEditingTicket] = useState(false)
  const [form, setForm] = useState<TicketInput>(() => emptyTicketForm(conversation))

  if (!conversation) {
    return (
      <aside className="hidden min-h-0 flex-col border-l bg-muted/10 xl:flex">
        <div className="flex h-14 shrink-0 items-center border-b px-3">
          <h2 className="text-sm font-semibold">{t('customerInfo')}</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-muted-foreground text-sm">{t('selectConversation')}</p>
        </div>
      </aside>
    )
  }

  const rows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Phone, label: t('phone'), value: conversation.phone },
    { icon: Mail, label: t('email'), value: conversation.email },
    { icon: MapPin, label: t('location'), value: conversation.location },
    { icon: UserRound, label: t('segment'), value: conversation.segment },
    { icon: Clock, label: t('joined'), value: conversation.joined },
    { icon: MessageSquare, label: t('totalChats'), value: String(conversation.totalChats) },
  ]

  return (
    <aside className="hidden min-h-0 flex-col border-l bg-muted/10 xl:flex">
      <Tabs defaultValue="details" className="flex min-h-0 flex-1 flex-col gap-0">
        <div className="flex h-14 shrink-0 items-center border-b px-3">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">{t('overview')}</TabsTrigger>
            <TabsTrigger value="ticket" className="flex-1">{t('ticket')}</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">{t('history')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="chat-scroll mt-0 flex min-h-0 flex-col overflow-y-auto">
          <div className="flex flex-col items-center gap-2 px-4 py-5 text-center">
            <Avatar className="size-14">
              <AvatarFallback className="text-base font-semibold">{conversation.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{conversation.customer}</p>
              <p className="text-muted-foreground text-xs">{conversation.customerId}</p>
            </div>
          </div>
          <dl className="space-y-2.5 border-t px-4 py-4">
            {rows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
                <dt className="text-muted-foreground w-20 shrink-0 text-xs">{label}</dt>
                <dd className="min-w-0 flex-1 truncate text-xs font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto border-t px-4 py-4">
            <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">{t('assign')}</h3>
            <Select value={conversation.assignee} onValueChange={onAssigneeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="ticket" className="chat-scroll mt-0 min-h-0 overflow-y-auto p-4">
          {conversation.ticketId && !editingTicket ? (
            <div className="space-y-4">
              <Badge variant="secondary" className="w-full justify-between gap-2 px-3 py-2">
                <span className="flex items-center gap-2">
                  <Ticket className="size-3.5" />
                  {t('ticket')}
                </span>
                <span className="font-mono text-xs">{conversation.ticketId}</span>
              </Badge>
              <TicketRow label={t('subject')} value={conversation.ticketSubject ?? '—'} />
              <TicketRow label={t('status')} value={t(`status${conversation.status.charAt(0).toUpperCase()}${conversation.status.slice(1)}` as TranslationKey)} />
              <TicketRow label={t('category')} value={conversation.ticketCategory ?? '—'} />
              <TicketRow label={t('type')} value={conversation.ticketType ?? '—'} />
              <TicketRow label={t('priority')} value={conversation.ticketPriority ?? '—'} />
              <TicketRow label={t('created')} value={conversation.ticketCreated ?? '—'} />
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-semibold">{t('description')}</p>
                <p className="text-sm leading-relaxed">{conversation.ticketDescription ?? '—'}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setEditingTicket(true)}>
                {t('editTicket')}
              </Button>
            </div>
          ) : (
            <TicketForm
              form={form}
              onChange={setForm}
              onSubmit={() => {
                onSaveTicket(form)
                setEditingTicket(false)
              }}
              onCancel={editingTicket ? () => setEditingTicket(false) : undefined}
              isEditing={editingTicket}
              t={t}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="chat-scroll mt-0 min-h-0 overflow-y-auto p-4">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs">{t('history')} · {conversation.messages.length}</p>
            {conversation.messages.map((message) => (
              <div key={message.id} className="border-l-2 border-muted pl-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">{message.sender === 'agent' ? conversation.assignee : conversation.customer}</span>
                  <span className="text-muted-foreground text-xs">{message.time}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed">{message.body}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0 text-xs">{label}</span>
      <span className="min-w-0 text-right text-xs font-medium">{value}</span>
    </div>
  )
}

type TicketFormProps = {
  form: TicketInput
  onChange: (form: TicketInput) => void
  onSubmit: () => void
  onCancel?: () => void
  isEditing: boolean
  t: Translator
}

function TicketForm({ form, onChange, onSubmit, onCancel, isEditing, t }: TicketFormProps) {
  const set = (patch: Partial<TicketInput>) => onChange({ ...form, ...patch })

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!form.subject.trim()) return
        onSubmit()
      }}
    >
      <h3 className="text-sm font-semibold">{isEditing ? t('editTicket') : t('newTicket')}</h3>
      <label className="grid gap-2 text-xs font-medium">
        {t('subject')}
        <Input
          value={form.subject}
          onChange={(event) => set({ subject: event.target.value })}
          placeholder={t('selectSubject')}
          required
        />
      </label>
      <label className="grid gap-2 text-xs font-medium">
        {t('category')}
        <Select value={form.category} onValueChange={(value) => set({ category: value })}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t('categoryPh')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Billing">{t('billing')}</SelectItem>
            <SelectItem value="Technical">{t('technical')}</SelectItem>
            <SelectItem value="General">{t('general')}</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-2 text-xs font-medium">
        {t('type')}
        <Select value={form.type} onValueChange={(value) => set({ type: value })}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t('typePh')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Complaint">{t('complaint')}</SelectItem>
            <SelectItem value="Request">{t('request')}</SelectItem>
            <SelectItem value="Inquiry">{t('inquiry')}</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-2 text-xs font-medium">
        {t('priority')}
        <Select value={form.priority} onValueChange={(value) => set({ priority: value })}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t('priorityPh')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">{t('lowPriority')}</SelectItem>
            <SelectItem value="Medium">{t('mediumPriority')}</SelectItem>
            <SelectItem value="High">{t('highPriority')}</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-2 text-xs font-medium">
        {t('description')}
        <Textarea
          value={form.description}
          onChange={(event) => set({ description: event.target.value })}
          rows={3}
          className="min-h-20 resize-none"
        />
      </label>
      <div className="flex items-start gap-2">
        <Checkbox
          id="ticket-escalation"
          checked={form.escalated}
          onCheckedChange={(value) => set({ escalated: value === true })}
          className="mt-0.5"
        />
        <label htmlFor="ticket-escalation" className="grid gap-0.5">
          <span className="text-xs font-medium">{t('escalation')}</span>
          <span className="text-muted-foreground text-xs">{t('escalationDesc')}</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          <Send className="size-3.5" />
          {t('save')}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}

export default function LiveChatPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [, force] = useReducer((x) => x + 1, 0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all')

  const conversations = conversationService.list()
  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const messageCount = selected?.messages.length ?? 0
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [selectedId, messageCount])

  const query = search.trim().toLowerCase()
  const filtered = conversations.filter((c) => {
    const last = c.messages[c.messages.length - 1]
    const matchesQuery =
      !query || c.customer.toLowerCase().includes(query) || (last?.body.toLowerCase().includes(query) ?? false)
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'unread' ? c.unread : c.status === statusFilter)
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter
    return matchesQuery && matchesStatus && matchesChannel
  })

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setChannelFilter('all')
  }

  const select = (id: string) => {
    setSelectedId(id)
    if (conversations.find((c) => c.id === id)?.unread) {
      conversationService.setStatus(id, 'open')
    }
    force()
  }

  const submit = () => {
    if (!draft.trim() || !selected) return
    conversationService.reply(selected.id, draft.trim())
    setDraft('')
    force()
  }

  const changeAssignee = (assignee: string) => {
    if (!selected) return
    conversationService.setAssignee(selected.id, assignee)
    force()
  }

  const saveTicket = (input: TicketInput) => {
    if (!selected) return
    conversationService.createTicket(selected.id, input)
    force()
    toast({ title: t('ticketSaved'), variant: 'success' })
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col p-4 md:p-6">
        <Card className="overflow-hidden py-0 md:h-[calc(100svh-7rem)] md:min-h-[520px]">
          <div className="grid min-h-[560px] md:h-full md:min-h-0 md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_400px]">
            <ConversationList
              conversations={filtered}
              total={conversations.length}
              selectedId={selected?.id ?? null}
              search={search}
              statusFilter={statusFilter}
              channelFilter={channelFilter}
              onSearch={setSearch}
              onStatusFilter={setStatusFilter}
              onChannelFilter={setChannelFilter}
              onSelect={select}
              onReset={resetFilters}
              t={t}
            />
            <section className="flex min-h-0 flex-col">
              {selected ? (
                <>
                  <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs">{selected.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{selected.customer}</span>
                      <Badge variant="outline" className="text-muted-foreground px-1.5 py-0 text-xs">
                        {channelLabels[selected.channel]}
                      </Badge>
                    </div>
                    <Select
                      value={selected.status}
                      onValueChange={(v) => {
                        conversationService.setStatus(selected.id, v as ConversationStatus)
                        force()
                      }}
                    >
                      <SelectTrigger size="sm" className="ml-auto w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">{t('statusOpen')}</SelectItem>
                        <SelectItem value="pending">{t('statusPending')}</SelectItem>
                        <SelectItem value="resolved">{t('statusResolved')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </header>
                  <div ref={messagesRef} className="chat-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4">
                    {selected.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        initials={selected.initials}
                        customer={selected.customer}
                      />
                    ))}
                  </div>
                  <Composer draft={draft} onDraftChange={setDraft} onSubmit={submit} t={t} />
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
                  <MessageSquare className="text-muted-foreground size-10" />
                  <p className="text-muted-foreground text-sm">{t('selectConversation')}</p>
                </div>
              )}
            </section>
            <CustomerPanel key={selected?.id ?? 'empty'} conversation={selected} onAssigneeChange={changeAssignee} onSaveTicket={saveTicket} t={t} />
          </div>
        </Card>
      </main>
    </PageTransition>
  )
}
