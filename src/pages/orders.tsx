import { createAppColumnHelper, DataTable } from '@/components/shared/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { tableFeaturesConfig } from '@/components/shared/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useToast } from '@/components/shared/toast';
import { Link } from 'react-router';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { useDeleteOrder, useOrders } from '@/features/orders/api';
import type { Order } from '@/lib/data/types';

const helper = createAppColumnHelper<Order>();

export default function OrdersPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { toast } = useToast();
    const { data, isLoading, isError, refetch } = useOrders();
    const deleteOrder = useDeleteOrder();
    const orders = data ?? [];
    const [pendingDelete, setPendingDelete] = useState<Order | null>(null);

    const columns: ColumnDef<typeof tableFeaturesConfig, Order, any>[] = [
        helper.accessor('id', {
            header: t('orderId'),
            cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
        }),
        helper.accessor('customer', { header: t('customer') }),
        helper.accessor('product', { header: t('product') }),
        helper.accessor('status', {
            header: t('status'),
            cell: (info) => (
                <Badge variant={info.getValue() === 'Paid' ? 'default' : 'secondary'}>
                    {info.getValue()}
                </Badge>
            ),
        }),
        helper.accessor('amount', {
            header: t('amount'),
            cell: (info) => `$${info.getValue().toFixed(2)}`,
        }),
        helper.accessor('date', { header: t('date') }),
        helper.display({
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        asChild
                        aria-label={t('view')}
                    >
                        <Link to={`/orders/${row.original.id}`}>
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        asChild
                        aria-label={t('edit')}
                    >
                        <Link to={`/orders/${row.original.id}/edit`}>
                            <Pencil className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        aria-label={t('delete')}
                        onClick={() => setPendingDelete(row.original)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        }),
    ];

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={t('orders')}
                    description={t('ordersDescription')}
                    actions={
                        <Button asChild size="sm">
                            <Link to="/orders/new">
                                <Plus className="size-4" />
                                {t('newOrder')}
                            </Link>
                        </Button>
                    }
                />
                {isLoading ? (
                    <div role="status" aria-label="Loading orders" className="flex flex-col gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 p-8 text-center">
                        <p className="text-sm text-muted-foreground">{t('somethingWentWrong')}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            {t('retry')}
                        </Button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={orders}
                        filterPlaceholder={t('filterOrders')}
                    />
                )}
                <ConfirmDialog
                    open={pendingDelete !== null}
                    onOpenChange={(open) => !open && setPendingDelete(null)}
                    title={t('deleteOrder')}
                    description={t('deleteOrderDescription')}
                    confirmLabel={t('delete')}
                    cancelLabel={t('cancel')}
                    onConfirm={async () => {
                        const target = pendingDelete;
                        if (!target) return;
                        try {
                            await deleteOrder.mutateAsync(target.id);
                            toast({ title: t('orderDeleted'), variant: 'success' });
                        } catch {
                            toast({ title: t('somethingWentWrong'), variant: 'error' });
                        }
                    }}
                />
            </main>
        </PageTransition>
    );
}
