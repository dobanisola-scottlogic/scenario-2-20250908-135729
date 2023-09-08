import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginTextFieldProps {
  field: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginTextField = ({ field, onChange }: LoginTextFieldProps) => {
  const isPassword = field === 'password';

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  let type: string;
  if (isPassword) {
    type = showPassword ? 'text' : 'password';
  } else {
    type = 'text';
  }

  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={field}
        name={field}
        label={isPassword ? 'Password' : 'Username'}
        aria-label={field}
        type={type}
        autoComplete={isPassword ? 'current-password' : 'username'}
        onChange={onChange}
        InputProps={
          isPassword
            ? {
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
              }
            : undefined
        }
      />
    </>
  );
};

export default LoginTextField;
