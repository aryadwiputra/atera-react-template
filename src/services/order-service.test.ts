import { describe, expect, it } from 'vitest';
import { orderService } from './order-service';

describe('orderService', () => {
    it('lists the seeded orders', () => {
        expect(orderService.list().length).toBeGreaterThan(0);
    });

    it('creates, updates and removes an order', () => {
        const created = orderService.create({
            customer: 'Test Customer',
            customerEmail: 'test@example.com',
            product: 'Test plan',
            status: 'Pending',
            amount: 10,
            date: '2026-01-01',
        });

        expect(orderService.get(created.id)?.customer).toBe('Test Customer');

        const updated = orderService.update(created.id, { status: 'Paid' });
        expect(updated?.status).toBe('Paid');

        orderService.remove(created.id);
        expect(orderService.get(created.id)).toBeUndefined();
    });
});
