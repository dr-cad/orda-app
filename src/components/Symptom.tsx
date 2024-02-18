import { Box, Checkbox, FormControlLabel, Radio, Stack, TextField, Typography } from "@mui/material";
import React, { Fragment, MouseEventHandler, useCallback, useMemo } from "react";
import { useStore } from "../config/store";
import { IRange, ISymptom, Value } from "../types/interfaces";
import { StyledTreeItem } from "./styled";

interface IProps {
  id: string;
  parent: ISymptom;
}

interface IInnerProps {
  symptom: ISymptom;
  parent: ISymptom;
}

function useSymptom(symptom: ISymptom | undefined) {
  const hasInput = useMemo(() => !(symptom?.type === "enum" || symptom?.type === "none"), [symptom?.type]);
  const expandable = useMemo(() => {
    if (!symptom) return false;
    const hasDesc = !!symptom.desc;
    const hasOptions = Array.isArray(symptom.options) && symptom.options.length !== 0;
    return hasDesc || hasInput || hasOptions;
  }, [hasInput, symptom]);
  return { expandable, hasInput };
}

export default function SymptomsGroup({ symptom }: { symptom: ISymptom }) {
  if (!Array.isArray(symptom.options) || symptom.options.length === 0) return null;
  return (
    <Fragment>
      {symptom.options.map((id, i) => (
        <Symptom key={id} id={id} parent={symptom} />
      ))}
    </Fragment>
  );
}

function Symptom({ id, parent }: IProps) {
  const toggleExpanded = useStore((s) => s.toggleExpanded);
  const symptoms = useStore((s) => s.symptoms);
  const updateSymptom = useStore((s) => s.updateSymptom);

  const symptom = useMemo(() => symptoms.find((i) => i.id === id), [id, symptoms]);
  const { expandable } = useSymptom(symptom);

  const handleClick: MouseEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!symptom) return;
      const isBoolLeaf = (parent.type === "enum" || symptom.type === "none") && !symptom.options;
      if (isBoolLeaf) {
        updateSymptom(id, !symptom.value); // for radio or checkbox
      }
      toggleExpanded(symptom.id);
    },
    [id, parent, symptom, toggleExpanded, updateSymptom]
  );

  const [mt, mb] = useMemo(() => {
    const firstOption = parent.options!.indexOf(id) === 0;
    const space = expandable ? (parent.page ? (firstOption ? 0 : 4) : 1) : 0;
    return [space, expandable ? space : 0];
  }, [expandable, id, parent.options, parent.page]);

  if (!symptom) return null;

  return (
    <StyledTreeItem
      nodeId={symptom.id}
      onClick={handleClick}
      label={<Label symptom={symptom} parent={parent} />}
      children={
        expandable && (
          <Fragment>
            <Desc {...symptom} />
            <Input symptom={symptom} parent={parent} />
            <SymptomsGroup symptom={symptom} />
          </Fragment>
        )
      }
      sx={{ mt, mb }}
    />
  );
}

const Label = ({ symptom, parent }: IInnerProps) => {
  const { hasInput } = useSymptom(symptom);
  const isParent = Array.isArray(symptom.options);
  const noButton = hasInput || isParent;
  return (
    <FormControlLabel
      value={symptom.id}
      label={
        <Typography
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
          color={!!symptom.value ? "primary" : undefined}>
          {symptom.name}
          {symptom.type === "enum" && <Typography sx={{ color: "warning.main" }}>{" !"}</Typography>}
          {symptom.required && <Typography sx={{ color: "error.main" }}>{" *"}</Typography>}
        </Typography>
      }
      control={
        noButton ? (
          <Box sx={{ width: 12 }} />
        ) : parent.type === "enum" ? (
          <Radio size="small" checked={!!symptom.value} />
        ) : (
          <Checkbox size="small" checked={!!symptom.value} />
        )
      }
    />
  );
};

const Desc = (symptom: ISymptom) => {
  if (!symptom.desc) return null;
  return (
    <Stack p={2}>
      {typeof symptom.desc === "string" ? (
        <div>{symptom.desc}</div>
      ) : (
        <div>
          <div>{symptom.desc!.title}</div>
          <img alt={symptom.desc!.title} src={symptom.desc!.image} style={{ width: "65vw", height: "auto" }} />
        </div>
      )}
    </Stack>
  );
};

const Input = React.memo(({ symptom }: IInnerProps) => {
  const { hasInput } = useSymptom(symptom);
  const updateSymptom = useStore((s) => s.updateSymptom);

  const handleChange = useCallback(
    (value: Value) => {
      updateSymptom(symptom.id, value);
    },
    [symptom.id, updateSymptom]
  );

  if (!hasInput) return null;
  return (
    <Stack p={2}>
      {symptom.type === "string" ? (
        <TextField
          id={symptom.id + "-textfield"}
          size="small"
          type="text"
          placeholder={symptom.name}
          value={symptom.value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : symptom.type === "number" ? (
        <TextField
          id={symptom.id + "-textfield"}
          size="small"
          type="tel"
          placeholder={symptom.name}
          value={symptom.value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : symptom.type === "range" ? (
        <Stack direction="row" gap={1}>
          <TextField
            id={symptom.id + "-textfield-1"}
            size="small"
            type="number"
            placeholder="Start"
            value={(symptom.value as IRange)?.a ?? ""}
            onChange={(e) =>
              handleChange({
                a: Number(e.target.value),
                b: (symptom.value as IRange)?.b ?? "",
              })
            }
          />
          <TextField
            id={symptom.id + "-textfield-2"}
            size="small"
            type="number"
            placeholder="End"
            value={(symptom.value as IRange)?.b ?? ""}
            onChange={(e) =>
              handleChange({
                a: (symptom.value as IRange)?.a ?? "",
                b: Number(e.target.value),
              })
            }
          />
        </Stack>
      ) : null}
    </Stack>
  );
});
