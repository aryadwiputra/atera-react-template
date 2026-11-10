import type { FinanceTransaction } from './types'

const seed: FinanceTransaction[] = [
  { id: 'TXN-014', date: '2026-11-08', description: 'Enterprise plan renewals', category: 'Subscriptions', type: 'Income', amount: 18400, status: 'Cleared' },
  { id: 'TXN-013', date: '2026-11-06', description: 'Cloud infrastructure', category: 'Infrastructure', type: 'Expense', amount: 6820, status: 'Cleared' },
  { id: 'TXN-012', date: '2026-11-04', description: 'Q4 ad campaign', category: 'Marketing', type: 'Expense', amount: 4100, status: 'Pending' },
  { id: 'TXN-011', date: '2026-11-02', description: 'Onboarding package sale', category: 'Services', type: 'Income', amount: 5600, status: 'Cleared' },
  { id: 'TXN-010', date: '2026-10-30', description: 'Payroll run', category: 'Payroll', type: 'Expense', amount: 12250, status: 'Cleared' },
  { id: 'TXN-009', date: '2026-10-27', description: 'Annual design tooling', category: 'Software', type: 'Expense', amount: 1980, status: 'Cleared' },
  { id: 'TXN-008', date: '2026-10-22', description: 'Team plan upgrades', category: 'Subscriptions', type: 'Income', amount: 9300, status: 'Cleared' },
  { id: 'TXN-007', date: '2026-10-18', description: 'Office supplies', category: 'Office', type: 'Expense', amount: 640, status: 'Cleared' },
  { id: 'TXN-006', date: '2026-10-12', description: 'Consulting retainer', category: 'Services', type: 'Income', amount: 7200, status: 'Pending' },
  { id: 'TXN-005', date: '2026-10-05', description: 'Travel and lodging', category: 'Travel', type: 'Expense', amount: 2140, status: 'Cleared' },
]

let transactions: FinanceTransaction[] = [...seed]
let counter = seed.reduce((max, item) => Math.max(max, Number(item.id.replace('TXN-', ''))), 0)

const nextId = () => {
  counter += 1
  return `TXN-${String(counter).padStart(3, '0')}`
}

export const listTransactions = () => [...transactions]
export const getTransaction = (id: string) => transactions.find((transaction) => transaction.id === id)
export const createTransaction = (transaction: Omit<FinanceTransaction, 'id'>) => {
  const created = { ...transaction, id: nextId() }
  transactions = [created, ...transactions]
  return created
}
export const updateTransaction = (id: string, updates: Partial<FinanceTransaction>) => {
  transactions = transactions.map((transaction) => transaction.id === id ? { ...transaction, ...updates } : transaction)
  return getTransaction(id)
}
export const removeTransaction = (id: string) => {
  transactions = transactions.filter((transaction) => transaction.id !== id)
}
