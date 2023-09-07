import { AppBar, Toolbar, Typography } from '@mui/material';
import { colours } from '../../theme';

const Navbar = () => {
  return (
    <>
      <AppBar
        elevation={0}
        sx={{ backgroundColor: colours.midGrey, position: 'relative' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="header"
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              color: colours.textBlack,
              fontWeight: 'bold',
            }}
          >
            Hackathon
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
