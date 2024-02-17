import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: 'Lato,"Source Sans Pro",Helvetica,Arial,sans-serif',
  },
  components: {
    // MuiButton: { defaultProps: { variant: "contained" } },
    MuiTextField: { defaultProps: { variant: "standard" } },
  },
});

export default responsiveFontSizes(theme);
