import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

function Material({ children }) {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default Material;
