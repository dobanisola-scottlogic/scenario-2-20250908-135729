import { Button, Typography } from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { logout } from '../../auth/authSlice';

const Admin = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Typography component="h1" variant="h6" fontWeight={'bold'}>
        Admin
      </Typography>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Admin;
