export function formatNumber(value?: number, fractionDigits = 0): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'N/A';
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  });
}
