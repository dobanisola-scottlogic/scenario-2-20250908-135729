import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

interface PasswordTextFieldProps {
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordTextField = ({
  required,
  value,
  onChange,
}: PasswordTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const type = showPassword ? 'text' : 'password';

  return (
    <>
      <TextField
        aria-label='password'
        autoComplete='current-password'
        fullWidth
        id='password'
        label='Password'
        margin='normal'
        name='Password'
        required={required}
        sx={{ m: 1, mx: 'auto' }}
        type={type}
        value={value}
        variant='outlined'
        onChange={onChange}
        InputProps={{
          inputProps: {
            'data-testid': 'password-input',
          },
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleTogglePassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default PasswordTextField;
