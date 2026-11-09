import { Navigate, Outlet, useLocation } from 'react-router'
import AppLayout from '@/layouts/app-layout'
import { ScrollToTop } from '@/components/shared/scroll-to-top'
import { useAuth } from '@/hooks/use-auth'

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <AppLayout><ScrollToTop /><Outlet /></AppLayout>
}
