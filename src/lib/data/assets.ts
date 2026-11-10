import type { Asset } from './types'

let assets: Asset[] = [
  { id: 'AST-001', tag: 'LT-0231', name: 'MacBook Pro 14', category: 'Laptop', assignedTo: 'Olivia Martin', location: 'HQ — Floor 3', purchaseDate: '2025-03-14', warrantyEnd: '2027-03-14', value: 2399, status: 'In Use' },
  { id: 'AST-002', tag: 'LT-0232', name: 'ThinkPad X1 Carbon', category: 'Laptop', assignedTo: 'Jackson Lee', location: 'HQ — Floor 2', purchaseDate: '2025-06-02', warrantyEnd: '2027-06-02', value: 1899, status: 'In Use' },
  { id: 'AST-003', tag: 'MN-0087', name: 'Dell UltraSharp 27', category: 'Monitor', assignedTo: 'Isabella Nguyen', location: 'HQ — Floor 3', purchaseDate: '2025-01-20', warrantyEnd: '2026-01-20', value: 549, status: 'In Use' },
  { id: 'AST-004', tag: 'PH-0150', name: 'iPhone 15 Pro', category: 'Phone', assignedTo: 'William Kim', location: 'Remote', purchaseDate: '2025-02-11', warrantyEnd: '2026-02-11', value: 1099, status: 'Maintenance' },
  { id: 'AST-005', tag: 'VH-0003', name: 'Ford Transit Van', category: 'Vehicle', assignedTo: 'Logistics Team', location: 'Warehouse A', purchaseDate: '2024-09-30', warrantyEnd: '2027-09-30', value: 41500, status: 'In Use' },
  { id: 'AST-006', tag: 'LT-0233', name: 'MacBook Air 13', category: 'Laptop', assignedTo: '', location: 'HQ — IT Storage', purchaseDate: '2025-08-19', warrantyEnd: '2027-08-19', value: 1299, status: 'Available' },
  { id: 'AST-007', tag: 'PR-0042', name: 'Zebra Label Printer', category: 'Printer', assignedTo: 'Warehouse A', location: 'Warehouse A', purchaseDate: '2024-11-05', warrantyEnd: '2026-11-05', value: 780, status: 'In Use' },
  { id: 'AST-008', tag: 'SR-0012', name: 'Dell PowerEdge R750', category: 'Server', assignedTo: 'IT Team', location: 'HQ — Server Room', purchaseDate: '2024-05-22', warrantyEnd: '2029-05-22', value: 8900, status: 'In Use' },
  { id: 'AST-009', tag: 'LT-0119', name: 'ThinkPad T14', category: 'Laptop', assignedTo: 'Emma Davis', location: 'Remote', purchaseDate: '2023-12-01', warrantyEnd: '2025-12-01', value: 1450, status: 'Maintenance' },
  { id: 'AST-010', tag: 'DS-0056', name: 'Sonos Docking Station', category: 'Peripheral', assignedTo: '', location: 'HQ — Floor 1', purchaseDate: '2023-07-14', warrantyEnd: '2024-07-14', value: 449, status: 'Retired' },
  { id: 'AST-011', tag: 'TB-0033', name: 'Caldigit TS4 Dock', category: 'Peripheral', assignedTo: 'Noah Patel', location: 'HQ — Floor 2', purchaseDate: '2025-04-08', warrantyEnd: '2027-04-08', value: 380, status: 'In Use' },
  { id: 'AST-012', tag: 'CN-0007', name: 'Sony Conference Camera', category: 'AV Equipment', assignedTo: '', location: 'HQ — Meeting Room B', purchaseDate: '2025-05-30', warrantyEnd: '2027-05-30', value: 1250, status: 'Available' },
]

export const listAssets = () => [...assets]
export const getAsset = (id: string) => assets.find((asset) => asset.id === id)
export const createAsset = (asset: Omit<Asset, 'id'>) => {
  const created = { ...asset, id: `AST-${String(assets.length + 1).padStart(3, '0')}` }
  assets = [created, ...assets]
  return created
}
export const updateAsset = (id: string, updates: Partial<Asset>) => {
  assets = assets.map((asset) => asset.id === id ? { ...asset, ...updates } : asset)
  return getAsset(id)
}
export const removeAsset = (id: string) => {
  assets = assets.filter((asset) => asset.id !== id)
}
