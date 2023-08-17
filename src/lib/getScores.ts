import { IDisease, IScore, ISymptom } from "./../types/interfaces";
import waApi from "./wa-api";

interface IProps {
  symptoms: ISymptom[];
  diseases: IDisease[];
}

export default async function getScores({ diseases, symptoms }: IProps): Promise<IScore[]> {
  console.log(((await waApi).exports as any).add(20, 46));
  return [];
}
