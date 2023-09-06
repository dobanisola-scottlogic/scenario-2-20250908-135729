import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectTeamName } from '../../auth/authSlice';
import { Button, Typography } from '@mui/material';

function Team() {
  const name = useAppSelector(selectTeamName);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Typography component="h1" variant="h6" fontWeight={'bold'}>
        Team: {name}
      </Typography>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
}

export default Team;
