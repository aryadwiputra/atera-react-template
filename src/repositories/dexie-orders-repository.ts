import {
    db,
    ensureSeeded,
    exportWorkspace,
    importWorkspace,
    resetDatabase,
} from '@/lib/db/database';
import type { Order } from '@/lib/data/types';
import type { ImportResult, OrdersRepository, WorkspaceSnapshot } from './orders-repository';

function nextOrderId(orders: Order[]): string {
    const max = orders.reduce((acc, order) => {
        const match = /^ORD-(\d+)$/.exec(order.id);
        if (!match) return acc;
        const value = Number(match[1]);
        return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, 7300);
    return `ORD-${max + 1}`;
}

export class DexieOrdersRepository implements OrdersRepository {
    async list(): Promise<Order[]> {
        const orders = await db.orders.toArray();
        return orders.sort((a, b) => {
            if (a.date !== b.date) return a.date < b.date ? 1 : -1;
            if (a.id === b.id) return 0;
            return a.id < b.id ? 1 : -1;
        });
    }

    async get(id: string): Promise<Order | undefined> {
        return db.orders.get(id);
    }

    async create(input: Omit<Order, 'id'>): Promise<Order> {
        await ensureSeeded();
        const orders = await db.orders.toArray();
        const order: Order = { ...input, id: nextOrderId(orders) };
        await db.orders.add(order);
        return order;
    }

    async update(id: string, updates: Partial<Order>): Promise<Order | undefined> {
        return db.transaction('rw', db.orders, async () => {
            const existing = await db.orders.get(id);
            if (!existing) return undefined;
            const updated: Order = { ...existing, ...updates, id };
            await db.orders.put(updated);
            return updated;
        });
    }

    async remove(id: string): Promise<void> {
        await db.orders.delete(id);
    }

    async export(): Promise<WorkspaceSnapshot> {
        return exportWorkspace();
    }

    async import(payload: unknown): Promise<ImportResult> {
        return importWorkspace(payload);
    }

    async reset(): Promise<void> {
        return resetDatabase();
    }
}
