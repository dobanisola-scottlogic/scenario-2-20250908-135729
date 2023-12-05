import { Route, Routes } from 'react-router-dom';
import HackathonDetails from '~/components/dashboards/admin/HackathonDetails';
import HackathonList from '~/components/dashboards/admin/HackathonList';
import Team from '~/components/dashboards/team/Team';
import GameViewer from '~/components/game/GameViewer';
import Login from '~/components/login/Login';
import { UserRole } from '~/enums/UserRole';
import { useAppSelector } from '~/hooks';
import { selectUserRole } from '~/slices/authSlice';
import ProtectedRoute from './ProtectedRoute';
import {
  baseRoute,
  hackathonGameRouterRoute,
  hackathonRouterRoute,
} from './Routes';

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
        <Route path={baseRoute} element={renderComponentBasedOnRole()} />
        <Route element={<ProtectedRoute allowedRoles={UserRole.ADMIN} />}>
          <Route path={hackathonRouterRoute} element={<HackathonDetails />} />
          <Route path={hackathonGameRouterRoute} element={<GameViewer />} />
        </Route>
      </Routes>
    </>
  );
};

export default Routing;
