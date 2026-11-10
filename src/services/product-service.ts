import { type Product } from '@/lib/data/types'
import {
  createProduct,
  getProduct,
  listProducts,
  removeProduct,
  updateProduct,
} from '@/lib/data/products'

export interface ProductService {
  list(): Product[]
  get(id: string): Product | undefined
  create(input: Omit<Product, 'id' | 'sales'>): Product
  update(id: string, updates: Partial<Product>): Product | undefined
  remove(id: string): void
}

export const productService: ProductService = {
  list: listProducts,
  get: getProduct,
  create: createProduct,
  update: updateProduct,
  remove: removeProduct,
}
