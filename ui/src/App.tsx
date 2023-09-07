import Login from './components/login/Login';
import Admin from './components/admin/Admin';
import Team from './components/team/Team';
import { useAppSelector } from './hooks';
import { selectUserRole } from './auth/authSlice';
import { UserRole } from './enums/UserRole';
import { theme } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Navbar from './components/navbar/Navbar';

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
