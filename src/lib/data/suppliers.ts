import type { Supplier } from './types'

let suppliers: Supplier[] = [
  { id: 'SUP-001', name: 'Nordic Components AB', contact: 'Erik Lindqvist', email: 'erik@nordiccomponents.se', phone: '+46 8 555 011 22', country: 'Sweden', rating: 4.6, onTimeRate: 96, status: 'Active' },
  { id: 'SUP-002', name: 'Shenzhen ElectroParts', contact: 'Wei Zhang', email: 'wei.zhang@szelectro.cn', phone: '+86 755 5550 8811', country: 'China', rating: 4.2, onTimeRate: 89, status: 'Active' },
  { id: 'SUP-003', name: 'Berlin Office Supply', contact: 'Anna Keller', email: 'a.keller@berlinoffice.de', phone: '+49 30 5550 4412', country: 'Germany', rating: 4.8, onTimeRate: 98, status: 'Active' },
  { id: 'SUP-004', name: 'Pacific Logistics Co', contact: 'Grace Tanaka', email: 'gtanaka@paclog.co.jp', phone: '+81 3 5550 7733', country: 'Japan', rating: 3.9, onTimeRate: 84, status: 'On Hold' },
  { id: 'SUP-005', name: 'Tokyo Precision Tools', contact: 'Hiroshi Sato', email: 'hsato@tokyoprecision.jp', phone: '+81 45 5550 2244', country: 'Japan', rating: 4.7, onTimeRate: 95, status: 'Active' },
  { id: 'SUP-006', name: 'Amsterdam Hardware BV', contact: 'Sanne de Vries', email: 'sanne@amshardware.nl', phone: '+31 20 5550 6677', country: 'Netherlands', rating: 4.4, onTimeRate: 92, status: 'Active' },
  { id: 'SUP-007', name: 'Lyon Packaging SARL', contact: 'Théo Moreau', email: 't.moreau@lyonpack.fr', phone: '+33 4 5550 1188', country: 'France', rating: 4.0, onTimeRate: 87, status: 'Active' },
  { id: 'SUP-008', name: 'Austin Tech Depot', contact: 'Maria Gonzales', email: 'maria@austintech.com', phone: '+1 512 555 0192', country: 'USA', rating: 4.5, onTimeRate: 93, status: 'Active' },
  { id: 'SUP-009', name: 'Warsaw Metal Works', contact: 'Piotr Kowalski', email: 'pkowalski@warsawmetal.pl', phone: '+48 22 5550 3355', country: 'Poland', rating: 3.8, onTimeRate: 81, status: 'On Hold' },
  { id: 'SUP-010', name: 'Oslo Safety Gear', contact: 'Ingrid Berg', email: 'ingrid@oslosafety.no', phone: '+47 2 5550 9944', country: 'Norway', rating: 4.3, onTimeRate: 90, status: 'Active' },
]

export const listSuppliers = () => [...suppliers]
export const getSupplier = (id: string) => suppliers.find((supplier) => supplier.id === id)
export const createSupplier = (supplier: Omit<Supplier, 'id'>) => {
  const created = { ...supplier, id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}` }
  suppliers = [created, ...suppliers]
  return created
}
export const updateSupplier = (id: string, updates: Partial<Supplier>) => {
  suppliers = suppliers.map((supplier) => supplier.id === id ? { ...supplier, ...updates } : supplier)
  return getSupplier(id)
}
