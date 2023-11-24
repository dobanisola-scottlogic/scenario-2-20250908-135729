import {
  Alert,
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useLoginMutation } from '~/api/api';
import { CommonContainer } from '~/components/common/CommonContainer';
import PasswordTextField from '~/components/common/PasswordTextField';
import { commonStyles } from '~/components/commonStyles';
import { ContainerRole } from '~/enums/ContainerRole';
import { useAppDispatch } from '~/hooks';
import { setCredentials } from '~/slices/authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

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
      <CommonContainer containerRole={ContainerRole.LOGIN}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '9px',
            padding: '40px 30px',
            height: '23rem',
          }}
        >
          <Typography component='h1' variant='h6'>
            Login
          </Typography>
          <Box
            component='form'
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              aria-label='username'
              autoComplete='username'
              fullWidth
              id='username'
              label='Username'
              margin='normal'
              name='username'
              required
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <PasswordTextField
              required
              value={password}
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
                <Alert severity='error' sx={commonStyles.alertStyle}>
                  {error}
                </Alert>
              )}
              <Button
                type='submit'
                disabled={isLoading || !password?.trim() || !username?.trim()}
                sx={{ my: 4 }}
              >
                Login
              </Button>
            </Box>
            {isLoading && <LinearProgress />}
          </Box>
        </Box>
      </CommonContainer>
    </>
  );
};

export default Login;
