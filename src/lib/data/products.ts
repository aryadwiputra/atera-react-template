import type { Product } from './types'

let products: Product[] = [
  { id: 'PRD-001', name: 'Pro subscription', category: 'Subscriptions', price: 249, stock: 999, status: 'Active', sales: 842 },
  { id: 'PRD-002', name: 'Team plan', category: 'Subscriptions', price: 129, stock: 999, status: 'Active', sales: 621 },
  { id: 'PRD-003', name: 'Starter plan', category: 'Subscriptions', price: 49, stock: 999, status: 'Active', sales: 418 },
  { id: 'PRD-004', name: 'Onboarding package', category: 'Services', price: 799, stock: 24, status: 'Draft', sales: 65 },
]

export const listProducts = () => [...products]
export const getProduct = (id: string) => products.find((product) => product.id === id)
export const createProduct = (product: Omit<Product, 'id' | 'sales'>) => {
  const created = { ...product, id: `PRD-${String(products.length + 1).padStart(3, '0')}`, sales: 0 }
  products = [created, ...products]
  return created
}
export const updateProduct = (id: string, updates: Partial<Product>) => {
  products = products.map((product) => product.id === id ? { ...product, ...updates } : product)
  return getProduct(id)
}
export const removeProduct = (id: string) => {
  products = products.filter((product) => product.id !== id)
}
