import { type Order } from '@/lib/data/types'
import { createOrder, getOrder, listOrders, removeOrder, updateOrder } from '@/lib/data/orders'

export interface OrderService {
  list(): Order[]
  get(id: string): Order | undefined
  create(input: Omit<Order, 'id'>): Order
  update(id: string, updates: Partial<Order>): Order | undefined
  remove(id: string): void
}

export const orderService: OrderService = {
  list: listOrders,
  get: getOrder,
  create: createOrder,
  update: updateOrder,
  remove: removeOrder,
}
