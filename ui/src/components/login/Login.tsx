import { createTheme } from '@mui/material/styles';
import { useState } from 'react';
import theme from '../../theme';
import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { setCredentials } from '../../auth/authSlice';
import { useLoginMutation } from '../../api/api';

function Login() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

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

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    const credentials: string = btoa(username + ':' + password);
    dispatch(setCredentials(credentials));

    login()
      .unwrap() // success handled by the `fulfilled` action creator
      .catch((e: unknown) => {
        if ((e as { originalStatus?: number }).originalStatus === 401) {
          setError(
            'Invalid username or password. Please check your credentials.'
          );
        } else {
          setError("Sorry we couldn't log you in. Please try again later.");
        }
      });
  };

  return (
    <>
      <ThemeProvider theme={loginTheme}>
        <CssBaseline />
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '90vh',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '9px',
              padding: '40px 30px',
              height: '23rem',
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
                aria-label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  inputProps: {
                    'data-testid': 'password-input',
                  },
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
                {error && (
                  <Box
                    component="div"
                    sx={{
                      mt: 2,
                      mr: 1,
                      color: 'red',
                    }}
                  >
                    <Alert severity="error">{error}</Alert>
                  </Box>
                )}
                <Button
                  type="submit"
                  variant="text"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 4,
                    fontWeight: 'bold',
                    justifyItems: 'center',
                  }}
                >
                  Login
                </Button>
              </Box>
              {isLoading && <LinearProgress />}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Login;
