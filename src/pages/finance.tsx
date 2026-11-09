import { ArrowLeftRight, PiggyBank, TrendingDown, Wallet } from 'lucide-react'

import { ChartComposed } from '@/components/charts/chart-composed'
import { ChartCard } from '@/components/charts/chart-config'
import { ChartPie, PieLegend } from '@/components/charts/chart-pie'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { StatCard } from '@/components/shared/stat-card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

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

const budgets: Array<{ name: string; spent: number; total: number }> = [
  { name: 'Research & Development', spent: 12400, total: 18000 },
  { name: 'Marketing', spent: 8200, total: 10000 },
  { name: 'Infrastructure', spent: 6800, total: 9000 },
  { name: 'Travel', spent: 2100, total: 5000 },
  { name: 'Office', spent: 1400, total: 3000 },
]

export default function FinancePage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('finance')} description={t('financeDescription')} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={t('totalBudget')}
            value="$84,240"
            change="+6.2%"
            icon={Wallet}
            description={t('totalBudgetDescription')}
          />
          <StatCard
            title={t('totalExpenses')}
            value="$32,180"
            change="+11.4%"
            changePositive={false}
            icon={TrendingDown}
            description={t('totalExpensesDescription')}
          />
          <StatCard
            title={t('cashFlow')}
            value="$52,060"
            change="+8.7%"
            icon={ArrowLeftRight}
            description={t('cashFlowDescription')}
          />
          <StatCard
            title={t('savings')}
            value="$18,430"
            change="+3.1%"
            icon={PiggyBank}
            description={t('savingsDescription')}
          />
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
        <ChartCard
          title={t('budgetAllocation')}
          description={t('budgetAllocationDescription')}
        >
          <div className="flex flex-col gap-4">
            {budgets.map((budget) => {
              const percent = Math.round((budget.spent / budget.total) * 100)
              return (
                <div key={budget.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{budget.name}</span>
                    <span className="text-muted-foreground">
                      ${budget.spent.toLocaleString()} / ${budget.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded bg-muted">
                    <div
                      className="h-2 rounded bg-primary"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      </main>
    </PageTransition>
  )
}
