import { FINANCE_TAGS } from '../config/financeTags';
import type { FundRecord } from '../domain/fundTypes';

export function findDuplicateFundCodes(
  funds: FundRecord[],
): string[] {
  const codeCount = new Map<string, number>();

  for (const fund of funds) {
    const code = fund.fundCode.trim();
    codeCount.set(code, (codeCount.get(code) ?? 0) + 1);
  }

  return [...codeCount.entries()]
    .filter(([, count]) => count > 1)
    .map(([code]) => code);
}

export function validateFundRecords(funds: FundRecord[]): void {
  const duplicates = findDuplicateFundCodes(funds);
  if (duplicates.length > 0) {
    const preview = duplicates.slice(0, 5).join('、');
    throw new Error(`基金代码重复：${preview}`);
  }

  for (const fund of funds) {
    for (const tag of FINANCE_TAGS) {
      const ratio = fund[tag.field];
      if (!Number.isFinite(ratio) || ratio < 0 || ratio > 1) {
        throw new Error(
          `基金代码 ${fund.fundCode || '（缺失）'} 字段 ${tag.sourceField} 占比无效：${ratio}`,
        );
      }
    }
  }
}
