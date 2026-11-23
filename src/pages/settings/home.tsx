import { Bell, Building2, CreditCard, Palette, UserRound, Users } from 'lucide-react'
import { useLocation, useSearchParams } from 'react-router'
import { SettingCard } from '@/components/shared/setting-card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

export default function SettingsHome() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const isTeamPath = pathname === '/users' || pathname.startsWith('/settings/departments')
  const activeTab = pathname === '/settings' ? (searchParams.get('tab') === 'team' ? 'team' : 'general') : isTeamPath ? 'team' : 'general'

  const general = [
    { icon: UserRound, title: t('profile'), description: t('profileSettingsDescription'), href: '/settings/profile' },
    { icon: Palette, title: t('appearance'), description: t('appearanceDescription'), href: '/settings/appearance' },
    { icon: Bell, title: t('notifications'), description: t('notificationsSettingsDescription'), href: '/settings/notifications' },
    { icon: CreditCard, title: t('billing'), description: t('billingSettingsDescription'), href: '/settings/billing' },
  ]

  const team = [
    { icon: Users, title: t('users'), description: t('usersDescription'), href: '/users' },
    { icon: Building2, title: t('departments'), description: t('departmentsDescriptionLong'), href: '/settings/departments' },
  ]

  const cards = activeTab === 'team' ? team : general

  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <SettingCard key={card.href} {...card} actionLabel={t('openSettings')} />)}</div>
}
