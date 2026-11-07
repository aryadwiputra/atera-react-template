import { createBrowserRouter, RouterProvider } from 'react-router'
import AppLayout from './layouts/app-layout'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import DashboardPage from './pages/dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
        <DashboardPage />
      </AppLayout>
    ),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
