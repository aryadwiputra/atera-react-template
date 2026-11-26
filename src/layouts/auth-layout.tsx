import type { ReactNode } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { usePageMeta } from '@/hooks/use-page-meta';

export default function AuthLayout({ children }: { children: ReactNode }) {
    usePageMeta();
    return <AuthShell>{children}</AuthShell>;
}
