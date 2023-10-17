import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../enums/UserRole';
import { useAppSelector } from '../hooks';
import { selectUserRole } from '../slices/authSlice';

interface ProtectedRouteProps {
  allowedRoles: UserRole;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userRole = useAppSelector(selectUserRole);

  return userRole && allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to={import.meta.env.BASE_URL} />
  );
};

export default ProtectedRoute;
