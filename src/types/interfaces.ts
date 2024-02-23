export type Value = string | number | IRange | boolean;
export type Desc = string | { title: string; image: string };
export type SymptomType = "number" | "string" | "enum" | "none" | "range";

export interface ISymptomRaw {
  id: string;
  name: string;
  desc?: Desc;
  caption?: string;
  page?: boolean;
  required?: boolean;
  type?: string;
  // type?: string;
  options?: string[];
  open?: boolean;
}

export interface ISymptom extends ISymptomRaw {
  value?: Value;
  type: SymptomType;
}

export interface IDisease {
  id: string;
  name: string;
  preval: number;
  factors: IDiseaseFactor[];
}

export interface IDiseaseFactor {
  sid: string;
  rate?: number;
  ranges?: IDiseaseFactorRange[];
}

export interface IRange {
  a: number;
  b: number;
}

export interface IDiseaseFactorRange extends IRange {
  rate: number;
}

export interface IScoredDisease extends IDisease {
  value: number;
  pvalue: number;
}

export interface IHistoryItem {
  createdAt: Date;
  symptoms: ISymptom[];
  scores: IScoredDisease[];
  unsaved?: boolean;
  hash?: string;
}
