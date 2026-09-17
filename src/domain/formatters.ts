export function formatFundScale(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  return value.toFixed(2);
}
