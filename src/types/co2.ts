export type YearlyData = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: number | undefined;
};

export type CountryData = {
  iso_code?: string;
  data: YearlyData[];
};

export type Co2Data = Record<string, CountryData>;
