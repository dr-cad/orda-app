import { IDisease, IDiseaseFactor, IScoredDisease, ISymptom } from "../types/interfaces";
import _ from "lodash";

interface IProps {
  symptoms: ISymptom[];
  diseases: IDisease[];
}

export const epsilon = 0.01; // NOTICE lower number may cause NaN issue
const inactive = epsilon; // any fucking number - no matter
const manipulateRate = (rate: number) => (rate === -1 ? epsilon : rate);

const getSymptomProbablity = (factor: IDiseaseFactor, symptoms: ISymptom[]) => {
  // This will check if ranges-array exists and sort them by their rate
  const dfranges = factor.ranges ? _.orderBy(factor.ranges, (a) => manipulateRate(a.rate), "desc") : null; // dfranges = disease factor ranges

  for (const symptom of symptoms) {
    if (symptom.id === factor.sid) {
      switch (symptom.type) {
        case "range":
          if (!Array.isArray(dfranges)) return 1;
          for (let range of dfranges) {
            if (typeof symptom.value !== "object" || !symptom.value || !symptom.value.a || !symptom.value.b) {
              console.error(
                `Type mismatch for symptom.value ${symptom.id} expected range but got ${typeof symptom.value}`,
                symptom.value
              );
              return inactive;
            }
            if (symptom.value.a >= range.a && symptom.value.b <= range.b) {
              return manipulateRate(range.rate);
            }
          }
          return inactive; // TODO
        case "number":
          if (!Array.isArray(dfranges)) return 1;
          for (let range of dfranges) {
            if ((symptom.value! as number) >= range.a && (symptom.value! as number) <= range.b) {
              return manipulateRate(range.rate);
            }
          }
          return inactive;
        case "boolean":
        default:
          if (symptom.value) return manipulateRate(factor.rate!);
          return inactive;
      }
    }
  }

  console.error("Couldn't find factor", factor.sid);
  return 1;
};

// nominator
const getDiseaseProbablity = (disease: IDisease, symptoms: ISymptom[]): number => {
  console.groupCollapsed("Disease", disease.name);
  const p0 = 1;
  const mul = disease.factors.reduce((v, factor) => v * getSymptomProbablity(factor, symptoms), 1);
  console.groupEnd();
  return mul * p0; // P(Di) * ∏j{P(Sj|Di)}
};

export default async function getScores({ diseases, symptoms }: IProps): Promise<IScoredDisease[]> {
  const nominators: number[] = diseases.map((disease) => getDiseaseProbablity(disease, symptoms));
  const dinaminator = nominators.reduce((a, b) => a + b, 0); // Σi{P(Di)} * ∏j{P(Sj|Di)}
  return diseases.map((disease, i) => ({ ...disease, value: nominators[i] / dinaminator }));
}

// export function getIsSymptomProbable(symptom: ISymptom, diseases: IDisease[], symptoms: ISymptom[]): boolean {
//   if (symptom.page || Array.isArray(symptom.options)) return true;
//   for (const disease of diseases) {
//     for (const factor of disease.factors) {
//       if (factor.sid === symptom.id) {
//         // when there is a diease factor with higher rate than epsilon
//         // show the symptom related to the factor - else hide it
//         const rate = factor.rate || 0;
//         if (rate > epsilon) return true;
//       }
//     }
//   }
//   return false;
// }
