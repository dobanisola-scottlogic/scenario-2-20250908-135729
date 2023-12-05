import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '~/enums/UserRole';
import { useAppSelector } from '~/hooks';
import { selectUserRole } from '~/slices/authSlice';
import { baseRoute } from './Routes';

interface ProtectedRouteProps {
  allowedRoles: UserRole;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userRole = useAppSelector(selectUserRole);

  return userRole && allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to={baseRoute} />
  );
};

export default ProtectedRoute;
