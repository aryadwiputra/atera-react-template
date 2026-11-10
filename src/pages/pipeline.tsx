import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/utils'
import { crmService } from '@/services/crm-service'
import type { Deal, DealStage } from '@/lib/data/types'

const DAY_MS = 24 * 60 * 60 * 1000

const formatCurrency = (value: number) =>
  value >= 1000 ? `$${Math.round(value / 100) / 10}k` : `$${value}`

const initials = (name: string) =>
  name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

const daysAgo = (iso: string) =>
  Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / DAY_MS))

const formatAge = (translate: (key: TranslationKey) => string, days: number) => {
  if (days === 0) return translate('ageToday')
  if (days === 1) return translate('ageDaysOne')
  return translate('ageDays').replace('{n}', String(days))
}

const stageLabel: Record<DealStage, TranslationKey> = {
  new: 'stageNew',
  contacted: 'stageContacted',
  qualified: 'stageQualified',
  won: 'stageWon',
  lost: 'stageLost',
}

const stageAccent: Record<DealStage, string> = {
  new: 'bg-muted-foreground/50',
  contacted: 'bg-info',
  qualified: 'bg-primary',
  won: 'bg-success',
  lost: 'bg-destructive',
}

export default function PipelinePage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [deals, setDeals] = useState<Deal[]>(() => crmService.listDeals())
  const [open, setOpen] = useState(false)

  const handleMove = (dealId: string, stage: DealStage) => {
    crmService.moveDeal(dealId, stage)
    setDeals(crmService.listDeals())
  }

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    crmService.createDeal({
      company: String(data.get('company') || '').trim(),
      contact: String(data.get('contact') || '').trim(),
      email: String(data.get('email') || '').trim(),
      value: Number(data.get('value') || 0),
      stage: (String(data.get('stage') || 'new') as DealStage),
      owner: String(data.get('owner') || '').trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setDeals(crmService.listDeals())
    setOpen(false)
    event.currentTarget.reset()
  }

  const summary = useMemo(() => {
    const open = deals.filter((deal) => deal.stage !== 'won' && deal.stage !== 'lost')
    const won = deals.filter((deal) => deal.stage === 'won')
    const closed = deals.filter((deal) => deal.stage === 'won' || deal.stage === 'lost')
    const pipelineValue = open.reduce((total, deal) => total + deal.value, 0)
    const winRate = closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0
    const thisMonth = deals.filter((deal) => daysAgo(deal.createdAt) <= 30).length
    const avg = open.length > 0 ? Math.round(pipelineValue / open.length) : 0
    return { pipelineValue, winRate, thisMonth, avg }
  }, [deals])

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          breadcrumbs={[{ title: t('crm'), href: '/crm' }, { title: t('pipelineBoard'), href: '/pipeline' }]}
          title={t('pipelineBoard')}
          description={t('pipelineBoardDescription')}
          actions={(
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="size-4" />{t('addDeal')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('addDeal')}</DialogTitle>
                  <DialogDescription>{t('addDealDescription')}</DialogDescription>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={handleCreate}>
                  <label className="grid gap-1.5 text-sm font-medium" htmlFor="deal-company">
                    {t('company')}
                    <Input id="deal-company" name="company" required placeholder="Acme Corp" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-medium" htmlFor="deal-contact">
                      {t('contact')}
                      <Input id="deal-contact" name="contact" required placeholder="Jane Doe" />
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium" htmlFor="deal-email">
                      {t('email')}
                      <Input id="deal-email" name="email" type="email" placeholder="jane@acme.com" />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-medium" htmlFor="deal-value">
                      {t('dealValue')}
                      <Input id="deal-value" name="value" type="number" min="0" step="100" required placeholder="12000" />
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium" htmlFor="deal-owner">
                      {t('owner')}
                      <Input id="deal-owner" name="owner" required placeholder="Avery Morgan" />
                    </label>
                  </div>
                  <label className="grid gap-1.5 text-sm font-medium" htmlFor="deal-stage">
                    {t('stage')}
                    <Select name="stage" defaultValue="new">
                      <SelectTrigger id="deal-stage" className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {crmService.stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>{t(stageLabel[stage.id])}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                    <Button type="submit">{t('createDeal')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t('pipelineValue')} value={`$${Math.round(summary.pipelineValue / 1000)}k`} change="+8.4%" description={t('openDeals')} icon={TrendingUp} />
          <StatCard title={t('winRate')} value={`${summary.winRate}%`} change="+2.1%" description={t('dealsWon')} />
          <StatCard title={t('dealsThisMonth')} value={`${summary.thisMonth}`} change="+12.5%" description={t('createdRecently')} />
          <StatCard title={t('avgDealValue')} value={formatCurrency(summary.avg)} change="+3.2%" description={t('perOpenDeal')} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {crmService.stages.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.stage === stage.id)
            const stageValue = stageDeals.reduce((total, deal) => total + deal.value, 0)
            return (
              <Card key={stage.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn('size-2 rounded-full', stageAccent[stage.id])} />
                        <h2 className="font-semibold">{t(stageLabel[stage.id])}</h2>
                      </div>
                      <Badge variant="secondary">{stageDeals.length}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatCurrency(stageValue)} {t('inStage')}</p>
                  </div>
                  <div className="space-y-3">
                    {stageDeals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileDrag={{ scale: 1.03, zIndex: 10, boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.2)' }}
                        drag
                        dragSnapToOrigin
                        dragElastic={0.12}
                        className="cursor-grab rounded-lg border bg-background p-4 active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-snug">{deal.company}</p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">{deal.contact}</p>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs font-semibold tabular-nums">{formatCurrency(deal.value)}</Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-2xs font-medium">{initials(deal.owner)}</AvatarFallback>
                            </Avatar>
                            <span className="truncate text-xs text-muted-foreground">{deal.owner}</span>
                          </div>
                          <span className="shrink-0 text-2xs text-muted-foreground">{formatAge(t, daysAgo(deal.createdAt))}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {crmService.stages.filter((col) => col.id !== deal.stage).map((col) => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => handleMove(deal.id, col.id)}
                              className="rounded border px-1.5 py-0.5 text-2xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              title={`${t('moveTo')} ${t(stageLabel[col.id])}`}
                            >
                              {t(stageLabel[col.id])} →
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                        {t('dragHere')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </PageTransition>
  )
}
