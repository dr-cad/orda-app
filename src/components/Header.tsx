import { AddRounded, HistoryRounded, HomeOutlined, SaveOutlined, UploadFileOutlined } from "@mui/icons-material";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../config/store";
import { downloadData } from "../lib/file";
import { ReactComponent as Logo } from "./favicon.svg";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const addHistory = useStore((s) => s.addHistory);
  const symptoms = useStore((s) => s.symptoms);
  const history = useStore((s) => s.history);
  const reset = useStore((s) => s.reset);
  const autoBackup = useStore((s) => s.autoBackup);

  const handleDownloadData: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadData(history);
  };

  const handleLoadHistory = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as any).files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (readerEvent) => {
        try {
          const content = readerEvent.target!.result;
          console.log(content);
          if (!content) throw new Error("empty file");
          const data = JSON.parse(content!.toString());
          if (!Array.isArray(data)) throw new Error("wrong content");
          data.forEach((item) => addHistory(item));
          nav("/history");
        } catch (e) {
          if (e instanceof Error) {
            alert(e.message);
          }
        }
      };
    };
    input.click();
  };

  const handleNewFile = () => {
    // save prev data as history
    addHistory({ createdAt: new Date(), scores: [], symptoms, unsaved: true });
    // clear list
    reset();
    // nav to home page 1
    nav("/list/1");
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
            <IconButton onClick={handleNewFile}>
              <AddRounded />
            </IconButton>
          </Tooltip>
        )}
        {showLoadBtn && (
          <Tooltip title="Import History">
            <IconButton onClick={handleLoadHistory}>
              <UploadFileOutlined />
            </IconButton>
          </Tooltip>
        )}
        {showSaveBtn && (
          <Tooltip title="Export History">
            <IconButton aria-label="save-data" onClick={handleDownloadData} title="Download Data">
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
