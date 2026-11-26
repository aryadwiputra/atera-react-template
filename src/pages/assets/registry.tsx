import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Boxes,
    Cpu,
    Eye,
    Pencil,
    Plus,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    Wallet,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DatePicker } from '@/components/shared/date-picker';
import {
    createAppColumnHelper,
    DataTable,
    tableFeaturesConfig,
} from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { StatCard } from '@/components/shared/stat-card';
import { useToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations, type TranslationKey } from '@/i18n';
import { getWarrantyState, type WarrantyState } from '@/lib/assets';
import type { Asset, AssetStatus } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { assetService } from '@/services/asset-service';

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

const assetStatuses: AssetStatus[] = ['In Use', 'Available', 'Maintenance', 'Retired'];

const statusClasses: Record<AssetStatus, string> = {
    'In Use': 'bg-status-success/15 text-status-success',
    Available: 'bg-primary/10 text-foreground',
    Maintenance: 'bg-status-warning/15 text-status-warning',
    Retired: 'bg-muted text-muted-foreground',
};

const statusLabelKeys: Record<AssetStatus, TranslationKey> = {
    'In Use': 'inUse',
    Available: 'available',
    Maintenance: 'inMaintenance',
    Retired: 'retired',
};

const warrantyClasses: Record<WarrantyState, string> = {
    active: 'bg-status-success/15 text-status-success',
    expiring: 'bg-status-warning/15 text-status-warning',
    expired: 'bg-destructive/15 text-destructive',
};

const warrantyCalloutClasses: Record<WarrantyState, string> = {
    active: 'border-status-success/30 bg-status-success/10',
    expiring: 'border-status-warning/30 bg-status-warning/10',
    expired: 'border-destructive/30 bg-destructive/10',
};

const warrantyIconClasses: Record<WarrantyState, string> = {
    active: 'text-status-success',
    expiring: 'text-status-warning',
    expired: 'text-destructive',
};

const warrantyLabelKeys: Record<WarrantyState, TranslationKey> = {
    active: 'warrantyActive',
    expiring: 'warrantyExpiring',
    expired: 'warrantyExpired',
};

const assetSchema = z
    .object({
        tag: z.string().trim().min(1, 'assetTagRequired'),
        name: z.string().trim().min(1, 'assetNameRequired'),
        category: z.string(),
        assignedTo: z.string(),
        location: z.string(),
        purchaseDate: z.string().min(1),
        warrantyEnd: z.string().min(1),
        value: z
            .string()
            .trim()
            .min(1, 'assetValueInvalid')
            .refine(
                (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
                'assetValueInvalid',
            ),
        status: z.enum(['In Use', 'Available', 'Maintenance', 'Retired']),
    })
    .refine((data) => data.warrantyEnd >= data.purchaseDate, {
        message: 'warrantyBeforePurchase',
        path: ['warrantyEnd'],
    });

type AssetFormValues = z.input<typeof assetSchema>;
type AssetSubmitValues = z.output<typeof assetSchema>;

const DEFAULT_DATE = new Date().toISOString().slice(0, 10);

const emptyForm: AssetFormValues = {
    tag: '',
    name: '',
    category: '',
    assignedTo: '',
    location: '',
    purchaseDate: DEFAULT_DATE,
    warrantyEnd: DEFAULT_DATE,
    value: '',
    status: 'Available',
};

export default function AssetsPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { toast } = useToast();

    const [items, setItems] = useState(assetService.list);
    const [detail, setDetail] = useState<Asset | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Asset | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Asset | null>(null);
    const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
    const form = useForm<AssetFormValues, unknown, AssetSubmitValues>({
        resolver: zodResolver(assetSchema),
        defaultValues: emptyForm,
    });
    const errors = form.formState.errors;

    const refresh = () => setItems(assetService.list());
    const fieldError = (message?: string) => (message ? t(message as TranslationKey) : undefined);

    const inUseCount = items.filter((item) => item.status === 'In Use').length;
    const maintenanceCount = items.filter((item) => item.status === 'Maintenance').length;
    const totalValue = items
        .filter((item) => item.status !== 'Retired')
        .reduce((sum, item) => sum + item.value, 0);
    const statusCounts = Object.fromEntries(
        assetStatuses.map((status) => [
            status,
            items.filter((item) => item.status === status).length,
        ]),
    ) as Record<AssetStatus, number>;
    const filteredItems =
        statusFilter === 'all' ? items : items.filter((item) => item.status === statusFilter);

    const openCreate = () => {
        setEditing(null);
        form.reset(emptyForm);
        setFormOpen(true);
    };

    const openEdit = (asset: Asset) => {
        setEditing(asset);
        const { id: _id, ...rest } = asset;
        form.reset({ ...rest, value: String(rest.value) });
        setFormOpen(true);
    };

    const handleSubmit = form.handleSubmit((values) => {
        const payload = {
            ...values,
            tag: values.tag.trim(),
            name: values.name.trim(),
            value: Number(values.value),
        };
        if (editing) {
            assetService.update(editing.id, payload);
        } else {
            assetService.create(payload);
        }
        refresh();
        setFormOpen(false);
        toast({ title: t('assetSaved'), variant: 'success' });
    });

    const helper = createAppColumnHelper<Asset>();
    const columns: ColumnDef<typeof tableFeaturesConfig, Asset, any>[] = [
        helper.accessor((row) => `${row.tag} ${row.name}`, {
            id: 'asset',
            header: t('asset'),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-mono text-xs text-muted-foreground">
                        {row.original.tag}
                    </span>
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        }),
        helper.accessor('category', { header: t('category') }),
        helper.accessor('assignedTo', {
            header: t('assignedTo'),
            cell: (info) => info.getValue() || '—',
        }),
        helper.accessor('location', { header: t('location') }),
        helper.accessor('warrantyEnd', {
            header: t('warranty'),
            cell: (info) => {
                const state = getWarrantyState(info.getValue());
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs tabular-nums text-muted-foreground">
                            {info.getValue()}
                        </span>
                        <Badge className={cn('w-fit border-transparent', warrantyClasses[state])}>
                            {t(warrantyLabelKeys[state])}
                        </Badge>
                    </div>
                );
            },
        }),
        helper.accessor('value', {
            header: t('assetValue'),
            cell: (info) => <span className="tabular-nums">{formatMoney(info.getValue())}</span>,
        }),
        helper.accessor('status', {
            header: t('status'),
            cell: (info) => {
                const status = info.getValue() as AssetStatus;
                return (
                    <Badge className={cn('border-transparent', statusClasses[status])}>
                        {t(statusLabelKeys[status])}
                    </Badge>
                );
            },
        }),
        helper.display({
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={t('view')}
                        onClick={() => setDetail(row.original)}
                    >
                        <Eye className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={t('edit')}
                        onClick={() => openEdit(row.original)}
                    >
                        <Pencil className="size-4" />
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

    const stats = [
        {
            title: t('totalAssets'),
            value: String(items.length),
            change: '',
            icon: Boxes,
            description: t('assetsDescription'),
        },
        {
            title: t('inUse'),
            value: String(inUseCount),
            change: '',
            icon: Cpu,
            description: t('assignedTo'),
        },
        {
            title: t('inMaintenance'),
            value: String(maintenanceCount),
            change: '',
            icon: Wrench,
            description: t('inMaintenance'),
        },
        {
            title: t('totalAssetValue'),
            value: formatMoney(totalValue),
            change: '',
            icon: Wallet,
            description: t('totalAssetValue'),
        },
    ];

    const warranty = detail ? getWarrantyState(detail.warrantyEnd) : 'active';
    const WarrantyIcon = warranty === 'active' ? ShieldCheck : ShieldAlert;
    const history = detail
        ? [
              { label: t('purchased'), date: detail.purchaseDate },
              ...(detail.assignedTo
                  ? [{ label: `${t('assignedTo')} · ${detail.assignedTo}`, date: '' }]
                  : []),
              { label: t('warrantyEnd'), date: detail.warrantyEnd },
          ]
        : [];

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={t('assets')}
                    description={t('assetsDescription')}
                    actions={
                        <Button size="sm" onClick={openCreate}>
                            <Plus className="size-4" />
                            {t('addAsset')}
                        </Button>
                    }
                    breadcrumbs={[
                        { title: t('enterprise'), href: '/assets' },
                        { title: t('assets'), href: '/assets' },
                    ]}
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((card) => (
                        <StatCard
                            key={card.title}
                            title={card.title}
                            value={card.value}
                            change={card.change ?? ''}
                            icon={card.icon}
                            description={card.description}
                        />
                    ))}
                </div>
                <div
                    className="flex flex-wrap items-center gap-2"
                    role="group"
                    aria-label={t('status')}
                >
                    <Button
                        size="sm"
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        aria-pressed={statusFilter === 'all'}
                        onClick={() => setStatusFilter('all')}
                    >
                        {t('allStatuses')}
                        <span className="ml-1.5 text-xs tabular-nums opacity-70">
                            {items.length}
                        </span>
                    </Button>
                    {assetStatuses.map((status) => (
                        <Button
                            key={status}
                            size="sm"
                            variant={statusFilter === status ? 'default' : 'outline'}
                            aria-pressed={statusFilter === status}
                            onClick={() => setStatusFilter(status)}
                        >
                            {t(statusLabelKeys[status])}
                            <span className="ml-1.5 text-xs tabular-nums opacity-70">
                                {statusCounts[status]}
                            </span>
                        </Button>
                    ))}
                </div>
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    filterPlaceholder={t('searchAssets')}
                />
            </main>

            <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
                <SheetContent className="w-full sm:max-w-xl">
                    <SheetHeader className="gap-3 pr-12">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <SheetTitle className="min-w-0 break-words">
                                {detail ? `${detail.tag} — ${detail.name}` : ''}
                            </SheetTitle>
                            {detail && (
                                <Badge
                                    className={cn(
                                        'shrink-0 border-transparent',
                                        statusClasses[detail.status],
                                    )}
                                >
                                    {t(statusLabelKeys[detail.status])}
                                </Badge>
                            )}
                        </div>
                    </SheetHeader>
                    {detail && (
                        <div className="grid gap-6 overflow-y-auto px-4 pb-6">
                            <div
                                className={cn(
                                    'flex items-start gap-3 rounded-lg border p-3',
                                    warrantyCalloutClasses[warranty],
                                )}
                            >
                                <WarrantyIcon
                                    className={cn(
                                        'mt-0.5 size-4 shrink-0',
                                        warrantyIconClasses[warranty],
                                    )}
                                />
                                <div className="space-y-0.5 text-sm">
                                    <p className="font-medium">{t(warrantyLabelKeys[warranty])}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t('warrantyEnd')}: {detail.warrantyEnd}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-2 text-sm">
                                {(
                                    [
                                        [t('category'), detail.category],
                                        [t('assignedTo'), detail.assignedTo || '—'],
                                        [t('location'), detail.location],
                                        [t('purchaseDate'), detail.purchaseDate],
                                        [t('assetValue'), formatMoney(detail.value)],
                                    ] as [string, string][]
                                ).map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between gap-4 border-b py-1.5 last:border-0"
                                    >
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="text-right font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid gap-2">
                                <h3 className="text-sm font-semibold">{t('assetHistory')}</h3>
                                {history.map((entry) => (
                                    <div
                                        key={entry.label}
                                        className="flex items-center justify-between gap-4 text-sm"
                                    >
                                        <span>{entry.label}</span>
                                        {entry.date && (
                                            <span className="text-xs text-muted-foreground">
                                                {entry.date}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog
                open={formOpen}
                onOpenChange={(open) => {
                    setFormOpen(open);
                    if (!open) form.reset(emptyForm);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? t('editAsset') : t('addAsset')}</DialogTitle>
                    </DialogHeader>
                    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="asset-tag" className="text-sm font-medium">
                                    {t('assetTag')}
                                </label>
                                <Input
                                    id="asset-tag"
                                    aria-invalid={Boolean(errors.tag)}
                                    aria-describedby={errors.tag ? 'asset-tag-error' : undefined}
                                    {...form.register('tag')}
                                />
                                {errors.tag && (
                                    <p
                                        id="asset-tag-error"
                                        role="alert"
                                        className="text-xs text-destructive"
                                    >
                                        {fieldError(errors.tag.message)}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="asset-name" className="text-sm font-medium">
                                    {t('assetName')}
                                </label>
                                <Input
                                    id="asset-name"
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={errors.name ? 'asset-name-error' : undefined}
                                    {...form.register('name')}
                                />
                                {errors.name && (
                                    <p
                                        id="asset-name-error"
                                        role="alert"
                                        className="text-xs text-destructive"
                                    >
                                        {fieldError(errors.name.message)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="asset-category" className="text-sm font-medium">
                                    {t('category')}
                                </label>
                                <Input id="asset-category" {...form.register('category')} />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="asset-location" className="text-sm font-medium">
                                    {t('location')}
                                </label>
                                <Input id="asset-location" {...form.register('location')} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="asset-assigned" className="text-sm font-medium">
                                {t('assignedTo')}
                            </label>
                            <Input id="asset-assigned" {...form.register('assignedTo')} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <span className="text-sm font-medium">{t('purchaseDate')}</span>
                                <DatePicker
                                    value={form.watch('purchaseDate')}
                                    onChange={(value) =>
                                        form.setValue('purchaseDate', value, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                    ariaLabel={t('purchaseDate')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <span className="text-sm font-medium">{t('warrantyEnd')}</span>
                                <DatePicker
                                    value={form.watch('warrantyEnd')}
                                    onChange={(value) =>
                                        form.setValue('warrantyEnd', value, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                    ariaLabel={t('warrantyEnd')}
                                />
                                {errors.warrantyEnd && (
                                    <p role="alert" className="text-xs text-destructive">
                                        {fieldError(errors.warrantyEnd.message)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="asset-value" className="text-sm font-medium">
                                    {t('assetValue')}
                                </label>
                                <Input
                                    id="asset-value"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    aria-invalid={Boolean(errors.value)}
                                    aria-describedby={
                                        errors.value ? 'asset-value-error' : undefined
                                    }
                                    {...form.register('value')}
                                />
                                {errors.value && (
                                    <p
                                        id="asset-value-error"
                                        role="alert"
                                        className="text-xs text-destructive"
                                    >
                                        {fieldError(errors.value.message)}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <span className="text-sm font-medium">{t('status')}</span>
                                <Select
                                    value={form.watch('status')}
                                    onValueChange={(value) =>
                                        form.setValue('status', value as AssetStatus, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                >
                                    <SelectTrigger aria-label={t('status')} className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assetStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {t(statusLabelKeys[status])}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormOpen(false)}
                            >
                                {t('cancel')}
                            </Button>
                            <Button type="submit">
                                {editing ? t('saveChanges') : t('addAsset')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title={t('deleteAsset')}
                description={t('deleteAssetDescription')}
                confirmLabel={t('delete')}
                cancelLabel={t('cancel')}
                onConfirm={() => {
                    if (!pendingDelete) return;
                    assetService.remove(pendingDelete.id);
                    refresh();
                    toast({ title: t('assetDeleted'), variant: 'success' });
                }}
            />
        </PageTransition>
    );
}
