import type { Customer } from './types'

const customers: Customer[] = [
  { id: 'CUS-001', name: 'Olivia Martin', email: 'olivia@example.com', company: 'Northstar Labs', orders: 12, spent: 2840, joined: '2025-02-14' },
  { id: 'CUS-002', name: 'Jackson Lee', email: 'jackson@example.com', company: 'Vertex Studio', orders: 8, spent: 1640, joined: '2025-04-22' },
  { id: 'CUS-003', name: 'Isabella Nguyen', email: 'isabella@example.com', company: 'Brightside Co.', orders: 6, spent: 920, joined: '2025-06-08' },
  { id: 'CUS-004', name: 'William Kim', email: 'william@example.com', company: 'Atlas Group', orders: 19, spent: 4390, joined: '2024-11-19' },
]

export const listCustomers = () => [...customers]
export const getCustomer = (id: string) => customers.find((customer) => customer.id === id)
export const createCustomer = (customer: Omit<Customer, 'id'>) => {
  const created = { ...customer, id: `CUS-${String(Math.max(...customers.map((c) => Number.parseInt(c.id.slice(4), 10) || 0), 0) + 1).padStart(3, '0')}` }
  customers.unshift(created)
  return created
}
export const updateCustomer = (id: string, updates: Partial<Customer>) => {
  const index = customers.findIndex((customer) => customer.id === id)
  if (index === -1) return undefined
  customers[index] = { ...customers[index], ...updates }
  return customers[index]
}
export const removeCustomer = (id: string) => {
  const index = customers.findIndex((customer) => customer.id === id)
  if (index !== -1) customers.splice(index, 1)
}
