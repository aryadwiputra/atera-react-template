import { createTransaction, getTransaction, listTransactions, removeTransaction, updateTransaction } from '@/lib/data/finance'
import { type FinanceTransaction } from '@/lib/data/types'

export interface FinanceService {
  list(): FinanceTransaction[]
  get(id: string): FinanceTransaction | undefined
  create(input: Omit<FinanceTransaction, 'id'>): FinanceTransaction
  update(id: string, updates: Partial<FinanceTransaction>): FinanceTransaction | undefined
  remove(id: string): void
}

export const financeService: FinanceService = {
  list: listTransactions,
  get: getTransaction,
  create: createTransaction,
  update: updateTransaction,
  remove: removeTransaction,
}
