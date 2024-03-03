import { Box, Checkbox, FormControlLabel, Radio, Stack, TextField, Typography } from "@mui/material";
import React, { Fragment, MouseEventHandler, useCallback, useMemo, useState } from "react";
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
  const { hasInput, hasDesc, hasOptions, expandable, isEnumParent } = useMemo(() => {
    if (!symptom) return {};
    const hasInput = !(symptom.type === "enum" || symptom.type === "none");
    const hasDesc = !!symptom.desc;
    const hasOptions = Array.isArray(symptom.options) && symptom.options.length !== 0;
    const expandable = !!symptom && (hasDesc || hasInput || hasOptions);
    const isEnumParent = symptom.type === "enum" && Array.isArray(symptom.options) && symptom.options?.length > 1;
    return { hasInput, hasDesc, hasOptions, expandable, isEnumParent };
  }, [symptom]);
  return { hasInput, hasDesc, hasOptions, expandable, isEnumParent };
}

function Symptom({ id, parent }: IProps) {
  const toggleExpanded = useStore((s) => s.toggleExpanded);
  const symptoms = useStore((s) => s.symptoms);
  const updateSymptom = useStore((s) => s.updateSymptom);
  const detailed = useStore((s) => s.detailed);

  const symptom = useMemo(() => symptoms.find((i) => i.id === id), [id, symptoms]);
  const { expandable, isEnumParent, hasInput, hasDesc, hasOptions } = useSymptom(symptom);

  const handleClick: MouseEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!symptom) return;
      const isBoolLeaf = (parent.type === "enum" || symptom.type === "none") && !symptom.options;
      if (isBoolLeaf) updateSymptom(id, !symptom.value); // for radio or checkbox
      toggleExpanded(symptom.id);
    },
    [id, parent, symptom, toggleExpanded, updateSymptom]
  );

  const [mt, mb] = useMemo(() => {
    const firstOption = parent.options!.indexOf(id) === 0;
    const space = expandable ? (parent.page ? (firstOption ? 0 : 4) : 1) : 0;
    return [space, expandable ? space : 0];
  }, [expandable, id, parent.options, parent.page]);

  if (!symptom || (detailed && !symptom.probable)) return null;

  return (
    <StyledTreeItem
      id={"symptom:" + symptom.id}
      nodeId={symptom.id}
      onClick={handleClick}
      label={<Label symptom={symptom} parent={parent} />}
      children={
        expandable && (
          <Fragment>
            {hasDesc && <Desc {...symptom} />}
            {hasInput && <Input symptom={symptom} parent={parent} />}
            {hasOptions && <SymptomsGroup symptom={symptom} />}
          </Fragment>
        )
      }
      sx={{ mt, mb }}
      className={isEnumParent ? "enum-parent" : ""}
    />
  );
}

const Label = ({ symptom, parent }: IInnerProps) => {
  const { hasInput, isEnumParent } = useSymptom(symptom);
  const isParent = Array.isArray(symptom.options);
  const noButton = hasInput || isParent;
  return (
    <FormControlLabel
      value={symptom.id}
      label={
        <Typography
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
          color={!!symptom.value ? (isEnumParent ? "warning.light" : "primary") : undefined}>
          {symptom.name}
          {symptom.required && <span style={{ color: "red" }}>{" *"}</span>}
        </Typography>
      }
      control={
        noButton ? (
          <Box sx={{ width: 12 }} />
        ) : parent.type === "enum" && parent.options?.length !== 1 ? (
          <Radio size="small" checked={!!symptom.value} />
        ) : (
          <Checkbox size="small" checked={!!symptom.value} />
        )
      }
    />
  );
};

const Desc = (symptom: ISymptom) => {
  const [hideImage, setHideImage] = useState(false);
  return (
    <Stack p={2}>
      {typeof symptom.desc === "string" ? (
        <div>{symptom.desc}</div>
      ) : (
        <div onClick={() => setHideImage((s) => !s)} style={{ cursor: "pointer" }}>
          <div>
            {symptom.desc!.title + ": "}
            <span>{hideImage ? "+" : ""}</span>
          </div>
          <Box sx={{ height: 18 }} />
          {!hideImage && <img alt={symptom.desc!.title} src={symptom.desc!.image} className="desc-img" />}
        </div>
      )}
    </Stack>
  );
};

const Input = React.memo(({ symptom }: IInnerProps) => {
  const updateSymptom = useStore((s) => s.updateSymptom);

  const handleChange = useCallback(
    (value: Value) => {
      updateSymptom(symptom.id, value);
    },
    [symptom.id, updateSymptom]
  );

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
            type="tel"
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
            type="tel"
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

export default function SymptomsGroup({ symptom }: { symptom: ISymptom }) {
  const detailed = useStore((s) => s.detailed);
  if (detailed && !symptom.probable && !symptom.options?.length) return null;
  return (
    <Fragment key={symptom.id}>
      {symptom.options!.map((id) => (
        <Symptom key={id} id={id} parent={symptom} />
      ))}
    </Fragment>
  );
}
