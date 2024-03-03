import rawSymptoms from "../data/symptoms.json";
import { IDisease, ISymptomRaw } from "../types/interfaces";
import { ISymptom, SymptomType } from "./../types/interfaces";
import getRawDiseases from "./diseases";
import { epsilon } from "./scores";

type ValidationError = {
  item: ISymptomRaw;
  message: string;
};

const symptomTypes = ["enum", "number", "range", "none", "string"];
const alwaysVisible = ["pat-info", "pat-name", "pat-age"];

export default function getRawSymptoms(data: ISymptomRaw[] = rawSymptoms): ISymptom[] {
  const validate = (): ValidationError | null => {
    let idRepo: string[] = [];
    for (let item of data) {
      // validate item.id
      if (!item.id) {
        return { item, message: "No Id defined" };
      }
      if (/[A-Z]/.test(item.id)) {
        return { item, message: "Id includes Uppercase!" };
      }
      if (item.id.includes(" ")) {
        return {
          item,
          message: "Id includes Space letter, consider using '-' instead",
        };
      }

      // check duplicate
      if (idRepo.includes(item.id)) {
        return { item, message: "Duplicate id found: " + item.id };
      } else {
        idRepo.push(item.id);
      }

      // check children
      if (!!item.options) {
        for (let childId of item.options) {
          if (!data.find((x) => x.id === childId)) {
            return { item, message: "Couldnt find child with Id: " + childId };
          }
        }
      }

      // validate type string
      if (item.type && !symptomTypes.includes(item.type)) {
        return { item, message: "Symptom type is invalid: " + item.type };
      }
    }
    return null;
  };

  const error = validate();

  if (!!error) {
    console.log("Symptom not valid", error);
    return [];
  }

  // remove unnecessary children

  let dataFiltered = [...data];
  dataFiltered = fillSymptomProbable(dataFiltered);

  // fill empty types with none
  const dataMapped = dataFiltered.map<ISymptom>((item) => {
    const hasEnoughChildren = Array.isArray(item.options) && item.options.length < 3;
    const hasEnumParent = !!dataFiltered.find((parent) => parent.options?.includes(item.id) && parent.type === "enum");
    return {
      ...item,
      type: item.type ? (item.type as SymptomType) : "none",
      open: item.open ?? (hasEnoughChildren || !hasEnumParent),
    };
  });

  return dataMapped;
}

function fillSymptomProbable(symptoms: ISymptomRaw[]) {
  const diseases = getRawDiseases();

  const recursivelyFillSymptomProbable = (item: ISymptomRaw, index: number, data: ISymptomRaw[]): boolean => {
    if (alwaysVisible.includes(item.id)) return true;
    // if item has any probable children
    if (Array.isArray(item.options)) {
      const probableItems = item.options.filter((option) => {
        const optItem = data.find((x) => x.id === option);
        return optItem && recursivelyFillSymptomProbable(optItem, index, data);
      });
      if (probableItems.length > 0) return true;
    }
    // if item is probable itself
    if (getIsSymptomProbable(item, diseases)) return true;
    return false;
  };

  return symptoms.map((x, i, data) => ({ ...x, probable: recursivelyFillSymptomProbable(x, i, data) }));
}

export function getIsSymptomProbable(symptom: ISymptomRaw, diseases: IDisease[]): boolean {
  if (symptom.page) return true;
  // if (Array.isArray(symptom.options)) return true;
  for (const disease of diseases) {
    for (const factor of disease.factors) {
      if (factor.sid === symptom.id) {
        // when there is a diease factor with higher rate than epsilon
        // show the symptom related to the factor - else hide it
        const rate = factor.rate || 0;
        if (factor.ranges) return true; // TODO
        if (rate > epsilon) return true;
      }
    }
  }
  return false;
}
