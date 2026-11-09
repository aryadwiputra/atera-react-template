import { Mail, MailOpen, Plus, Search, Star } from 'lucide-react'
import { useState } from 'react'
import { listMail, markMailRead, sendMail } from '@/lib/data/mail'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function MailPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [mails, setMails] = useState(listMail)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [compose, setCompose] = useState(false)
  const [search, setSearch] = useState('')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const selected = mails.find((mail) => mail.id === selectedId) ?? null
  const filtered = mails.filter((mail) => mail.subject.toLowerCase().includes(search.toLowerCase()) || mail.sender.toLowerCase().includes(search.toLowerCase()))

  const openMail = (id: string) => {
    markMailRead(id)
    setMails(listMail())
    setSelectedId(id)
  }

  const submit = () => {
    if (!to || !subject || !body) return
    sendMail({ to, subject, body })
    setMails(listMail())
    setCompose(false)
    setTo('')
    setSubject('')
    setBody('')
    setSent(true)
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('mail')}
          description={t('mailDescription')}
          actions={
            <Button size="sm" onClick={() => setCompose(true)}>
              <Plus className="size-4" />
              {t('compose')}
            </Button>
          }
        />
        {sent && <div className="rounded-md border border-success bg-success/10 px-4 py-3 text-sm">{t('mailSent')}</div>}
        {compose ? (
          <Card>
            <CardContent className="grid gap-4 p-5">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium">{t('to')}</label>
                <Input value={to} onChange={(event) => setTo(event.target.value)} placeholder="name@example.com" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium">{t('subject')}</label>
                <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder={t('subjectPlaceholder')} />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium">{t('message')}</label>
                <textarea
                  className="min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder={t('messagePlaceholder')}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={submit} disabled={!to || !subject || !body}>
                  {t('send')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCompose(false)}>
                  {t('cancel')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="grid min-h-[560px] md:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
                <div className="border-b p-3">
                  <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5">
                    <Search className="size-4 text-muted-foreground" />
                    <Input className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('searchMail')} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filtered.map((mail) => (
                    <button
                      key={mail.id}
                      type="button"
                      onClick={() => openMail(mail.id)}
                      className={cn('flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-muted', selectedId === mail.id && 'bg-muted/70')}
                    >
                      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium', mail.unread ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                        {mail.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn('truncate text-sm', mail.unread && 'font-semibold')}>{mail.sender}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{mail.time}</span>
                        </div>
                        <p className={cn('truncate text-sm', mail.unread && 'font-medium')}>{mail.subject}</p>
                        <p className="truncate text-xs text-muted-foreground">{mail.preview}</p>
                      </div>
                      {mail.starred && <Star className="size-4 shrink-0 text-primary" />}
                    </button>
                  ))}
                </div>
              </aside>
              <section className="flex min-h-[500px] flex-col">
                {selected ? (
                  <>
                    <header className="flex items-start gap-3 border-b p-5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {selected.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="font-semibold">{selected.subject}</h2>
                          <Badge variant="secondary">{selected.time}</Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {selected.sender}
                        </p>
                      </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-5">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{selected.body}</p>
                    </div>
                    <div className="border-t p-4">
                      <Button variant="outline" size="sm">
                        <Mail className="size-4" />
                        {t('reply')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                    <MailOpen className="size-10" />
                    <p className="text-sm">{t('selectEmail')}</p>
                  </div>
                )}
              </section>
            </div>
          </Card>
        )}
      </main>
    </PageTransition>
  )
}
