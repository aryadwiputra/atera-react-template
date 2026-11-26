import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
    DataTable,
    createAppColumnHelper,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { useToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import type { Invoice } from '@/lib/data/types';
import { invoiceService } from '@/services/invoice-service';

const invoiceHelper = createAppColumnHelper<Invoice>();

export function InvoicesPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { toast } = useToast();
    const [items, setItems] = useState(invoiceService.list());
    const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null);

    const columns: ColumnDef<typeof tableFeaturesConfig, Invoice, any>[] = [
        invoiceHelper.accessor('id', {
            header: 'Invoice',
            cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        }),
        invoiceHelper.accessor('customer', { header: 'Customer' }),
        invoiceHelper.accessor('date', { header: 'Issued' }),
        invoiceHelper.accessor('dueDate', { header: 'Due' }),
        invoiceHelper.accessor('amount', {
            header: 'Amount',
            cell: (info) => `$${info.getValue().toFixed(2)}`,
        }),
        invoiceHelper.accessor('status', {
            header: 'Status',
            cell: (info) => (
                <Badge variant={info.getValue() === 'Paid' ? 'default' : 'secondary'}>
                    {info.getValue()}
                </Badge>
            ),
        }),
        invoiceHelper.display({
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        asChild
                        aria-label={t('edit')}
                    >
                        <Link to={`/invoices/${row.original.id}/edit`}>
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
            <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('invoices')}
                    description={t('reviewInvoicesDescription')}
                    actions={
                        <Button asChild size="sm">
                            <Link to="/invoices/new">
                                <Plus className="size-4" />
                                {t('createInvoice')}
                            </Link>
                        </Button>
                    }
                />
                <DataTable columns={columns} data={items} filterPlaceholder={t('filterInvoices')} />
                <ConfirmDialog
                    open={pendingDelete !== null}
                    onOpenChange={(open) => !open && setPendingDelete(null)}
                    title={t('deleteInvoice')}
                    description={t('deleteInvoiceDescription')}
                    confirmLabel={t('delete')}
                    cancelLabel={t('cancel')}
                    trigger={<span />}
                    onConfirm={() => {
                        if (!pendingDelete) return;
                        invoiceService.remove(pendingDelete.id);
                        setItems(invoiceService.list());
                        toast({ title: t('invoiceDeleted'), variant: 'success' });
                    }}
                />
            </main>
        </PageTransition>
    );
}
