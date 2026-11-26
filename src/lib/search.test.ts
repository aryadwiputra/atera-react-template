import { describe, expect, it } from 'vitest';
import type { Order } from '@/lib/data/types';
import { buildSearchSections } from './search';

describe('buildSearchSections', () => {
    it('returns no sections for an empty query', () => {
        expect(buildSearchSections('   ')).toEqual([]);
    });

    it('finds a seeded order by customer name', () => {
        const orders: Order[] = [
            {
                id: 'ORD-7291',
                customer: 'Olivia Martin',
                customerEmail: 'olivia@example.com',
                product: 'Pro subscription',
                status: 'Paid',
                amount: 249,
                date: '2026-11-05',
            },
        ];
        const sections = buildSearchSections('Olivia', orders);

        expect(sections.some((section) => section.key === 'orders')).toBe(true);
    });
});
