import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0f212e" },
  },
  typography: {
    fontFamily: [
      '"Exo 2"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
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
    MuiPaginationItem: {},
  },
});

export default responsiveFontSizes(theme);
