import { CropFree } from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import seedrandom from "seedrandom";
import TreeMap, { TreeMapItem } from "../components/TreeMap";
import { useStore } from "../config/store";
import getScores from "../lib/scores";
import { IScoredDisease } from "../types/interfaces";

export default function DiseasesPage() {
  const _treeMapBox = useRef();

  const symptoms = useStore((s) => s.symptoms);
  const diseases = useStore((s) => s.diseases);

  const [scores, setScores] = useState<IScoredDisease[]>([]);

  useEffect(() => {
    const updateScores = async () => {
      const newScores = await getScores({ diseases, symptoms });
      setScores(newScores);
    };
    updateScores();
  }, [diseases, symptoms]);

  const handleDownload = async () => {
    const canvas = await html2canvas(_treeMapBox.current!);
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = data;
    link.download = `ORDA ${new Date().toLocaleString()}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const treeMapData: TreeMapItem = useMemo(
    () => ({
      name: "scores",
      children: scores.map<TreeMapItem>((score) => ({
        name: score.name,
        value: score.value,
        color: `hsl(${seedrandom(score.id)() * 360}, 70%, 50%)`,
      })),
    }),
    [scores]
  );

  return (
    <Stack p={2} gap={2} sx={{ overflowY: "auto", overflowX: "hidden" }}>
      <Box sx={{ borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <Box ref={_treeMapBox} height="50vh">
          <TreeMap data={treeMapData} />
        </Box>
        <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex" }}>
          <IconButton aria-label="save" id="save-btn" size="small" onClick={handleDownload}>
            <CropFree />
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

const DiseaseScore = ({ value, name }: IScoredDisease) => {
  return (
    <Fragment>
      <ListItem sx={{ justifyContent: "space-between", opacity: value > 0.25 ? 1 : 0.35 }}>
        <ListItemText primary={name} />
        <Typography sx={{ textAlign: "end" }}>{Math.round(value * 100) / 100}</Typography>
      </ListItem>
      <Divider />
    </Fragment>
  );
};
