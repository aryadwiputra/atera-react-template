import type { Order } from './types'

let orders: Order[] = [
  { id: 'ORD-7291', customer: 'Olivia Martin', customerEmail: 'olivia@example.com', product: 'Pro subscription', status: 'Paid', amount: 249, date: '2026-11-05' },
  { id: 'ORD-7289', customer: 'Jackson Lee', customerEmail: 'jackson@example.com', product: 'Team plan', status: 'Pending', amount: 129, date: '2026-11-04' },
  { id: 'ORD-7286', customer: 'Isabella Nguyen', customerEmail: 'isabella@example.com', product: 'Starter plan', status: 'Paid', amount: 49, date: '2026-11-03' },
  { id: 'ORD-7281', customer: 'William Kim', customerEmail: 'william@example.com', product: 'Pro subscription', status: 'Refunded', amount: 249, date: '2026-11-01' },
  { id: 'ORD-7278', customer: 'Emma Davis', customerEmail: 'emma@example.com', product: 'Enterprise plan', status: 'Paid', amount: 599, date: '2026-10-30' },
]

export const listOrders = () => [...orders]
export const getOrder = (id: string) => orders.find((order) => order.id === id)
export const createOrder = (order: Omit<Order, 'id'>) => {
  const created = { ...order, id: `ORD-${7300 + orders.length}` }
  orders = [created, ...orders]
  return created
}
export const updateOrder = (id: string, updates: Partial<Order>) => {
  orders = orders.map((order) => order.id === id ? { ...order, ...updates } : order)
  return getOrder(id)
}
export const removeOrder = (id: string) => {
  orders = orders.filter((order) => order.id !== id)
}
