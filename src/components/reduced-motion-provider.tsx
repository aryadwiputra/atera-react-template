import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
    const { motion } = useCustomizePreferences();

    return (
        <MotionConfig reducedMotion={motion === 'reduced' ? 'always' : 'user'}>
            {children}
        </MotionConfig>
    );
}
