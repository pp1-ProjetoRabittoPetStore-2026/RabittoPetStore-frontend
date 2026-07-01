
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { authService } from './services/auth/storage';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import PrivateLayout from './layouts/private-layout';
import ManagerOrdersPage from './pages/manager/orders';

export function ProtectedRoute() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/manager/orders', element: <ManagerOrdersPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
