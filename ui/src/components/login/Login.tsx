import { createTheme } from '@mui/material/styles';
import { useState } from 'react';
import theme from '../../theme';
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
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login, loginSuccess, setCredentials } from './authSlice';
import { useLoginMutation } from '../../api/api';

function Login() {
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    const credentials: string = btoa(username + ':' + password);
    await dispatch(setCredentials(credentials));
    const response: any = await login(credentials);
    console.log(response.data);
    // dispatch(loginSuccess(response.data))
    // try {
    //   await dispatch(login(credentials));
    // } catch (e) {
    //   setError('Login failed. Please check your credentials.');
    // }
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
              onSubmit={handleLogin}
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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
                {error && <div className="error-message">{error}</div>}
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Login;
