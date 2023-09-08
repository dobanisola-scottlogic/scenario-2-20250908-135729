import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <>
      <AppBar elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="header">
            Hackathon
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
