import { ClearAllRounded, ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import TreeView from "@mui/lab/TreeView";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import SymptomsGroup from "../components/Symptom";
import { CloseSquare, MinusSquare, PlusSquare } from "../components/styled";
import { useStore } from "../config/store";
import { usePageIndex } from "../hooks/pages";

function SymptomsPage() {
  const { currPage } = usePageIndex();
  const reset = useStore((s) => s.reset);
  const collapseAll = useStore((s) => s.collapseAll);
  const expandAll = useStore((s) => s.expandAll);
  const expanded = useStore((s) => s.expanded);

  if (!currPage) return <p>404</p>;

  return (
    <Stack gap={4} flex={1} sx={{ overflowY: "auto", overflowX: "hidden" }}>
      <Stack direction="row" alignItems="center" pt={2} pl={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700} sx={{ whiteSpace: "pre-line" }}>
            {currPage.name}
          </Typography>
          <Typography variant="subtitle2" fontWeight={500} color="#444">
            {typeof currPage.desc === "string" ? currPage.desc : null}
          </Typography>
        </Stack>
        <Box flex="1 0 0" />
        <IconButton
          size="small"
          color={expanded.length > 0 ? "warning" : "default"}
          onClick={expanded.length > 0 ? collapseAll : expandAll}>
          {expanded.length > 0 ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </IconButton>
        <Box flex="0 0 12px" />
        <IconButton size="small" color="error" onClick={reset}>
          <ClearAllRounded />
        </IconButton>
        <Box flex="0 0 12px" />
      </Stack>
      <TreeView
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        expanded={expanded}
        selected={[]}
        onNodeSelect={() => {}}
        onNodeToggle={() => {}}
        sx={{ flex: 1, overflowY: "auto", px: 2 }}>
        <SymptomsGroup symptom={currPage} />
      </TreeView>
    </Stack>
  );
}

export default SymptomsPage;
