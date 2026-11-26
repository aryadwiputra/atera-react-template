import { orderService } from '@/services/order-service';
import { productService } from '@/services/product-service';
import { customerService } from '@/services/customer-service';
import { invoiceService } from '@/services/invoice-service';
import { userService } from '@/services/user-service';

const MAX_PER_SECTION = 5;

const matches = (query: string, fields: (string | number | undefined)[]) => {
    const q = query.toLowerCase();
    return fields.some((field) => field !== undefined && String(field).toLowerCase().includes(q));
};

export type SearchSection = {
    key: string;
    label: string;
    href: string;
    items: { id: string; title: string; subtitle: string; href: string }[];
};

export function buildSearchSections(query: string): SearchSection[] {
    const q = query.trim();
    if (!q) return [];
    const sections: SearchSection[] = [
        {
            key: 'orders',
            label: 'Orders',
            href: '/orders',
            items: orderService
                .list()
                .filter((o) => matches(q, [o.id, o.customer, o.product, o.status]))
                .slice(0, MAX_PER_SECTION)
                .map((o) => ({
                    id: o.id,
                    title: `${o.id} — ${o.customer}`,
                    subtitle: `${o.product} · $${o.amount}`,
                    href: `/orders/${o.id}`,
                })),
        },
        {
            key: 'products',
            label: 'Products',
            href: '/products',
            items: productService
                .list()
                .filter((p) => matches(q, [p.name, p.category, p.status]))
                .slice(0, MAX_PER_SECTION)
                .map((p) => ({
                    id: p.id,
                    title: p.name,
                    subtitle: p.category,
                    href: `/products/${p.id}`,
                })),
        },
        {
            key: 'customers',
            label: 'Customers',
            href: '/customers',
            items: customerService
                .list()
                .filter((c) => matches(q, [c.name, c.email, c.company]))
                .slice(0, MAX_PER_SECTION)
                .map((c) => ({
                    id: c.id,
                    title: c.name,
                    subtitle: c.company,
                    href: `/customers/${c.id}`,
                })),
        },
        {
            key: 'invoices',
            label: 'Invoices',
            href: '/invoices',
            items: invoiceService
                .list()
                .filter((i) => matches(q, [i.id, i.customer]))
                .slice(0, MAX_PER_SECTION)
                .map((i) => ({
                    id: i.id,
                    title: i.id,
                    subtitle: `${i.customer} · $${i.amount}`,
                    href: '/invoices',
                })),
        },
        {
            key: 'users',
            label: 'Users',
            href: '/users',
            items: userService
                .list()
                .filter((u) => matches(q, [u.name, u.email]))
                .slice(0, MAX_PER_SECTION)
                .map((u) => ({ id: u.id, title: u.name, subtitle: u.email, href: '/users' })),
        },
    ];
    return sections.filter((section) => section.items.length > 0);
}
