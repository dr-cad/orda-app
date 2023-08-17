import { IDisease, IScore, ISymptom } from "./../types/interfaces";

interface IProps {
  symptoms: ISymptom[];
  diseases: IDisease[];
}

export default function getScores({ diseases, symptoms }: IProps): IScore[] {
  return diseases.map((disease, i) => ({ ...disease, value: 0 }));
  // TODO instead calculate all at once and pass the result
}
