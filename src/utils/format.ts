export function formatPercent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function formatAsOfDate(asOfDate: string): string {
  const date = new Date(`${asOfDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return `截至${asOfDate}`;
  }
  return `截至${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
