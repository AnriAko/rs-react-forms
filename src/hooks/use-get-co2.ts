import { getCo2Data } from '~/api/get-co2';
import { Co2Data } from '~/types/co2';

let data: Co2Data | null = null;
let promise: Promise<void> | null = null;

export function useGetCo2(): Co2Data {
  if (data) return data;
  if (!promise) {
    promise = getCo2Data().then((res) => {
      data = res;
    });
  }
  throw promise;
}
