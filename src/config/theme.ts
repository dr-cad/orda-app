import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: 'Lato,"Source Sans Pro",Helvetica,Arial,sans-serif',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
        InputProps: { disableUnderline: true, inputProps: { sx: { py: 0.5 } } },
      },
      styleOverrides: {
        root: { backgroundColor: "#ffffff0d", padding: "3px 12px", borderRadius: 14 },
      },
    },
  },
});

export default responsiveFontSizes(theme);
