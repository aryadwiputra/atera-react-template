import { DatePicker } from '@/components/shared/date-picker'
import type { ColumnDef } from '@tanstack/react-table'
import { createAppColumnHelper, DataTable, tableFeaturesConfig } from '@/components/shared/data-table'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useToast } from '@/components/shared/toast'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { ChartComposed } from '@/components/charts/chart-composed'
import { ChartCard } from '@/components/charts/chart-config'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeftRight, Pencil, PiggyBank, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { financeService } from '@/services/finance-service'
import type { FinanceTransaction } from '@/lib/data/types'
import { cn } from '@/lib/utils'

const cashFlowTrend = [
  { month: 'Jun', income: 14200, expenses: 9800 },
  { month: 'Jul', income: 15800, expenses: 10400 },
  { month: 'Aug', income: 15100, expenses: 11200 },
  { month: 'Sep', income: 17400, expenses: 9600 },
  { month: 'Oct', income: 16900, expenses: 12100 },
  { month: 'Nov', income: 18300, expenses: 10800 },
]

const expenseBreakdown = [
  { name: 'Operations', value: 34 },
  { name: 'Marketing', value: 26 },
  { name: 'Payroll', value: 22 },
  { name: 'Software', value: 12 },
  { name: 'Other', value: 6 },
]

const transactionCategories = ['Subscriptions', 'Services', 'Infrastructure', 'Payroll', 'Marketing', 'Software', 'Office', 'Travel']

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

type FormState = Pick<FinanceTransaction, 'description' | 'category' | 'type' | 'amount' | 'status'> & { date: string }

const emptyForm: FormState = {
  description: '',
  category: 'Subscriptions',
  type: 'Expense',
  amount: 0,
  status: 'Cleared',
  date: new Date().toISOString().slice(0, 10),
}

export default function FinancePage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const [items, setItems] = useState(financeService.list)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FinanceTransaction | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [pendingDelete, setPendingDelete] = useState<FinanceTransaction | null>(null)

  const refresh = () => setItems(financeService.list())

  const totalIncome = items.filter((item) => item.type === 'Income').reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = items.filter((item) => item.type === 'Expense').reduce((sum, item) => sum + item.amount, 0)
  const netCashFlow = totalIncome - totalExpenses
  const pendingCount = items.filter((item) => item.status === 'Pending').length

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (transaction: FinanceTransaction) => {
    setEditing(transaction)
    const { id: _id, ...rest } = transaction
    setForm(rest)
    setFormOpen(true)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (form.description.trim() === '' || form.amount <= 0) return
    if (editing) {
      financeService.update(editing.id, form)
      toast({ title: t('transactionUpdated'), description: form.description, variant: 'success' })
    } else {
      financeService.create(form)
      toast({ title: t('transactionCreated'), description: form.description, variant: 'success' })
    }
    refresh()
    setFormOpen(false)
  }

  const helper = createAppColumnHelper<FinanceTransaction>()
  const columns: ColumnDef<typeof tableFeaturesConfig, FinanceTransaction, any>[] = [
    helper.accessor('date', { header: t('date') }),
    helper.accessor('description', { cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    helper.accessor('category', { header: t('category') }),
    helper.accessor('type', { header: t('type'), cell: (info) => (
      <Badge variant={info.getValue() === 'Income' ? 'default' : 'secondary'}>{info.getValue() === 'Income' ? t('income') : t('expense')}</Badge>
    ) }),
    helper.accessor('amount', { cell: (info) => {
      const value = info.getValue()
      return <span className={cn('font-semibold tabular-nums', info.row.original.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive')}>
        {info.row.original.type === 'Income' ? '+' : '-'}{formatMoney(value)}
      </span>
    } }),
    helper.accessor('status', { header: t('status'), cell: (info) => (
      <Badge variant={info.getValue() === 'Cleared' ? 'outline' : 'secondary'}>{info.getValue() === 'Cleared' ? t('cleared') : t('pending')}</Badge>
    ) }),
    helper.display({ id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" aria-label={t('edit')} onClick={() => openEdit(row.original)}><Pencil className="size-4" /></Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t('delete')} onClick={() => setPendingDelete(row.original)}><Trash2 className="size-4" /></Button>
      </div>
    ) }),
  ]

  const summary = [
    {
      title: t('totalIncome'),
      value: formatMoney(totalIncome),
      change: `+${items.filter((item) => item.type === 'Income').length} ${t('entries')}`,
      icon: TrendingUp,
      description: t('totalIncomeDescription'),
    },
    {
      title: t('totalExpenses'),
      value: formatMoney(totalExpenses),
      change: `${pendingCount} ${t('pendingLower')}`,
      changePositive: false,
      icon: TrendingDown,
      description: t('totalExpensesDescription'),
    },
    {
      title: t('netCashFlow'),
      value: formatMoney(netCashFlow),
      change: netCashFlow >= 0 ? t('positiveNetFlow') : t('negativeNetFlow'),
      changePositive: netCashFlow >= 0,
      icon: ArrowLeftRight,
      description: t('netCashFlowDescription'),
    },
    {
      title: t('savings'),
      value: formatMoney(Math.round(netCashFlow * 0.35)),
      change: '+3.1%',
      icon: PiggyBank,
      description: t('savingsDescription'),
    },
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('finance')}
          description={t('financeDescription')}
          actions={<Button size="sm" onClick={openCreate}><Plus className="size-4" />{t('addTransaction')}</Button>}
          breadcrumbs={[{ title: t('overview'), href: '#' }, { title: t('finance'), href: '/finance' }]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((card) => (
            <StatCard key={card.title} title={card.title} value={card.value} change={card.change} changePositive={card.changePositive} icon={card.icon} description={card.description} />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <ChartCard
            title={t('cashFlowTrend')}
            description={t('cashFlowTrendDescription')}
          >
            <ChartComposed
              data={cashFlowTrend}
              barKeys={['income']}
              lineKeys={['expenses']}
            />
          </ChartCard>
          <ChartCard
            title={t('expenseBreakdown')}
            description={t('expenseBreakdownDescription')}
          >
            <ChartPie data={expenseBreakdown} innerRadius={70} />
            <PieLegend data={expenseBreakdown} />
          </ChartCard>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold tracking-tight">{t('transactions')}</h2>
          <DataTable columns={columns} data={items} filterPlaceholder={t('filterTransactions')} />
        </div>
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('editTransaction') : t('addTransaction')}</DialogTitle>
            <DialogDescription>{t('transactionDescription')}</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium">
              {t('descriptionField')}
              <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('category')}
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {transactionCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('type')}
                <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value as FinanceTransaction['type'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">{t('income')}</SelectItem>
                    <SelectItem value="Expense">{t('expense')}</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                {t('amount')}
                <Input type="number" min={0} step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {t('status')}
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as FinanceTransaction['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cleared">{t('cleared')}</SelectItem>
                    <SelectItem value="Pending">{t('pending')}</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              {t('date')}
              <DatePicker value={form.date} onChange={(value) => setForm({ ...form, date: value })} required ariaLabel={t('date')} />
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
              <Button type="submit">{editing ? t('saveChanges') : t('addTransaction')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={t('deleteTransaction')}
        description={t('deleteTransactionDescription')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        trigger={<span />}
        onConfirm={() => {
          if (!pendingDelete) return
          financeService.remove(pendingDelete.id)
          refresh()
          toast({ title: t('transactionDeleted'), variant: 'success' })
        }}
      />
    </PageTransition>
  )
}
