import TreeItem from "@mui/lab/TreeItem";
import { Box, Checkbox, FormControlLabel, Radio, Stack, TextField, Typography } from "@mui/material";
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

  const handleClick: MouseEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!symptom) return;
      if (!symptom.type || symptom.type === "enum") {
        // for radio or checkbox
        updateSymptom(id, !symptom.value, parent);
      }
      toggleExpanded(symptom.id);
    },
    [id, parent, symptom, toggleExpanded, updateSymptom]
  );

  const expandable = useMemo(() => {
    if (!symptom) return false;
    const hasDesc = !!symptom.desc;
    const hasInput = !!symptom.type && symptom.type !== "enum";
    const hasOptions = Array.isArray(symptom.options) && symptom.options.length !== 0;
    return hasDesc || hasInput || hasOptions;
  }, [symptom]);

  const spaceAfter = useMemo(() => {
    const firstOption = parent.page && parent.options!.indexOf(id) === 0;
    return expandable ? (parent.page ? (firstOption ? 0 : 4) : 2) : 0;
  }, [expandable, id, parent.options, parent.page]);

  if (!symptom) return null;

  return (
    <TreeItem
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
      sx={{ mt: spaceAfter }}
    />
  );
}

const Label = ({ symptom, parent }: IInnerProps) => {
  return (
    <FormControlLabel
      value={symptom.id}
      label={
        <Typography
          sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}
          color={!!symptom.value ? "primary" : undefined}>
          {symptom.name}
          {symptom.required && <Typography sx={{ color: "orangered" }}>{" *"}</Typography>}
        </Typography>
      }
      control={
        parent.type === "enum" ? (
          <Radio size="small" checked={!!symptom.value} />
        ) : symptom.options ? (
          <Box sx={{ width: 12 }} />
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

  if (!symptom.type || symptom.type === "enum") return null;
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
