import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Admin from './components/admin/Admin';
import Team from './components/team/Team';
import { useAppSelector } from './hooks';
import { selectAuthRole } from './components/login/authSlice';
import { UserRole } from './enums/UserRole';

function App() {
  const userRole = useAppSelector(selectAuthRole);
  console.log(userRole)

  const redirectMap = {
  [UserRole.NONE]: '/login',
  [UserRole.ADMIN]: '/admin',
  [UserRole.TEAM]: '/team',
};

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={redirectMap[userRole]}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </>
  );
}

export default App;
