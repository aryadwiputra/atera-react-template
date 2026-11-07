import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    disabled?: boolean;
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
};

export const demoUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
};

export type AppVariant = 'header' | 'sidebar';

export type AppLayoutProps = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};
