import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import AuthLayout from '@/layouts/auth-layout';
import ProtectedLayout from '@/layouts/protected-layout';
import PreviewPage from '@/pages/preview';
import { PageTransition } from '@/components/shared/page-transition';
import { ScrollToTop } from '@/components/shared/scroll-to-top';
import { RouteFallback } from '@/components/shared/route-fallback';
import { navigationItems } from '@/lib/navigation';

const HomePage = lazy(() => import('@/pages/home'));
const DocsPage = lazy(() => import('@/pages/docs'));
const LoginPage = lazy(() => import('@/pages/login'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const AnalyticsPage = lazy(() => import('@/pages/analytics'));
const OrdersPage = lazy(() => import('@/pages/orders'));
const ProductsPage = lazy(() => import('@/pages/products'));
const CustomersPage = lazy(() => import('@/pages/customers'));
const AppPlaceholder = lazy(() => import('@/pages/app-placeholder'));
const PricingPage = lazy(() => import('@/pages/pricing'));
const ChartsPage = lazy(() => import('@/pages/charts'));
const EcommercePage = lazy(() => import('@/pages/ecommerce'));
const PosPage = lazy(() => import('@/pages/pos'));
const CrmPage = lazy(() => import('@/pages/crm'));
const PipelinePage = lazy(() => import('@/pages/pipeline'));
const SaasPage = lazy(() => import('@/pages/saas'));
const MailPage = lazy(() => import('@/pages/mail'));
const ChatPage = lazy(() => import('@/pages/chat'));
const FilesPage = lazy(() => import('@/pages/files'));
const KanbanPage = lazy(() => import('@/pages/kanban'));
const CalendarPage = lazy(() => import('@/pages/calendar'));
const WizardPage = lazy(() => import('@/pages/wizard'));
const UsersPage = lazy(() => import('@/pages/users'));
const SupportPage = lazy(() => import('@/pages/support'));
const FinancePage = lazy(() => import('@/pages/finance'));
const AssetsPage = lazy(() => import('@/pages/assets'));
const ProcurementPage = lazy(() => import('@/pages/procurement'));
const InventoryPage = lazy(() => import('@/pages/inventory'));
const SuppliersPage = lazy(() => import('@/pages/suppliers'));
const HrPage = lazy(() => import('@/pages/hr'));
const MarketingPage = lazy(() => import('@/pages/marketing'));
const ProjectManagementPage = lazy(() => import('@/pages/project-management'));
const AiChatPage = lazy(() => import('@/pages/ai-chat'));
const WidgetsPage = lazy(() => import('@/pages/widgets'));
const EditorPage = lazy(() => import('@/pages/editor'));
const MapsPage = lazy(() => import('@/pages/maps'));
const SearchPage = lazy(() => import('@/pages/search'));
const FormsPage = lazy(() => import('@/pages/forms'));
const DataTableClientPage = lazy(() => import('@/pages/data-table/client'));
const DataTableServerPage = lazy(() => import('@/pages/data-table/server'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const CustomerFormPage = lazy(() => import('@/pages/customer-form'));
const InvoiceFormPage = lazy(() => import('@/pages/invoice-form'));
const SettingsLayout = lazy(() => import('@/pages/settings/layout'));
const SettingsHome = lazy(() => import('@/pages/settings/home'));
const SettingsAppearancePage = lazy(() => import('@/pages/settings/appearance'));
const SettingsProfilePage = lazy(() => import('@/pages/settings/profile'));
const SettingsNotificationsPage = lazy(() => import('@/pages/settings/notifications'));
const SettingsBillingPage = lazy(() => import('@/pages/settings/billing'));
const SettingsDepartmentsPage = lazy(() => import('@/pages/settings/departments'));
const SalesReportPage = lazy(() => import('@/pages/reports/sales'));
const FinanceReportPage = lazy(() => import('@/pages/reports/finance'));
const InventoryReportPage = lazy(() => import('@/pages/reports/inventory'));
const CustomersReportPage = lazy(() => import('@/pages/reports/customers'));
const HrReportPage = lazy(() => import('@/pages/reports/hr'));
const ProcurementReportPage = lazy(() => import('@/pages/reports/procurement'));
const LiveChatPage = lazy(() => import('@/pages/contact-center/live-chat'));
const SocialCommentsPage = lazy(() => import('@/pages/contact-center/social-comments'));
const EmailsPage = lazy(() => import('@/pages/contact-center/emails'));
const EmailsComposePage = lazy(() => import('@/pages/contact-center/emails-compose'));
const NotFoundPage = lazy(() => import('@/pages/errors/not-found'));
const ForbiddenPage = lazy(() => import('@/pages/errors/forbidden'));
const ServerErrorPage = lazy(() => import('@/pages/errors/server-error'));
const ComingSoonPage = lazy(() => import('@/pages/errors/coming-soon'));
const MaintenancePage = lazy(() => import('@/pages/errors/maintenance'));

const PrivacyPage = lazy(() =>
    import('@/pages/legal').then((module) => ({ default: module.PrivacyPage })),
);
const TermsPage = lazy(() =>
    import('@/pages/legal').then((module) => ({ default: module.TermsPage })),
);
const BillingPage = lazy(() =>
    import('@/pages/commerce/billing').then((module) => ({ default: module.BillingPage })),
);
const CustomerDetailPage = lazy(() =>
    import('@/pages/commerce/details').then((module) => ({ default: module.CustomerDetailPage })),
);
const InvoicesPage = lazy(() =>
    import('@/pages/commerce/invoices').then((module) => ({ default: module.InvoicesPage })),
);
const OrderDetailPage = lazy(() =>
    import('@/pages/commerce/details').then((module) => ({ default: module.OrderDetailPage })),
);
const OrderFormPage = lazy(() =>
    import('@/pages/commerce/order-form').then((module) => ({ default: module.OrderFormPage })),
);
const ProductDetailPage = lazy(() =>
    import('@/pages/commerce/details').then((module) => ({ default: module.ProductDetailPage })),
);
const ProductFormPage = lazy(() =>
    import('@/pages/commerce/product-form').then((module) => ({ default: module.ProductFormPage })),
);
const LoginV2Page = lazy(() =>
    import('@/pages/auth-v2').then((module) => ({ default: module.LoginV2Page })),
);
const RegisterV2Page = lazy(() =>
    import('@/pages/auth-v2').then((module) => ({ default: module.RegisterV2Page })),
);
const NotificationsPage = lazy(() =>
    import('@/pages/workspaces').then((module) => ({ default: module.NotificationsPage })),
);
const ForgotPasswordPage = lazy(() =>
    import('@/pages/auth-pages').then((module) => ({ default: module.ForgotPasswordPage })),
);
const LockScreenPage = lazy(() =>
    import('@/pages/auth-pages').then((module) => ({ default: module.LockScreenPage })),
);
const ResetPasswordPage = lazy(() =>
    import('@/pages/auth-pages').then((module) => ({ default: module.ResetPasswordPage })),
);
const SignUpPage = lazy(() =>
    import('@/pages/auth-pages').then((module) => ({ default: module.SignUpPage })),
);
const TwoFactorPage = lazy(() =>
    import('@/pages/auth-pages').then((module) => ({ default: module.TwoFactorPage })),
);
const VerifyEmailPage = lazy(() =>
    import('@/pages/auth-pages').then((module) => ({ default: module.VerifyEmailPage })),
);

function suspend(children: ReactNode) {
    return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function AuthRoutes() {
    return (
        <AuthLayout>
            <ScrollToTop />
            <PageTransition>
                <Outlet />
            </PageTransition>
        </AuthLayout>
    );
}

const explicitPaths = new Set([
    '/reports/sales',
    '/reports/finance',
    '/reports/inventory',
    '/reports/customers',
    '/reports/hr',
    '/reports/procurement',
    '/analytics',
    '/orders',
    '/products',
    '/customers',
    '/finance',
    '/assets',
    '/procurement',
    '/inventory',
    '/suppliers',
    '/hr',
    '/ecommerce',
    '/crm',
    '/pipeline',
    '/saas',
    '/charts',
    '/invoices',
    '/billing',
    '/search',
    '/pricing',
    '/mail',
    '/chat',
    '/files',
    '/kanban',
    '/calendar',
    '/wizard',
    '/profile',
    '/users',
    '/notifications',
    '/support',
    '/settings',
    '/settings/profile',
    '/settings/appearance',
    '/settings/notifications',
    '/settings/billing',
    '/settings/departments',
    '/editor',
    '/contact-center/live-chat',
    '/contact-center/social-comments',
    '/contact-center/emails',
    '/contact-center/emails/compose',
    '/pos',
    '/marketing',
    '/project-management',
    '/ai-chat',
    '/widgets',
    '/maps',
    '/forms',
    '/data-table/client',
    '/data-table/server',
]);
const placeholderRoutes = navigationItems
    .filter(
        (item) =>
            item.href !== '/dashboard' && item.href !== '/login' && !explicitPaths.has(item.href),
    )
    .map((item) => ({
        path: item.href.slice(1),
        element: suspend(<AppPlaceholder title={item.translationKey} route="/dashboard" />),
    }));

const router = createBrowserRouter([
    { path: '/', element: suspend(<HomePage />) },
    { path: '/terms', element: suspend(<TermsPage />) },
    { path: '/privacy', element: suspend(<PrivacyPage />) },
    { path: '/docs', element: suspend(<DocsPage />) },
    { path: '/preview', element: <PreviewPage /> },
    {
        element: <AuthRoutes />,
        children: [
            { path: '/login', element: suspend(<LoginPage />) },
            { path: '/sign-in', element: suspend(<LoginPage />) },
            { path: '/sign-up', element: suspend(<SignUpPage />) },
            { path: '/forgot-password', element: suspend(<ForgotPasswordPage />) },
            { path: '/reset-password', element: suspend(<ResetPasswordPage />) },
            { path: '/two-factor', element: suspend(<TwoFactorPage />) },
            { path: '/verify-email', element: suspend(<VerifyEmailPage />) },
            { path: '/lock-screen', element: suspend(<LockScreenPage />) },
            { path: '/login-v2', element: suspend(<LoginV2Page />) },
            { path: '/register-v2', element: suspend(<RegisterV2Page />) },
        ],
    },
    {
        element: <ProtectedLayout />,
        children: [
            { path: '/dashboard', element: suspend(<DashboardPage />) },
            { path: '/reports/sales', element: suspend(<SalesReportPage />) },
            { path: '/reports/finance', element: suspend(<FinanceReportPage />) },
            { path: '/reports/inventory', element: suspend(<InventoryReportPage />) },
            { path: '/reports/customers', element: suspend(<CustomersReportPage />) },
            { path: '/reports/hr', element: suspend(<HrReportPage />) },
            { path: '/reports/procurement', element: suspend(<ProcurementReportPage />) },
            { path: '/contact-center/live-chat', element: suspend(<LiveChatPage />) },
            { path: '/contact-center/social-comments', element: suspend(<SocialCommentsPage />) },
            { path: '/contact-center/emails', element: suspend(<EmailsPage />) },
            { path: '/contact-center/emails/compose', element: suspend(<EmailsComposePage />) },
            { path: '/analytics', element: suspend(<AnalyticsPage />) },
            { path: '/charts', element: suspend(<ChartsPage />) },
            { path: '/orders', element: suspend(<OrdersPage />) },
            { path: '/pos', element: suspend(<PosPage />) },
            { path: '/products', element: suspend(<ProductsPage />) },
            { path: '/customers', element: suspend(<CustomersPage />) },
            { path: '/ecommerce', element: suspend(<EcommercePage />) },
            { path: '/crm', element: suspend(<CrmPage />) },
            { path: '/pipeline', element: suspend(<PipelinePage />) },
            { path: '/saas', element: suspend(<SaasPage />) },
            { path: '/finance', element: suspend(<FinancePage />) },
            { path: '/assets', element: suspend(<AssetsPage />) },
            { path: '/procurement', element: suspend(<ProcurementPage />) },
            { path: '/inventory', element: suspend(<InventoryPage />) },
            { path: '/suppliers', element: suspend(<SuppliersPage />) },
            { path: '/hr', element: suspend(<HrPage />) },
            { path: '/marketing', element: suspend(<MarketingPage />) },
            { path: '/project-management', element: suspend(<ProjectManagementPage />) },
            { path: '/ai-chat', element: suspend(<AiChatPage />) },
            { path: '/widgets', element: suspend(<WidgetsPage />) },
            { path: '/editor', element: suspend(<EditorPage />) },
            { path: '/maps', element: suspend(<MapsPage />) },
            { path: '/forms', element: suspend(<FormsPage />) },
            { path: '/data-table/client', element: suspend(<DataTableClientPage />) },
            { path: '/data-table/server', element: suspend(<DataTableServerPage />) },
            { path: '/orders/new', element: suspend(<OrderFormPage />) },
            { path: '/orders/:id/edit', element: suspend(<OrderFormPage />) },
            { path: '/orders/:id', element: suspend(<OrderDetailPage />) },
            { path: '/products/new', element: suspend(<ProductFormPage />) },
            { path: '/products/:id/edit', element: suspend(<ProductFormPage />) },
            { path: '/products/:id', element: suspend(<ProductDetailPage />) },
            { path: '/customers/new', element: suspend(<CustomerFormPage />) },
            { path: '/customers/:id/edit', element: suspend(<CustomerFormPage />) },
            { path: '/customers/:id', element: suspend(<CustomerDetailPage />) },
            { path: '/invoices', element: suspend(<InvoicesPage />) },
            { path: '/invoices/new', element: suspend(<InvoiceFormPage />) },
            { path: '/invoices/:id/edit', element: suspend(<InvoiceFormPage />) },
            { path: '/billing', element: suspend(<BillingPage />) },
            { path: '/pricing', element: suspend(<PricingPage />) },
            { path: '/mail', element: suspend(<MailPage />) },
            { path: '/chat', element: suspend(<ChatPage />) },
            { path: '/files', element: suspend(<FilesPage />) },
            { path: '/kanban', element: suspend(<KanbanPage />) },
            { path: '/calendar', element: suspend(<CalendarPage />) },
            { path: '/wizard', element: suspend(<WizardPage />) },
            { path: '/profile', element: suspend(<ProfilePage />) },
            { path: '/users', element: suspend(<UsersPage />) },
            { path: '/notifications', element: suspend(<NotificationsPage />) },
            { path: '/support', element: suspend(<SupportPage />) },
            ...placeholderRoutes.filter((item) => !explicitPaths.has(`/${item.path}`)),
            { path: '/search', element: suspend(<SearchPage />) },
            {
                path: '/settings',
                element: suspend(<SettingsLayout />),
                children: [
                    { index: true, element: suspend(<SettingsHome />) },
                    { path: 'profile', element: suspend(<SettingsProfilePage />) },
                    { path: 'appearance', element: suspend(<SettingsAppearancePage />) },
                    { path: 'notifications', element: suspend(<SettingsNotificationsPage />) },
                    { path: 'billing', element: suspend(<SettingsBillingPage />) },
                    { path: 'departments', element: suspend(<SettingsDepartmentsPage />) },
                ],
            },
            { path: '/403', element: suspend(<ForbiddenPage />) },
            { path: '/404', element: suspend(<NotFoundPage />) },
            { path: '/500', element: suspend(<ServerErrorPage />) },
            { path: '/coming-soon', element: suspend(<ComingSoonPage />) },
            { path: '/maintenance', element: suspend(<MaintenancePage />) },
            { path: '*', element: suspend(<NotFoundPage />) },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
