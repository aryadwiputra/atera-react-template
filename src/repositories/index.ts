import { DexieOrdersRepository } from './dexie-orders-repository';
import type { OrdersRepository } from './orders-repository';

export const ordersRepository: OrdersRepository = new DexieOrdersRepository();

export type { ImportResult, OrdersRepository, WorkspaceSnapshot } from './orders-repository';
