import { type Supplier } from '@/lib/data/types'
import { createSupplier, getSupplier, listSuppliers, updateSupplier } from '@/lib/data/suppliers'

export interface SupplierService {
  list(): Supplier[]
  get(id: string): Supplier | undefined
  create(input: Omit<Supplier, 'id'>): Supplier
  update(id: string, updates: Partial<Supplier>): Supplier | undefined
}

export const supplierService: SupplierService = {
  list: listSuppliers,
  get: getSupplier,
  create: createSupplier,
  update: updateSupplier,
}
