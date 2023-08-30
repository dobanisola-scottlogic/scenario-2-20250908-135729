import { createTheme } from '@mui/material/styles';
import { useState } from 'react';
import theme from '../theme';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// to do : accessibility and tags - how to make it easier to test
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const loginTheme = createTheme(theme, {
    palette: {
      background: {
        default: '#F5F5F5',
      },
    },
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return event.target;
  };

  return (
    <>
      <ThemeProvider theme={loginTheme}>
        <CssBaseline />
        <AppBar elevation={0} sx={{ backgroundColor: '#EFEFEF' }}>
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
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '9px',
              padding: '40px 30px',
            }}
          >
            <Typography component="h1" variant="h6" fontWeight={'bold'}>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                name="username"
                label="Username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  type="submit"
                  variant="text"
                  sx={{
                    mt: 3,
                    mb: 2,
                    fontWeight: 'bold',
                    justifyItems: 'center',
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Login;
