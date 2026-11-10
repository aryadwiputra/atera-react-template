import { Banknote, Coffee, Cookie, Minus, Plus, Receipt, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useToast } from '@/components/shared/toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listCategories, listPosItems } from '@/lib/data/pos'
import type { PosCartLine, PosItem, PosPaymentMethod } from '@/lib/data/types'
import { cn } from '@/lib/utils'

const TAX_RATE = 0.11
const CURRENCY = 'Rp'

const formatMoney = (value: number) => `${CURRENCY} ${value.toLocaleString('en-US')}`

const categoryIcons: Record<PosItem['category'], typeof Coffee> = {
  Coffee,
  Tea: Coffee,
  Food: Cookie,
}

export default function PosPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const allItems = useMemo(() => listPosItems(), [])
  const categories = useMemo(() => listCategories(), [])

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [cartLines, setCartLines] = useState<PosCartLine[]>([])
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>('Cash')
  const [customerName, setCustomerName] = useState('Walk-in customer')
  const [customerEmail, setCustomerEmail] = useState('walkin@example.com')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [receipt, setReceipt] = useState<{
    id: string
    total: number
    paymentMethod: PosPaymentMethod
    items: { name: string; quantity: number; priceAtTime: number }[]
    date: string
  } | null>(null)

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  const subtotal = cartLines.reduce((sum, line) => sum + line.item.price * line.quantity, 0)
  const discount = subtotal * (discountPercent / 100)
  const taxable = subtotal - discount
  const tax = taxable * TAX_RATE
  const total = taxable + tax

  const addItem = (item: PosItem) => {
    setCartLines((current) => {
      const existing = current.find((line) => line.item.id === item.id)
      if (existing) {
        return current.map((line) => line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line)
      }
      return [...current, { item, quantity: 1 }]
    })
  }

  const changeQuantity = (id: string, delta: number) => {
    setCartLines((current) => current
      .map((line) => line.item.id === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0)
    )
  }

  const removeLine = (id: string) => {
    setCartLines((current) => current.filter((line) => line.item.id !== id))
  }

  const resetCart = () => {
    setCartLines([])
    setDiscountPercent(0)
    setPaymentMethod('Cash')
    setCustomerName('Walk-in customer')
    setCustomerEmail('walkin@example.com')
  }

  const handleCharge = () => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`
    setReceipt({
      id,
      total,
      paymentMethod,
      items: cartLines.map((line) => ({ name: line.item.name, quantity: line.quantity, priceAtTime: line.item.price })),
      date: new Date().toISOString(),
    })
    setConfirmOpen(false)
    resetCart()
    toast({ title: 'Order completed', description: `Receipt ${id} ready to print.` })
  }

  return (
    <PageTransition>
      <main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('pointOfSale')}
          description="Process a sale from start to finish."
          breadcrumbs={[{ title: 'Commerce', href: '#' }, { title: t('pointOfSale'), href: '/pos' }]}
        />

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Catalog */}
          <section className="flex min-h-0 flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search menu..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-300',
                    activeCategory === category
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const Icon = categoryIcons[item.category]
                const inCart = cartLines.find((line) => line.item.id === item.id)?.quantity ?? 0
                return (
                  <Card
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Add ${item.name} to cart`}
                    onClick={() => addItem(item)}
                    onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); addItem(item) } }}
                    className={cn(
                      'cursor-pointer transition-colors duration-300 hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      inCart > 0 && 'border-primary/40 bg-accent/20',
                    )}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-semibold">{formatMoney(item.price)}</span>
                          <Badge variant="outline" className="text-xs">Stock {item.stock}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filteredItems.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No items match your search.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Cart */}
          <section className="flex min-h-0 flex-col gap-4">
            <Card className="flex min-h-0 flex-1 flex-col">
              <CardHeader>
                <CardTitle>Current order</CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="flex gap-2">
                  <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" />
                  <Input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Email" type="email" />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border p-3">
                  {cartLines.length === 0 ? (
                    <div className="flex h-full min-h-32 items-center justify-center text-sm text-muted-foreground">
                      Tap an item to start the order.
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {cartLines.map((line) => (
                        <li key={line.item.id} className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{line.item.name}</p>
                            <p className="text-xs text-muted-foreground">{formatMoney(line.item.price)} each</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => changeQuantity(line.item.id, -1)} aria-label={`Decrease ${line.item.name}`}>
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => changeQuantity(line.item.id, 1)} aria-label={`Increase ${line.item.name}`}>
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          <p className="w-20 text-right text-sm font-medium tabular-nums">{formatMoney(line.item.price * line.quantity)}</p>
                          <Button type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={() => removeLine(line.item.id)} aria-label={`Remove ${line.item.name}`}>
                            <Trash2 className="size-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2">
                      Discount
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="h-7 w-16"
                        value={discountPercent}
                        onChange={(event) => setDiscountPercent(Math.max(0, Math.min(100, Number(event.target.value))))}
                      />
                      %
                    </label>
                    <span className="tabular-nums text-muted-foreground">-{formatMoney(discount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax (11%)</span>
                    <span className="tabular-nums">{formatMoney(tax)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{formatMoney(total)}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Cash', 'Card', 'QRIS'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-300',
                          paymentMethod === method
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                      >
                        {method === 'Cash' && <Banknote className="size-4" />}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={cartLines.length === 0}
                  onClick={() => setConfirmOpen(true)}
                >
                  Charge {formatMoney(total)}
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm charge</DialogTitle>
            <DialogDescription>
              {cartLines.length} item{cartLines.length === 1 ? '' : 's'} · Total {formatMoney(total)} · {paymentMethod}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleCharge}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receipt !== null} onOpenChange={(open) => { if (!open) setReceipt(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="size-5" />
              Payment received
            </DialogTitle>
            <DialogDescription>
              Order {receipt?.id} · {receipt && new Date(receipt.date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-lg border p-3 text-sm">
                {receipt.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between">
                    <span>{item.quantity} × {item.name}</span>
                    <span className="tabular-nums">{formatMoney(item.priceAtTime * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Paid via {receipt.paymentMethod}</span>
                <span className="tabular-nums">{formatMoney(receipt.total)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => window.print()}>Print</Button>
            <Button onClick={() => setReceipt(null)}>New order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
