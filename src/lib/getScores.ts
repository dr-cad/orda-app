import { IDisease, IDiseaseFactor, IScore, ISymptom } from "./../types/interfaces";
import _ from "lodash";

interface IProps {
  symptoms: ISymptom[];
  diseases: IDisease[];
}

export default async function getScores({ diseases, symptoms }: IProps): Promise<IScore[]> {
  const nominators: number[] = diseases.map((disease, i) => getDiseaseProbablity(disease, symptoms));
  const dinaminator = nominators.reduce((a, b) => a + b, 0);
  return diseases.map((disease, i) => ({ ...disease, value: nominators[i] / dinaminator }));
}

const getDiseaseProbablity = (disease: IDisease, symptoms: ISymptom[]): number => {
  const result = disease.factors.reduce((a, b) => a * getSingleRate(b, symptoms), 1);
  return result;
};

const getSingleRate = (factor: IDiseaseFactor, symptoms: ISymptom[]) => {
  const dfranges = factor.ranges ? _.orderBy(factor.ranges, (a) => manipulateRate(a.rate), "desc") : null;

  for (let symptom of symptoms) {
    if (symptom.id === factor.sid) {
      switch (symptom.type) {
        case "range":
          dfranges!.forEach((range) => {
            if (
              typeof symptom.value !== "object" ||
              (typeof symptom.value === "object" && (!symptom.value?.a || !symptom.value?.b))
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
          });
          return 1;
        case "number":
          dfranges!.forEach((range) => {
            if (symptom.value! >= range.a && symptom.value! <= range.b) {
              return manipulateRate(range.rate);
            }
          });
          return 1;
        case "boolean":
        default:
          return symptom.value ? manipulateRate(factor.rate!) : 1;
      }
    }
  }

  console.error("Couldn't find factor", factor.sid);
  return 1;
};

const epsilon = 0.01;
const manipulateRate = (rate: number) => (rate === -1 ? epsilon : rate);
