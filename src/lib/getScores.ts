import { IDisease, IDiseaseFactor, IScore, ISymptom } from "./../types/interfaces";
import _ from "lodash";

interface IProps {
  symptoms: ISymptom[];
  diseases: IDisease[];
}

const epsilon = 0.01;
const manipulateRate = (rate: number) => (rate === -1 ? epsilon : rate);

const getSingleRate = (factor: IDiseaseFactor, symptoms: ISymptom[]) => {
  // This will check if ranges-array exists and sort them by their rate
  const dfranges = factor.ranges ? _.orderBy(factor.ranges, (a) => manipulateRate(a.rate), "desc") : null; // dfranges = disease factor ranges

  for (let symptom of symptoms) {
    if (symptom.id === factor.sid) {
      switch (symptom.type) {
        case "range":
          if (!Array.isArray(dfranges)) return 1;
          for (let range of dfranges) {
            if (
              typeof symptom.value !== "object" ||
              (typeof symptom.value === "object" && !symptom.value) ||
              (typeof symptom.value === "object" && (!symptom.value.a || !symptom.value.b))
            ) {
              console.error(
                `Type mismatch for symptom.value ${symptom.id} expected range but got ${typeof symptom.value}`,
                symptom.value
              );
              return 1;
            }
            if (symptom.value.a >= range.a && symptom.value.b <= range.b) {
              return manipulateRate(range.rate);
            }
          }
          return 1; // TODO
        case "number":
          if (!Array.isArray(dfranges)) return 1;
          for (let range of dfranges) {
            if ((symptom.value! as number) >= range.a && (symptom.value! as number) <= range.b) {
              return manipulateRate(range.rate);
            }
          }
          return 1; // TODO
        case "boolean":
        default:
          return symptom.value ? manipulateRate(factor.rate!) : 1;
      }
    }
  }

  console.error("Couldn't find factor", factor.sid);
  return 1;
};

const getDiseaseProbablity = (disease: IDisease, symptoms: ISymptom[]): number => {
  const result = disease.factors.reduce((a, b) => a * getSingleRate(b, symptoms), 1);
  return result;
};

export default async function getScores({ diseases, symptoms }: IProps): Promise<IScore[]> {
  const nominators: number[] = diseases.map((disease, i) => getDiseaseProbablity(disease, symptoms));
  const dinaminator = nominators.reduce((a, b) => a + b, 0);
  return diseases.map((disease, i) => ({ ...disease, value: nominators[i] / dinaminator }));
}
