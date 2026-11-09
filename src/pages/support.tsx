import { Send } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function SupportPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [sent, setSent] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('helpSupport')} description={t('helpSupportDescription')} />
        <Card>
          <CardHeader><CardTitle>{t('contactSupport')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(event) => { event.preventDefault(); if (subject.trim() && message.trim()) setSent(true) }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">{t('subject')}</label>
                  <Input id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">{t('category')}</label>
                  <select id="category" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    <option value="general">{t('general')}</option>
                    <option value="billing">{t('billing')}</option>
                    <option value="technical">{t('technical')}</option>
                  </select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-medium">{t('message')}</label>
                  <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm" />
                </div>
              </div>
              <Button className="mt-4" type="submit"><Send className="size-4" />{t('send')}</Button>
            </form>
            {sent && <p className="mt-4 text-sm text-emerald-600">{t('sentSuccessfully')}</p>}
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>{t('faq')}</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>{t('faq1')}</li>
                <li>{t('faq2')}</li>
                <li>{t('faq3')}</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('quickLinks')}</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li><a href="#" className="hover:underline">{t('docs')}</a></li>
                <li><a href="#" className="hover:underline">{t('community')}</a></li>
                <li><a href="#" className="hover:underline">{t('safety')}</a></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('status')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('operational')}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  )
}
