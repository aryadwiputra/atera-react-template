import type { Order } from '@/lib/data/types';
import type { ImportResult, WorkspaceSnapshot } from '@/repositories';
import { ordersRepository } from '@/repositories';

export interface OrderService {
    list(): Promise<Order[]>;
    get(id: string): Promise<Order | undefined>;
    create(input: Omit<Order, 'id'>): Promise<Order>;
    update(id: string, updates: Partial<Order>): Promise<Order | undefined>;
    remove(id: string): Promise<void>;
    export(): Promise<WorkspaceSnapshot>;
    import(payload: unknown): Promise<ImportResult>;
    reset(): Promise<void>;
}

export const orderService: OrderService = {
    list: () => ordersRepository.list(),
    get: (id) => ordersRepository.get(id),
    create: (input) => ordersRepository.create(input),
    update: (id, updates) => ordersRepository.update(id, updates),
    remove: (id) => ordersRepository.remove(id),
    export: () => ordersRepository.export(),
    import: (payload) => ordersRepository.import(payload),
    reset: () => ordersRepository.reset(),
};
