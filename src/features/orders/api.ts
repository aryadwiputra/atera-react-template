import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Order } from '@/lib/data/types';
import { orderService } from '@/services/order-service';

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export function useOrders() {
    return useQuery({
        queryKey: orderKeys.lists(),
        queryFn: () => orderService.list(),
    });
}

export function useOrder(id?: string) {
    return useQuery({
        queryKey: orderKeys.detail(id ?? ''),
        queryFn: () => orderService.get(id!),
        enabled: Boolean(id),
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: Omit<Order, 'id'>) => orderService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Order> }) =>
            orderService.update(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: orderKeys.all });
            const lists = queryClient.getQueryData<Order[]>(orderKeys.lists());
            const detail = queryClient.getQueryData<Order>(orderKeys.detail(id));
            queryClient.setQueryData<Order[]>(orderKeys.lists(), (rows) =>
                rows?.map((row) => (row.id === id ? { ...row, ...updates, id } : row)),
            );
            queryClient.setQueryData<Order>(orderKeys.detail(id), (row) =>
                row ? { ...row, ...updates, id } : row,
            );
            return { lists, detail };
        },
        onError: (_error, { id }, context) => {
            if (context?.lists !== undefined) {
                queryClient.setQueryData(orderKeys.lists(), context.lists);
            }
            if (context?.detail !== undefined) {
                queryClient.setQueryData(orderKeys.detail(id), context.detail);
            }
        },
        onSettled: (_data, _error, { id }) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        },
    });
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => orderService.remove(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: orderKeys.all });
            const lists = queryClient.getQueryData<Order[]>(orderKeys.lists());
            queryClient.setQueryData<Order[]>(orderKeys.lists(), (rows) =>
                rows?.filter((row) => row.id !== id),
            );
            return lists;
        },
        onError: (_error, _id, context) => {
            if (context !== undefined) {
                queryClient.setQueryData(orderKeys.lists(), context);
            }
        },
        onSettled: (_data, _error, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        },
    });
}
