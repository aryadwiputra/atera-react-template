import { MessageSquare, Plus, Send } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

const channels = ['General', 'Product', 'Design', 'Random']

const initialMessages: Record<string, string[]> = {
  General: ['Welcome to the Atera team space.', 'The quarterly review is ready for your feedback.'],
  Product: ['The roadmap review is scheduled for Friday.'],
  Design: ['The latest dashboard exploration is ready.'],
  Random: ['Share anything useful with the team here.'],
}

const senders = ['Avery Morgan', 'Sofia Chen', 'Marcus Reed']

export default function ChatPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [channel, setChannel] = useState('General')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Record<string, string[]>>(initialMessages)
  const currentMessages = messages[channel] ?? []

  const submit = () => {
    if (!message.trim()) return
    setMessages((current) => ({ ...current, [channel]: [...(current[channel] ?? []), message] }))
    setMessage('')
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('chat')} description={t('chatDescription')} />
        <Card className="overflow-hidden">
          <div className="grid min-h-[560px] md:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
              <div className="mb-3 flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('channels')}</span>
                <Button variant="ghost" size="icon" aria-label={t('addChannel')} className="size-7">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="space-y-1 px-2">
                {channels.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setChannel(item)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                      channel === item ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <MessageSquare className="size-4" />
                    {item}
                  </button>
                ))}
              </div>
            </aside>
            <section className="flex min-h-[500px] flex-col">
              <header className="flex items-center gap-3 border-b px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <h2 className="font-semibold">{channel}</h2>
                  <p className="text-xs text-muted-foreground">{t('teamConversation')}</p>
                </div>
              </header>
              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                {currentMessages.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {senders[index % senders.length].split(' ').map((part) => part[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">{senders[index % senders.length]}</span>
                        <Badge variant="secondary" className="text-[10px]">Now</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 border-t p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit()
                }}
              >
                <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`#${channel.toLowerCase()}`} />
                <Button type="submit" size="icon" aria-label={t('send')}>
                  <Send className="size-4" />
                </Button>
              </form>
            </section>
          </div>
        </Card>
      </main>
    </PageTransition>
  )
}
