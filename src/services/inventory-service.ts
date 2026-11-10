import { type InventoryItem } from '@/lib/data/types'
import { listInventory } from '@/lib/data/inventory'

export interface InventoryService {
  list(): InventoryItem[]
}

export const inventoryService: InventoryService = {
  list: listInventory,
}
