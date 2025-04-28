// src/components/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  redirectPath?: string;
}

function PrivateRoute({ redirectPath = '/' }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} state={{ from: location }} replace />
  );
}

export default PrivateRoute;