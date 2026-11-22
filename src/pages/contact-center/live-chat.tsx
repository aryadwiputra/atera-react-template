import { MessageSquare, Search, Send } from 'lucide-react'
import { useReducer, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from '@/i18n'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import type { ConversationChannel, ConversationStatus } from '@/lib/data/types'
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

const quickReplies = ['Thanks for reaching out!', 'Let me check that for you.', 'Is there anything else?']

export default function LiveChatPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [, force] = useReducer((x) => x + 1, 0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  const conversations = conversationService.list()
  const selected = conversations.find((c) => c.id === selectedId) ?? null

  const query = search.trim().toLowerCase()
  const filtered = conversations.filter((c) => {
    const last = c.messages[c.messages.length - 1]
    const matchesQuery =
      !query || c.customer.toLowerCase().includes(query) || (last?.body.toLowerCase().includes(query) ?? false)
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter
    return matchesQuery && matchesStatus && matchesChannel
  })

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

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title="Live Chat" />
        <Card className="overflow-hidden">
          <div className="grid min-h-[560px] md:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
              <div className="flex flex-col gap-2 border-b p-3">
                <div className="relative">
                  <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('search')}
                    className="pl-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger size="sm" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger size="sm" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="webchat">Webchat</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="messenger">Messenger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground p-6 text-center text-sm">No conversations found.</p>
                ) : (
                  filtered.map((conversation) => {
                    const last = conversation.messages[conversation.messages.length - 1]
                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => select(conversation.id)}
                        className={cn(
                          'relative flex w-full items-start gap-3 border-b p-3 text-left transition-colors hover:bg-accent/50',
                          selected?.id === conversation.id && 'bg-accent',
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-0 bottom-0 left-0 w-0.5',
                            statusStrip[conversation.status],
                          )}
                        />
                        <Avatar className="size-9">
                          <AvatarFallback className="text-xs">{conversation.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">{conversation.customer}</span>
                            {conversation.unread && (
                              <span className="size-2 shrink-0 rounded-full bg-primary" />
                            )}
                            <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                              {last?.time}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <Badge variant="outline" className="text-muted-foreground px-1.5 py-0 text-xs">
                              {channelLabels[conversation.channel]}
                            </Badge>
                            <span className="text-muted-foreground truncate text-xs">
                              {last?.body}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </aside>
            <section className="flex min-h-[500px] flex-col">
              {selected ? (
                <>
                  <header className="flex items-center gap-3 border-b p-4">
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
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </header>
                  <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                    {selected.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn('flex max-w-[75%] flex-col gap-1', message.sender === 'agent' && 'ml-auto')}
                      >
                        <div
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm',
                            message.sender === 'agent'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted',
                          )}
                        >
                          {message.body}
                        </div>
                        <span
                          className={cn(
                            'text-muted-foreground text-xs',
                            message.sender === 'agent' && 'text-right',
                          )}
                        >
                          {message.sender === 'agent' ? 'You' : selected.customer} · {message.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <footer className="flex flex-col gap-2 border-t p-4">
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((text) => (
                        <Button key={text} variant="outline" size="sm" onClick={() => setDraft(text)}>
                          {text}
                        </Button>
                      ))}
                    </div>
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        submit()
                      }}
                    >
                      <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={t('messagePlaceholder')}
                      />
                      <Button type="submit" size="icon" disabled={!draft.trim()} aria-label={t('send')}>
                        <Send className="size-4" />
                      </Button>
                    </form>
                  </footer>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
                  <MessageSquare className="text-muted-foreground size-10" />
                  <p className="text-muted-foreground text-sm">Select a conversation to start chatting.</p>
                </div>
              )}
            </section>
          </div>
        </Card>
      </main>
    </PageTransition>
  )
}
