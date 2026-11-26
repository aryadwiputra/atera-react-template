import { describe, expect, it } from 'vitest';
import { buildSearchSections } from './search';

describe('buildSearchSections', () => {
    it('returns no sections for an empty query', () => {
        expect(buildSearchSections('   ')).toEqual([]);
    });

    it('finds a seeded order by customer name', () => {
        const sections = buildSearchSections('Olivia');

        expect(sections.some((section) => section.key === 'orders')).toBe(true);
    });
});
