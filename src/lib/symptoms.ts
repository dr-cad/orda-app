import rawSymptoms from "../data/symptoms.json";
import { IDisease, ISymptom, ISymptomRaw } from "../types/interfaces";
import getRawDiseases from "./diseases";
import { epsilon } from "./scores";

const alwaysVisible = ["pat-info", "pat-name", "pat-age"];

export default function getRawSymptoms(data: ISymptomRaw[] = rawSymptoms) {
  const validate = () => {
    let idRepo: string[] = [];
    for (let item of data) {
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

      if (idRepo.includes(item.id)) {
        return { item, message: "Duplicate id found: " + item.id };
      } else {
        idRepo.push(item.id);
      }

      if (!!item.options) {
        for (let childId of item.options) {
          if (!data.find((x) => x.id === childId)) {
            return { item, message: "Couldnt find child with Id: " + childId };
          }
        }
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
  const diseases = getRawDiseases();

  let dataFiltered = data;
  for (let i = 0; i < 5; ++i) {
    // eslint-disable-next-line no-loop-func
    dataFiltered = dataFiltered.filter((item) => {
      if (alwaysVisible.includes(item.id)) return true;
      if (Array.isArray(item.options)) {
        item.options = item.options.filter((option) => {
          const optItem = data.find((x) => x.id === option);
          return optItem && getIsSymptomProbable(optItem, diseases, data);
        });
        if (item.options.length > 0) return true;
        item.options = undefined;
      }
      if (getIsSymptomProbable(item, diseases, data)) return true;
      return false;
    });
  }

  return dataFiltered;
}

export function getIsSymptomProbable(symptom: ISymptomRaw, diseases: IDisease[], symptoms: ISymptom[]): boolean {
  if (symptom.page || Array.isArray(symptom.options)) return true;
  for (const disease of diseases) {
    for (const factor of disease.factors) {
      if (factor.sid === symptom.id) {
        // when there is a diease factor with higher rate than epsilon
        // show the symptom related to the factor - else hide it
        const rate = factor.rate || 0;
        if (rate > epsilon || !!factor.ranges) return true;
      }
    }
  }
  return false;
}
