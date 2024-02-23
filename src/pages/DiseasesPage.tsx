import { ImageOutlined } from "@mui/icons-material";
import { Box, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import seedrandom from "seedrandom";
import TreeMap, { TreeMapItem } from "../components/TreeMap";
import { useStore } from "../config/store";
import { exportHistory } from "../lib/history";
import getScores from "../lib/scores";
import { IScoredDisease } from "../types/interfaces";

export default function DiseasesPage() {
  const backedUp = useRef(false);
  const _treeMapBox = useRef();

  const mode = useStore((s) => s.mode);
  const symptoms = useStore((s) => s.symptoms);
  const diseases = useStore((s) => s.diseases);
  const addHistory = useStore((s) => s.addHistory);
  const autoBackup = useStore((s) => s.autoBackup);

  const [scores, setScores] = useState<IScoredDisease[]>([]);

  useEffect(() => {
    const updateScores = async () => {
      const newScores = await getScores({ diseases, symptoms });
      setScores(newScores);
      // update in-app history
      if (!backedUp.current) {
        backedUp.current = true;
        const history = addHistory({ createdAt: new Date(), scores: newScores, symptoms });
        // download a backup file
        if (autoBackup) exportHistory(history);
      }
    };
    updateScores();
  }, [addHistory, autoBackup, diseases, symptoms]);

  const handleDownload = async () => {
    const canvas = await html2canvas(_treeMapBox.current!);
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = `ORDA ${new Date().toLocaleString()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const treeMapData: TreeMapItem = useMemo(
    () => ({
      name: "scores",
      children: scores.map<TreeMapItem>((score) => ({
        name: score.name,
        value: mode === "raw" ? score.value : score.pvalue,
        color: `hsl(${seedrandom(score.id)() * 360}, 70%, 50%)`,
      })),
    }),
    [mode, scores]
  );

  return (
    <Stack aria-label="diseases-page" flex={1} p={2} gap={2}>
      <Box sx={{ borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <Box ref={_treeMapBox} height="50vh">
          <TreeMap data={treeMapData} />
        </Box>
        <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex" }}>
          <IconButton aria-label="download-image" size="small" onClick={handleDownload} title="Download Image">
            <ImageOutlined />
          </IconButton>
        </Box>
      </Box>
      <Box height={4} />
      <List>
        {scores.map((score, i) => (
          <DiseaseScore key={i} {...score} />
        ))}
      </List>
    </Stack>
  );
}

const DiseaseScore = ({ value, name, pvalue, preval }: IScoredDisease) => {
  const mode = useStore((s) => s.mode);
  return (
    <Fragment>
      <ListItem
        sx={{
          justifyContent: "space-between",
          opacity: value > 0.25 ? 1 : 0.35,
          borderBottom: "var(--app-border)",
        }}>
        <ListItemText primary={name} />
        {mode === "prevalance" ? (
          <Fragment>
            <Typography sx={{ textAlign: "end" }}>{(pvalue * 100).toFixed(0)}%</Typography>
            <Typography sx={{ textAlign: "end", opacity: 0.5, ml: 1 }} fontSize="0.75rem">
              ({value.toFixed(2)})
            </Typography>
          </Fragment>
        ) : (
          <Typography sx={{ textAlign: "end" }}>{(value * 100).toFixed(0)}%</Typography>
        )}
      </ListItem>
    </Fragment>
  );
};
