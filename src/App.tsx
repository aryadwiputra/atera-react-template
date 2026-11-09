import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'
import AuthLayout from '@/layouts/auth-layout'
import ProtectedLayout from '@/layouts/protected-layout'
import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard'
import AnalyticsPage from '@/pages/analytics'
import OrdersPage from '@/pages/orders'
import ProductsPage from '@/pages/products'
import CustomersPage from '@/pages/customers'
import AppPlaceholder from '@/pages/app-placeholder'
import { BillingPage, CustomerDetailPage, InvoicesPage, OrderDetailPage, OrderFormPage, ProductDetailPage, ProductFormPage } from '@/pages/commerce'
import PricingPage from '@/pages/pricing'
import ChartsPage from '@/pages/charts'
import EcommercePage from '@/pages/ecommerce'
import CrmPage from '@/pages/crm'
import SaasPage from '@/pages/saas'
import MailPage from '@/pages/mail'
import ChatPage from '@/pages/chat'
import FilesPage from '@/pages/files'
import KanbanPage from '@/pages/kanban'
import CalendarPage from '@/pages/calendar'
import WizardPage from '@/pages/wizard'
import UsersPage from '@/pages/users'
import SupportPage from '@/pages/support'
import FinancePage from '@/pages/finance'
import MarketingPage from '@/pages/marketing'
import ProjectManagementPage from '@/pages/project-management'
import AiChatPage from '@/pages/ai-chat'
import WidgetsPage from '@/pages/widgets'
import EditorPage from '@/pages/editor'
import MapsPage from '@/pages/maps'
import { LoginV2Page, RegisterV2Page } from '@/pages/auth-v2'
import FormsPage from '@/pages/forms'
import CustomerFormPage from '@/pages/customer-form'
import InvoiceFormPage from '@/pages/invoice-form'
import { NotificationsPage, ProfilePage } from '@/pages/workspaces'
import { ForgotPasswordPage, LockScreenPage, ResetPasswordPage, SignUpPage, TwoFactorPage, VerifyEmailPage } from '@/pages/auth-pages'
import SettingsAppearancePage from '@/pages/settings/appearance'
import SettingsProfilePage from '@/pages/settings/profile'
import SettingsNotificationsPage from '@/pages/settings/notifications'
import SettingsBillingPage from '@/pages/settings/billing'
import { PageTransition } from '@/components/shared/page-transition'
import { ScrollToTop } from '@/components/shared/scroll-to-top'
import { navigationItems } from '@/lib/navigation'
import NotFoundPage from '@/pages/errors/not-found'
import ForbiddenPage from '@/pages/errors/forbidden'
import ServerErrorPage from '@/pages/errors/server-error'
import ComingSoonPage from '@/pages/errors/coming-soon'
import MaintenancePage from '@/pages/errors/maintenance'

function AuthRoutes() {
  return <AuthLayout><ScrollToTop /><PageTransition><Outlet /></PageTransition></AuthLayout>
}

const explicitPaths = new Set(['/analytics', '/orders', '/products', '/customers', '/ecommerce', '/crm', '/saas', '/charts', '/invoices', '/billing', '/pricing', '/mail', '/chat', '/files', '/kanban', '/calendar', '/wizard', '/profile', '/users', '/notifications', '/support', '/settings', '/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/billing'])
const placeholderRoutes = navigationItems.filter((item) => item.href !== '/dashboard' && item.href !== '/login' && !explicitPaths.has(item.href)).map((item) => ({
  path: item.href.slice(1),
  element: <AppPlaceholder title={item.translationKey} route="/dashboard" />,
}))

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { element: <AuthRoutes />, children: [{ path: '/login', element: <LoginPage /> }, { path: '/sign-in', element: <LoginPage /> }, { path: '/sign-up', element: <SignUpPage /> }, { path: '/forgot-password', element: <ForgotPasswordPage /> }, { path: '/reset-password', element: <ResetPasswordPage /> }, { path: '/two-factor', element: <TwoFactorPage /> }, { path: '/verify-email', element: <VerifyEmailPage /> }, { path: '/lock-screen', element: <LockScreenPage /> }, { path: '/login-v2', element: <LoginV2Page /> }, { path: '/register-v2', element: <RegisterV2Page /> }] },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/charts', element: <ChartsPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/customers', element: <CustomersPage /> },
      { path: '/ecommerce', element: <EcommercePage /> },
      { path: '/crm', element: <CrmPage /> },
      { path: '/saas', element: <SaasPage /> },
      { path: '/finance', element: <FinancePage /> },
      { path: '/marketing', element: <MarketingPage /> },
      { path: '/project-management', element: <ProjectManagementPage /> },
      { path: '/ai-chat', element: <AiChatPage /> },
      { path: '/widgets', element: <WidgetsPage /> },
      { path: '/editor', element: <EditorPage /> },
      { path: '/maps', element: <MapsPage /> },
      { path: '/forms', element: <FormsPage /> },
      { path: '/orders/new', element: <OrderFormPage /> },
      { path: '/orders/:id/edit', element: <OrderFormPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/products/new', element: <ProductFormPage /> },
      { path: '/products/:id/edit', element: <ProductFormPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },
      { path: '/customers/new', element: <CustomerFormPage /> },
      { path: '/customers/:id/edit', element: <CustomerFormPage /> },
      { path: '/customers/:id', element: <CustomerDetailPage /> },
      { path: '/invoices', element: <InvoicesPage /> },
      { path: '/invoices/new', element: <InvoiceFormPage /> },
      { path: '/invoices/:id/edit', element: <InvoiceFormPage /> },
      { path: '/billing', element: <BillingPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/mail', element: <MailPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/files', element: <FilesPage /> },
      { path: '/kanban', element: <KanbanPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/wizard', element: <WizardPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/users', element: <UsersPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/support', element: <SupportPage /> },
      ...placeholderRoutes.filter((item) => !explicitPaths.has(`/${item.path}`)),
      { path: '/settings', element: <Navigate to="/settings/appearance" replace /> },
      { path: '/settings/profile', element: <SettingsProfilePage /> },
      { path: '/settings/appearance', element: <SettingsAppearancePage /> },
      { path: '/settings/notifications', element: <SettingsNotificationsPage /> },
      { path: '/settings/billing', element: <SettingsBillingPage /> },
      { path: '/403', element: <ForbiddenPage /> },
      { path: '/404', element: <NotFoundPage /> },
      { path: '/500', element: <ServerErrorPage /> },
      { path: '/coming-soon', element: <ComingSoonPage /> },
      { path: '/maintenance', element: <MaintenancePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
