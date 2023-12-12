import { createTheme } from '@mui/material';

export const colours = {
  // dark washed purple from Material Design 2 - https://m2.material.io/design/color/the-color-system.html
  darkPurple: '#6200EE',
  midGrey: '#EFEFEF',
  lightGrey: '#F5F5F5',
  darkGrey: '#575757',
  textBlack: '#000000DE',
  outlineGrey: '#0000001F',
  errorRed: '#D8332E',
  white: '#FFFFFF',
};

export const playerColours = [
  '#A80000', // red
  '#0000FF', // blue
  '#006100', // green
  '#9400D3', // purple
];

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
          '&.MuiButton-outlined': {
            borderColor: colours.outlineGrey,
          },
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
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 'bold',
            background: 'white',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          wordWrap: 'break-word',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between',
        },
      },
    },
  },
});
