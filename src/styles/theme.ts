import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

const theme = createTheme(
  {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1024,
        lg: 1440,
        xl: 1920,
      },
    },
    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    },
    palette: {
      primary: {
        main: '#461E52',
      },
      common: {
        white: '#FFFFFF',
      },
      secondary: {
        main: '#DD517F',
      },
      action: {
        disabledBackground: '#b9abcc',
        disabled: 'white',
      },
      text: {
        primary: `#7998EE`,
        secondary: `#556DC8`,
        disabled: `rgba(0, 0, 0, 0.38)`,
      },
      error: {
        main: `#F15B5B`,
      },
    },
    spacing: 10,
  },
  esES,
);

export default theme;
