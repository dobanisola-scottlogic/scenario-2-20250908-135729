import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { setCredentials } from '../../auth/authSlice';
import { useLoginMutation } from '../../api/api';
import LoginTextField from './LoginTextField';

const Login = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username?.trim() || !password?.trim()) {
      setError('Username and password cannot be empty.');
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
          setError("Sorry, we couldn't log you in. Please try again later.");
        }
      });
  };

  return (
    <>
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
          <Typography component="h1" variant="h6">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <LoginTextField
              field="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <LoginTextField
              field="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    my: 2,
                    mr: 1,
                  }}
                >
                  {error}
                </Alert>
              )}
              <Button type="submit" disabled={isLoading} sx={{ my: 4 }}>
                Login
              </Button>
            </Box>
            {isLoading && <LinearProgress />}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
