import type { PurchaseOrder } from './types'

let purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-1041', number: 'PO-1041', supplier: 'Nordic Components AB', items: [{ name: 'USB-C dock, 12-port', qty: 20, price: 149 }, { name: 'HDMI cable 2m', qty: 40, price: 12 }], date: '2026-10-28', expectedDelivery: '2026-11-14', status: 'Pending' },
  { id: 'PO-1040', number: 'PO-1040', supplier: 'Shenzhen ElectroParts', items: [{ name: 'Mechanical keyboard', qty: 15, price: 89 }], date: '2026-10-24', expectedDelivery: '2026-11-20', status: 'Draft' },
  { id: 'PO-1039', number: 'PO-1039', supplier: 'Berlin Office Supply', items: [{ name: 'Standing desk', qty: 6, price: 620 }, { name: 'Ergonomic chair', qty: 8, price: 340 }], date: '2026-10-20', expectedDelivery: '2026-11-06', status: 'Approved' },
  { id: 'PO-1038', number: 'PO-1038', supplier: 'Nordic Components AB', items: [{ name: '27-inch monitor', qty: 10, price: 549 }], date: '2026-10-15', expectedDelivery: '2026-10-30', status: 'Received' },
  { id: 'PO-1037', number: 'PO-1037', supplier: 'Pacific Logistics Co', items: [{ name: 'Pallet rack', qty: 4, price: 950 }, { name: 'Barcode scanner', qty: 6, price: 210 }], date: '2026-10-11', expectedDelivery: '2026-11-02', status: 'Approved' },
  { id: 'PO-1036', number: 'PO-1036', supplier: 'Shenzhen ElectroParts', items: [{ name: 'Webcam 4K', qty: 12, price: 130 }, { name: 'USB hub', qty: 25, price: 35 }], date: '2026-10-06', expectedDelivery: '2026-10-24', status: 'Received' },
  { id: 'PO-1035', number: 'PO-1035', supplier: 'Berlin Office Supply', items: [{ name: 'Paper A4, box', qty: 50, price: 28 }], date: '2026-09-30', expectedDelivery: '2026-10-14', status: 'Cancelled' },
  { id: 'PO-1034', number: 'PO-1034', supplier: 'Tokyo Precision Tools', items: [{ name: 'Torque wrench set', qty: 5, price: 260 }], date: '2026-09-24', expectedDelivery: '2026-10-18', status: 'Received' },
  { id: 'PO-1033', number: 'PO-1033', supplier: 'Pacific Logistics Co', items: [{ name: 'Forklift battery', qty: 2, price: 3200 }], date: '2026-09-18', expectedDelivery: '2026-10-09', status: 'Cancelled' },
  { id: 'PO-1032', number: 'PO-1032', supplier: 'Nordic Components AB', items: [{ name: 'SSD 2TB NVMe', qty: 18, price: 175 }], date: '2026-09-12', expectedDelivery: '2026-09-29', status: 'Received' },
]

export const listPurchaseOrders = () => [...purchaseOrders]
export const getPurchaseOrder = (id: string) => purchaseOrders.find((po) => po.id === id)
export const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
  purchaseOrders = purchaseOrders.map((po) => po.id === id ? { ...po, ...updates } : po)
  return getPurchaseOrder(id)
}
export const poTotal = (po: PurchaseOrder) => po.items.reduce((sum, item) => sum + item.qty * item.price, 0)
