import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { selectUserRole } from '../../slices/authSlice';
import NavbarMenu from '../menus/NavbarMenu';

const Navbar = () => {
  const userRole = useAppSelector(selectUserRole);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(import.meta.env.BASE_URL);
  };

  return (
    <>
      <AppBar elevation={0}>
        <Toolbar>
          <Typography
            variant='h6'
            component='header'
            onClick={handleRedirect}
            sx={{ cursor: 'pointer' }}
          >
            Hackathon
          </Typography>
          {userRole && <NavbarMenu />}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
