import { HistoryRounded, HomeOutlined, SaveOutlined, UploadFileOutlined } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "../config/store";
import { ReactComponent as Logo } from "./favicon.svg";

export default function Header() {
  const { pathname } = useLocation();

  const symptoms = useStore((s) => s.symptoms);

  const handleDownloadData = async () => {
    const prefix = symptoms.find((s) => s.id === "pat-name")?.value ?? "ORDA";
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify([symptoms]));
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", `${prefix} ${new Date().toLocaleString()}.json`);
    document.body.appendChild(link); // required for firefox
    link.click();
    link.remove();
  };

  const handleLoadHistory = () => {
    // TODO
  };

  const showLoadBtn = useMemo(() => pathname.startsWith("/list") || pathname.startsWith("/history"), [pathname]);
  const showSaveBtn = useMemo(() => pathname.startsWith("/result") || pathname.startsWith("/history"), [pathname]);
  const showHistoryBtn = useMemo(() => !pathname.startsWith("/history"), [pathname]);

  return (
    <Stack
      aria-label="app-header"
      direction="row"
      gap={2}
      justifyContent="center"
      alignItems="center"
      height={66}
      px={1.5}
      className="blur-bg"
      flexShrink={0}
      top={0}
      zIndex={99}
      borderBottom="var(--app-border)">
      <Stack flex="0 1 100%" direction="row" alignItems="center" justifyContent="flex-start">
        {showLoadBtn && (
          <IconButton onClick={handleLoadHistory}>
            <UploadFileOutlined />
          </IconButton>
        )}
        {showSaveBtn && (
          <IconButton aria-label="save-data" onClick={handleDownloadData} title="Download Data">
            <SaveOutlined />
          </IconButton>
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
