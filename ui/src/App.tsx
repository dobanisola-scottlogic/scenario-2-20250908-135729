import { CssBaseline, ThemeProvider } from '@mui/material';
import { selectUserRole } from './auth/authSlice';
import Admin from './components/admin/Admin';
import Login from './components/login/Login';
import Navbar from './components/navbar/Navbar';
import Team from './components/team/Team';
import { UserRole } from './enums/UserRole';
import { useAppSelector } from './hooks';
import { theme } from './theme';

const App = () => {
  const userRole = useAppSelector(selectUserRole);

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        {renderComponentBasedOnRole()}
      </ThemeProvider>
    </>
  );
};

export default App;
