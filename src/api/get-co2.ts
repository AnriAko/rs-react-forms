import { Co2Data } from '~/types/co2';

const DATA_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

export async function getCo2Data(): Promise<Co2Data> {
  const res = await fetch(DATA_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch CO₂ data: ${res.status}`);
  }
  return res.json() as Promise<Co2Data>;
}
