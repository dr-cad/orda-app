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

export default function getRawSymptoms(): ISymptom[] {
  const data: ISymptomRaw[] = rawSymptoms;

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
  dataFiltered = dataFiltered.filter(filterSymptomProbable());

  // fill empty types with none
  const dataMapped = dataFiltered.map<ISymptom>((item) => ({
    ...item,
    type: item.type ? (item.type as SymptomType) : "none",
    open: item.open ?? (item.options?.length ?? 0) < 3,
  }));

  return dataMapped;
}

function filterSymptomProbable() {
  const diseases = getRawDiseases();

  const recursivelyFilterSymptomProbable = (item: ISymptomRaw, index: number, data: ISymptomRaw[]) => {
    if (alwaysVisible.includes(item.id)) return true;
    // if item has any probable children
    if (Array.isArray(item.options)) {
      item.options = item.options.filter((option) => {
        const optItem = data.find((x) => x.id === option);
        return optItem && recursivelyFilterSymptomProbable(optItem, index, data);
      });
      if (item.options.length > 0) return true;
      item.options = undefined;
    }
    // if item is probable itself
    if (getIsSymptomProbable(item, diseases)) return true;
    return false;
  };

  return recursivelyFilterSymptomProbable;
}

export function getIsSymptomProbable(symptom: ISymptomRaw, diseases: IDisease[]): boolean {
  if (symptom.page || Array.isArray(symptom.options)) return true;
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
