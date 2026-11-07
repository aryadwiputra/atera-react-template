import {
    Bell,
    CalendarDays,
    ChartNoAxesCombined,
    CreditCard,
    FileText,
    Folder,
    FormInput,
    HelpCircle,
    KanbanSquare,
    LayoutGrid,
    Mail,
    MessageSquare,
    Package,
    Settings,
    ShoppingCart,
    Users,
    WalletCards,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
} from '@/components/ui/sidebar';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations, type TranslationKey } from '@/i18n';
import type { NavItem } from '@/types';

const mainNavGroups = [
    {
        label: 'overview',
        items: [
            { title: 'dashboard', href: '/dashboard', icon: LayoutGrid },
            {
                title: 'analytics',
                href: '/dashboard',
                icon: ChartNoAxesCombined,
                disabled: true,
            },
            {
                title: 'ecommerce',
                href: '/dashboard',
                icon: ShoppingCart,
                disabled: true,
            },
            { title: 'crm', href: '/dashboard', icon: Users, disabled: true },
            {
                title: 'saas',
                href: '/dashboard',
                icon: WalletCards,
                disabled: true,
            },
        ],
    },
    {
        label: 'commerce',
        items: [
            {
                title: 'orders',
                href: '/dashboard',
                icon: Package,
                badge: '12',
                disabled: true,
            },
            {
                title: 'products',
                href: '/dashboard',
                icon: ShoppingCart,
                disabled: true,
            },
            {
                title: 'customers',
                href: '/dashboard',
                icon: Users,
                disabled: true,
            },
            {
                title: 'invoices',
                href: '/dashboard',
                icon: FileText,
                disabled: true,
            },
        ],
    },
    {
        label: 'apps',
        items: [
            { title: 'mail', href: '/dashboard', icon: Mail, disabled: true },
            {
                title: 'chat',
                href: '/dashboard',
                icon: MessageSquare,
                disabled: true,
            },
            {
                title: 'files',
                href: '/dashboard',
                icon: Folder,
                disabled: true,
            },
            {
                title: 'kanban',
                href: '/dashboard',
                icon: KanbanSquare,
                disabled: true,
            },
            {
                title: 'calendar',
                href: '/dashboard',
                icon: CalendarDays,
                disabled: true,
            },
            {
                title: 'forms',
                href: '/dashboard',
                icon: FormInput,
                disabled: true,
            },
        ],
    },
    {
        label: 'system',
        items: [
            {
                title: 'billing',
                href: '/dashboard',
                icon: CreditCard,
                disabled: true,
            },
            {
                title: 'notifications',
                href: '/dashboard',
                icon: Bell,
                badge: '3',
                disabled: true,
            },
            { title: 'settings', href: '/settings/appearance', icon: Settings },
            {
                title: 'helpSupport',
                href: '/dashboard',
                icon: HelpCircle,
                disabled: true,
            },
        ],
    },
] satisfies { label: string; items: (NavItem & { badge?: string })[] }[];

export function AppSidebar() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    const translatedGroups = mainNavGroups.map((group) => ({
        ...group,
        label: t(group.label as TranslationKey),
        items: group.items.map((item) => ({
            ...item,
            title: t(item.title as TranslationKey),
        })),
    }));

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarContent className="px-3 py-4">
                <NavMain groups={translatedGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
