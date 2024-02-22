import { CloseRounded } from "@mui/icons-material";
import { Box, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useStore } from "../config/store";
import { IHistoryItem } from "../types/interfaces";

export default function HistoryPage() {
  const history = useStore((s) => s.history);
  return (
    <Stack aria-label="diseases-page" flex={1} p={2} gap={2}>
      <List>
        {history.map((item, i) => (
          <HistoryItem key={i} index={i} {...item} />
        ))}
      </List>
    </Stack>
  );
}

const HistoryItem = ({ createdAt, symptoms, index }: IHistoryItem & { index: number }) => {
  const remove = useStore((s) => s.removeHistory);
  const load = useStore((s) => s.loadHistory);
  const title = useMemo(() => symptoms.find((s) => s.id === "pat-name")?.value ?? "ORDA", [symptoms]);

  return (
    <ListItem
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "var(--app-border)",
        cursor: "pointer",
      }}
      onClick={() => load(symptoms)}>
      <IconButton size="small" color="error" onClick={() => remove(index)}>
        <CloseRounded />
      </IconButton>
      <Box flex="0 0 8px" />
      <ListItemText primary={title.toString()} />
      <Typography fontSize="0.75rem" sx={{ textAlign: "end", opacity: 0.55 }}>
        {createdAt?.toUTCString()}
      </Typography>
    </ListItem>
  );
};
