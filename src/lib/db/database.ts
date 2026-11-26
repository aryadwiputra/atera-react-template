import Dexie, { type Table } from 'dexie';
import { z } from 'zod';
import type { Order } from '@/lib/data/types';
import type { ImportResult, WorkspaceSnapshot } from '@/repositories/orders-repository';

const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;

export const DB_NAME = isEmbedded ? 'atera-preview' : 'atera-local';

export const seedOrders: Order[] = [
    {
        id: 'ORD-7291',
        customer: 'Olivia Martin',
        customerEmail: 'olivia@example.com',
        product: 'Pro subscription',
        status: 'Paid',
        amount: 249,
        date: '2026-11-05',
    },
    {
        id: 'ORD-7289',
        customer: 'Jackson Lee',
        customerEmail: 'jackson@example.com',
        product: 'Team plan',
        status: 'Pending',
        amount: 129,
        date: '2026-11-04',
    },
    {
        id: 'ORD-7286',
        customer: 'Isabella Nguyen',
        customerEmail: 'isabella@example.com',
        product: 'Starter plan',
        status: 'Paid',
        amount: 49,
        date: '2026-11-03',
    },
    {
        id: 'ORD-7281',
        customer: 'William Kim',
        customerEmail: 'william@example.com',
        product: 'Pro subscription',
        status: 'Refunded',
        amount: 249,
        date: '2026-11-01',
    },
    {
        id: 'ORD-7278',
        customer: 'Emma Davis',
        customerEmail: 'emma@example.com',
        product: 'Enterprise plan',
        status: 'Paid',
        amount: 599,
        date: '2026-10-30',
    },
];

const orderSchema = z.object({
    id: z.string().min(1),
    customer: z.string(),
    customerEmail: z.email(),
    product: z.string(),
    status: z.enum(['Paid', 'Pending', 'Refunded']),
    amount: z.number().nonnegative(),
    date: z.string(),
});

const workspaceSchema = z.object({
    app: z.literal('atera'),
    version: z.literal(1),
    exportedAt: z.string().optional(),
    orders: z.array(orderSchema).max(10000),
});

export class AteraDatabase extends Dexie {
    orders!: Table<Order, string>;
    meta!: Table<{ key: string; value: string }, string>;

    constructor() {
        super(DB_NAME);
        this.version(1).stores({
            orders: 'id, customer, status, date',
            meta: 'key',
        });
        this.on('populate', async () => {
            if ((await this.orders.count()) > 0) return;
            await this.orders.bulkAdd(seedOrders);
            await this.meta.put({ key: 'seedVersion', value: '1' });
        });
    }
}

export const db = new AteraDatabase();

export async function ensureSeeded(): Promise<void> {
    if ((await db.orders.count()) > 0) return;
    await db.transaction('rw', db.orders, db.meta, async () => {
        if ((await db.orders.count()) > 0) return;
        await db.orders.bulkAdd(seedOrders);
        await db.meta.put({ key: 'seedVersion', value: '1' });
    });
}

export async function resetDatabase(): Promise<void> {
    await db.transaction('rw', db.orders, db.meta, async () => {
        await db.orders.clear();
        await db.meta.clear();
        await db.orders.bulkAdd(seedOrders);
        await db.meta.put({ key: 'seedVersion', value: '1' });
    });
}

export async function exportWorkspace(): Promise<WorkspaceSnapshot> {
    const orders = await db.orders.toArray();
    return {
        app: 'atera',
        version: 1,
        exportedAt: new Date().toISOString(),
        orders,
    };
}

export async function importWorkspace(payload: unknown): Promise<ImportResult> {
    const parsed = workspaceSchema.safeParse(payload);
    if (!parsed.success) {
        const versionIssue = parsed.error.issues.some((issue) => issue.path[0] === 'version');
        return { ok: false, error: versionIssue ? 'unsupportedVersion' : 'invalid' };
    }

    const orders = parsed.data.orders;
    await db.transaction('rw', db.orders, db.meta, async () => {
        await db.orders.clear();
        if (orders.length > 0) await db.orders.bulkAdd(orders);
        await db.meta.put({ key: 'seedVersion', value: '1' });
        await db.meta.put({ key: 'importedAt', value: new Date().toISOString() });
    });

    return { ok: true };
}
