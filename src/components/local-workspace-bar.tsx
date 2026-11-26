import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Database, Download, RotateCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useToast } from '@/components/shared/toast';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

const MAX_IMPORT_SIZE = 5 * 1024 * 1024;
const ordersKey = ['orders'] as const;

const getOrderService = () => import('@/services/order-service').then((m) => m.orderService);

export function LocalWorkspaceBar() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const [resetOpen, setResetOpen] = useState(false);

    if (typeof window !== 'undefined' && window.self !== window.top) {
        return null;
    }

    const handleExport = async () => {
        try {
            const orderService = await getOrderService();
            const snapshot = await orderService.export();
            const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `atera-workspace-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
            toast({ title: t('workspaceExported'), variant: 'success' });
        } catch {
            toast({ title: t('somethingWentWrong'), variant: 'error' });
        }
    };

    const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_IMPORT_SIZE) {
            toast({ title: t('workspaceTooLarge'), variant: 'error' });
            event.target.value = '';
            return;
        }

        try {
            const parsed: unknown = JSON.parse(await file.text());
            const orderService = await getOrderService();
            const result = await orderService.import(parsed);
            if (!result.ok) {
                toast({ title: t('workspaceImportFailed'), variant: 'error' });
                return;
            }
            await queryClient.invalidateQueries({ queryKey: ordersKey });
            toast({ title: t('workspaceImported'), variant: 'success' });
        } catch {
            toast({ title: t('workspaceImportFailed'), variant: 'error' });
        } finally {
            event.target.value = '';
        }
    };

    const handleReset = async () => {
        try {
            const orderService = await getOrderService();
            await orderService.reset();
            await queryClient.invalidateQueries({ queryKey: ordersKey });
            toast({ title: t('workspaceReset'), variant: 'success' });
        } catch {
            toast({ title: t('somethingWentWrong'), variant: 'error' });
        }
    };

    return (
        <div
            role="region"
            aria-label={t('localWorkspace')}
            className="flex w-full flex-wrap items-center gap-2 border-b bg-muted/40 px-4 py-1.5"
        >
            <Database className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-semibold">{t('localWorkspace')}</span>
            <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                {t('localWorkspaceDescription')}
            </span>
            <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleExport}>
                    <Download />
                    {t('exportWorkspace')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
                    <Upload />
                    {t('importWorkspace')}
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={handleImport}
                />
                <ConfirmDialog
                    open={resetOpen}
                    onOpenChange={setResetOpen}
                    title={t('resetWorkspace')}
                    description={t('resetWorkspaceDescription')}
                    confirmLabel={t('resetWorkspace')}
                    cancelLabel={t('cancel')}
                    trigger={
                        <Button variant="ghost" size="sm">
                            <RotateCcw />
                            {t('reset')}
                        </Button>
                    }
                    onConfirm={handleReset}
                />
            </div>
        </div>
    );
}
