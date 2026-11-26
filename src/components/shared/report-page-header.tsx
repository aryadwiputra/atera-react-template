import { Download } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { downloadCsv } from '@/lib/export-csv';

export type ReportPageHeaderProps = {
    title: string;
    description: string;
    breadcrumbs: Array<{ title: string; href: string }>;
    exportName: string;
    exportRows: Array<Record<string, unknown>>;
    children?: ReactNode;
};

export function ReportPageHeader({
    title,
    description,
    breadcrumbs,
    exportName,
    exportRows,
    children,
}: ReportPageHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                        {breadcrumbs.at(-2)?.title}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {children}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCsv(exportName, exportRows)}
                        disabled={exportRows.length === 0}
                    >
                        <Download className="size-4" />
                        Export CSV
                    </Button>
                </div>
            </div>
        </div>
    );
}
