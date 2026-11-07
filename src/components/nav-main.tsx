import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

type NavGroup = {
    label: string;
    items: (NavItem & { badge?: string })[];
};

export function NavMain({ groups }: { groups: NavGroup[] }) {
    const { currentUrl, isCurrentUrl } = useCurrentUrl();
    const { state, isMobile } = useSidebar();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(groups.map((group) => [group.label, true])),
    );
    const isCollapsed = state === 'collapsed' && !isMobile;

    useEffect(() => {
        setOpenGroups((current) => {
            let changed = false;
            const next = { ...current };

            groups.forEach((group) => {
                if (
                    group.items.some(
                        (item) => !item.disabled && isCurrentUrl(item.href),
                    )
                ) {
                    if (!next[group.label]) {
                        next[group.label] = true;
                        changed = true;
                    }
                }
            });

            return changed ? next : current;
        });
    }, [groups, currentUrl, isCurrentUrl]);

    return (
        <nav aria-label="Main navigation" className="space-y-3">
            {groups.map((group) => {
                const isOpen = openGroups[group.label] ?? true;
                const groupId = `sidebar-group-${group.label.toLowerCase()}`;

                return (
                    <SidebarGroup key={group.label} className="p-0">
                        <SidebarGroupLabel asChild className="h-7 px-0">
                            <button
                                type="button"
                                aria-controls={groupId}
                                aria-expanded={isOpen}
                                aria-label={group.label}
                                onClick={() =>
                                    setOpenGroups((current) => ({
                                        ...current,
                                        [group.label]: !isOpen,
                                    }))
                                }
                                className="group/section w-full justify-between px-2 text-[10px] leading-5 font-medium tracking-[0.12em] text-sidebar-foreground/45 hover:bg-transparent hover:text-sidebar-foreground/70"
                            >
                                <span className="truncate">{group.label}</span>
                                <ChevronDown
                                    className={cn(
                                        'size-3.5 transition-transform duration-200',
                                        !isOpen && '-rotate-90',
                                    )}
                                />
                            </button>
                        </SidebarGroupLabel>
                        <div
                            id={groupId}
                            className={cn(
                                'grid transition-[grid-template-rows,opacity] duration-200',
                                isCollapsed || isOpen
                                    ? 'grid-rows-[1fr] opacity-100'
                                    : 'grid-rows-[0fr] opacity-0',
                            )}
                        >
                            <div className="min-h-0 overflow-hidden">
                                <SidebarMenu className="mt-1">
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild={!item.disabled}
                                                disabled={item.disabled}
                                                isActive={
                                                    !item.disabled &&
                                                    isCurrentUrl(item.href)
                                                }
                                                tooltip={{
                                                    children: item.title,
                                                }}
                                                className="h-9 text-[13px] leading-5 font-normal text-sidebar-foreground/70 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground"
                                            >
                                                {item.disabled ? (
                                                    <>
                                                        {item.icon && (
                                                            <item.icon />
                                                        )}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <Link to={item.href}>
                                                        {item.icon && (
                                                            <item.icon />
                                                        )}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                )}
                                            </SidebarMenuButton>
                                            {item.badge && (
                                                <SidebarMenuBadge>
                                                    {item.badge}
                                                </SidebarMenuBadge>
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </div>
                        </div>
                    </SidebarGroup>
                );
            })}
        </nav>
    );
}
