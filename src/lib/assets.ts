import type { Asset } from '@/lib/data/types';

const DAY_MS = 24 * 60 * 60 * 1000;

const REFERENCE_NOW = Date.now();

export type WarrantyState = 'active' | 'expiring' | 'expired';

export function daysUntilDate(date: string, now = REFERENCE_NOW): number {
    const target = Date.parse(`${date}T00:00:00Z`);
    if (Number.isNaN(target)) return Number.NaN;
    return Math.ceil((target - now) / DAY_MS);
}

export function getWarrantyState(date: string, now = REFERENCE_NOW): WarrantyState {
    const days = daysUntilDate(date, now);
    if (!Number.isFinite(days) || days < 0) return 'expired';
    if (days <= 90) return 'expiring';
    return 'active';
}

export function formatAssetValue(value: number): string {
    return `$${value.toLocaleString('en-US')}`;
}

export type AssigneeSummary = {
    assignee: string;
    assetCount: number;
    tags: string[];
    locations: string[];
    totalValue: number;
};

export function summarizeAssetsByAssignee(assets: Asset[]): AssigneeSummary[] {
    const groups = new Map<string, AssigneeSummary>();

    for (const asset of assets) {
        const assignee = asset.assignedTo.trim();
        const group = groups.get(assignee) ?? {
            assignee,
            assetCount: 0,
            tags: [],
            locations: [],
            totalValue: 0,
        };

        group.assetCount += 1;
        group.tags.push(asset.tag);
        if (!group.locations.includes(asset.location)) group.locations.push(asset.location);
        group.totalValue += asset.value;
        groups.set(assignee, group);
    }

    return [...groups.values()].sort((a, b) => {
        if (!a.assignee) return 1;
        if (!b.assignee) return -1;
        return b.assetCount - a.assetCount || a.assignee.localeCompare(b.assignee);
    });
}
