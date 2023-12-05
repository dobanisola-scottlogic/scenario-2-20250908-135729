import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarMenu from '~/components/menus/NavbarMenu';
import { useAppSelector } from '~/hooks';
import { baseRoute } from '~/routing/Routes';
import { selectUserRole } from '~/slices/authSlice';

const Navbar = () => {
  const userRole = useAppSelector(selectUserRole);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(baseRoute);
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
