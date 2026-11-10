import type { InventoryItem } from './types'

let inventory: InventoryItem[] = [
  { id: 'INV-001', sku: 'SKU-1001', name: 'USB-C dock, 12-port', warehouse: 'Warehouse A', onHand: 142, reserved: 20, reorderPoint: 40 },
  { id: 'INV-002', sku: 'SKU-1002', name: 'Mechanical keyboard', warehouse: 'Warehouse A', onHand: 88, reserved: 15, reorderPoint: 30 },
  { id: 'INV-003', sku: 'SKU-1003', name: '27-inch monitor', warehouse: 'Warehouse B', onHand: 35, reserved: 10, reorderPoint: 40 },
  { id: 'INV-004', sku: 'SKU-1004', name: 'Standing desk', warehouse: 'Warehouse B', onHand: 12, reserved: 6, reorderPoint: 10 },
  { id: 'INV-005', sku: 'SKU-1005', name: 'Ergonomic chair', warehouse: 'Warehouse B', onHand: 24, reserved: 8, reorderPoint: 15 },
  { id: 'INV-006', sku: 'SKU-1006', name: 'HDMI cable 2m', warehouse: 'Warehouse A', onHand: 320, reserved: 40, reorderPoint: 100 },
  { id: 'INV-007', sku: 'SKU-1007', name: 'Webcam 4K', warehouse: 'Warehouse A', onHand: 9, reserved: 0, reorderPoint: 25 },
  { id: 'INV-008', sku: 'SKU-1008', name: 'Barcode scanner', warehouse: 'Warehouse C', onHand: 18, reserved: 6, reorderPoint: 12 },
  { id: 'INV-009', sku: 'SKU-1009', name: 'Pallet rack section', warehouse: 'Warehouse C', onHand: 7, reserved: 0, reorderPoint: 4 },
  { id: 'INV-010', sku: 'SKU-1010', name: 'SSD 2TB NVMe', warehouse: 'Warehouse A', onHand: 61, reserved: 18, reorderPoint: 30 },
  { id: 'INV-011', sku: 'SKU-1011', name: 'Torque wrench set', warehouse: 'Warehouse C', onHand: 4, reserved: 2, reorderPoint: 6 },
  { id: 'INV-012', sku: 'SKU-1012', name: 'Paper A4, box', warehouse: 'Warehouse B', onHand: 210, reserved: 30, reorderPoint: 80 },
  { id: 'INV-013', sku: 'SKU-1013', name: 'Forklift battery', warehouse: 'Warehouse C', onHand: 2, reserved: 0, reorderPoint: 2 },
  { id: 'INV-014', sku: 'SKU-1014', name: 'USB hub', warehouse: 'Warehouse A', onHand: 0, reserved: 0, reorderPoint: 20 },
  { id: 'INV-015', sku: 'SKU-1015', name: 'Label roll, 4x6', warehouse: 'Warehouse C', onHand: 96, reserved: 12, reorderPoint: 50 },
]

export const listInventory = () => [...inventory]
