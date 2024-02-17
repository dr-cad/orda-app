export type Value = string | number | IRange | null;
export type Desc = string | { title: string; image: string };

export interface ISymptomRaw {
  id: string;
  name: string;
  desc?: Desc;
  caption?: string;
  page?: boolean;
  required?: boolean;
  type?: "number" | "string" | "enum" | "none" | string;
  // type?: string;
  options?: string[];
  open?: boolean;
}

export interface ISymptom extends ISymptomRaw {
  value?: Value;
}

export interface IDisease {
  id: string;
  name: string;
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
}
