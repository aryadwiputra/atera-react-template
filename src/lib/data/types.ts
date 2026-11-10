export type OrderStatus = 'Paid' | 'Pending' | 'Refunded'
export type ProductStatus = 'Active' | 'Draft' | 'Archived'
export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Moderator'

export type Order = {
  id: string
  customer: string
  customerEmail: string
  product: string
  status: OrderStatus
  amount: number
  date: string
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  sales: number
}

export type Customer = {
  id: string
  name: string
  email: string
  company: string
  orders: number
  spent: number
  joined: string
}

export type Invoice = {
  id: string
  customer: string
  date: string
  dueDate: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
}

export type PosItem = {
  id: string
  name: string
  category: 'Coffee' | 'Tea' | 'Food'
  price: number
  stock: number
}

export type PosCartLine = {
  item: PosItem
  quantity: number
}

export type PosPaymentMethod = 'Cash' | 'Card' | 'QRIS'

export type TransactionStatus = 'Cleared' | 'Pending'
export type TransactionType = 'Income' | 'Expense'

export type FinanceTransaction = {
  id: string
  date: string
  description: string
  category: string
  type: TransactionType
  amount: number
  status: TransactionStatus
}

export type DealStage = 'new' | 'contacted' | 'qualified' | 'won' | 'lost'

export type Deal = {
  id: string
  company: string
  contact: string
  email: string
  value: number
  stage: DealStage
  owner: string
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'Active' | 'Inactive' | 'Invited' | 'Suspended'
  department: string
  lastActive: string
}

export type FileItem = {
  id: string
  name: string
  type: 'folder' | 'document' | 'image' | 'spreadsheet'
  size?: string
  updated: string
  owner: string
}

export type EditorDocument = {
  id: string
  title: string
  content: string
  updatedAt: string
}

export type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'order' | 'team' | 'report' | 'system'
}

export type AuthSession = {
  email: string
  name: string
  authenticatedAt: string
}

export type AuthResult =
  | { ok: true; session?: AuthSession }
  | { ok: false; message: 'invalidCredentials' | 'accountExists' | 'invalidEmail' }
