import { Box, Button, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
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

  return (
    <Stack overflow="scroll" p={2} gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Result
      </Typography>
      <List>
        {scores.map((score, i) => (
          <DiseaseScore key={i} {...score} />
        ))}
      </List>
      <Box flex={1} />
      <Button onClick={handleUpload}>Upload Diseases</Button>
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
