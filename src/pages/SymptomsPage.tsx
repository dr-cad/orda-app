import { ClearAllRounded, ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import TreeView from "@mui/lab/TreeView";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import SymptomsGroup from "../components/Symptom";
import { CloseSquare, MinusSquare, PlusSquare } from "../components/styled";
import { useStore } from "../config/store";
import { usePageIndex } from "../hooks/pages";

function SymptomsPage() {
  const { currPage } = usePageIndex();
  const collapseAll = useStore((s) => s.collapseAll);
  const expandAll = useStore((s) => s.expandAll);
  const expanded = useStore((s) => s.expanded);

  if (!currPage) return <p>404</p>;

  return (
    <Stack flex={1} sx={{ height: "fit-content", position: "relative" }}>
      <Stack
        aria-label="symptom-page-header"
        direction="row"
        alignItems="center"
        sx={{ py: 2, px: 2, top: 0, position: "sticky", zIndex: 100, backdropFilter: "blur(10px)" }}>
        <Stack>
          <Typography variant="h5" textTransform="capitalize" fontWeight={700} sx={{ whiteSpace: "pre-line" }}>
            {currPage.name}
          </Typography>
          <Typography variant="subtitle2" fontWeight={500} sx={{ opacity: 0.45 }}>
            {typeof currPage.desc === "string" ? currPage.desc : null}
          </Typography>
        </Stack>
        <Box flex="1 0 0" />
        <Tooltip title={expanded.length > 0 ? "Collapse all" : "Expand all"}>
          <IconButton
            size="small"
            color={expanded.length > 0 ? "warning" : "default"}
            onClick={expanded.length > 0 ? collapseAll : expandAll}>
            {expanded.length > 0 ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          </IconButton>
        </Tooltip>
      </Stack>
      <TreeView
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        expanded={expanded}
        selected={[]}
        onNodeSelect={() => {}}
        onNodeToggle={() => {}}
        sx={{ height: "fit-content", px: 2 }}>
        <SymptomsGroup symptom={currPage} />
      </TreeView>
    </Stack>
  );
}

export default SymptomsPage;
