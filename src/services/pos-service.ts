import { createOrderFromCart, getPosItem, listCategories, listPosItems } from '@/lib/data/pos'
import { type PosCartLine, type PosItem, type PosPaymentMethod } from '@/lib/data/types'

export interface PosService {
  listItems(): PosItem[]
  getItem(id: string): PosItem | undefined
  listCategories(): string[]
  createOrder(cartLines: PosCartLine[], total: number, paymentMethod: PosPaymentMethod, customer: string, customerEmail: string): void
}

export const posService: PosService = {
  listItems: listPosItems,
  getItem: getPosItem,
  listCategories,
  createOrder: createOrderFromCart,
}
