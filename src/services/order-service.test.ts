import { beforeEach, describe, expect, it } from 'vitest';
import { resetDatabase } from '@/lib/db/database';
import { orderService } from './order-service';

describe('orderService', () => {
    beforeEach(async () => {
        await resetDatabase();
    });

    it('lists the seeded orders', async () => {
        const orders = await orderService.list();
        expect(orders.length).toBeGreaterThan(0);
    });

    it('creates, updates and removes an order', async () => {
        const created = await orderService.create({
            customer: 'Test Customer',
            customerEmail: 'test@example.com',
            product: 'Test plan',
            status: 'Pending',
            amount: 10,
            date: '2026-01-01',
        });

        expect((await orderService.get(created.id))?.customer).toBe('Test Customer');

        const updated = await orderService.update(created.id, { status: 'Paid' });
        expect(updated?.status).toBe('Paid');

        await orderService.remove(created.id);
        expect(await orderService.get(created.id)).toBeUndefined();
    });

    it('exports the seeded workspace', async () => {
        const snapshot = await orderService.export();

        expect(snapshot.app).toBe('atera');
        expect(snapshot.version).toBe(1);
        expect(snapshot.orders).toHaveLength(5);
    });

    it('imports a snapshot and replaces the current orders', async () => {
        const created = await orderService.create({
            customer: 'Imported Customer',
            customerEmail: 'imported@example.com',
            product: 'Imported plan',
            status: 'Paid',
            amount: 20,
            date: '2026-02-02',
        });
        const snapshot = await orderService.export();
        expect(snapshot.orders).toHaveLength(6);

        await orderService.reset();
        expect(await orderService.list()).toHaveLength(5);

        const result = await orderService.import(snapshot);
        expect(result).toEqual({ ok: true });

        const orders = await orderService.list();
        expect(orders).toHaveLength(6);
        expect(orders.some((order) => order.id === created.id)).toBe(true);
        expect(orders.some((order) => order.customer === 'Imported Customer')).toBe(true);
    });

    it('rejects an invalid import payload', async () => {
        const result = await orderService.import({
            app: 'atera',
            version: 1,
            orders: [{ id: '' }],
        });

        expect(result.ok).toBe(false);
        expect(await orderService.list()).toHaveLength(5);
    });
});
