import { ClearAllRounded } from "@mui/icons-material";
import TreeView from "@mui/lab/TreeView";
import { Button, Stack, Typography } from "@mui/material";
import SymptomsGroup from "../components/Symptom";
import { CloseSquare, MinusSquare, PlusSquare } from "../components/styled";
import { useStore } from "../config/store";
import { usePageIndex } from "../hooks/pages";

function SymptomsPage() {
  const { currPage } = usePageIndex();
  const resetSymptoms = useStore((s) => s.resetSymptoms);
  const expanded = useStore((s) => s.expanded);

  const handleReset = () => {
    resetSymptoms();
  };

  if (!currPage) return <p>404</p>;

  return (
    <Stack gap={4} flex={1} sx={{ overflowY: "auto", overflowX: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pt={2} pl={3}>
        <Stack>
          <Typography variant="h5" fontWeight={700} sx={{ whiteSpace: "pre-line" }}>
            {currPage.name}
          </Typography>
          <Typography variant="subtitle2" fontWeight={500} color="#444">
            {typeof currPage.desc === "string" ? currPage.desc : null}
          </Typography>
        </Stack>
        <Button
          size="small"
          color="error"
          sx={{ ml: 2, mr: 2, display: "flex", alignItems: "center", px: 2 }}
          startIcon={<ClearAllRounded />}
          onClick={handleReset}>
          <Typography variant="caption" textTransform="uppercase" sx={{ cursor: "pointer" }}>
            Reset
          </Typography>
        </Button>
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
