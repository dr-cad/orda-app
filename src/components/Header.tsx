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
import useAppHistory from "../hooks/history";
import NewRecordButton from "./NewRecordButton";
import { ReactComponent as Logo } from "./favicon.svg";

export default function Header() {
  const { pathname } = useLocation();
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const detailed = useStore((s) => s.detailed);
  const toggleDetailed = useStore((s) => s.toggleDetailed);

  const toggleMode = () => {
    setMode(mode === "raw" ? "prevalance" : "raw");
  };

  const { handleImportHistory, handleExportHistory } = useAppHistory();

  const inIntro = useMemo(() => pathname.startsWith("/intro"), [pathname]);
  const inList = useMemo(() => pathname.startsWith("/list") && !pathname.startsWith("/list/1"), [pathname]);
  const inHistory = useMemo(() => pathname.startsWith("/history"), [pathname]);
  const inResult = useMemo(() => pathname.startsWith("/result"), [pathname]);

  if (inIntro) return null;

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
        {inList && (
          <Tooltip title="New Record">
            <NewRecordButton size="small" sx={{ fontSize: "0.75rem" }} />
          </Tooltip>
        )}
        {inHistory && (
          <Tooltip title="Import History">
            <IconButton onClick={handleImportHistory}>
              <UploadFileOutlined />
            </IconButton>
          </Tooltip>
        )}
        {inHistory && (
          <Tooltip title="Export History">
            <IconButton onClick={handleExportHistory}>
              <SaveOutlined />
            </IconButton>
          </Tooltip>
        )}
        {inResult && (
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
        {inList && (
          <Tooltip title="Show Detailed" sx={{ opacity: !detailed ? 1 : 0.25 }}>
            <IconButton onClick={toggleDetailed}>{!detailed ? <Visibility /> : <VisibilityOff />}</IconButton>
          </Tooltip>
        )}
        {!inHistory && !inIntro && (
          <NavLink to="/history">
            <IconButton>
              <HistoryRounded />
            </IconButton>
          </NavLink>
        )}
        {inHistory && (
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
