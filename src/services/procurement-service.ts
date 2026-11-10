import { type PurchaseOrder } from '@/lib/data/types'
import { getPurchaseOrder, listPurchaseOrders, poTotal, updatePurchaseOrder } from '@/lib/data/procurement'

export interface ProcurementService {
  list(): PurchaseOrder[]
  get(id: string): PurchaseOrder | undefined
  update(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | undefined
  total(po: PurchaseOrder): number
}

export const procurementService: ProcurementService = {
  list: listPurchaseOrders,
  get: getPurchaseOrder,
  update: updatePurchaseOrder,
  total: poTotal,
}
