import type { useTranslations } from '@/i18n'

export type Translator = ReturnType<typeof useTranslations>

export type Metric = {
  label: 'totalRevenue' | 'activeUsers' | 'totalOrders' | 'pageViews'
  value: string
  change: string
  positive: boolean
}

export const metrics: Metric[] = [
  { label: 'totalRevenue', value: '$48,295', change: '+12.5%', positive: true },
  { label: 'activeUsers', value: '2,847', change: '+8.2%', positive: true },
  { label: 'totalOrders', value: '1,432', change: '-3.1%', positive: false },
  { label: 'pageViews', value: '284K', change: '+24.7%', positive: true },
]

export const chartData = [42, 56, 48, 68, 60, 78, 66, 88, 75, 96, 84, 100]

export const orders = [
  { customer: 'Olivia Martin', id: '#ORD-7291', product: 'Pro subscription', status: 'Paid', amount: '$249.00' },
  { customer: 'Jackson Lee', id: '#ORD-7289', product: 'Team plan', status: 'Pending', amount: '$129.00' },
  { customer: 'Isabella Nguyen', id: '#ORD-7286', product: 'Starter plan', status: 'Paid', amount: '$49.00' },
  { customer: 'William Kim', id: '#ORD-7281', product: 'Pro subscription', status: 'Refunded', amount: '$249.00' },
]

export type Activity = {
  title: 'newOrderReceived' | 'paymentCompleted' | 'newCustomerJoined' | 'reportGenerated'
  description: 'orderPlaced' | 'paymentFrom' | 'joinedYourTeam' | 'salesReportReady'
  detail?: string
  time: string
}

export const activities: Activity[] = [
  { title: 'newOrderReceived', description: 'orderPlaced', detail: 'Order #ORD-7291', time: '2m ago' },
  { title: 'paymentCompleted', description: 'paymentFrom', detail: 'Olivia Martin', time: '18m ago' },
  { title: 'newCustomerJoined', description: 'joinedYourTeam', detail: 'Jackson Lee', time: '1h ago' },
  { title: 'reportGenerated', description: 'salesReportReady', time: '3h ago' },
]
