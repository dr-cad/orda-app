import { BarChartRounded, ImageOutlined, ShareOutlined, TableChartRounded } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import seedrandom from "seedrandom";
import BarChart, { BarDatum } from "../components/BarChart";
import TreeMap, { TreeMapItem } from "../components/TreeMap";
import { useStore } from "../config/store";
import theme from "../config/theme";
import { exportHistory } from "../lib/history";
import getScores from "../lib/scores";
import { IScoredDisease } from "../types/interfaces";

export default function DiseasesPage() {
  const backedUp = useRef(false);
  const _chartBox = useRef();

  const mode = useStore((s) => s.mode);
  const chartMode = useStore((s) => s.chartMode);
  const setChartMode = useStore((s) => s.setChartMode);
  const symptoms = useStore((s) => s.symptoms);
  const diseases = useStore((s) => s.diseases);
  const addHistory = useStore((s) => s.addHistory);
  const autoBackup = useStore((s) => s.autoBackup);

  const [_scores, setScores] = useState<IScoredDisease[]>([]);

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

  const scores = useMemo(() => {
    return _scores
      .sort((a, b) => {
        if (mode === "raw") return b.value - a.value;
        return b.pvalue - a.pvalue;
      })
      .slice(0, 5);
  }, [_scores, mode]);

  const { title, patName } = useMemo(() => {
    const patName = symptoms.find((s) => s.id === "pat-name")?.value;
    const patMale = symptoms.find((s) => s.id === "pat-male")?.value;
    const patFemale = symptoms.find((s) => s.id === "pat-female")?.value;
    const patAge = symptoms.find((s) => s.id === "pat-age")?.value;

    let title = "";
    if (patName) title += patName;
    if (patMale) title += " ♂";
    if (patFemale) title += " ♀";
    if (patAge) title += " " + patAge;
    return { title, patName };
  }, [symptoms]);

  const takeScreenshoot = async () => {
    const canvas = await html2canvas(_chartBox.current!, { backgroundColor: theme.palette.background.default });
    return canvas.toDataURL("image/png");
  };

  const handleDownload = async () => {
    const data = await takeScreenshoot();
    const link = document.createElement("a");
    link.href = data;
    link.download = `${patName ?? "ORDA"} - ${new Date().toLocaleString()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleShare = async () => {
    try {
      const data = await takeScreenshoot();
      const resp = await fetch(data);
      const blob = await resp.blob();
      const filename = `${patName ?? "ORDA"} - ${new Date().toLocaleString()}.png`;
      const file = new File([blob], filename, { type: "image/png" });
      const title = "ORDA";
      const text = "Patient result image";
      if (!navigator.canShare?.({ files: [file] })) throw new Error("Can't share image");
      await navigator.share({ files: [file], title, text });
    } catch (err) {
      console.log(err);
    }
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

  const barChartData: BarDatum[] = useMemo(
    () =>
      scores.map<BarDatum>((score) => ({
        title: score.name,
        raw: score.value,
        prevalanced: score.pvalue,
      })),
    [scores]
  );

  return (
    <Stack aria-label="diseases-page" className="xxx" flex={1} p={2} gap={2}>
      <ToggleButtonGroup
        aria-label="Chart Mode"
        color="primary"
        size="small"
        fullWidth
        exclusive
        value={chartMode}
        onChange={(_, v) => v && setChartMode(v)}>
        <ToggleButton value="bar">
          Bar Chart <BarChartRounded sx={{ ml: 2 }} fontSize="small" />
        </ToggleButton>
        <ToggleButton value="treemap">
          Tree Map <TableChartRounded sx={{ ml: 2 }} fontSize="small" />
        </ToggleButton>
        {/* <ToggleButton value="bar">
          Radial Chart <DonutLargeRounded sx={{ ml: 2 }} fontSize="small" />
        </ToggleButton> */}
      </ToggleButtonGroup>
      <Box sx={{ borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <Box ref={_chartBox} height={chartMode === "treemap" ? "50vh" : "35vh"}>
          {chartMode === "treemap" ? <TreeMap data={treeMapData} /> : <BarChart data={barChartData} />}
          {!!title.length && (
            <Stack
              className={chartMode === "treemap" ? "blur-bg-dark abs-center-x" : "abs-center-x"}
              position="absolute"
              zIndex={101}
              top={10}
              borderRadius={2}
              px={1.5}
              py={0.5}>
              <Typography
                textAlign="start"
                fontSize={12}
                sx={{ maxWidth: 100, textOverflow: "ellipsis", overflow: "hidden" }}>
                {title}
              </Typography>
            </Stack>
          )}
        </Box>
        <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex" }}>
          <IconButton aria-label="download-image" size="small" onClick={handleDownload} title="Download Image">
            <ImageOutlined />
          </IconButton>
          <IconButton aria-label="share-image" size="small" onClick={handleShare} title="Share Image">
            <ShareOutlined fontSize="inherit" sx={{ mx: "3px" }} />
          </IconButton>
        </Box>
      </Box>
      <Box height={4} />
      <List>
        {scores.map((score, i) => (
          <DiseaseScore key={i} index={i} {...score} />
        ))}
      </List>
    </Stack>
  );
}

const DiseaseScore = ({ value, name, pvalue, preval, index }: IScoredDisease & { index: number }) => {
  const mode = useStore((s) => s.mode);
  return (
    <Fragment>
      <ListItem
        sx={{
          justifyContent: "space-between",
          opacity: index < 3 ? 1 : 0.35,
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
