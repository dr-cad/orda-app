import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeView from "@mui/lab/TreeView";
import { Button, Stack, Typography } from "@mui/material";
import { Options } from "../components/Symptom";
import { useStore } from "../config/store";
import { usePageIndex } from "../hooks/pages";

function SymptomsPage() {
  const { currPage } = usePageIndex();
  const resetSymptoms = useStore((s) => s.resetSymptoms);
  const expanded = useStore((s) => s.expanded);

  const handleReset = () => {
    resetSymptoms();
  };

  return (
    <Stack gap={4} flex={1} overflow="scroll">
      <Stack direction="row" justifyContent="space-between" alignItems="center" pt={2} pl={4}>
        {currPage && (
          <Stack>
            <Typography variant="h5" fontWeight={700}>
              {currPage.name}
            </Typography>
            <Typography variant="subtitle2" fontWeight={500} color="#444">
              {typeof currPage.desc === "string" ? currPage.desc : null}
            </Typography>
          </Stack>
        )}
        <Button variant="outlined" size="small" color="error" sx={{ ml: 2, mr: 2 }} onClick={handleReset}>
          <Typography variant="caption" textTransform="uppercase" sx={{ cursor: "pointer" }}>
            Reset
          </Typography>
        </Button>
      </Stack>
      {currPage && (
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={[]}
          onNodeSelect={() => {}}
          onNodeToggle={() => {}}
          sx={{ flex: 1, overflowY: "auto" }}
        >
          <Options symptom={currPage} />
        </TreeView>
      )}
    </Stack>
  );
}

export default SymptomsPage;
