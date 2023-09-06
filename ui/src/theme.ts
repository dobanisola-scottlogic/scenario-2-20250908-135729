import { createTheme } from '@mui/material';

// dark washed purple from Material Design 2 - https://m2.material.io/design/color/the-color-system.html
const darkPurple = '#6200EE';

const theme = createTheme({
  palette: {
    primary: {
      main: darkPurple,
    },
  },
});

export default theme;
