import { Stack, Typography } from "@mui/material";
import { ReactComponent as Logo } from "./favicon.svg";

export default function Header() {
  return (
    <Stack
      direction="row"
      gap={2}
      justifyContent="center"
      alignItems="center"
      py={1.5}
      px={3}
      borderBottom="var(--app-border)">
      <Logo style={{ height: "2.5rem", width: "auto" }} />
      <Typography fontWeight={600} color="text">
        ORDA
      </Typography>
    </Stack>
  );
}
