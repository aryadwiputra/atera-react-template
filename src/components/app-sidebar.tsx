import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations, type TranslationKey } from '@/i18n'
import { navigationGroups, navigationItems } from '@/lib/navigation'

export function AppSidebar() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const groups = navigationGroups.map((group) => ({
    label: t(group as TranslationKey),
    items: navigationItems.filter((item) => item.group === group).map((item) => ({
      title: t(item.translationKey as TranslationKey),
      href: item.href,
      icon: item.icon,
      badge: item.badge,
    })),
  }))

  return <Sidebar collapsible="icon" variant="sidebar"><SidebarContent className="px-3 py-4"><NavMain groups={groups} /></SidebarContent><SidebarFooter className="border-t border-sidebar-border px-3 py-3"><NavUser /></SidebarFooter><SidebarRail /></Sidebar>
}
