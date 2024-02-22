import { CloseRounded, SearchRounded } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewRecordButton from "../components/NewRecordButton";
import { useStore } from "../config/store";
import { IHistoryItem } from "../types/interfaces";

export default function HistoryPage() {
  const history = useStore((s) => s.history);
  const [query, setQuery] = useState("");
  const handleChange = (v: string) => setQuery(v);

  const list = useMemo(
    () =>
      history.filter((h) => {
        const patName = h.symptoms.find((s) => s.id === "pat-name")?.value as string | undefined;
        return patName?.includes(query);
      }),
    [history, query]
  );

  return (
    <Stack aria-label="diseases-page" flex={1} p={2} gap={2}>
      <TextField
        size="small"
        type="text"
        placeholder="Search a name"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ opacity: 0.5 }}>
              <SearchRounded />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
      />
      <List>
        {list.map((item, i) => (
          <HistoryItem key={i} index={i} {...item} />
        ))}
      </List>
      <NewRecordButton fullWidth />
    </Stack>
  );
}

const HistoryItem = ({ createdAt, symptoms, index, unsaved }: IHistoryItem & { index: number }) => {
  const nav = useNavigate();
  const remove = useStore((s) => s.removeHistory);
  const load = useStore((s) => s.loadHistory);
  const showSnackbar = useStore((s) => s.showSnackbar);

  const title = useMemo(() => symptoms.find((s) => s.id === "pat-name")?.value ?? "ORDA", [symptoms]);

  const handleLoad: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    load(symptoms);
    nav("/");
    showSnackbar("History record loaded!");
  };

  const handleRemove: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    remove(index);
    showSnackbar("History record removed!");
  };

  return (
    <ListItem
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "var(--app-border)",
        cursor: "pointer",
      }}
      onClick={handleLoad}>
      <IconButton size="small" color="error" onClick={handleRemove}>
        <CloseRounded fontSize="small" />
      </IconButton>
      <Box flex="0 0 8px" />
      <ListItemText
        primary={title.toString()}
        secondary={unsaved ? "(unsaved draft)" : undefined}
        secondaryTypographyProps={{ fontSize: "0.65rem", color: "warning.main" }}
      />
      <Typography fontSize="0.75rem" sx={{ textAlign: "end", opacity: 0.55 }}>
        {new Date(createdAt).toUTCString()}
      </Typography>
    </ListItem>
  );
};
