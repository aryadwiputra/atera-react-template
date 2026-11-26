import { describe, expect, it } from 'vitest';
import type { Asset } from '@/lib/data/types';
import {
    daysUntilDate,
    formatAssetValue,
    getWarrantyState,
    summarizeAssetsByAssignee,
} from './assets';

const now = Date.parse('2026-01-01T00:00:00Z');

describe('getWarrantyState', () => {
    it('treats a past warranty as expired', () => {
        expect(getWarrantyState('2025-12-31', now)).toBe('expired');
    });

    it('marks warranties within 90 days as expiring', () => {
        expect(getWarrantyState('2026-03-01', now)).toBe('expiring');
        expect(getWarrantyState('2026-01-01', now)).toBe('expiring');
    });

    it('keeps warranties beyond 90 days active', () => {
        expect(getWarrantyState('2026-04-02', now)).toBe('active');
    });

    it('treats an invalid date as expired', () => {
        expect(getWarrantyState('not-a-date', now)).toBe('expired');
    });

    it('counts whole days to the warranty end', () => {
        expect(daysUntilDate('2026-01-11', now)).toBe(10);
    });
});

const asset = (overrides: Partial<Asset>): Asset => ({
    id: 'AST-001',
    tag: 'LT-0001',
    name: 'Laptop',
    category: 'Laptop',
    assignedTo: 'Olivia Martin',
    location: 'HQ Floor 3',
    purchaseDate: '2025-01-01',
    warrantyEnd: '2027-01-01',
    value: 1000,
    status: 'In Use',
    ...overrides,
});

describe('summarizeAssetsByAssignee', () => {
    it('groups assets per assignee with totals and unique locations', () => {
        const result = summarizeAssetsByAssignee([
            asset({ id: 'AST-001', tag: 'LT-0001', value: 1000 }),
            asset({ id: 'AST-002', tag: 'LT-0002', value: 1500, location: 'Remote' }),
            asset({ id: 'AST-003', tag: 'MN-0001', assignedTo: 'Noah Patel', value: 500 }),
        ]);

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
            assignee: 'Olivia Martin',
            assetCount: 2,
            tags: ['LT-0001', 'LT-0002'],
            locations: ['HQ Floor 3', 'Remote'],
            totalValue: 2500,
        });
        expect(result[1]).toMatchObject({ assignee: 'Noah Patel', assetCount: 1 });
    });

    it('puts unassigned assets last', () => {
        const result = summarizeAssetsByAssignee([
            asset({ id: 'AST-001', assignedTo: '' }),
            asset({ id: 'AST-002', assignedTo: 'Jackson Lee' }),
        ]);

        expect(result.map((group) => group.assignee)).toEqual(['Jackson Lee', '']);
    });
});

describe('formatAssetValue', () => {
    it('formats whole dollars with grouping', () => {
        expect(formatAssetValue(61954)).toBe('$61,954');
    });
});
