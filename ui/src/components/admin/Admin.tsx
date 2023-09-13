import { Button, Typography } from '@mui/material';
import { logout } from '../../auth/authSlice';
import { useAppDispatch } from '../../hooks';

const Admin = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Typography component="h1" variant="h6">
        Admin
      </Typography>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Admin;
