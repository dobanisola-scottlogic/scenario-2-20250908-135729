import { AppBar, Toolbar, Typography } from '@mui/material';

function Navbar() {
  return (
    <>
      <AppBar
        elevation={0}
        sx={{ backgroundColor: '#EFEFEF', position: 'relative' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="header"
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              color: '#000000DE',
              fontWeight: 'bold',
            }}
          >
            Hackathon
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
