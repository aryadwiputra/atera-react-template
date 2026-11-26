import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteFallback } from './route-fallback';

describe('RouteFallback', () => {
    it('renders a loading indicator', () => {
        render(<RouteFallback />);

        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
});
