import { AddRounded, HistoryRounded, HomeOutlined, SaveOutlined, UploadFileOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../config/store";
import { exportHistory, importHistory } from "../lib/history";
import { ReactComponent as Logo } from "./favicon.svg";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const addHistory = useStore((s) => s.addHistory);
  const symptoms = useStore((s) => s.symptoms);
  const history = useStore((s) => s.history);
  const reset = useStore((s) => s.reset);
  const autoBackup = useStore((s) => s.autoBackup);
  const showSnackbar = useStore((s) => s.showSnackbar);

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

  const handleNewRecord = () => {
    // save prev data as history
    addHistory({ createdAt: new Date(), scores: [], symptoms, unsaved: true });
    // clear list
    reset();
    // nav to home page 1
    nav("/list/1");
    // show notification
    showSnackbar("Draft saved! You can view it any time in history page");
  };

  const showNewBtn = useMemo(() => pathname.startsWith("/list") && !pathname.startsWith("/list/1"), [pathname]);
  const showLoadBtn = useMemo(() => pathname.startsWith("/history"), [pathname]);
  const showSaveBtn = useMemo(
    () => (!autoBackup && pathname.startsWith("/result")) || pathname.startsWith("/history"),
    [autoBackup, pathname]
  );
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
      <Stack flex="0 1 100%" direction="row" alignItems="center" justifyContent="flex-start">
        {showNewBtn && (
          <Tooltip title="New File">
            <Button onClick={handleNewRecord} startIcon={<AddRounded />} size="small" sx={{ fontSize: "0.78rem" }}>
              New
            </Button>
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
            <IconButton aria-label="save-data" onClick={handleExportHistory} title="Download Data">
              <SaveOutlined />
            </IconButton>
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
