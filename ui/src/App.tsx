import Login from './components/login/Login';
import Admin from './components/admin/Admin';
import Team from './components/team/Team';
import { useAppSelector } from './hooks';
import { selectAuthRole } from './components/login/authSlice';
import { UserRole } from './enums/UserRole';

function App() {
  const userRole = useAppSelector(selectAuthRole);
  const status = useAppSelector((state) => state.auth.status);
  console.log(status);
  console.log(userRole)

const renderComponentBasedOnRole = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return <Admin />;
      case UserRole.TEAM:
        return <Team />;
      default:
        return <Login />;
    }
  };

  return (
    <>
    {renderComponentBasedOnRole()}
    </>
  );
}

export default App;
