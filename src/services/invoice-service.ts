import { type Invoice } from '@/lib/data/types'
import {
  createInvoice,
  getInvoice,
  listInvoices,
  removeInvoice,
  updateInvoice,
} from '@/lib/data/invoices'

export interface InvoiceService {
  list(): Invoice[]
  get(id: string): Invoice | undefined
  create(input: Omit<Invoice, 'id'>): Invoice
  update(id: string, updates: Partial<Invoice>): Invoice | undefined
  remove(id: string): void
}

export const invoiceService: InvoiceService = {
  list: listInvoices,
  get: getInvoice,
  create: createInvoice,
  update: updateInvoice,
  remove: removeInvoice,
}
