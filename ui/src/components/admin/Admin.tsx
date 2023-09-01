import { Button } from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { logout } from '../login/authSlice';

function Admin() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <h1>You are logged in as admin</h1>
      <Button
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
}

export default Admin;
