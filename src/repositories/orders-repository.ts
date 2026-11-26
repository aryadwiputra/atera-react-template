import type { Order } from '@/lib/data/types';

export type WorkspaceSnapshot = {
    app: 'atera';
    version: 1;
    exportedAt: string;
    orders: Order[];
};

export type ImportResult = { ok: true } | { ok: false; error: string };

export interface OrdersRepository {
    list(): Promise<Order[]>;
    get(id: string): Promise<Order | undefined>;
    create(input: Omit<Order, 'id'>): Promise<Order>;
    update(id: string, updates: Partial<Order>): Promise<Order | undefined>;
    remove(id: string): Promise<void>;
    export(): Promise<WorkspaceSnapshot>;
    import(payload: unknown): Promise<ImportResult>;
    reset(): Promise<void>;
}
