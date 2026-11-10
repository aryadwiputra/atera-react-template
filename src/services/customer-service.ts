import { type Customer } from '@/lib/data/types'
import {
  createCustomer,
  getCustomer,
  listCustomers,
  removeCustomer,
  updateCustomer,
} from '@/lib/data/customers'

export interface CustomerService {
  list(): Customer[]
  get(id: string): Customer | undefined
  create(input: Omit<Customer, 'id'>): Customer
  update(id: string, updates: Partial<Customer>): Customer | undefined
  remove(id: string): void
}

export const customerService: CustomerService = {
  list: listCustomers,
  get: getCustomer,
  create: createCustomer,
  update: updateCustomer,
  remove: removeCustomer,
}
