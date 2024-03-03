import {
  HistoryRounded,
  HomeOutlined,
  SaveOutlined,
  UploadFileOutlined,
  Visibility,
  VisibilityOff,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "../config/store";
import { exportHistory, importHistory } from "../lib/history";
import NewRecordButton from "./NewRecordButton";
import { ReactComponent as Logo } from "./favicon.svg";

export default function Header() {
  const { pathname } = useLocation();

  const addHistory = useStore((s) => s.addHistory);
  const history = useStore((s) => s.history);
  const showSnackbar = useStore((s) => s.showSnackbar);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const detailed = useStore((s) => s.detailed);
  const toggleDetailed = useStore((s) => s.toggleDetailed);

  const toggleMode = () => {
    setMode(mode === "raw" ? "prevalance" : "raw");
  };

  const handleExportHistory: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    exportHistory(history);
    showSnackbar("History file exported successfully!");
  };

  const handleImportHistory: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    importHistory(addHistory, () => {
      showSnackbar("History file imported successfully!");
    });
  };

  const insideList = useMemo(() => pathname.startsWith("/list") && !pathname.startsWith("/list/1"), [pathname]);
  const showLoadBtn = useMemo(() => pathname.startsWith("/history"), [pathname]);
  const showModeBtn = useMemo(() => pathname.startsWith("/result"), [pathname]);
  const showSaveBtn = useMemo(() => pathname.startsWith("/history"), [pathname]);
  const showHistoryBtn = useMemo(() => !pathname.startsWith("/history"), [pathname]);

  return (
    <Stack
      aria-label="app-header"
      direction="row"
      gap={2}
      justifyContent="center"
      alignItems="center"
      height={66}
      px={2}
      className="blur-bg"
      flexShrink={0}
      top={0}
      zIndex={99}
      borderBottom="var(--app-border)">
      <Stack flex="0 1 100%" direction="row" alignItems="center" justifyContent="flex-start" overflow="hidden">
        {insideList && (
          <Tooltip title="New Record">
            <NewRecordButton size="small" sx={{ fontSize: "0.75rem" }} />
          </Tooltip>
        )}
        {showLoadBtn && (
          <Tooltip title="Import History">
            <IconButton onClick={handleImportHistory}>
              <UploadFileOutlined />
            </IconButton>
          </Tooltip>
        )}
        {showSaveBtn && (
          <Tooltip title="Export History">
            <IconButton onClick={handleExportHistory}>
              <SaveOutlined />
            </IconButton>
          </Tooltip>
        )}
        {showModeBtn && (
          <Tooltip title="Toggle prevalanced mode to consider spread factor">
            <Button
              value="bold"
              sx={{ color: mode === "prevalance" ? "primary" : "#fff5" }}
              startIcon={mode === "prevalance" ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
              onClick={toggleMode}>
              <Typography fontSize="0.65rem" className="text-ellipsis">
                {mode === "raw" ? "Raw Results" : "Prevalanced"}
              </Typography>
            </Button>
          </Tooltip>
        )}
      </Stack>
      <NavLink
        to="/"
        style={{ flex: "0 1 100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Logo style={{ height: "2.5rem", width: "auto" }} />
        <Typography fontWeight={600} color="text">
          ORDA
        </Typography>
      </NavLink>
      <Stack flex="0 1 100%" gap={0.25} direction="row" justifyContent="flex-end" alignItems="center">
        {insideList && (
          <Tooltip title="Show Detailed" sx={{ opacity: !detailed ? 1 : 0.25 }}>
            <IconButton onClick={toggleDetailed}>{!detailed ? <Visibility /> : <VisibilityOff />}</IconButton>
          </Tooltip>
        )}
        {showHistoryBtn ? (
          <NavLink to="/history">
            <IconButton>
              <HistoryRounded />
            </IconButton>
          </NavLink>
        ) : (
          <NavLink to="/">
            <IconButton>
              <HomeOutlined />
            </IconButton>
          </NavLink>
        )}
      </Stack>
    </Stack>
  );
}
