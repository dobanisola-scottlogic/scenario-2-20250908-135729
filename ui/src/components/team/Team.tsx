import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectAuthName } from '../login/authSlice';
import { Button } from '@mui/material';

function Team() {
  const name = useAppSelector(selectAuthName);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <h1>You are logged in as team: {name} </h1>
      <Button
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
}

export default Team;
