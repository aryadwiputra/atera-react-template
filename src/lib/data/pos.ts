import type { PosItem, PosCartLine, PosPaymentMethod } from './types'

const items: PosItem[] = [
  { id: 'POS-001', name: 'Double Espresso', category: 'Coffee', price: 9000, stock: 200 },
  { id: 'POS-002', name: 'Espresso', category: 'Coffee', price: 7000, stock: 200 },
  { id: 'POS-003', name: 'Americano', category: 'Coffee', price: 10000, stock: 200 },
  { id: 'POS-004', name: 'Cappuccino', category: 'Coffee', price: 13000, stock: 200 },
  { id: 'POS-005', name: 'Latte', category: 'Coffee', price: 14000, stock: 200 },
  { id: 'POS-006', name: 'Mocha', category: 'Coffee', price: 16000, stock: 200 },
  { id: 'POS-007', name: 'Cold Brew', category: 'Coffee', price: 15000, stock: 200 },
  { id: 'POS-008', name: 'Filter Coffee', category: 'Coffee', price: 8000, stock: 200 },
  { id: 'POS-009', name: 'Iced Tea', category: 'Tea', price: 10000, stock: 200 },
  { id: 'POS-010', name: 'Lemon Tea', category: 'Tea', price: 10000, stock: 200 },
  { id: 'POS-011', name: 'Matcha Latte', category: 'Tea', price: 15000, stock: 200 },
  { id: 'POS-012', name: 'Orange Juice', category: 'Tea', price: 12000, stock: 200 },
  { id: 'POS-013', name: 'Croissant', category: 'Food', price: 11000, stock: 50 },
  { id: 'POS-014', name: 'Scone', category: 'Food', price: 9000, stock: 50 },
  { id: 'POS-015', name: 'Muffin', category: 'Food', price: 10000, stock: 50 },
  { id: 'POS-016', name: 'Bagel', category: 'Food', price: 12000, stock: 50 },
]

export const listPosItems = () => [...items]
export const getPosItem = (id: string) => items.find((item) => item.id === id)

export const listCategories = () => ['Coffee', 'Tea', 'Food', 'All']

export const createOrderFromCart = (cartLines: PosCartLine[], total: number, paymentMethod: PosPaymentMethod, customer: string, customerEmail: string) => {
  return {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    customer,
    customerEmail,
    paymentMethod,
    total,
    items: cartLines.map((line) => ({ id: line.item.id, name: line.item.name, quantity: line.quantity, priceAtTime: line.item.price })),
    date: new Date().toISOString(),
    status: 'Paid' as const,
  }
}
