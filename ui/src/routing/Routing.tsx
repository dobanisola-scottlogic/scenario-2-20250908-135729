import { Route, Routes } from 'react-router-dom';
import HackathonDetails from '../components/dashboards/admin/HackathonDetails';
import HackathonList from '../components/dashboards/admin/HackathonList';
import Team from '../components/dashboards/team/Team';
import Login from '../components/login/Login';
import { UserRole } from '../enums/UserRole';
import { useAppSelector } from '../hooks';
import { selectUserRole } from '../slices/authSlice';
import ProtectedRoute from './ProtectedRoute';

const Routing = () => {
  const userRole = useAppSelector(selectUserRole);

  const renderComponentBasedOnRole = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return <HackathonList />;
      case UserRole.TEAM:
        return <Team />;
      default:
        return <Login />;
    }
  };

  return (
    <>
      <Routes>
        <Route
          path={import.meta.env.BASE_URL}
          element={renderComponentBasedOnRole()}
        />
        <Route element={<ProtectedRoute allowedRoles={UserRole.ADMIN} />}>
          <Route
            path={`${import.meta.env.BASE_URL}:id`}
            element={<HackathonDetails />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default Routing;
