import { useMemo } from 'react';

export type ReportRange = '30d' | '90d' | '12m' | 'all';

export const reportRangeOptions: Array<{ value: ReportRange; label: string }> = [
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
    { value: 'all', label: 'All time' },
];

const rangeDays: Record<Exclude<ReportRange, 'all'>, number> = {
    '30d': 30,
    '90d': 90,
    '12m': 365,
};

export function useReportData<T extends { date?: string }>(rows: T[], range: ReportRange): T[] {
    return useMemo(() => {
        if (range === 'all') return rows;
        const days = rangeDays[range];
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffText = cutoff.toISOString().slice(0, 10);
        return rows.filter((row) => !row.date || row.date >= cutoffText);
    }, [rows, range]);
}

export function monthKey(date: string): string {
    return date.slice(0, 7);
}

export function groupByMonth<T extends { date: string }>(
    rows: T[],
    pick: (row: T) => number,
): Array<{ name: string; value: number }> {
    const map = new Map<string, number>();
    for (const row of rows) {
        const key = monthKey(row.date);
        map.set(key, (map.get(key) ?? 0) + pick(row));
    }
    return [...map.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => ({
            name: new Date(`${key}-01`).toLocaleString('en-US', {
                month: 'short',
                year: '2-digit',
            }),
            value,
        }));
}

export function countBy<T>(
    rows: T[],
    pick: (row: T) => string,
): Array<{ name: string; value: number }> {
    const map = new Map<string, number>();
    for (const row of rows) {
        const key = pick(row);
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
}

export function sumBy<T>(rows: T[], pick: (row: T) => number): number {
    return rows.reduce((sum, row) => sum + pick(row), 0);
}

export const formatMoney = (value: number) =>
    `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export type ReportFilters = {
    from?: string;
    to?: string;
    status?: string;
    search?: string;
};

export function applyFilters<T>(
    rows: T[],
    filters: ReportFilters,
    searchText: (row: T) => string,
): T[] {
    return rows.filter((row) => {
        const record = row as Record<string, unknown>;
        const date = record.date as string | undefined;
        if (filters.from && (!date || date < filters.from)) return false;
        if (filters.to && (!date || date > filters.to)) return false;
        if (filters.status && filters.status !== 'all') {
            if (record.status !== filters.status) return false;
        }
        if (filters.search && !searchText(row).toLowerCase().includes(filters.search.toLowerCase()))
            return false;
        return true;
    });
}
