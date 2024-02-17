import { ArrowUpward, CloudUpload, CropFree, FileDownload, FileUpload, Upload, UploadFile } from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import seedrandom from "seedrandom";
import TreeMap, { TreeMapItem } from "../components/TreeMap";
import { useStore } from "../config/store";
import getScores from "../lib/scores";
import { IDisease, IScoredDisease } from "../types/interfaces";

async function parseJsonFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(String(event.target?.result) ?? ""));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

export default function DiseasesPage() {
  const _treeMapBox = useRef();

  const symptoms = useStore((s) => s.symptoms);
  const diseases = useStore((s) => s.diseases);
  const updateDiseases = useStore((s) => s.updateDiseases);

  const [scores, setScores] = useState<IScoredDisease[]>([]);

  useEffect(() => {
    const updateScores = async () => {
      const newScores = await getScores({ diseases, symptoms });
      setScores(newScores);
    };
    updateScores();
  }, [diseases, symptoms]);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (_) => {
      // you can use this method to get file and perform respective operations
      const files = Array.from(input.files ?? []);
      const file = files[0];
      if (!file) return;
      const object = await parseJsonFile(file);
      console.log(object);
      updateDiseases(object as IDisease[]);
    };
    input.click();
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(_treeMapBox.current!);
    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    link.href = data;
    link.download = "downloaded-image.jpg";

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
    <Stack overflow="scroll" p={2} gap={2}>
      <Box ref={_treeMapBox} id="treemap-box" height="50vh" sx={{ borderRadius: 4, overflow: "hidden" }}>
        <TreeMap data={treeMapData} />
        <Box sx={{ position: "absolute", top: 25, left: 25, display: "flex" }}>
          <IconButton aria-label="delete" size="small" onClick={handleDownload}>
            <CropFree />
          </IconButton>
          <IconButton aria-label="delete" size="small" onClick={handleUpload}>
            <ArrowUpward />
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
      <ListItem sx={{ justifyContent: "space-between" }}>
        <ListItemText primary={name} />
        <Typography sx={{ textAlign: "end" }}>{Math.round(value * 100) / 100}</Typography>
      </ListItem>
      <Divider />
    </Fragment>
  );
};
