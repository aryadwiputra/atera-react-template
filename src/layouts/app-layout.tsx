import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { layout } = useCustomizePreferences();
    const Layout = layout === 'top-nav' ? AppHeaderLayout : AppSidebarLayout;

    return <Layout breadcrumbs={breadcrumbs}>{children}</Layout>;
}
