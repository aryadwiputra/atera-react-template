import { Bot, Plus, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type TranslationKey } from '@/i18n'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  preview: string
}

const conversations: Conversation[] = [
  { id: '1', title: 'Quarterly report summary', preview: 'Can you summarize these numbers for me?' },
  { id: '2', title: 'Customer email draft', preview: 'Write a friendly follow-up email to a lead.' },
  { id: '3', title: 'Bug triage help', preview: 'The checkout page throws a 500 error.' },
  { id: '4', title: 'Campaign ideas', preview: 'Give me five launch ideas for spring.' },
  { id: '5', title: 'Onboarding checklist', preview: 'Draft an onboarding plan for new hires.' },
]

const suggestions: { key: TranslationKey; text: string }[] = [
  { key: 'suggestionSummarize', text: 'Summarize this quarter\u2019s performance' },
  { key: 'suggestionDraft', text: 'Draft a customer follow-up email' },
  { key: 'suggestionIdeas', text: 'Brainstorm campaign ideas' },
  { key: 'suggestionExplain', text: 'Explain this metric' },
]

const cannedReplies = [
  'Here is a quick summary: revenue grew 12.5% quarter over quarter, driven mostly by the enterprise segment. Churn stayed flat while new signups rose sharply in the last two weeks.',
  'Great idea! I would start with the highest-impact items, group them into three phases, and assign a clear owner to each. Want me to draft a detailed plan?',
  'Based on the data, the trend is positive and stable. The main risk is seasonal dip in December, so I recommend keeping the current pacing through the holidays.',
  'I put together a short draft. It opens with context, states the ask in one sentence, and closes with a clear call to action. You can tweak the tone as needed.',
]

export default function AiChatPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [activeConversation, setActiveConversation] = useState(conversations[0].id)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I am your AI assistant. How can I help you today?' },
  ])
  const [message, setMessage] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!typing) return
    const timer = setTimeout(() => {
      setTyping(false)
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: cannedReplies[current.filter((m) => m.role === 'assistant').length % cannedReplies.length] },
      ])
    }, 400)
    return () => clearTimeout(timer)
  }, [typing])

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((current) => [...current, { role: 'user', content: trimmed }])
    setMessage('')
    setTyping(true)
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('aiChat')} description={t('aiChatDescription')} />
        <Card className="overflow-hidden">
          <div className="grid min-h-[560px] md:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
              <div className="mb-3 flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('conversations')}</span>
                <Button variant="ghost" size="icon" aria-label={t('newConversation')} className="size-7">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="space-y-1 px-2">
                {conversations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveConversation(item.id)}
                    className={cn(
                      'flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left text-sm transition-colors',
                      activeConversation === item.id ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{item.preview}</span>
                  </button>
                ))}
              </div>
            </aside>
            <section className="flex min-h-[500px] flex-col">
              <header className="flex items-center gap-3 border-b px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Bot className="size-4" />
                </div>
                <div>
                  <h2 className="font-semibold">{conversations.find((c) => c.id === activeConversation)?.title}</h2>
                  <p className="text-xs text-muted-foreground">{t('aiAssistant')}</p>
                </div>
              </header>
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={cn('flex', item.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg px-4 py-2.5 text-sm',
                        item.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {item.content}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                      <Sparkles className="size-4" />
                      {t('typing')}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 border-t px-4 py-3">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.key}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => submit(t(suggestion.key))}
                  >
                    {t(suggestion.key)}
                  </Button>
                ))}
              </div>
              <form
                className="flex gap-2 border-t p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit(message)
                }}
              >
                <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t('sendAMessage')} />
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
