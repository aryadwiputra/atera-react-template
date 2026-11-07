import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Translator } from './types'
import { orders } from './types'

const headings = ['customer', 'orderId', 'product', 'status', 'amount'] as const

export function RecentOrders({ t }: { t: Translator }) {
  return <Card className="min-w-0 gap-4 py-5 shadow-none"><CardHeader className="flex-row items-center justify-between px-5"><div><CardTitle className="text-base">{t('recentOrders')}</CardTitle><CardDescription className="mt-1 text-xs">{t('latestTransactions')}</CardDescription></div><Button variant="ghost" size="sm" className="h-7 text-xs">{t('viewAll')} <ChevronRight className="size-3.5" /></Button></CardHeader><CardContent className="overflow-x-auto px-5"><table className="w-full min-w-[560px] text-left text-xs"><thead className="border-b text-[10px] tracking-wider text-muted-foreground uppercase"><tr>{headings.map((heading) => <th key={heading} className="pb-3 font-medium">{t(heading)}</th>)}<th className="pb-3" /></tr></thead><tbody className="divide-y">{orders.map((order) => <tr key={order.id}><td className="py-3 font-medium">{order.customer}</td><td className="py-3 text-muted-foreground">{order.id}</td><td className="py-3 text-muted-foreground">{order.product}</td><td className="py-3"><Badge variant="outline" className="rounded-md px-1.5 py-0 text-[10px]">{t(order.status.toLowerCase() as 'paid' | 'pending' | 'refunded')}</Badge></td><td className="py-3 font-medium">{order.amount}</td><td className="py-3 text-right"><Button variant="ghost" size="icon" className="size-6"><MoreHorizontal className="size-3.5" /></Button></td></tr>)}</tbody></table></CardContent></Card>
}
