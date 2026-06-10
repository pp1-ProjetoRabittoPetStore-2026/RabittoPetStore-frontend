/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { authService, type Role } from './services/auth/storage';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import PrivateLayout from './layouts/private-layout';
import ManagerOrdersPage from './pages/manager/orders';
import StatusPet from './pages/pets/StatusPet';
import EmployeePage from './pages/manager/employee';
import ManagerAgendaPage from './pages/manager/agenda';
import VetAgendaPage from './pages/vet/agenda';

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

// Guarda de papel: bloqueia rotas conforme o cargo do funcionário logado.
export function RoleRoute({ allow }: { allow: Role[] }) {
  const role = authService.getRole();
  if (!role || !allow.includes(role)) {
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
          // Rotas do gerente
          {
            element: <RoleRoute allow={['GERENTE']} />,
            children: [
              { path: '/manager/orders', element: <ManagerOrdersPage /> },
              { path: '/manager/employee', element: <EmployeePage /> },
              { path: '/manager/agenda', element: <ManagerAgendaPage /> },
            ],
          },
          // Controle de fila — gerente e tosador
          {
            element: <RoleRoute allow={['GERENTE', 'TOSADOR']} />,
            children: [{ path: '/pets/status', element: <StatusPet /> }],
          },
          // Agenda médica — somente veterinário
          {
            element: <RoleRoute allow={['VETERINARIO']} />,
            children: [{ path: '/vet/agenda', element: <VetAgendaPage /> }],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
