import {
  BarChart3, Bell, CalendarDays, ChartNoAxesCombined, CircleDollarSign, CreditCard, FilePenLine, FileText, Folder, FolderKanban, FormInput,
  HelpCircle, KanbanSquare, LayoutGrid, LayoutPanelTop, Mail, MapPin, Megaphone, MessageSquare, Package, Settings, ShoppingCart,
  Sparkles, Users, WalletCards, UserCircle, Wand2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TranslationKey } from '@/i18n'

export type NavigationGroup = 'overview' | 'commerce' | 'apps' | 'system'
export type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  group: NavigationGroup
  keywords: string[]
  translationKey: TranslationKey
  badge?: string
}

export const navigationItems: NavigationItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid, group: 'overview', keywords: ['home', 'overview'], translationKey: 'dashboard' },
  { title: 'Analytics', href: '/analytics', icon: ChartNoAxesCombined, group: 'overview', keywords: ['metrics', 'reports'], translationKey: 'analytics' },
  { title: 'eCommerce', href: '/ecommerce', icon: ShoppingCart, group: 'overview', keywords: ['sales', 'shop'], translationKey: 'ecommerce' },
  { title: 'CRM', href: '/crm', icon: Users, group: 'overview', keywords: ['leads', 'customers'], translationKey: 'crm' },
  { title: 'SaaS', href: '/saas', icon: WalletCards, group: 'overview', keywords: ['subscriptions', 'mrr'], translationKey: 'saas' },
  { title: 'Finance', href: '/finance', icon: CircleDollarSign, group: 'overview', keywords: ['budget', 'expenses', 'cash flow'], translationKey: 'finance' },
  { title: 'Marketing', href: '/marketing', icon: Megaphone, group: 'overview', keywords: ['campaigns', 'ads'], translationKey: 'marketing' },
  { title: 'Project Management', href: '/project-management', icon: FolderKanban, group: 'overview', keywords: ['projects', 'tasks'], translationKey: 'projectManagement' },
  { title: 'Charts', href: '/charts', icon: BarChart3, group: 'overview', keywords: ['graphs', 'visualization'], translationKey: 'charts' },
  { title: 'Orders', href: '/orders', icon: Package, group: 'commerce', keywords: ['purchases', 'transactions'], translationKey: 'orders', badge: '12' },
  { title: 'Products', href: '/products', icon: ShoppingCart, group: 'commerce', keywords: ['catalog', 'inventory'], translationKey: 'products' },
  { title: 'Customers', href: '/customers', icon: Users, group: 'commerce', keywords: ['clients', 'accounts'], translationKey: 'customers' },
  { title: 'Invoices', href: '/invoices', icon: FileText, group: 'commerce', keywords: ['billing', 'receipts'], translationKey: 'invoices' },
  { title: 'Billing', href: '/billing', icon: CreditCard, group: 'commerce', keywords: ['payments', 'plans'], translationKey: 'billing' },
  { title: 'Pricing', href: '/pricing', icon: CircleDollarSign, group: 'commerce', keywords: ['plans', 'upgrade'], translationKey: 'pricing' },
  { title: 'Mail', href: '/mail', icon: Mail, group: 'apps', keywords: ['email', 'inbox'], translationKey: 'mail' },
  { title: 'Chat', href: '/chat', icon: MessageSquare, group: 'apps', keywords: ['messages', 'conversation'], translationKey: 'chat' },
  { title: 'Files', href: '/files', icon: Folder, group: 'apps', keywords: ['documents', 'storage'], translationKey: 'files' },
  { title: 'Kanban', href: '/kanban', icon: KanbanSquare, group: 'apps', keywords: ['tasks', 'board'], translationKey: 'kanban' },
  { title: 'Calendar', href: '/calendar', icon: CalendarDays, group: 'apps', keywords: ['events', 'schedule'], translationKey: 'calendar' },
  { title: 'Wizard', href: '/wizard', icon: Wand2, group: 'apps', keywords: ['setup', 'workflow'], translationKey: 'wizard' },
  { title: 'Forms', href: '/forms', icon: FormInput, group: 'apps', keywords: ['inputs', 'validation'], translationKey: 'forms' },
  { title: 'AI Chat', href: '/ai-chat', icon: Sparkles, group: 'apps', keywords: ['assistant', 'ai'], translationKey: 'aiChat' },
  { title: 'Editor', href: '/editor', icon: FilePenLine, group: 'apps', keywords: ['rich text', 'tiptap'], translationKey: 'editor' },
  { title: 'Maps', href: '/maps', icon: MapPin, group: 'apps', keywords: ['locations', 'leaflet'], translationKey: 'maps' },
  { title: 'Widgets', href: '/widgets', icon: LayoutPanelTop, group: 'apps', keywords: ['components', 'showcase'], translationKey: 'widgets' },
  { title: 'Profile', href: '/profile', icon: UserCircle, group: 'system', keywords: ['account', 'personal'], translationKey: 'profile' },
  { title: 'Users', href: '/users', icon: Users, group: 'system', keywords: ['team', 'roles'], translationKey: 'users' },
  { title: 'Notifications', href: '/notifications', icon: Bell, group: 'system', keywords: ['alerts'], translationKey: 'notifications', badge: '3' },
  { title: 'Settings', href: '/settings/appearance', icon: Settings, group: 'system', keywords: ['preferences', 'configuration'], translationKey: 'settings' },
  { title: 'Support', href: '/support', icon: HelpCircle, group: 'system', keywords: ['help', 'contact'], translationKey: 'helpSupport' },
]

export const navigationGroups = ['overview', 'commerce', 'apps', 'system'] as const
