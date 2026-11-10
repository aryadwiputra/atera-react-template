import { useSearchParams, Link } from 'react-router'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { NoSearchResultsState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listOrders } from '@/lib/data/orders'
import { listProducts } from '@/lib/data/products'
import { listCustomers } from '@/lib/data/customers'
import { listInvoices } from '@/lib/data/invoices'
import { listUsers } from '@/lib/data/users'

const MAX_PER_SECTION = 5

const matches = (query: string, fields: (string | number | undefined)[]) => {
  const q = query.toLowerCase()
  return fields.some((field) => field !== undefined && String(field).toLowerCase().includes(q))
}

export type SearchSection = {
  key: string
  label: string
  href: string
  items: { id: string; title: string; subtitle: string; href: string }[]
}

export function buildSearchSections(query: string): SearchSection[] {
  const q = query.trim()
  if (!q) return []
  const sections: SearchSection[] = [
    {
      key: 'orders',
      label: 'Orders',
      href: '/orders',
      items: listOrders()
        .filter((o) => matches(q, [o.id, o.customer, o.product, o.status]))
        .slice(0, MAX_PER_SECTION)
        .map((o) => ({ id: o.id, title: `${o.id} — ${o.customer}`, subtitle: `${o.product} · $${o.amount}`, href: `/orders/${o.id}` })),
    },
    {
      key: 'products',
      label: 'Products',
      href: '/products',
      items: listProducts()
        .filter((p) => matches(q, [p.name, p.category, p.status]))
        .slice(0, MAX_PER_SECTION)
        .map((p) => ({ id: p.id, title: p.name, subtitle: p.category, href: `/products/${p.id}` })),
    },
    {
      key: 'customers',
      label: 'Customers',
      href: '/customers',
      items: listCustomers()
        .filter((c) => matches(q, [c.name, c.email, c.company]))
        .slice(0, MAX_PER_SECTION)
        .map((c) => ({ id: c.id, title: c.name, subtitle: c.company, href: `/customers/${c.id}` })),
    },
    {
      key: 'invoices',
      label: 'Invoices',
      href: '/invoices',
      items: listInvoices()
        .filter((i) => matches(q, [i.id, i.customer]))
        .slice(0, MAX_PER_SECTION)
        .map((i) => ({ id: i.id, title: i.id, subtitle: `${i.customer} · $${i.amount}`, href: '/invoices' })),
    },
    {
      key: 'users',
      label: 'Users',
      href: '/users',
      items: listUsers()
        .filter((u) => matches(q, [u.name, u.email]))
        .slice(0, MAX_PER_SECTION)
        .map((u) => ({ id: u.id, title: u.name, subtitle: u.email, href: '/users' })),
    },
  ]
  return sections.filter((section) => section.items.length > 0)
}

export default function SearchPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const sections = buildSearchSections(query)
  const total = sections.reduce((sum, section) => sum + section.items.length, 0)
  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('searchResults')}
          description={query ? `${t('searchResultsFor')} "${query}"` : t('searchResultsDescription')}
          breadcrumbs={[{ title: t('searchResults'), href: '/search' }]}
        />
        {query && total === 0 && <NoSearchResultsState query={query} />}
        {(!query || total > 0) && (
          <div className="mx-auto w-full max-w-3xl space-y-4">
            {!query && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Search className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{t('searchPrompt')}</p>
              </div>
            )}
            {sections.map((section) => (
              <Card key={section.key} className="shadow-none">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-sm">{section.label}</CardTitle>
                  <Badge variant="secondary">{section.items.length}</Badge>
                </CardHeader>
                <CardContent className="divide-y">
                  {section.items.map((item) => (
                    <Link key={item.id} to={item.href} className="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-foreground">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </PageTransition>
  )
}
