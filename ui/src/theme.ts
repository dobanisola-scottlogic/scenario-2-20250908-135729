import { createTheme } from '@mui/material';

export const colours = {
  // dark washed purple from Material Design 2 - https://m2.material.io/design/color/the-color-system.html
  darkPurple: '#6200EE',
  midGrey: '#EFEFEF',
  lightGrey: '#F5F5F5',
  textBlack: '#000000DE'
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colours.darkPurple,
    },
    background: {
      default: colours.lightGrey,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          justifyItems: 'center',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: colours.textBlack,
          fontWeight: 'bold',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colours.midGrey,
          position: 'relative',
        },
      },
    },
  },
});
