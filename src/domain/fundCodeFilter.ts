import type { FundRecord } from './fundTypes';

export function normalizeFundCode(input: string): string {
  return input.trim().toUpperCase();
}

export function parseFundCodes(input: string): string[] {
  const tokens = input
    .split(/[\s,，;；]+/)
    .map(normalizeFundCode)
    .filter(Boolean);

  return [...new Set(tokens)];
}

export interface FundCodeMatchResult {
  matchedCodes: string[];
  unmatchedCodes: string[];
}

export function matchFundCodes(
  codes: string[],
  funds: FundRecord[],
): FundCodeMatchResult {
  const allFundCodes = new Set(funds.map((fund) => fund.fundCode));
  const matchedCodes: string[] = [];
  const unmatchedCodes: string[] = [];

  for (const code of codes) {
    if (allFundCodes.has(code)) {
      matchedCodes.push(code);
    } else {
      unmatchedCodes.push(code);
    }
  }

  return { matchedCodes, unmatchedCodes };
}
