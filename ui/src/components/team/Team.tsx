import { Button, Typography } from '@mui/material';
import { logout, selectTeamName } from '../../auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const Team = () => {
  const name = useAppSelector(selectTeamName);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Typography component="h1" variant="h6">
        Team: {name}
      </Typography>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Team;
