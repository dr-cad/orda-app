import TreeItem from "@mui/lab/TreeItem";
import { Checkbox, FormControlLabel, Radio, Stack, TextField, Typography } from "@mui/material";
import React, { Fragment, MouseEventHandler, useCallback, useMemo } from "react";
import { useStore } from "../config/store";
import { IRange, ISymptom, Value } from "../types/interfaces";

interface IProps {
  id: string;
  parent: ISymptom;
}

interface IInnerProps {
  symptom: ISymptom;
  parent: ISymptom;
}

export default function Symptom({ id, parent }: IProps) {
  const toggleExpanded = useStore((s) => s.toggleExpanded);
  const symptoms = useStore((s) => s.symptoms);
  const updateSymptom = useStore((s) => s.updateSymptom);

  const symptom = useMemo(() => symptoms.find((i) => i.id === id), [id, symptoms]);

  const handleClick: MouseEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!symptom) return;
      if (!symptom.type || symptom.type === "enum") {
        // for radio or checkbox
        updateSymptom(id, !symptom.value, parent);
        toggleExpanded(symptom.id);
      } else {
        // for inputs
        toggleExpanded(symptom.id);
      }
    },
    [id, parent, symptom, toggleExpanded, updateSymptom]
  );

  if (!symptom) return null;
  return (
    <TreeItem nodeId={symptom.id} onClick={handleClick} label={<Label symptom={symptom} parent={parent} />}>
      <Desc symptom={symptom} />
      <Input symptom={symptom} parent={parent} />
      <Options symptom={symptom} />
    </TreeItem>
  );
}

const Label = ({ symptom, parent }: IInnerProps) => {
  return (
    <FormControlLabel
      value={symptom.id}
      label={
        <Typography sx={{ display: "flex", gap: 1 }}>
          {symptom.name}
          <span style={{ color: symptom.required ? "orangered" : "inherit" }}>{symptom.required ? " *" : ""}</span>
        </Typography>
      }
      control={
        parent.type === "enum" ? (
          <Radio size="small" checked={!!symptom.value} />
        ) : (
          <Checkbox size="small" checked={!!symptom.value} />
        )
      }
    />
  );
};

const Desc = ({ symptom }: { symptom: ISymptom }) => {
  if (!symptom.desc) return null;
  return (
    <Stack p={2}>
      {typeof symptom.desc === "string" ? (
        <div>{symptom.desc}</div>
      ) : (
        <div>
          <div>{symptom.desc!.title}</div>
          <img alt={symptom.desc!.title} src={symptom.desc!.image} />
        </div>
      )}
    </Stack>
  );
};

const Input = React.memo(({ symptom, parent }: IInnerProps) => {
  const updateSymptom = useStore((s) => s.updateSymptom);

  const handleChange = useCallback(
    (value: Value) => {
      updateSymptom(symptom.id, value, parent);
    },
    [parent, symptom.id, updateSymptom]
  );

  console.log("symptom", symptom);

  if (!symptom.type || !symptom.type || symptom.type === "enum") return null;
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
          type="number"
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

export function Options({ symptom }: { symptom: ISymptom }) {
  if (!symptom.options) return null;
  return (
    <Fragment>
      {symptom.options.map((option, i) => (
        <Symptom key={i} id={option} parent={symptom} />
      ))}
    </Fragment>
  );
}
